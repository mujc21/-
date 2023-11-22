import math

import torch
import torch.nn as nn

from geotransformer.modules.ops import index_select
from geotransformer.modules.kpconv.kernel_points import load_kernels

# step into 2.1.1.1：KPConv 是用来进行特征提取吗，这个操作有些没看懂？？？
class KPConv(nn.Module):
    def __init__(
        self,
        in_channels,
        out_channels,
        kernel_size,
        radius,
        sigma,
        bias=False,
        dimension=3,
        inf=1e6,
        eps=1e-9,
    ):
        """Initialize parameters for KPConv.

        Modified from [KPConv-PyTorch](https://github.com/HuguesTHOMAS/KPConv-PyTorch).

        Deformable KPConv is not supported.

        Args:
             in_channels: dimension of input features.
             out_channels: dimension of output features.
             kernel_size: Number of kernel points.
             radius: radius used for kernel point init.
             sigma: influence radius of each kernel point.
             bias: use bias or not (default: False)
             dimension: dimension of the point space.
             inf: value of infinity to generate the padding point
             eps: epsilon for gaussian influence
        """
        super(KPConv, self).__init__()

        # Save parameters
        self.kernel_size = kernel_size
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.radius = radius
        self.sigma = sigma
        self.dimension = dimension

        self.inf = inf
        self.eps = eps

        # Initialize weights
        self.weights = nn.Parameter(torch.zeros(self.kernel_size, in_channels, out_channels))  # (15,1,64)
        if bias:  # True
            self.bias = nn.Parameter(torch.zeros(self.out_channels))  # (64,)
        else:
            self.register_parameter('bias', None)  # 这个函数是添加一个model的参数

        # Reset parameters
        self.reset_parameters()  # 初始化参数

        # Initialize kernel points
        # step into 2.1.1.1.1 ：加载KP
        kernel_points = self.initialize_kernel_points()  # (N, 3)
        self.register_buffer('kernel_points', kernel_points)  # 也是注册到属性中，但是和register_parameter()的区别是优化器更新不会更新buffer的值

    def reset_parameters(self):  # 这个是重载了reset_parameters函数
        nn.init.kaiming_uniform_(self.weights, a=math.sqrt(5))
        if self.bias is not None:  # 如果有bias
            fan_in, _ = nn.init._calculate_fan_in_and_fan_out(self.weights)  # 当前网络层的输入神经元个数
            bound = 1 / math.sqrt(fan_in)  # 为什么是这个值？？？
            nn.init.uniform_(self.bias, -bound, bound)  # 将bias用范围内的均匀分布填充

    # step into 2.1.1.1.1 ：加载KP
    def initialize_kernel_points(self):
        """Initialize the kernel point positions in a sphere."""
        kernel_points = load_kernels(self.radius, self.kernel_size, dimension=self.dimension, fixed='center')  # 从同级路径下的dispositions文件夹里面读取ply文件获得kp
        return torch.from_numpy(kernel_points).float()

    # step into 2.1.1.1.2 ：模型执行
    def forward(self, s_feats, q_points, s_points, neighbor_indices):
        r"""KPConv forward.

        Args:
            s_feats (Tensor): (N, C_in)
            q_points (Tensor): (M, 3)
            s_points (Tensor): (N, 3)
            neighbor_indices (LongTensor): (M, H)

        Returns:
            q_feats (Tensor): (M, C_out)
        """
        s_points = torch.cat([s_points, torch.zeros_like(s_points[:1, :]) + self.inf], 0)  # (N, 3) -> (N+1, 3)
        # 下面这个操作是在s_points中通过反复选出每个查询点的邻居然后再改变形状变成邻居列表索引，具体操作ctrl进去看，如果选到边界索引就会将邻点坐标定位到inf
        neighbors = index_select(s_points, neighbor_indices, dim=0)  # (N+1, 3) -> (M, H, 3) 把邻点的坐标都找到了
        neighbors = neighbors - q_points.unsqueeze(1)  # (M, H, 3) 这个操作是换到了以q_points中的点为原点下nerghbors的相对坐标

        # Get Kernel point influences
        neighbors = neighbors.unsqueeze(2)  # (M, H, 3) -> (M, H, 1, 3)
        # 下面这个计算出了neighbors到每个kp的相对坐标
        differences = neighbors - self.kernel_points  # (M, H, 1, 3) x (K, 3) -> (M, H, K, 3)  邻域和kernel_points 找距离
        sq_distances = torch.sum(differences ** 2, dim=3)  # (M, H, K)  # 开根就是欧式空间的距离了
        # 对应kpconv论文中的（3）
        neighbor_weights = torch.clamp(1 - torch.sqrt(sq_distances) / self.sigma, min=0.0)  # (M, H, K) 这个函数是限制在最大值和最小值之间，超过的部分用max和min分别代替
        neighbor_weights = torch.transpose(neighbor_weights, 1, 2)  # (M, H, K) -> (M, K, H)

        # apply neighbor weights
        s_feats = torch.cat((s_feats, torch.zeros_like(s_feats[:1, :])), 0)  # (N, C) -> (N+1, C)
        neighbor_feats = index_select(s_feats, neighbor_indices, dim=0)  # (N+1, C) -> (M, H, C)
        weighted_feats = torch.matmul(neighbor_weights, neighbor_feats)  # (M, K, H) x (M, H, C) -> (M, K, C) 前面的一维可以看成矩阵的堆叠，后面的二维是正常进行矩阵乘法的

        # apply convolutional weights
        weighted_feats = weighted_feats.permute(1, 0, 2)  # (M, K, C) -> (K, M, C)
        kernel_outputs = torch.matmul(weighted_feats, self.weights)  # (K, M, C) x (K, C, C_out) -> (K, M, C_out)
        output_feats = torch.sum(kernel_outputs, dim=0, keepdim=False)  # (K, M, C_out) -> (M, C_out)  把kps的信息累加起来

        # normalization
        neighbor_feats_sum = torch.sum(neighbor_feats, dim=-1)  # (M, K, C) -> (M, K)
        # torch.gt返回比较Tensor1和Tensor2的每一个元素,并返回一个0-1值.若Tensor1中的元素大于Tensor2中的元素,则结果取1,否则取0
        neighbor_num = torch.sum(torch.gt(neighbor_feats_sum, 0.0), dim=-1)  # (M,)
        neighbor_num = torch.max(neighbor_num, torch.ones_like(neighbor_num))  # (M,) 小于1的用1来替代？？？
        output_feats = output_feats / neighbor_num.unsqueeze(1)  # 算平均值？？？

        # add bias
        if self.bias is not None:
            output_feats = output_feats + self.bias

        return output_feats

    def __repr__(self):  # 这个是重载了输出的函数，print的时候会打印返回值字符串
        format_string = self.__class__.__name__ + '('
        format_string += 'kernel_size: {}'.format(self.kernel_size)
        format_string += ', in_channels: {}'.format(self.in_channels)
        format_string += ', out_channels: {}'.format(self.out_channels)
        format_string += ', radius: {:g}'.format(self.radius)
        format_string += ', sigma: {:g}'.format(self.sigma)
        format_string += ', bias: {}'.format(self.bias is not None)
        format_string += ')'
        return format_string

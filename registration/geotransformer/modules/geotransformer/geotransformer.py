import numpy as np
import torch
import torch.nn as nn

from geotransformer.modules.ops import pairwise_distance
from geotransformer.modules.transformer import SinusoidalPositionalEmbedding, RPEConditionalTransformer

# step into 2.2.1：embedding 执行后返回(B, N, N, HD)含有距离、角度、dps等embedding的和
class GeometricStructureEmbedding(nn.Module):
    def __init__(self,
                 hidden_dim,
                 sigma_d,
                 sigma_a,
                 sigma_dp,
                 sigma_rgb,
                 angle_k,
                 reduction_a='max',  # 化简角度embedding的方式'max','mean'两种
                 rgb_id_like='rgb'
                 ):
        super(GeometricStructureEmbedding, self).__init__()
        self.sigma_d = sigma_d
        self.sigma_a = sigma_a

        self.factor_a = 180.0 / (self.sigma_a * np.pi)  # 这个是单位换算和灵敏度
        self.angle_k = angle_k
        self.sigma_dp = sigma_dp
        self.sigma_rgb = sigma_rgb
        self.rgb_id_like = rgb_id_like
        # step into 2.2.1.1：sin embedding 作用完output维度会变成(*,hidden_dim)
        self.embedding = SinusoidalPositionalEmbedding(hidden_dim)
        self.proj_d = nn.Linear(hidden_dim, hidden_dim)  # 距离
        self.proj_a = nn.Linear(hidden_dim, hidden_dim)  # 角度
        self.proj_dp = nn.Linear(hidden_dim, hidden_dim)  # 梯度

        self.reduction_a = reduction_a
        if self.reduction_a not in ['max', 'mean']:
            raise ValueError(f'Unsupported reduction mode: {self.reduction_a}.')

    @torch.no_grad()
    # step into 2.2.1.2：get embedding indices
    def get_embedding_indices(self, points):
        r"""Compute the indices of pair-wise distance embedding and triplet-wise angular embedding.
        Args:
            points: torch.Tensor (B, N, 3), input point cloud

        Returns:
            d_indices: torch.FloatTensor (B, N, N), distance embedding indices
            a_indices: torch.FloatTensor (B, N, N, k), angular embedding indices
        """
        batch_size, num_point, _ = points.shape
        # step into 2.2.1.2.1：逐点距离
        dist_map = torch.sqrt(pairwise_distance(points, points))  # (B, N, N)
        d_indices = dist_map / self.sigma_d  # 11146左侧(1)操作

        k = self.angle_k
        knn_indices = dist_map.topk(k=k + 1, dim=2, largest=False)[1][:, :, 1:]  # (B, N, k) 最相邻的三个点(不是3是因为包含自己参考论文中图片); [1]是返回索引 ; 最后的切片是除去自己
        knn_indices = knn_indices.unsqueeze(3).expand(batch_size, num_point, k, 3)  # (B, N, k, 3) expand是拓展（通过重复）原张量的某一维度
        expanded_points = points.unsqueeze(1).expand(batch_size, num_point, num_point, 3)  # (B, N, 3) -> (B, N, N, 3)
        # 下面的是在k维度上找到索引值，然后定位到某一个点，再去找expanded_points中的那个点的3维度的坐标赋值到knn_points上面
        knn_points = torch.gather(expanded_points, dim=2, index=knn_indices)  # (B, N, k, 3) 按照索引在给定维度上筛选，out和index形状一样 例dim=2 out[i,j,k]=input[i,j,indices[i,j,k]]
        ref_vectors = knn_points - points.unsqueeze(2)  # (B, N, k, 3) 转化成了向量坐标，起点是点，终点是近邻点
        # 前者是N个点都有同样的邻点集合，后者是每个点的邻点集合都不同，但是集合中元素是同一个点复制N份。  减完了之后是以某个点为原点，其他点为终点的向量了
        anc_vectors = points.unsqueeze(1) - points.unsqueeze(2)  # (B, 1, N, 3) - (B, N, 1, 3) = (B, N, N, 3)
        ref_vectors = ref_vectors.unsqueeze(2).expand(batch_size, num_point, num_point, k, 3)  # (B, N, 1, K, 3) -> (B, N, N, k, 3)
        anc_vectors = anc_vectors.unsqueeze(3).expand(batch_size, num_point, num_point, k, 3)  # (B, N, N, 1, 3) -> (B, N, N, k, 3)

        sin_values = torch.linalg.norm(torch.cross(ref_vectors, anc_vectors, dim=-1), dim=-1)  # (B, N, N, k) 每个点对所有其他点都有k个角度值
        cos_values = torch.sum(ref_vectors * anc_vectors, dim=-1)  # (B, N, N, k)
        angles = torch.atan2(sin_values, cos_values)  # (B, N, N, k) 弧度制
        a_indices = angles * self.factor_a  # (B, N, N, k) 换角度制并且添加灵敏度

        return d_indices, a_indices

    # step into 2.2.1.3：get dp indices
    def get_dp_indices(self, dps):
        # dps : (B, N, 3) 下面是求某个点的梯度点乘其他所有点的梯度，是N*N矩阵
        # mask = (dps == 0)
        inner_prod = torch.bmm(dps, torch.transpose(dps, 1, 2))  # bmm只支持3*3矩阵乘法，matmul更强
        inner_prod = inner_prod / self.sigma_dp  # (B, N, N) 不同点的梯度之间也会点乘
        return inner_prod

    def get_rgb_indices(self, rgb):
        dist_rgb_map = torch.sqrt(pairwise_distance(rgb, rgb))  # (B, N, N) rgb之间的距离
        rgb_indices = dist_rgb_map / self.sigma_rgb
        return rgb_indices

    def forward(self, points, dps=None, rgb=None):
        # print(points.shape, dps.shape)

        # step into 2.2.1.2：get embedding indices
        d_indices, a_indices = self.get_embedding_indices(points)  # (B, N, N), (B, N, N, K)

        d_embeddings = self.embedding(d_indices)  # (B, N, N, hidden_dim->HD)
        d_embeddings = self.proj_d(d_embeddings)

        if dps is not None:
            # step into 2.2.1.3：get dp indices
            dp_indices = self.get_dp_indices(dps)  # (B, N, N) 是点梯度点积的矩阵
            dp_embeddings = self.embedding(dp_indices)  # (B, N, N, HD)
            dp_embeddings = self.proj_dp(dp_embeddings)
        if rgb is not None:
            if self.rgb_id_like == 'dps':
                rgb_indices = self.get_dp_indices(rgb)
            else:
                rgb_indices = self.get_rgb_indices(rgb)  # (B, N, N)
            rgb_embeddings = self.embedding(rgb_indices)  # (B, N, N, HD)
            rgb_embeddings = self.proj_dp(rgb_embeddings)
        # else:
        #     print('dp is None')

        a_embeddings = self.embedding(a_indices)  # (B, N, N, K) -> (B, N, N, K, HD)
        a_embeddings = self.proj_a(a_embeddings)
        if self.reduction_a == 'max':
            a_embeddings = a_embeddings.max(dim=3)[0]  # (B, N, N, HD) 0是返回具体值而不是索引，此操作选择了三个角embedding中最大值
            torch.cuda.empty_cache()
        else:
            a_embeddings = a_embeddings.mean(dim=3)  # (B, N, N, HD)

        embeddings = d_embeddings + a_embeddings  # (B, N, N, HD) + (B, N, N, HD) 对应论文中(5)式子
        # 这一部分就是加上的HSL梯度或者是rgb的embedding来辅助点云配准
        if dps is not None:
            embeddings = embeddings + dp_embeddings
        if rgb is not None:
            embeddings = embeddings + rgb_embeddings
        # embeddings = d_embeddings + a_embeddings # + dp_embeddings

        return embeddings

# step into 2.2：GeoTransformer
class GeometricTransformer(nn.Module):
    def __init__(
        self,
        input_dim,
        output_dim,
        hidden_dim,
        num_heads,  # 这个是什么？？？
        blocks,  #　［'self', 'cross', 'cross', 'self', 'cross'］
        sigma_d,
        sigma_a,
        sigma_dp,
        sigma_rgb,
        angle_k,
        dropout=None,
        activation_fn='ReLU',
        reduction_a='max',
        rgb_id_like='rgb'
    ):
        r"""Geometric Transformer (GeoTransformer).

        Args:
            input_dim: input feature dimension
            output_dim: output feature dimension
            hidden_dim: hidden feature dimension
            num_heads: number of head in transformer
            blocks: list of 'self' or 'cross'
            sigma_d: temperature of distance
            sigma_a: temperature of angles
            angle_k: number of nearest neighbors for angular embedding
            activation_fn: activation function
            reduction_a: reduction mode of angular embedding ['max', 'mean']
        """
        super(GeometricTransformer, self).__init__()
        # step into 2.2.1：embedding
        self.embedding = GeometricStructureEmbedding(hidden_dim, sigma_d, sigma_a, sigma_dp, sigma_rgb, angle_k, reduction_a=reduction_a, rgb_id_like=rgb_id_like)

        self.in_proj = nn.Linear(input_dim, hidden_dim)
        # step into 2.2.2：transformer各模块集合起来的模型，跑block
        self.transformer = RPEConditionalTransformer(
            blocks, hidden_dim, num_heads, dropout=dropout, activation_fn=activation_fn
        )
        self.out_proj = nn.Linear(hidden_dim, output_dim)

    def forward(
        self,
        ref_points,
        src_points,
        ref_feats,
        src_feats,
        ref_masks=None,
        src_masks=None,
        ref_dps=None,
        src_dps=None,
        ref_rgb=None,
        src_rgb=None,
    ):
        r"""Geometric Transformer

        Args:
            ref_points (Tensor): (B, N, 3)
            src_points (Tensor): (B, M, 3)
            ref_feats (Tensor): (B, N, C)
            src_feats (Tensor): (B, M, C)
            ref_masks (Optional[BoolTensor]): (B, N)
            src_masks (Optional[BoolTensor]): (B, M)

        Returns:
            ref_feats: torch.Tensor (B, N, C)
            src_feats: torch.Tensor (B, M, C)
        """
        ref_embeddings = self.embedding(ref_points, ref_dps, ref_rgb)  # (B, N, N, HD)
        src_embeddings = self.embedding(src_points, src_dps, src_rgb)  # (B, M, M, HD)

        ref_feats = self.in_proj(ref_feats)  # (B, N, HD)
        src_feats = self.in_proj(src_feats)  # (B, M, HD)

        ref_feats, src_feats = self.transformer(
            ref_feats,
            src_feats,
            ref_embeddings,
            src_embeddings,
            masks0=ref_masks,
            masks1=src_masks,
        )  # (B, N, HD) (B, M, HD)

        ref_feats = self.out_proj(ref_feats)
        src_feats = self.out_proj(src_feats)

        return ref_feats, src_feats  # (B, N, O) (B, M, O)

# TODO: finish this batch transformer
class GHTransformerBatch(nn.Module):
    def __init__(
        self,
        input_dim,
        output_dim,
        hidden_dim,
        num_heads,
        blocks,
        sigma_d,
        sigma_a,
        sigma_dp,
        sigma_rgb,
        angle_k,
        dropout=None,
        activation_fn='ReLU',
        reduction_a='max',
        rgb_id_like='rgb'
    ):
        r"""Geometric Transformer (GeoTransformer).

        Args:
            input_dim: input feature dimension
            output_dim: output feature dimension
            hidden_dim: hidden feature dimension
            num_heads: number of head in transformer
            blocks: list of 'self' or 'cross'
            sigma_d: temperature of distance
            sigma_a: temperature of angles
            angle_k: number of nearest neighbors for angular embedding
            activation_fn: activation function
            reduction_a: reduction mode of angular embedding ['max', 'mean']
        """
        super(GeometricTransformer, self).__init__()

        self.embedding = GeometricStructureEmbedding(hidden_dim, sigma_d, sigma_a, sigma_dp, sigma_rgb, angle_k, reduction_a=reduction_a, rgb_id_like=rgb_id_like)

        self.in_proj = nn.Linear(input_dim, hidden_dim)
        self.transformer = RPEConditionalTransformer(
            blocks, hidden_dim, num_heads, dropout=dropout, activation_fn=activation_fn
        )
        self.out_proj = nn.Linear(hidden_dim, output_dim)

    def forward(
        self,
        ref_points,
        src_points,
        ref_feats,
        src_feats,
        ref_masks=None,
        src_masks=None,
        ref_dps=None,
        src_dps=None,
        ref_rgb=None,
        src_rgb=None,
    ):
        r"""Geometric Transformer

        Args:
            ref_points (Tensor): (B, N, 3)
            src_points (Tensor): (B, M, 3)
            ref_feats (Tensor): (B, N, C)
            src_feats (Tensor): (B, M, C)
            ref_masks (Optional[BoolTensor]): (B, N)
            src_masks (Optional[BoolTensor]): (B, M)

        Returns:
            ref_feats: torch.Tensor (B, N, C)
            src_feats: torch.Tensor (B, M, C)
        """
        ref_embeddings = self.embedding(ref_points, ref_dps, ref_rgb)
        src_embeddings = self.embedding(src_points, src_dps, src_rgb)

        ref_feats = self.in_proj(ref_feats)
        src_feats = self.in_proj(src_feats)

        ref_feats, src_feats = self.transformer(
            ref_feats,
            src_feats,
            ref_embeddings,
            src_embeddings,
            masks0=ref_masks,
            masks1=src_masks,
        )

        ref_feats = self.out_proj(ref_feats)
        src_feats = self.out_proj(src_feats)

        return ref_feats, src_feats

class GeometricTransformerORI(nn.Module):
    def __init__(
        self,
        input_dim,
        output_dim,
        hidden_dim,
        num_heads,
        blocks,
        sigma_d,
        sigma_a,
        angle_k,
        dropout=None,
        activation_fn='ReLU',
        reduction_a='max',
    ):
        r"""Geometric Transformer (GeoTransformer).

        Args:
            input_dim: input feature dimension
            output_dim: output feature dimension
            hidden_dim: hidden feature dimension
            num_heads: number of head in transformer
            blocks: list of 'self' or 'cross'
            sigma_d: temperature of distance
            sigma_a: temperature of angles
            angle_k: number of nearest neighbors for angular embedding
            activation_fn: activation function
            reduction_a: reduction mode of angular embedding ['max', 'mean']
        """
        super(GeometricTransformer, self).__init__()

        self.embedding = GeometricStructureEmbedding(hidden_dim, sigma_d, sigma_a, angle_k, reduction_a=reduction_a)

        self.in_proj = nn.Linear(input_dim, hidden_dim)
        self.transformer = RPEConditionalTransformer(
            blocks, hidden_dim, num_heads, dropout=dropout, activation_fn=activation_fn
        )
        self.out_proj = nn.Linear(hidden_dim, output_dim)

    def forward(
        self,
        ref_points,
        src_points,
        ref_feats,
        src_feats,
        ref_masks=None,
        src_masks=None,
    ):
        r"""Geometric Transformer

        Args:
            ref_points (Tensor): (B, N, 3)
            src_points (Tensor): (B, M, 3)
            ref_feats (Tensor): (B, N, C)
            src_feats (Tensor): (B, M, C)
            ref_masks (Optional[BoolTensor]): (B, N)
            src_masks (Optional[BoolTensor]): (B, M)

        Returns:
            ref_feats: torch.Tensor (B, N, C)
            src_feats: torch.Tensor (B, M, C)
        """
        ref_embeddings = self.embedding(ref_points)
        src_embeddings = self.embedding(src_points)

        ref_feats = self.in_proj(ref_feats)
        src_feats = self.in_proj(src_feats)

        ref_feats, src_feats = self.transformer(
            ref_feats,
            src_feats,
            ref_embeddings,
            src_embeddings,
            masks0=ref_masks,
            masks1=src_masks,
        )

        ref_feats = self.out_proj(ref_feats)
        src_feats = self.out_proj(src_feats)

        return ref_feats, src_feats

class GeometricStructureEmbeddingORI(nn.Module):
    def __init__(self, hidden_dim, sigma_d, sigma_a, angle_k, reduction_a='max'):
        super(GeometricStructureEmbedding, self).__init__()
        self.sigma_d = sigma_d
        self.sigma_a = sigma_a
        self.factor_a = 180.0 / (self.sigma_a * np.pi)
        self.angle_k = angle_k

        self.embedding = SinusoidalPositionalEmbedding(hidden_dim)
        self.proj_d = nn.Linear(hidden_dim, hidden_dim)
        self.proj_a = nn.Linear(hidden_dim, hidden_dim)

        self.reduction_a = reduction_a
        if self.reduction_a not in ['max', 'mean']:
            raise ValueError(f'Unsupported reduction mode: {self.reduction_a}.')

    @torch.no_grad()
    def get_embedding_indices(self, points):
        r"""Compute the indices of pair-wise distance embedding and triplet-wise angular embedding.

        Args:
            points: torch.Tensor (B, N, 3), input point cloud

        Returns:
            d_indices: torch.FloatTensor (B, N, N), distance embedding indices
            a_indices: torch.FloatTensor (B, N, N, k), angular embedding indices
        """
        batch_size, num_point, _ = points.shape

        dist_map = torch.sqrt(pairwise_distance(points, points))  # (B, N, N)
        d_indices = dist_map / self.sigma_d

        k = self.angle_k
        knn_indices = dist_map.topk(k=k + 1, dim=2, largest=False)[1][:, :, 1:]  # (B, N, k)
        knn_indices = knn_indices.unsqueeze(3).expand(batch_size, num_point, k, 3)  # (B, N, k, 3)
        expanded_points = points.unsqueeze(1).expand(batch_size, num_point, num_point, 3)  # (B, N, N, 3)
        knn_points = torch.gather(expanded_points, dim=2, index=knn_indices)  # (B, N, k, 3)
        ref_vectors = knn_points - points.unsqueeze(2)  # (B, N, k, 3)
        anc_vectors = points.unsqueeze(1) - points.unsqueeze(2)  # (B, N, N, 3)
        ref_vectors = ref_vectors.unsqueeze(2).expand(batch_size, num_point, num_point, k, 3)  # (B, N, N, k, 3)
        anc_vectors = anc_vectors.unsqueeze(3).expand(batch_size, num_point, num_point, k, 3)  # (B, N, N, k, 3)
        sin_values = torch.linalg.norm(torch.cross(ref_vectors, anc_vectors, dim=-1), dim=-1)  # (B, N, N, k)
        cos_values = torch.sum(ref_vectors * anc_vectors, dim=-1)  # (B, N, N, k)
        angles = torch.atan2(sin_values, cos_values)  # (B, N, N, k)
        a_indices = angles * self.factor_a

        return d_indices, a_indices

    def forward(self, points):
        d_indices, a_indices = self.get_embedding_indices(points)

        d_embeddings = self.embedding(d_indices)
        d_embeddings = self.proj_d(d_embeddings)

        a_embeddings = self.embedding(a_indices)
        a_embeddings = self.proj_a(a_embeddings)
        if self.reduction_a == 'max':
            a_embeddings = a_embeddings.max(dim=3)[0]
        else:
            a_embeddings = a_embeddings.mean(dim=3)

        embeddings = d_embeddings + a_embeddings

        return embeddings
import torch
import torch.nn as nn
from IPython import embed

from geotransformer.modules.kpconv import ConvBlock, ResidualBlock, UnaryBlock, LastUnaryBlock, nearest_upsample

# step into 2.1：backbone
class KPConvFPN(nn.Module):
    r"""
    这个是follow的一个文章KPConv，原文大概是提出了一个点卷积核的概念，与图像卷积相比图像卷积是用一个给定的卷积核来对固定的pixel进行卷积计算，
    但是点卷积是利用一个kernel point来对点云进行卷积，给定一个区域，将区域内的每个点与kp进行卷积操作，并且卷积计算后会乘一个卷积系数，这个系数
    由该点与kp的相对位置决定。
    文中引入radius search的方式，选取的点集合是距离kp的给定邻域半径，半径内的点云中的点将会被选取进行卷积操作。
    """
    def __init__(self, input_dim, output_dim, init_dim, kernel_size, init_radius, init_sigma, group_norm):  # 1,256,64,15,0.0625,0.05,32
        super(KPConvFPN, self).__init__()
        # step into 2.1.1：ConvBlock
        self.encoder1_1 = ConvBlock(input_dim, init_dim, kernel_size, init_radius, init_sigma, group_norm)
        # step into 2.1.2：ResidualBlock
        self.encoder1_2 = ResidualBlock(init_dim, init_dim * 2, kernel_size, init_radius, init_sigma, group_norm)

        self.encoder2_1 = ResidualBlock(
            init_dim * 2, init_dim * 2, kernel_size, init_radius, init_sigma, group_norm, strided=True
        )
        self.encoder2_2 = ResidualBlock(
            init_dim * 2, init_dim * 4, kernel_size, init_radius * 2, init_sigma * 2, group_norm
        )
        self.encoder2_3 = ResidualBlock(
            init_dim * 4, init_dim * 4, kernel_size, init_radius * 2, init_sigma * 2, group_norm
        )

        self.encoder3_1 = ResidualBlock(
            init_dim * 4, init_dim * 4, kernel_size, init_radius * 2, init_sigma * 2, group_norm, strided=True
        )
        self.encoder3_2 = ResidualBlock(
            init_dim * 4, init_dim * 8, kernel_size, init_radius * 4, init_sigma * 4, group_norm
        )
        self.encoder3_3 = ResidualBlock(
            init_dim * 8, init_dim * 8, kernel_size, init_radius * 4, init_sigma * 4, group_norm
        )

        self.encoder4_1 = ResidualBlock(
            init_dim * 8, init_dim * 8, kernel_size, init_radius * 4, init_sigma * 4, group_norm, strided=True
        )
        self.encoder4_2 = ResidualBlock(
            init_dim * 8, init_dim * 16, kernel_size, init_radius * 8, init_sigma * 8, group_norm
        )
        self.encoder4_3 = ResidualBlock(
            init_dim * 16, init_dim * 16, kernel_size, init_radius * 8, init_sigma * 8, group_norm
        )

        self.decoder3 = UnaryBlock(init_dim * 24, init_dim * 8, group_norm)  # 这个dim选择是因为cat操作导致feature变了 24=8+16
        self.decoder2 = LastUnaryBlock(init_dim * 12, output_dim)

    def forward(self, feats, data_dict):
        feats_list = []

        points_list = data_dict['points']
        neighbors_list = data_dict['neighbors']
        subsampling_list = data_dict['subsampling']
        upsampling_list = data_dict['upsampling']
        # 第一阶段特征
        feats_s1 = feats
        feats_s1 = self.encoder1_1(feats_s1, points_list[0], points_list[0], neighbors_list[0])
        feats_s1 = self.encoder1_2(feats_s1, points_list[0], points_list[0], neighbors_list[0])
        # 第二阶段特征
        feats_s2 = self.encoder2_1(feats_s1, points_list[1], points_list[0], subsampling_list[0])
        feats_s2 = self.encoder2_2(feats_s2, points_list[1], points_list[1], neighbors_list[1])
        feats_s2 = self.encoder2_3(feats_s2, points_list[1], points_list[1], neighbors_list[1])
        # 第三阶段特征
        feats_s3 = self.encoder3_1(feats_s2, points_list[2], points_list[1], subsampling_list[1])
        feats_s3 = self.encoder3_2(feats_s3, points_list[2], points_list[2], neighbors_list[2])
        feats_s3 = self.encoder3_3(feats_s3, points_list[2], points_list[2], neighbors_list[2])
        # 最后阶段特征
        feats_s4 = self.encoder4_1(feats_s3, points_list[3], points_list[2], subsampling_list[2])
        feats_s4 = self.encoder4_2(feats_s4, points_list[3], points_list[3], neighbors_list[3])
        feats_s4 = self.encoder4_3(feats_s4, points_list[3], points_list[3], neighbors_list[3])  # out:initdim*16

        latent_s4 = feats_s4
        feats_list.append(feats_s4)  # 提取出了最后一阶段的特征

        latent_s3 = nearest_upsample(latent_s4, upsampling_list[2])  # 最近的上采样特征提取
        latent_s3 = torch.cat([latent_s3, feats_s3], dim=1)  # 8+12 将上采样特征和原本提取的特征连起来，这样保留了结构信息？？？
        latent_s3 = self.decoder3(latent_s3)
        feats_list.append(latent_s3)

        latent_s2 = nearest_upsample(latent_s3, upsampling_list[1])
        latent_s2 = torch.cat([latent_s2, feats_s2], dim=1)
        latent_s2 = self.decoder2(latent_s2)
        feats_list.append(latent_s2)

        feats_list.reverse()

        return feats_list  # 有三个阶段的特征

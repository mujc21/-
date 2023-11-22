import torch
import torch.nn as nn
import torch.nn.functional as F
from IPython import embed

from geotransformer.modules.ops import point_to_node_partition, index_select, apply_transform
from geotransformer.modules.registration import get_node_correspondences
from geotransformer.modules.sinkhorn import LearnableLogOptimalTransport
from geotransformer.modules.geotransformer import (
    GeometricTransformer,
    # GeometricColorTransformer,
    SuperPointMatching,
    SuperPointTargetGenerator,
    LocalGlobalRegistration,
)

from backbone import KPConvFPN
import numpy as np
# step into 2：建立模型
class GeoTransformer(nn.Module):
    def __init__(self, cfg):
        super(GeoTransformer, self).__init__()
        self.num_points_in_patch = cfg.model.num_points_in_patch  # 64
        self.matching_radius = cfg.model.ground_truth_matching_radius  # 0.05
        # step into 2.1：backbone
        self.backbone = KPConvFPN(  # 这个能提取三个阶段的特征
            cfg.backbone.input_dim,
            cfg.backbone.output_dim,
            cfg.backbone.init_dim,
            cfg.backbone.kernel_size,
            cfg.backbone.init_radius,
            cfg.backbone.init_sigma,
            cfg.backbone.group_norm,
        )
        # step into 2.2：GeoTransformer 执行后计算各自(B, N, N, HD)含有距离、角度、dps等embedding的和，然后利用其计算 (B, N, O) (B, M, O)特征返回
        self.transformer = GeometricTransformer(
            cfg.geotransformer.input_dim,
            cfg.geotransformer.output_dim,
            cfg.geotransformer.hidden_dim,
            cfg.geotransformer.num_heads,
            cfg.geotransformer.blocks,
            cfg.geotransformer.sigma_d,
            cfg.geotransformer.sigma_a,
            cfg.geotransformer.sigma_dps,
            cfg.geotransformer.sigma_rgb,
            cfg.geotransformer.angle_k,
            reduction_a=cfg.geotransformer.reduction_a,
            rgb_id_like=cfg.geotransformer.rgb_id_like,
        )
        # 这个和上面的transformer完全一致，只是输入输出维度固定成了256，是对上采样点的transformer
        self.fine_transformer = GeometricTransformer(
            256,
            256,
            cfg.geotransformer.hidden_dim,
            cfg.geotransformer.num_heads,
            cfg.geotransformer.blocks,
            cfg.geotransformer.sigma_d,
            cfg.geotransformer.sigma_a,
            cfg.geotransformer.sigma_dps,
            cfg.geotransformer.sigma_rgb,
            cfg.geotransformer.angle_k,
            reduction_a=cfg.geotransformer.reduction_a,
            rgb_id_like=cfg.geotransformer.rgb_id_like,
        )
        # step into 2.4 ：随机选择一部分重叠率超过阈值的node并且返回索引和重叠率
        self.coarse_target = SuperPointTargetGenerator(
            cfg.coarse_matching.num_targets, cfg.coarse_matching.overlap_threshold
        )
        # step into 2.3：超点匹配
        self.coarse_matching = SuperPointMatching(
            cfg.coarse_matching.num_correspondences, cfg.coarse_matching.dual_normalization
        )
        # step into 2.7 最重要的配准
        self.fine_matching = LocalGlobalRegistration(
            cfg.fine_matching.topk,
            cfg.fine_matching.acceptance_radius,
            mutual=cfg.fine_matching.mutual,
            confidence_threshold=cfg.fine_matching.confidence_threshold,
            use_dustbin=cfg.fine_matching.use_dustbin,
            use_global_score=cfg.fine_matching.use_global_score,
            correspondence_threshold=cfg.fine_matching.correspondence_threshold,
            correspondence_limit=cfg.fine_matching.correspondence_limit,
            num_refinement_steps=cfg.fine_matching.num_refinement_steps,
        )
        # step into 2.6：最优转换
        self.optimal_transport = LearnableLogOptimalTransport(cfg.model.num_sinkhorn_iterations)

    def forward(self, data_dict, extra_channel='dps'):
        output_dict = {}

        # Downsample point clouds
        feats = data_dict['features'].detach()  # (M+N, 1) 别名，无梯度
        transform = data_dict['transform'].detach()  # (4, 4)

        ref_length_c = data_dict['lengths'][-1][0].item()  # 最后阶段的ref点数
        ref_length_f = data_dict['lengths'][1][0].item()  # 第二阶段ref数
        ref_length = data_dict['lengths'][0][0].item()  # 第一阶段ref数
        points_c = data_dict['points'][-1].detach()  # 最后一阶段点
        points_f = data_dict['points'][1].detach()  # 第二阶段点
        points = data_dict['points'][0].detach()  # 第一阶段点

        with_dps = data_dict['dps'] is not None  # bool：true
        # with_rgb = data_dict['rgb'] is not None


        ref_points_c = points_c[:ref_length_c]  # 最后阶段ref点
        src_points_c = points_c[ref_length_c:]  # 最后阶段src点
        ref_points_f = points_f[:ref_length_f]  # 第二阶段ref
        src_points_f = points_f[ref_length_f:]  # 第二阶段src
        ref_points = points[:ref_length]  # 第一阶段ref点
        src_points = points[ref_length:]  # 第一阶段src点


        output_dict['ref_points_c'] = ref_points_c
        output_dict['src_points_c'] = src_points_c
        output_dict['ref_points_f'] = ref_points_f
        output_dict['src_points_f'] = src_points_f
        output_dict['ref_points'] = ref_points
        output_dict['src_points'] = src_points

        if with_dps:
            dps_c = data_dict['dps'][-1].detach()
            dps_f = data_dict['dps'][1].detach()
            dps = data_dict['dps'][0].detach()
            ref_dps_c = dps_c[:ref_length_c]
            src_dps_c = dps_c[ref_length_c:]
            ref_dps_f = dps_f[:ref_length_f]
            src_dps_f = dps_f[ref_length_f:]
            ref_dps = dps[:ref_length]
            src_dps = dps[ref_length:]
            output_dict['ref_dps_c'] = ref_dps_c
            output_dict['src_dps_c'] = src_dps_c
            output_dict['ref_dps_f'] = ref_dps_f
            output_dict['src_dps_f'] = src_dps_f
            output_dict['ref_dps'] = ref_dps
            output_dict['src_dps'] = src_dps
        # if with_rgb:
        #     rgb_c = data_dict['rgb'][-1].detach()
        #     rgb_f = data_dict['rgb'][1].detach()
        #     rgb = data_dict['rgb'][0].detach()
        #     ref_rgb_c = rgb_c[:ref_length_c]
        #     src_rgb_c = rgb_c[ref_length_c:]
        #     ref_rgb_f = rgb_f[:ref_length_f]
        #     src_rgb_f = rgb_f[ref_length_f:]
        #     ref_rgb = rgb[:ref_length]
        #     src_rgb = rgb[ref_length:]
        #     output_dict['ref_rgb_c'] = ref_rgb_c
        #     output_dict['src_rgb_c'] = src_rgb_c
        #     output_dict['ref_rgb_f'] = ref_rgb_f
        #     output_dict['src_rgb_f'] = src_rgb_f
        #     output_dict['ref_rgb'] = ref_rgb
        #     output_dict['src_rgb'] = src_rgb
        # else:
        #     src_dps_c = None
        #     ref_dps_c = None


        # 1. Generate ground truth node correspondences
        # step into 2.4：点与上采样点的关系 这里是最后一阶段和第二阶段的点的关系,为什么跳了两级？？？
        _, ref_node_masks, ref_node_knn_indices, ref_node_knn_masks = point_to_node_partition(
            ref_points_f, ref_points_c, self.num_points_in_patch
        )  # (N,)每个点属于哪个下采样点; (M,)哪些node是有上采样点的; (M, K)每个node最近k个上采样点，如果这个点不属于它就会是N索引; (M, K)每个node的k个上采样点是不是属于它
        _, src_node_masks, src_node_knn_indices, src_node_knn_masks = point_to_node_partition(
            src_points_f, src_points_c, self.num_points_in_patch
        )

        ref_padded_points_f = torch.cat([ref_points_f, torch.zeros_like(ref_points_f[:1])], dim=0)  # (N1+1, 3)加了一行0，不写A[0]是维持行形状
        src_padded_points_f = torch.cat([src_points_f, torch.zeros_like(src_points_f[:1])], dim=0)
        ref_node_knn_points = index_select(ref_padded_points_f, ref_node_knn_indices, dim=0)  # (N4r, K, 3) indices:每个node最近k个上采样点，如果这个点不属于它就会是N索引
        src_node_knn_points = index_select(src_padded_points_f, src_node_knn_indices, dim=0)  # (N4s, K, 3) 同上，此外如果node上采样点不属于他，对应位置点为(0, 0, 0)
        # step into 2.5：ground_true patch重叠率
        gt_node_corr_indices, gt_node_corr_overlaps = get_node_correspondences(
            ref_points_c,
            src_points_c,
            ref_node_knn_points,
            src_node_knn_points,
            transform,
            self.matching_radius,
            ref_masks=ref_node_masks,
            src_masks=src_node_masks,
            ref_knn_masks=ref_node_knn_masks,
            src_knn_masks=src_node_knn_masks,
        )  # (C, 2), (C,) 第一个：有C对patch匹配，是索引号集合。 第二个：每对patch匹配的重叠率平均值,重叠率是patch上采样点也匹配的数量除以patch的总上采样点数

        output_dict['gt_node_corr_indices'] = gt_node_corr_indices
        output_dict['gt_node_corr_overlaps'] = gt_node_corr_overlaps

        # 2. KPFCNN Encoder
        feats_list = self.backbone(feats, data_dict)  # 从完全没有意义的全为1的feats跑了一下主干网络获得了二三四阶段的feats_list

        feats_c = feats_list[-1]  # 最后一阶段的特征向量
        feats_f = feats_list[0]  # 第二阶段的特征

        # 3. Conditional Transformer
        tr_ref_dps = None
        tr_src_dps = None
        tr_ref_rgb = None
        tr_src_rgb = None

        if extra_channel == 'dps' and with_dps:
            tr_ref_dps = ref_dps_c.unsqueeze(0)  # (1, N4r, 3)
            tr_src_dps = src_dps_c.unsqueeze(0)  # (1, N4s, 3)
        elif extra_channel == 'rgb' and with_dps:
            tr_ref_rgb = ref_dps_c.unsqueeze(0)
            tr_src_rgb = src_dps_c.unsqueeze(0)

        ref_feats_c = feats_c[:ref_length_c]  # (N4r, len)
        src_feats_c = feats_c[ref_length_c:]  # (N4s, len)
        # step into 2.2：GeoTransformer 执行后计算各自(B, N, N, HD)含有距离、角度、dps等embedding的和，然后利用其计算 (B, N, O) (B, M, O)特征返回
        ref_feats_c, src_feats_c = self.transformer(
            ref_points_c.unsqueeze(0),
            src_points_c.unsqueeze(0),
            ref_feats_c.unsqueeze(0),
            src_feats_c.unsqueeze(0),
            ref_dps = tr_ref_dps,
            src_dps = tr_src_dps,
            ref_rgb = tr_ref_rgb,
            src_rgb = tr_src_rgb
        )  # (B, N, O) (B, M, O)
        ref_feats_c_norm = F.normalize(ref_feats_c.squeeze(0), p=2, dim=1)  # 去掉B维度，p表示2范数
        src_feats_c_norm = F.normalize(src_feats_c.squeeze(0), p=2, dim=1)

        output_dict['ref_feats_c'] = ref_feats_c_norm
        output_dict['src_feats_c'] = src_feats_c_norm

        # 5. Head for fine level matching
        ref_feats_f = feats_f[:ref_length_f]  # (N2r, len)
        src_feats_f = feats_f[ref_length_f:]  # (N2s, len)
        output_dict['ref_feats_f'] = ref_feats_f
        output_dict['src_feats_f'] = src_feats_f

        # 6. Select topk nearest node correspondences
        with torch.no_grad():
            ref_node_corr_indices, src_node_corr_indices, node_corr_scores = self.coarse_matching(
                ref_feats_c_norm, src_feats_c_norm, ref_node_masks, src_node_masks
            )  # (k,) (k,) (k,) topk feats关联度最高的索引及对应的关联度score

            output_dict['ref_node_corr_indices'] = ref_node_corr_indices
            output_dict['src_node_corr_indices'] = src_node_corr_indices

            # 7 Random select ground truth node correspondences during training
            if self.training:
                # step into 2.4 ：随机选择一部分(P)重叠率超过阈值的node并且返回索引和重叠率
                ref_node_corr_indices, src_node_corr_indices, node_corr_scores = self.coarse_target(
                    gt_node_corr_indices, gt_node_corr_overlaps  # (C, 2), (C,) 第一个：有C对patch匹配，是索引号集合。 第二个：每对patch匹配的重叠率平均值,重叠率是patch上采样点也匹配的数量除以patch的总上采样点数
                )  # (P,), (P,), (P,) P是要选择的数目target

        # 7.2 Generate batched node points & feats
        ref_node_corr_knn_indices = ref_node_knn_indices[ref_node_corr_indices]  # (P, K)  每个node最近的knn
        src_node_corr_knn_indices = src_node_knn_indices[src_node_corr_indices]  # (P, K)
        ref_node_corr_knn_masks = ref_node_knn_masks[ref_node_corr_indices]  # (P, K)  是不是属于自己
        src_node_corr_knn_masks = src_node_knn_masks[src_node_corr_indices]  # (P, K)
        ref_node_corr_knn_points = ref_node_knn_points[ref_node_corr_indices]  # (P, K, 3)  node的knn
        src_node_corr_knn_points = src_node_knn_points[src_node_corr_indices]  # (P, K, 3)

        ref_padded_feats_f = torch.cat([ref_feats_f, torch.zeros_like(ref_feats_f[:1])], dim=0)  # (N2r+1, C)
        src_padded_feats_f = torch.cat([src_feats_f, torch.zeros_like(src_feats_f[:1])], dim=0)  # (N2s+1, C)
        ref_node_corr_knn_feats = index_select(ref_padded_feats_f, ref_node_corr_knn_indices, dim=0)  # (P, K, C)
        src_node_corr_knn_feats = index_select(src_padded_feats_f, src_node_corr_knn_indices, dim=0)  # (P, K, C)

        ref_padded_dps_f = torch.cat([ref_dps_f, torch.zeros_like(ref_dps_f[:1])], dim=0)  # (N2r+1, 3)
        src_padded_dps_f = torch.cat([src_dps_f, torch.zeros_like(src_dps_f[:1])], dim=0)  # (N2s+1, 3)
        ref_node_corr_knn_dps = index_select(ref_padded_dps_f, ref_node_corr_knn_indices, dim=0)  # (P, K, 3)
        src_node_corr_knn_dps = index_select(src_padded_dps_f, src_node_corr_knn_indices, dim=0)  # (P, K, 3)

        #

        list_ref_node_corr_knn_feats = []
        list_src_node_corr_knn_feats = []
        cut_ids = [(0, 32), (32, 64), (64, 96), (96, 128)]
        print(data_dict['_index'], points_c.shape)
        # step into 2.2：GeoTransformer 执行后计算各自(B, N, N, HD)含有距离、角度、dps等embedding的和，然后利用其计算 (B, N, 256) (B, M, 256)特征返回
        ref_node_corr_knn_feats, src_node_corr_knn_feats = self.fine_transformer(  # 对上采样点跑一下transformer，输入输出都是256
                ref_node_corr_knn_points,
                src_node_corr_knn_points,
                ref_node_corr_knn_feats,
                src_node_corr_knn_feats,
                ref_dps=ref_node_corr_knn_dps,
                src_dps=src_node_corr_knn_dps,
                ref_rgb=None,
                src_rgb=None
        )  # (B, N, 256) (B, M, 256)
        # print(data_dict['index'], r, )
        #
        # for l_id, r_id in cut_ids:
        #     ref_node_corr_knn_feats_minibatch, src_node_corr_knn_feats_minibatch = self.fine_transformer(
        #         ref_node_corr_knn_points[l_id:r_id, ...],
        #         src_node_corr_knn_points[l_id:r_id, ...],
        #         ref_node_corr_knn_feats[l_id:r_id, ...],
        #         src_node_corr_knn_feats[l_id:r_id, ...],
        #         ref_dps=ref_node_corr_knn_dps[l_id:r_id, ...],
        #         src_dps=src_node_corr_knn_dps[l_id:r_id, ...],
        #         ref_rgb=None,
        #         src_rgb=None
        #     )
        #     list_ref_node_corr_knn_feats.append(ref_node_corr_knn_feats_minibatch)
        #     list_src_node_corr_knn_feats.append(src_node_corr_knn_feats_minibatch)
        #
        # ref_node_corr_knn_feats = torch.cat(list_ref_node_corr_knn_feats, dim=0)
        # src_node_corr_knn_feats = torch.cat(list_src_node_corr_knn_feats, dim=0)

        # ref_node_corr_knn_feats0, src_node_corr_knn_feats0 = self.fine_transformer(
        #     ref_node_corr_knn_points[:64, ...],
        #     src_node_corr_knn_points[:64, ...],
        #     ref_node_corr_knn_feats[:64, ...],
        #     src_node_corr_knn_feats[:64, ...],
        #     ref_dps = ref_node_corr_knn_dps[:64, ...],
        #     src_dps = src_node_corr_knn_dps[:64, ...],
        #     ref_rgb = None,
        #     src_rgb = None
        # )
        # ref_node_corr_knn_feats1, src_node_corr_knn_feats1 = self.fine_transformer(
        #     ref_node_corr_knn_points[64:, ...],
        #     src_node_corr_knn_points[64:, ...],
        #     ref_node_corr_knn_feats[64:, ...],
        #     src_node_corr_knn_feats[64:, ...],
        #     ref_dps = ref_node_corr_knn_dps[64:, ...],
        #     src_dps = src_node_corr_knn_dps[64:, ...],
        #     ref_rgb = None,
        #     src_rgb = None
        # )
        #
        # ref_node_corr_knn_feats = torch.cat([ref_node_corr_knn_feats0, ref_node_corr_knn_feats1], dim=0)
        # src_node_corr_knn_feats = torch.cat([src_node_corr_knn_feats0, src_node_corr_knn_feats1], dim=0)

        output_dict['ref_node_corr_knn_points'] = ref_node_corr_knn_points  # (P, K, 3)
        output_dict['src_node_corr_knn_points'] = src_node_corr_knn_points
        output_dict['ref_node_corr_knn_masks'] = ref_node_corr_knn_masks  # (P, K)
        output_dict['src_node_corr_knn_masks'] = src_node_corr_knn_masks

        # 8. Optimal transport
        matching_scores = torch.einsum('bnd,bmd->bnm', ref_node_corr_knn_feats, src_node_corr_knn_feats)  # (P, K, K) 这是在d维度乘法了
        matching_scores = matching_scores / feats_f.shape[1] ** 0.5  # 这是在干什么？？？
        # step into 2.6：最优转换
        matching_scores = self.optimal_transport(matching_scores, ref_node_corr_knn_masks, src_node_corr_knn_masks)  # (B, K+1, K+1)

        output_dict['matching_scores'] = matching_scores

        # 9. Generate final correspondences during testing
        with torch.no_grad():
            if not self.fine_matching.use_dustbin:
                matching_scores = matching_scores[:, :-1, :-1]
            # step into 2.7 local to global matching
            ref_corr_points, src_corr_points, corr_scores, estimated_transform = self.fine_matching(
                ref_node_corr_knn_points,
                src_node_corr_knn_points,
                ref_node_corr_knn_masks,
                src_node_corr_knn_masks,
                matching_scores,
                node_corr_scores,
            )  # (C, 3) (C, 3) (C) (4, 4) 其中C是函数内部计算出来的超过阈值的那些patch匹配


            output_dict['ref_corr_points'] = ref_corr_points
            output_dict['src_corr_points'] = src_corr_points
            output_dict['corr_scores'] = corr_scores
            output_dict['estimated_transform'] = estimated_transform

        return output_dict

# step into 2：建立模型
def create_model(config):
    # step into 2：建立模型
    model = GeoTransformer(config)
    return model


def main():
    from config import make_cfg

    cfg = make_cfg()
    model = create_model(cfg)
    print(model.state_dict().keys())
    print(model)


if __name__ == '__main__':
    main()

import torch
import torch.nn as nn

from geotransformer.modules.ops import pairwise_distance

# step into 2.3：超点匹配
class SuperPointMatching(nn.Module):
    def __init__(self, num_correspondences, dual_normalization=True):
        super(SuperPointMatching, self).__init__()
        self.num_correspondences = num_correspondences
        self.dual_normalization = dual_normalization

    def forward(self,
                ref_feats,  # (N, O)
                src_feats,   # (M, O)
                ref_masks=None,  # (N,) 哪些node是有上采样点的
                src_masks=None):  # (M,)
        r"""Extract superpoint correspondences.

        Args:
            ref_feats (Tensor): features of the superpoints in reference point cloud.
            src_feats (Tensor): features of the superpoints in source point cloud.
            ref_masks (BoolTensor=None): masks of the superpoints in reference point cloud (False if empty).
            src_masks (BoolTensor=None): masks of the superpoints in source point cloud (False if empty).

        Returns:
            ref_corr_indices (LongTensor): indices of the corresponding superpoints in reference point cloud.
            src_corr_indices (LongTensor): indices of the corresponding superpoints in source point cloud.
            corr_scores (Tensor): scores of the correspondences.
        """
        if ref_masks is None:
            ref_masks = torch.ones(size=(ref_feats.shape[0],), dtype=torch.bool).cuda()
        if src_masks is None:
            src_masks = torch.ones(size=(src_feats.shape[0],), dtype=torch.bool).cuda()
        # remove empty patch
        ref_indices = torch.nonzero(ref_masks, as_tuple=True)[0]  # 获取非0的索引
        src_indices = torch.nonzero(src_masks, as_tuple=True)[0]
        ref_feats = ref_feats[ref_indices]  # (n,O)
        src_feats = src_feats[src_indices]  # (m,O)
        # select top-k proposals 通过feats进行匹配分计算
        matching_scores = torch.exp(-pairwise_distance(ref_feats, src_feats, normalized=True))  # (N, M)
        if self.dual_normalization:  # 把每个行向量除以这行总和进行归一化
            ref_matching_scores = matching_scores / matching_scores.sum(dim=1, keepdim=True)
            src_matching_scores = matching_scores / matching_scores.sum(dim=0, keepdim=True)
            matching_scores = ref_matching_scores * src_matching_scores  # 匹配分分别归一化再相乘
        num_correspondences = min(self.num_correspondences, matching_scores.numel())  # 维数乘起来
        corr_scores, corr_indices = matching_scores.view(-1).topk(k=num_correspondences, largest=True)  # (k,) (k,)
        ref_sel_indices = corr_indices // matching_scores.shape[1]  # 因为前面view了，提取一下
        src_sel_indices = corr_indices % matching_scores.shape[1]  # 同样的
        # recover original indices
        ref_corr_indices = ref_indices[ref_sel_indices]  # (k,)
        src_corr_indices = src_indices[src_sel_indices]  # (k,)

        return ref_corr_indices, src_corr_indices, corr_scores  # (k,) (k,) (k,)

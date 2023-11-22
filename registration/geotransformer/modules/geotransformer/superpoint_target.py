import numpy as np
import torch
import torch.nn as nn

# step into 2.4 ：随机选择一部分重叠率超过阈值的node并且返回索引和重叠率
class SuperPointTargetGenerator(nn.Module):
    def __init__(self, num_targets, overlap_threshold):
        super(SuperPointTargetGenerator, self).__init__()
        self.num_targets = num_targets
        self.overlap_threshold = overlap_threshold  # 0.1

    @torch.no_grad()
    def forward(self,
                gt_corr_indices,
                gt_corr_overlaps):  # (C, 2), (C,) 第一个：有C对patch匹配，是索引号集合。 第二个：每对patch匹配的重叠率平均值,重叠率是patch上采样点也匹配的数量除以patch的总上采样点数
        r"""Generate ground truth superpoint (patch) correspondences.

        Randomly select "num_targets" correspondences whose overlap is above "overlap_threshold".

        Args:
            gt_corr_indices (LongTensor): ground truth superpoint correspondences (N, 2)
            gt_corr_overlaps (Tensor): ground truth superpoint correspondences overlap (N,)

        Returns:
            gt_ref_corr_indices (LongTensor): selected superpoints in reference point cloud.
            gt_src_corr_indices (LongTensor): selected superpoints in source point cloud.
            gt_corr_overlaps (LongTensor): overlaps of the selected superpoint correspondences.
        """
        gt_corr_masks = torch.gt(gt_corr_overlaps, self.overlap_threshold)  # (N, 2) 超过阈值的mask
        gt_corr_overlaps = gt_corr_overlaps[gt_corr_masks]  # 筛掉了一部分不到阈值的
        gt_corr_indices = gt_corr_indices[gt_corr_masks]  # 筛掉corr

        if gt_corr_indices.shape[0] > self.num_targets:  # 仍然需要通过随机选择筛掉一部分
            indices = np.arange(gt_corr_indices.shape[0])
            sel_indices = np.random.choice(indices, self.num_targets, replace=False)  # false是采样不会重复
            sel_indices = torch.from_numpy(sel_indices).cuda()
            gt_corr_indices = gt_corr_indices[sel_indices]
            gt_corr_overlaps = gt_corr_overlaps[sel_indices]

        gt_ref_corr_indices = gt_corr_indices[:, 0]
        gt_src_corr_indices = gt_corr_indices[:, 1]

        return gt_ref_corr_indices, gt_src_corr_indices, gt_corr_overlaps  # (T,), (T,), (T,)

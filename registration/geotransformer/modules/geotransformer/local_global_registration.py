from typing import Optional

import numpy as np
import torch
import torch.nn as nn

from geotransformer.modules.ops import apply_transform
from geotransformer.modules.registration import WeightedProcrustes

# step into 2.7 最重要的配准 local to global matching
class LocalGlobalRegistration(nn.Module):
    def __init__(
        self,
        k: int,
        acceptance_radius: float,
        mutual: bool = True,
        confidence_threshold: float = 0.05,
        use_dustbin: bool = False,
        use_global_score: bool = False,
        correspondence_threshold: int = 3,
        correspondence_limit: Optional[int] = None,
        num_refinement_steps: int = 5,
    ):
        r"""Point Matching with Local-to-Global Registration.

        Args:
            k (int): top-k selection for matching.
            acceptance_radius (float): acceptance radius for LGR.  "Local-to-Global Registration"
            mutual (bool=True): mutual or non-mutual matching.
            confidence_threshold (float=0.05): ignore matches whose scores are below this threshold.
            use_dustbin (bool=False): whether dustbin row/column is used in the score matrix.
            use_global_score (bool=False): whether use patch correspondence scores.
            correspondence_threshold (int=3): minimal number of correspondences for each patch correspondence.
            correspondence_limit (optional[int]=None): maximal number of verification correspondences.
            num_refinement_steps (int=5): number of refinement steps.
        """
        super(LocalGlobalRegistration, self).__init__()
        self.k = k
        self.acceptance_radius = acceptance_radius
        self.mutual = mutual
        self.confidence_threshold = confidence_threshold
        self.use_dustbin = use_dustbin
        self.use_global_score = use_global_score
        self.correspondence_threshold = correspondence_threshold
        self.correspondence_limit = correspondence_limit
        self.num_refinement_steps = num_refinement_steps
        self.procrustes = WeightedProcrustes(return_transform=True)

    # step into 2.7.1 计算关系矩阵
    def compute_correspondence_matrix(self, score_mat, ref_knn_masks, src_knn_masks):
        r"""Compute matching matrix and score matrix for each patch correspondence."""
        mask_mat = torch.logical_and(ref_knn_masks.unsqueeze(2), src_knn_masks.unsqueeze(1))  # (B, N, M)

        batch_size, ref_length, src_length = score_mat.shape
        batch_indices = torch.arange(batch_size).cuda()  # (B,)

        # correspondences from reference side
        ref_topk_scores, ref_topk_indices = score_mat.topk(k=self.k, dim=2)  # (B, N, K)
        ref_batch_indices = batch_indices.view(batch_size, 1, 1).expand(-1, ref_length, self.k)  # (B, N, K)
        ref_indices = torch.arange(ref_length).cuda().view(1, ref_length, 1).expand(batch_size, -1, self.k)  # (B, N, K)
        ref_score_mat = torch.zeros_like(score_mat)  # (B, N, M)
        ref_score_mat[ref_batch_indices, ref_indices, ref_topk_indices] = ref_topk_scores  # 这句只改变了K个值，注意索引的前两个维度和此矩阵相同，所以最后一个维度才是索引
        ref_corr_mat = torch.gt(ref_score_mat, self.confidence_threshold)  # (B, N, M)

        # correspondences from source side
        src_topk_scores, src_topk_indices = score_mat.topk(k=self.k, dim=1)  # (B, K, M)
        src_batch_indices = batch_indices.view(batch_size, 1, 1).expand(-1, self.k, src_length)  # (B, K, M)
        src_indices = torch.arange(src_length).cuda().view(1, 1, src_length).expand(batch_size, self.k, -1)  # (B, K, M)
        src_score_mat = torch.zeros_like(score_mat)
        src_score_mat[src_batch_indices, src_topk_indices, src_indices] = src_topk_scores
        src_corr_mat = torch.gt(src_score_mat, self.confidence_threshold)  # (B, N, M)

        # merge results from two sides
        if self.mutual:  # mutual两个都得超过阈值
            corr_mat = torch.logical_and(ref_corr_mat, src_corr_mat)
        else:  # 自注意的话有一个就行
            corr_mat = torch.logical_or(ref_corr_mat, src_corr_mat)

        if self.use_dustbin:  # ？？？
            corr_mat = corr_mat[:, -1:, -1]

        corr_mat = torch.logical_and(corr_mat, mask_mat)

        return corr_mat

    # step into 2.7.2.1 转换成统一的batch形式
    @staticmethod
    def convert_to_batch(ref_corr_points, src_corr_points, corr_scores, chunks):
        r"""Convert stacked correspondences to batched points.

        The extracted dense correspondences from all patch correspondences are stacked. However, to compute the
        transformations from all patch correspondences in parallel, the dense correspondences need to be reorganized
        into a batch.

        Args:
            ref_corr_points (Tensor): (C, 3)
            src_corr_points (Tensor): (C, 3)
            corr_scores (Tensor): (C,)
            chunks (List[Tuple[int, int]]): the starting index and ending index of each patch correspondences.

        Returns:
            batch_ref_corr_points (Tensor): (B, K, 3), padded with zeros.
            batch_src_corr_points (Tensor): (B, K, 3), padded with zeros.
            batch_corr_scores (Tensor): (B, K), padded with zeros.
        """
        batch_size = len(chunks)
        indices = torch.cat([torch.arange(x, y) for x, y in chunks], dim=0).cuda()  # (total,) 把超过阈值的那些下标都取出来
        ref_corr_points = ref_corr_points[indices]  # (total, 3)
        src_corr_points = src_corr_points[indices]  # (total, 3)
        corr_scores = corr_scores[indices]  # (total,)

        max_corr = np.max([y - x for x, y in chunks])  # 最大容量K

        target_chunks = [(i * max_corr, i * max_corr + y - x) for i, (x, y) in enumerate(chunks)]
        indices = torch.cat([torch.arange(x, y) for x, y in target_chunks], dim=0).cuda()  # (total,)
        indices0 = indices.unsqueeze(1).expand(indices.shape[0], 3)  # (total,) -> (total, 3)
        indices1 = torch.arange(3).unsqueeze(0).expand(indices.shape[0], 3).cuda()  # (3,) -> (total, 3)
        # 放到最大，没有的位置用0代替，为了保证返回值K的一致性
        batch_ref_corr_points = torch.zeros(batch_size * max_corr, 3).cuda()  # (BK, 3)
        # 下面这个index_put_还有一个类似的index_put函数，前者是改变自身，后者是不改变自身返回新tensor
        # indice是横坐标，纵坐标，索引需要和value保持shape一致
        batch_ref_corr_points.index_put_([indices0, indices1], ref_corr_points)  # 这里需要打断点理解，是把(BK, 3)中一部分值填写上，保持组距为K
        batch_ref_corr_points = batch_ref_corr_points.view(batch_size, max_corr, 3)  # (B, K, 3) 0来填充

        batch_src_corr_points = torch.zeros(batch_size * max_corr, 3).cuda()
        batch_src_corr_points.index_put_([indices0, indices1], src_corr_points)
        batch_src_corr_points = batch_src_corr_points.view(batch_size, max_corr, 3)

        batch_corr_scores = torch.zeros(batch_size * max_corr).cuda()  # (BK,)
        batch_corr_scores.index_put_([indices], corr_scores)
        batch_corr_scores = batch_corr_scores.view(batch_size, max_corr)  # (B, K)

        return batch_ref_corr_points, batch_src_corr_points, batch_corr_scores

    # step into 2.7.2.4 重新计算关系分数，只可能把一些非零值置为0
    def recompute_correspondence_scores(self, ref_corr_points, src_corr_points, corr_scores, estimated_transform):
        aligned_src_corr_points = apply_transform(src_corr_points, estimated_transform)
        corr_residuals = torch.linalg.norm(ref_corr_points - aligned_src_corr_points, dim=1)
        inlier_masks = torch.lt(corr_residuals, self.acceptance_radius)
        new_corr_scores = corr_scores * inlier_masks.float()
        return new_corr_scores

    # step into 2.7.2 计算估计的transformation
    def local_to_global_registration(self, ref_knn_points, src_knn_points, score_mat, corr_mat):
        # extract dense correspondences
        batch_indices, ref_indices, src_indices = torch.nonzero(corr_mat, as_tuple=True)  # (C,) 非零元素的个数C
        global_ref_corr_points = ref_knn_points[batch_indices, ref_indices]  # (C, 3)
        global_src_corr_points = src_knn_points[batch_indices, src_indices]  # (C, 3)
        global_corr_scores = score_mat[batch_indices, ref_indices, src_indices]  # (C,)

        # build verification set
        if self.correspondence_limit is not None and global_corr_scores.shape[0] > self.correspondence_limit:
            corr_scores, sel_indices = global_corr_scores.topk(k=self.correspondence_limit, largest=True)
            ref_corr_points = global_ref_corr_points[sel_indices]
            src_corr_points = global_src_corr_points[sel_indices]
        else:  # here
            ref_corr_points = global_ref_corr_points
            src_corr_points = global_src_corr_points
            corr_scores = global_corr_scores

        # compute starting and ending index of each patch correspondence.
        # torch.nonzero is row-major, so the correspondences from the same patch correspondence are consecutive.
        # find the first occurrence of each batch index, then the chunk of this batch can be obtained.
        unique_masks = torch.ne(batch_indices[1:], batch_indices[:-1])  # (C-1,) 与后一列的比较，为了找出同batch的corr的数量，如果两列不同说明是batch分界
        unique_indices = torch.nonzero(unique_masks, as_tuple=True)[0] + 1  # (C2-1,) 找到非0的分界线，加1是第二个batch的首个位置下标
        unique_indices = unique_indices.detach().cpu().numpy().tolist()
        unique_indices = [0] + unique_indices + [batch_indices.shape[0]]  # 头附一个0，尾付一个最大batch下标
        chunks = [  # 找含足够多匹配点的patch
            (x, y) for x, y in zip(unique_indices[:-1], unique_indices[1:]) if y - x >= self.correspondence_threshold
        ]

        batch_size = len(chunks)  # 有多少patch满足要求
        if batch_size > 0:
            # step into 2.7.2.1 转换成统一的batch形式
            batch_ref_corr_points, batch_src_corr_points, batch_corr_scores = self.convert_to_batch(
                global_ref_corr_points, global_src_corr_points, global_corr_scores, chunks
            )  # (B, K, 3) (B, K, 3) (B, K) K是最大的组内容量，其余不满的组都用0来填充
            # step into 2.7.2.2 得到每个batch的transform
            batch_transforms = self.procrustes(batch_src_corr_points, batch_ref_corr_points, batch_corr_scores)  # (B, 4, 4)
            # step into 2.7.2.3 使用transform来得到转换后的点云，这部分对应论文中的等式13！！！
            batch_aligned_src_corr_points = apply_transform(src_corr_points.unsqueeze(0), batch_transforms)  # (B, C, 3) 转换后点云，特意加上B维度广播是为了应用不同的transoform
            batch_corr_residuals = torch.linalg.norm(
                ref_corr_points.unsqueeze(0) - batch_aligned_src_corr_points, dim=2
            )  # (B, C)
            batch_inlier_masks = torch.lt(batch_corr_residuals, self.acceptance_radius)  # (B, C)
            best_index = batch_inlier_masks.sum(dim=1).argmax()  # 找出最大的B维度下标
            cur_corr_scores = corr_scores * batch_inlier_masks[best_index].float()  # (C,)将没有超过阈值的点置为0
        else:
            # degenerate: initialize transformation with all correspondences
            estimated_transform = self.procrustes(src_corr_points, ref_corr_points, corr_scores)
            cur_corr_scores = self.recompute_correspondence_scores(
                ref_corr_points, src_corr_points, corr_scores, estimated_transform
            )

        # global refinement
        estimated_transform = self.procrustes(src_corr_points, ref_corr_points, cur_corr_scores)
        for _ in range(self.num_refinement_steps - 1):  # 迭代进行目标次数
            # step into 2.7.2.4 重新计算关系分数，只可能把一些非零值置为0
            cur_corr_scores = self.recompute_correspondence_scores(
                ref_corr_points, src_corr_points, corr_scores, estimated_transform
            )
            # 根据新的关系分数，用这个新权重去估计transform
            estimated_transform = self.procrustes(src_corr_points, ref_corr_points, cur_corr_scores)

        return global_ref_corr_points, global_src_corr_points, global_corr_scores, estimated_transform

    def forward(
        self,
        ref_knn_points,
        src_knn_points,
        ref_knn_masks,
        src_knn_masks,
        score_mat,
        global_scores,
    ):
        r"""Point Matching Module forward propagation with Local-to-Global registration.

        Args:
            ref_knn_points (Tensor): (B, K, 3)
            src_knn_points (Tensor): (B, K, 3)
            ref_knn_masks (BoolTensor): (B, K)
            src_knn_masks (BoolTensor): (B, K)
            score_mat (Tensor): (B, K, K) or (B, K + 1, K + 1), log likelihood
            global_scores (Tensor): (B,)

        Returns:
            ref_corr_points: torch.LongTensor (C, 3)
            src_corr_points: torch.LongTensor (C, 3)
            corr_scores: torch.Tensor (C,)
            estimated_transform: torch.Tensor (4, 4)
        """
        score_mat = torch.exp(score_mat)  # 什么？？？
        # step into 2.7.1 计算关系矩阵
        corr_mat = self.compute_correspondence_matrix(score_mat, ref_knn_masks, src_knn_masks)  # (B, N, M) 是bool值

        if self.use_dustbin:  # ？？？
            score_mat = score_mat[:, :-1, :-1]
        if self.use_global_score:  # 乘上patch匹配的权重
            score_mat = score_mat * global_scores.view(-1, 1, 1)
        score_mat = score_mat * corr_mat.float()  # 将一些没超过阈值的置为0
        # step into 2.7.2 计算估计的transformation
        ref_corr_points, src_corr_points, corr_scores, estimated_transform = self.local_to_global_registration(
            ref_knn_points, src_knn_points, score_mat, corr_mat
        )

        return ref_corr_points, src_corr_points, corr_scores, estimated_transform

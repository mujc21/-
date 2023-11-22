import argparse
import time

import torch.optim as optim

from geotransformer.engine import EpochBasedTrainer
from config import make_cfg
from dataset import train_valid_color_data_loader
from model import create_model
import os.path as osp
from loss import OverallLoss, Evaluator

# import os
# os.environ["CUDA_VISIBLE_DEVICES"] = "5"
# import numpy as np
# from geotransformer.modules.ops.transformation import apply_transform


class Trainer(EpochBasedTrainer):
    def __init__(self, cfg):
        # step into 0 : 父类初始化
        super().__init__(cfg, max_epoch=cfg.optim.max_epoch)  # 默认是40epoch

        # dataloader
        start_time = time.time()
        # step into 1 ：加载数据集loader和计算邻域点限制？？？
        train_loader, val_loader, neighbor_limits = train_valid_color_data_loader(cfg, self.distributed)  # 默认是-1的distributed
        loading_time = time.time() - start_time
        message = 'Data loader created: {:.3f}s collapsed.'.format(loading_time)
        # self.ori = ori
        self.logger.info(message)
        message = 'Calibrate neighbors: {}.'.format(neighbor_limits)
        self.logger.info(message)
        # self的配准loader赋值而已
        self.register_loader(train_loader, val_loader)

        # model, optimizer, scheduler
        # step into 2：建立模型
        model = create_model(cfg).cuda()
        # step into 3：注册模型
        model = self.register_model(model)
        optimizer = optim.Adam(model.parameters(), lr=cfg.optim.lr, weight_decay=cfg.optim.weight_decay)
        # step into 4：注册优化器
        self.register_optimizer(optimizer)
        # 调度器，用来根据训练轮数来减小lr
        scheduler = optim.lr_scheduler.StepLR(optimizer, cfg.optim.lr_decay_steps, gamma=cfg.optim.lr_decay)
        # 简单赋值
        self.register_scheduler(scheduler)

        # loss function, evaluator

        # step into 5： loss_func，应该不重要，先跳过
        self.loss_func = OverallLoss(cfg).cuda()
        # step into 6：evaluator
        self.evaluator = Evaluator(cfg).cuda()

    # 没有用到，暂时不看
    def train_step(self, epoch, iteration, data_dict):
        output_dict = self.model(data_dict)
        # add
        # src_points = output_dict['src_points']
        # ref_points = output_dict['ref_points']
        # est_transform = output_dict['estimated_transform']
        # gt_transform = data_dict['transform']
        # realigned_src_points = apply_transform(src_points, est_transform)
        # gt_src_points = apply_transform(src_points, gt_transform)
        # np.save(osp.join(self.benchmark_dir, f'src_points.npy'), realigned_src_points.cpu().numpy())
        # np.save(osp.join(self.benchmark_dir, f'ref_points.npy'), ref_points.cpu().numpy())
        # np.save(osp.join(self.benchmark_dir, f'gt_src_points.npy'), gt_src_points.cpu().numpy())

        loss_dict = self.loss_func(output_dict, data_dict)
        result_dict = self.evaluator(output_dict, data_dict)
        loss_dict.update(result_dict)
        # torch.cuda.empty_cache()
        return output_dict, loss_dict

    def val_step(self, epoch, iteration, data_dict):
        output_dict = self.model(data_dict)
        loss_dict = self.loss_func(output_dict, data_dict)
        result_dict = self.evaluator(output_dict, data_dict)
        loss_dict.update(result_dict)
        return output_dict, loss_dict


def main():
    cfg = make_cfg()
    # add
    # parser = argparse.ArgumentParser(description='这是一个演示程序')
    # parser.add_argument('--snapshot', type=str, help='你的名字')
    # snapshot = osp.join(cfg.snapshot_dir, f'epoch-7.pth.tar')
    # parser.set_defaults(snapshot=snapshot)

    trainer = Trainer(cfg)

    trainer.run()


if __name__ == '__main__':
    main()

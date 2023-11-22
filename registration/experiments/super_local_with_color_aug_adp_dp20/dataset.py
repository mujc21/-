from geotransformer.datasets.registration.threedmatch.dataset import ThreeDMatchPairDataset
from geotransformer.utils.data import (
    registration_collate_fn_stack_mode,
    calibrate_neighbors_stack_mode,
    build_dataloader_stack_mode,
)

from geotransformer.datasets.registration.threedmatchcolor.dataset import ThreeDMatchColorPairDataset
# step into 1 ；加载数据集loader和计算邻域点限制？？？
def train_valid_color_data_loader(cfg, distributed):
    sampleN = -1
    # step into 1.1 ：加载数据集
    train_dataset = ThreeDMatchColorPairDataset(  # 这里建立了一个torch.utils.data.Dataset
        # '/home/lirenjie/data/3DMatchNPY/raw/meta_train.txt',
        cfg.train.meta_path_train,
        # '/home/lirenjie/GeoTransformer/mydata/raw/dp_meta.txt',
        cfg.data.dataset_root,
        'train',
        point_limit=cfg.train.point_limit,
        use_augmentation=cfg.train.use_augmentation,
        augmentation_noise=cfg.train.augmentation_noise,
        augmentation_rotation=cfg.train.augmentation_rotation,
        sampleN=sampleN
    )
    # step into 1.2 ：计算邻点限制
    neighbor_limits = calibrate_neighbors_stack_mode(  # （4,）返回四个阶段的邻接点限制，保证点数量再keep_ratio以下
        train_dataset,
        # step into 1.2.1配准整理函数（用于整理数据），就是一般传给dataloader的那个将batch转换为real_batch的那个函数（pytorch默认是转tensor函数）
        registration_collate_fn_stack_mode,
        cfg.backbone.num_stages,
        cfg.backbone.init_voxel_size,
        cfg.backbone.init_radius,
    )
    # step into 1.3 :dataloader
    train_loader = build_dataloader_stack_mode(
        train_dataset,
        registration_collate_fn_stack_mode,
        cfg.backbone.num_stages,
        cfg.backbone.init_voxel_size,
        cfg.backbone.init_radius,
        neighbor_limits,
        batch_size=cfg.train.batch_size,
        # num_workers=cfg.train.num_workers,
        shuffle=True,
        distributed=distributed,
    )
    # 同step into 1.1加载数据集
    valid_dataset = ThreeDMatchColorPairDataset(
        # '/home/lirenjie/data/3DMatchNPY/raw/meta_val.txt',
        # '/home/lirenjie/GeoTransformer/mydata/raw/dp_meta.txt',
        cfg.train.meta_path_valid,
        cfg.data.dataset_root,
        'val',
        point_limit=cfg.train.point_limit,
        use_augmentation=cfg.train.use_augmentation,
        augmentation_noise=cfg.train.augmentation_noise,
        augmentation_rotation=cfg.train.augmentation_rotation,
        sampleN=sampleN
    )

    valid_loader = build_dataloader_stack_mode(
        valid_dataset,
        registration_collate_fn_stack_mode,
        cfg.backbone.num_stages,
        cfg.backbone.init_voxel_size,
        cfg.backbone.init_radius,
        neighbor_limits,
        batch_size=cfg.test.batch_size,
        num_workers=cfg.test.num_workers,
        shuffle=True,
        distributed=distributed,
    )

    return train_loader, valid_loader, neighbor_limits


def test_color_data_loader(cfg, benchmark):
    sampleN = -1
    train_dataset = ThreeDMatchColorPairDataset(
        # '/home/lirenjie/data/3DMatchNPY/raw/meta_train.txt',
        # '/home/lirenjie/GeoTransformer/mydata/raw/dp_meta.txt',
        cfg.test.meta_path,
        cfg.data.dataset_root,
        'train',
        point_limit=cfg.train.point_limit,
        use_augmentation=cfg.train.use_augmentation,
        augmentation_noise=cfg.train.augmentation_noise,
        augmentation_rotation=cfg.train.augmentation_rotation,
        sampleN=sampleN
    )
    neighbor_limits = calibrate_neighbors_stack_mode(
        train_dataset,
        registration_collate_fn_stack_mode,
        cfg.backbone.num_stages,
        cfg.backbone.init_voxel_size,
        cfg.backbone.init_radius,
    )

    test_dataset = ThreeDMatchColorPairDataset(
        '/home/lirenjie/data/3DMatchNPY/raw/meta_test.txt',
        # '/home/lirenjie/GeoTransformer/mydata/raw/dp_meta.txt',
        cfg.data.dataset_root,
        'val',
        point_limit=cfg.train.point_limit,
        use_augmentation=cfg.train.use_augmentation,
        augmentation_noise=cfg.train.augmentation_noise,
        augmentation_rotation=cfg.train.augmentation_rotation,
        sampleN=sampleN
    )
    test_loader = build_dataloader_stack_mode(
        test_dataset,
        registration_collate_fn_stack_mode,
        cfg.backbone.num_stages,
        cfg.backbone.init_voxel_size,
        cfg.backbone.init_radius,
        neighbor_limits,
        batch_size=cfg.test.batch_size,
        num_workers=cfg.test.num_workers,
        shuffle=False,
    )

    return test_loader, neighbor_limits

def train_valid_data_loader(cfg, distributed):
    train_dataset = ThreeDMatchPairDataset(
        cfg.data.dataset_root,
        'train',
        point_limit=cfg.train.point_limit,
        use_augmentation=cfg.train.use_augmentation,
        augmentation_noise=cfg.train.augmentation_noise,
        augmentation_rotation=cfg.train.augmentation_rotation,
    )
    neighbor_limits = calibrate_neighbors_stack_mode(
        train_dataset,
        registration_collate_fn_stack_mode,
        cfg.backbone.num_stages,
        cfg.backbone.init_voxel_size,
        cfg.backbone.init_radius,
    )
    train_loader = build_dataloader_stack_mode(
        train_dataset,
        registration_collate_fn_stack_mode,
        cfg.backbone.num_stages,
        cfg.backbone.init_voxel_size,
        cfg.backbone.init_radius,
        neighbor_limits,
        batch_size=cfg.train.batch_size,
        num_workers=cfg.train.num_workers,
        shuffle=False,
        distributed=distributed,
    )

    valid_dataset = ThreeDMatchPairDataset(
        cfg.data.dataset_root,
        'val',
        point_limit=cfg.test.point_limit,
        use_augmentation=False,
    )
    valid_loader = build_dataloader_stack_mode(
        valid_dataset,
        registration_collate_fn_stack_mode,
        cfg.backbone.num_stages,
        cfg.backbone.init_voxel_size,
        cfg.backbone.init_radius,
        neighbor_limits,
        batch_size=cfg.test.batch_size,
        num_workers=cfg.test.num_workers,
        shuffle=False,
        distributed=distributed,
    )

    return train_loader, valid_loader, neighbor_limits


def test_data_loader(cfg, benchmark):
    train_dataset = ThreeDMatchPairDataset(
        cfg.data.dataset_root,
        'train',
        point_limit=cfg.train.point_limit,
        use_augmentation=cfg.train.use_augmentation,
        augmentation_noise=cfg.train.augmentation_noise,
        augmentation_rotation=cfg.train.augmentation_rotation,
    )
    neighbor_limits = calibrate_neighbors_stack_mode(
        train_dataset,
        registration_collate_fn_stack_mode,
        cfg.backbone.num_stages,
        cfg.backbone.init_voxel_size,
        cfg.backbone.init_radius,
    )

    test_dataset = ThreeDMatchPairDataset(
        cfg.data.dataset_root,
        benchmark,
        point_limit=cfg.test.point_limit,
        use_augmentation=False,
    )
    test_loader = build_dataloader_stack_mode(
        test_dataset,
        registration_collate_fn_stack_mode,
        cfg.backbone.num_stages,
        cfg.backbone.init_voxel_size,
        cfg.backbone.init_radius,
        neighbor_limits,
        batch_size=cfg.test.batch_size,
        num_workers=cfg.test.num_workers,
        shuffle=False,
    )

    return test_loader, neighbor_limits

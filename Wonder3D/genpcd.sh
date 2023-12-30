#!/bin/bash

rm -r outputs
rm -r instant-nsr-pl/exp
png="$1"
png_name="${png%.*}"

python process_picture.py "$1"

accelerate launch --config_file 1gpu.yaml test_mvdiffusion_seq.py \
            --config configs/mvdiffusion-joint-ortho-6views.yaml validation_dataset.root_dir=./example_images \
            validation_dataset.filepaths=["$png_name.png"] save_dir=./outputs

cd instant-nsr-pl
python launch.py --config configs/neuralangelo-ortho-wmask.yaml --gpu 0 --train dataset.root_dir=../outputs/cropsize-192-cfg1.0/ dataset.scene="${png_name}"

python mesh2pcd.py

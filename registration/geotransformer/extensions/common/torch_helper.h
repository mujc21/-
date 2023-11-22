#pragma once

#include <ATen/cuda/CUDAContext.h>
#include <torch/extension.h>

//这个文件和其他的c++文件都是在对底层的pytorch做拓展，来实现下采样等python会很慢的方法

#define CHECK_CUDA(x)                                                         \
  TORCH_CHECK(x.device().is_cuda(), #x " must be a CUDA tensor")

#define CHECK_CPU(x)                                                          \
  TORCH_CHECK(!x.device().is_cuda(), #x " must be a CPU tensor")
//判断在内存中是否连续分布，例如用transpose会破坏连续性
#define CHECK_CONTIGUOUS(x)                                                   \
  TORCH_CHECK(x.is_contiguous(), #x " must be contiguous").

#define CHECK_INPUT(x)                                                        \
  CHECK_CUDA(x);                                                              \
  CHECK_CONTIGUOUS(x)

#define CHECK_IS_INT(x)                                                       \
  do {                                                                        \
    TORCH_CHECK(x.scalar_type() == at::ScalarType::Int,                       \
                #x " must be an int tensor");                                 \
  } while (0)

#define CHECK_IS_LONG(x)                                                      \
  do {                                                                        \
    TORCH_CHECK(x.scalar_type() == at::ScalarType::Long,                      \
                #x " must be an long tensor");                                \
  } while (0)

#define CHECK_IS_FLOAT(x)                                                     \
  do {                                                                        \
    TORCH_CHECK(x.scalar_type() == at::ScalarType::Float,                     \
                #x " must be a float tensor");                                \
  } while (0)

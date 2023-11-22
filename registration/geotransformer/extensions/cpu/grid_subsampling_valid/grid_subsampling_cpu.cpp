#include "grid_subsampling_cpu.h"
#include <cstdio>

void single_grid_subsampling_cpu(
  std::vector<PointXYZ>& points,
  std::vector<PointXYZ>& s_points,
  std::vector<PointXYZ>& dps,
  std::vector<PointXYZ>& s_dps,
//  std::vector<long>& s_indexes,
  float voxel_size
) {

  PointXYZ minCorner = min_point(points);
  PointXYZ maxCorner = max_point(points);
  PointXYZ originCorner = floor(minCorner * (1. / voxel_size)) * voxel_size;

  std::size_t sampleNX = static_cast<std::size_t>(
    floor((maxCorner.x - originCorner.x) / voxel_size) + 1
  );
  std::size_t sampleNY = static_cast<std::size_t>(
    floor((maxCorner.y - originCorner.y) / voxel_size) + 1
  );

  std::size_t iX = 0;
  std::size_t iY = 0;
  std::size_t iZ = 0;
  std::size_t mapIdx = 0;
  std::unordered_map<std::size_t, SampledData> data;
  std::unordered_map<std::size_t, SampledData> dp_data;

  int NN = points.size();
  int NB = dps.size();

//  for (auto& p : points) {
    for (int i = 0; i < NN; ++i){
        PointXYZ& p = points[i];
        PointXYZ& dp = dps[i];

    iX = static_cast<std::size_t>(floor((p.x - originCorner.x) / voxel_size));
    iY = static_cast<std::size_t>(floor((p.y - originCorner.y) / voxel_size));
    iZ = static_cast<std::size_t>(floor((p.z - originCorner.z) / voxel_size));
    mapIdx = iX + sampleNX * iY + sampleNX * sampleNY * iZ;

    if (!data.count(mapIdx)) {
      data.emplace(mapIdx, SampledData());
      dp_data.emplace(mapIdx, SampledData());
    }

    data[mapIdx].update(p);

    dp_data[mapIdx].update(dp);
  }

  s_dps.reserve(dp_data.size());
  for (auto& v : dp_data) {
    s_dps.push_back(v.second.point * (1.0 / v.second.count));
  }

  s_points.reserve(data.size());
  for (auto& v : data) {
    s_points.push_back(v.second.point * (1.0 / v.second.count));
  }
}

void grid_subsampling_cpu(
  std::vector<PointXYZ>& points,
  std::vector<PointXYZ>& s_points,
  std::vector<PointXYZ>& dps,
  std::vector<PointXYZ>& s_dps,
  std::vector<long>& lengths,
  std::vector<long>& s_lengths,
  float voxel_size
) {
  std::size_t start_index = 0;
  std::size_t batch_size = lengths.size();

//  std::printf("%d\n", batch_size);

  for (std::size_t b = 0; b < batch_size; b++) {
    std::vector<PointXYZ> cur_points = std::vector<PointXYZ>(
      points.begin() + start_index,
      points.begin() + start_index + lengths[b]
    );
    std::vector<PointXYZ> cur_dps = std::vector<PointXYZ>(
      dps.begin() + start_index,
      dps.begin() + start_index + lengths[b]
    );
    std::vector<PointXYZ> cur_s_points;
    std::vector<PointXYZ> cur_s_dps;
//    std::vector<long> cur_s_indexes;

//    single_grid_subsampling_cpu(cur_points, cur_s_points, cur_s_indexes, voxel_size);
    single_grid_subsampling_cpu(cur_points, cur_s_points, cur_dps, cur_s_dps, voxel_size);

    s_points.insert(s_points.end(), cur_s_points.begin(), cur_s_points.end());
    s_dps.insert(s_dps.end(), cur_s_dps.begin(), cur_s_dps.end());

    s_lengths.push_back(cur_s_points.size());

    start_index += lengths[b];
  }

  return;
}

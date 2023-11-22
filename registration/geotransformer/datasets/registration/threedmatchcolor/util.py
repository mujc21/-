def load_meta():
    meta_path = './mydata/raw/meta.txt'
    # meta_path = './data/sampled/meta.txt'

    sampleN = 1000
    # sampleN = 40
    eps = 0.1
    with open(meta_path, 'r') as fin:
        meta = fin.readlines()
        meta = meta[:sampleN]
        meta = map(lambda x: x.split(','), meta)
        meta = [(x[0], x[2], x[3], x[4]) for x in meta]
    print(meta)
    meta = meta[:sampleN]
    # meta_path = meta_path[:1000]
    return meta

def load_my_data(meta, frame_id):
    # meta_path = load_meta()
    # 497,500,
    meta_path = './mydata/raw/meta.txt'
    path_pref = '/'.join(meta_path.split('/')[:-1])
    meta0 = meta[frame_id]
    pc1 = np.load(osp.join(path_pref, meta0[1]))
    pc2 = np.load(osp.join(path_pref, meta0[2]))
    gt_t = np.load(osp.join(path_pref, meta0[3]))

    pc1_p, pc1_c = pc1[:, :3], pc1[:, 3:]
    pc2_p, pc2_c = pc2[:, :3], pc2[:, 3:]

    pcd1 = n2o(pc1_p, pc1_c)
    pcd2 = n2o(pc2_p, pc2_c)

    return pcd1, pcd2, gt_t

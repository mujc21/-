import numpy as np

# finished

# step into 0.1.2 ：注册一个计量器meter，有属性_records
class AverageMeter:
    def __init__(self, last_n=None):
        self._records = []
        self.last_n = last_n

    def update(self, result):
        if isinstance(result, (list, tuple)):  # 返回result是否是（list,tuple）类型
            self._records += result  # 每个数都加result
        else:
            self._records.append(result)  # 将数据加入记录中

    def reset(self):
        self._records.clear()

    @property  # 只读，不允许赋值
    def records(self):
        if self.last_n is not None:
            return self._records[-self.last_n :]  # 返回后n个
        else:
            return self._records

    def sum(self):
        return np.sum(self.records)

    def mean(self):
        return np.mean(self.records)

    def std(self):
        return np.std(self.records)

    def median(self):
        return np.median(self.records)  # 中位数

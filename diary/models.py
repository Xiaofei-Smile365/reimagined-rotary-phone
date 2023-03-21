import datetime

from django.db import models
# timezone 用于处理时间相关事务。
from django.utils import timezone


class Diary(models.Model):
    # 文章正文。保存大量文本使用 TextField
    diary_body = models.TextField()
    # 文章创建时间。参数 default=timezone.now 指定其在创建数据时将默认写入当前的时间
    created_time = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.diary_body

    def was_published_recently(self):
        return self.created_time >= timezone.now() - datetime.timedelta(days=1)

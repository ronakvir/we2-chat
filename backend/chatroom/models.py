from django.db import models


class ChatRoom(models.Model):
    room_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    user_count = models.IntegerField(default=0)

    def __str__(self):
        return self.room_name

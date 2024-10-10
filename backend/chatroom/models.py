from django.db import models


class ChatRoom(models.Model):
    room_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    user_count = models.IntegerField(default=1)

    def __str__(self):
        return self.room_name

class Events(models.Model):
    event_name = models.CharField(max_length=255)
    expires_at = models.DateTimeField()
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [  # noqa: RUF012
            models.UniqueConstraint(fields=['event_name', 'is_active'], name='UX-event_name_per_active_status')
        ]

    def __str__(self):
        return self.event_name

class Messages(models.Model):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message

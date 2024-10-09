from rest_framework import serializers

from .models import ChatRoom


class ChatRoomSeralizer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = [  # noqa: RUF012
            "room_name",
            "created_at",
            "user_count",
        ]

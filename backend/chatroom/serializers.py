from rest_framework import serializers

from .models import ChatRoom


class ChatRoomSeralizer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = [  # noqa: RUF012
            "id",
            "room_name",
            "created_at",
            "user_count",
        ]

class CreateChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ["room_name", "user_count"]  # noqa: RUF012
        read_only_fields = ['user_count']  # noqa: RUF012

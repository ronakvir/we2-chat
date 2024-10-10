from rest_framework import serializers

from .models import ChatRoom, Events


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
        fields = ["room_name"]  # noqa: RUF012
        read_only_fields = ['user_count']  # noqa: RUF012

class EventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = ["event_name", "expires_at", "chat_room", "is_active"]  # noqa: RUF012
        read_only_fields = ['chat_room', 'is_active'] # noqa: RUF012

class TopChatsResponseSerializer(serializers.Serializer):
    top_chats = ChatRoomSeralizer(many=True)

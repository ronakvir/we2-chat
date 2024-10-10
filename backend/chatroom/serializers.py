from rest_framework import serializers

from .models import ChatRoom, Events, Messages


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

class MessagesListSerializer(serializers.ModelSerializer):
    chat_room = serializers.SlugRelatedField(slug_field='room_name', read_only=True)

    class Meta:
        model = Messages
        fields = ["chat_room", "user_name", "message", "created_at"]  # noqa: RUF012

class MessagesCreateSerializer(serializers.ModelSerializer):
    room_name = serializers.CharField(write_only=True)  # Accept room_name in the request instead of chat_room

    class Meta:
        model = Messages
        fields = ["room_name", "user_name", "message"]  # No need to send chat_room or created_at

    def create(self, validated_data):
        room_name = validated_data.pop('room_name')
        chat_room = ChatRoom.objects.get(room_name=room_name)

        # Create the message with the resolved chat_room
        return Messages.objects.create(chat_room=chat_room, **validated_data)


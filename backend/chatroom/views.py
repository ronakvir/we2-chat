from rest_framework import viewsets

from .models import ChatRoom
from .serializers import ChatRoomSeralizer


class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSeralizer

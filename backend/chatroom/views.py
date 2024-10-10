from django.shortcuts import get_object_or_404

from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ChatRoom
from .serializers import ChatRoomSeralizer, CreateChatRoomSerializer


class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSeralizer
class DecrementUserCountAPIView(APIView):
    serializer_class = ChatRoomSeralizer

    def patch(self, request):
        room_name = request.data.get('room_name')
        if not room_name:
            return Response({'error': 'room_name is required'}, status=status.HTTP_400_BAD_REQUEST)

        chatroom = get_object_or_404(ChatRoom, room_name=room_name)

        if chatroom.user_count > 0:
            chatroom.user_count -= 1
            chatroom.save()
            return Response({
                'message': 'User count decremented successfully',
                'user_count': chatroom.user_count
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User count cannot be less than 0'}, status=status.HTTP_400_BAD_REQUEST)


class IncrementUserCountAPIView(APIView):
    serializer_class = ChatRoomSeralizer

    def patch(self, request):
        room_name = request.data.get('room_name')
        if not room_name:
            return Response({'error': 'room_name is required'}, status=status.HTTP_400_BAD_REQUEST)

        chatroom = get_object_or_404(ChatRoom, room_name=room_name)

        chatroom.user_count += 1
        chatroom.save()
        return Response({
            'message': 'User count incremented successfully',
            'user_count': chatroom.user_count
        }, status=status.HTTP_200_OK)

class CreateChatRoomOrIncrementUserCount(APIView):
    serializer_class = CreateChatRoomSerializer
    def post(self, request):

        room_name = request.data.get('room_name')
        if not room_name:
            return Response({'error': 'room_name is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            chatroom = ChatRoom.objects.get(room_name=room_name)
            chatroom.user_count += 1
            chatroom.save()
            return Response({
                'message': 'User count incremented successfully',
                'chatroom': self.serializer_class(chatroom).data
            }, status=status.HTTP_200_OK)

        except ChatRoom.DoesNotExist:
            data = {
                'room_name': room_name,
            }
            serializer = self.serializer_class(data=data)
            print("Data to be saved:", data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            chatroom = serializer.save()
            return Response({
                'message': 'ChatRoom created successfully',
                'chatroom': serializer.data
            }, status=status.HTTP_201_CREATED)

class DecrementUserCountOrDeleteChatRoom(APIView):
    serializer_class = CreateChatRoomSerializer
    def post(self, request):
        room_name = request.data.get('room_name')
        if not room_name:
            return Response({'error': 'room_name is required'}, status=status.HTTP_400_BAD_REQUEST)

        chatroom = get_object_or_404(ChatRoom, room_name=room_name)

        if chatroom.user_count > 1:
            chatroom.user_count -= 1
            chatroom.save()
            return Response({
                'message': 'User count decremented successfully',
            }, status=status.HTTP_200_OK)
        else:
            chatroom.delete()
            return Response({
                'message': f'ChatRoom "{room_name}" deleted as user count reached 0.'
            }, status=status.HTTP_200_OK)


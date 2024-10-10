from django.shortcuts import get_object_or_404

from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ChatRoom, Events, Messages
from .serializers import (
    ChatRoomSeralizer,
    CreateChatRoomSerializer,
    EventsSerializer,
    MessagesListSerializer,
    MessagesCreateSerializer,
    TopChatsResponseSerializer,
)


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
            associated_events = Events.objects.filter(chat_room=chatroom, is_active=True).exists()
            if associated_events:
                chatroom.user_count -= 1
                chatroom.save()
                return Response({
                    'error': f'Successfuly left - ChatRoom "{room_name}" cannot be deleted as it has associated events.'
                }, status=status.HTTP_200_OK)

            chatroom.delete()
            return Response({
                'message': f'ChatRoom "{room_name}" deleted as user count reached 0.'
            }, status=status.HTTP_200_OK)

class CreateEvent(APIView):
    serializer_class = EventsSerializer

    def post(self, request):
        event_name = request.data.get('event_name')
        expires_at = request.data.get('expires_at')
        room_name = request.data.get('room_name', event_name)

        if not event_name:
            return Response({'error': 'event_name is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not expires_at:
            return Response({'error': 'expires_at is required'}, status=status.HTTP_400_BAD_REQUEST)

        if Events.objects.filter(event_name=event_name).exists():
            return Response({'error': 'Event with this name already exists'}, status=status.HTTP_400_BAD_REQUEST)
        if ChatRoom.objects.filter(room_name=event_name).exists():
            return Response({'error': 'ChatRoom with this name already exists'}, status=status.HTTP_400_BAD_REQUEST)


        chat_room = ChatRoom.objects.create(room_name=room_name, user_count=0)

        data = {
            'event_name': event_name,
            'expires_at': expires_at,
            'is_active': True
        }

        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save(chat_room=chat_room)
            return Response({
                'message': 'Event created successfully',
                'event': serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            chat_room.delete()
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Top5ActiveChatsCount(APIView):
    serializer_class = TopChatsResponseSerializer

    def get(self, request):
        top_chats = ChatRoom.objects.distinct().order_by('-user_count')[:5]
        chat_serializer = ChatRoomSeralizer(top_chats, many=True)
        response_serializer = self.serializer_class(data={'top_chats': chat_serializer.data})
        if response_serializer.is_valid():
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        return Response(response_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MessagesListView(APIView):
    serializer_class = MessagesListSerializer

    def get(self, request):
        room_name = request.query_params.get('room_name')
        offset = int(request.query_params.get('offset', 0))
        limit = int(request.query_params.get('limit', 10))

        if not room_name:
            return Response({'error': 'room_name is required'}, status=status.HTTP_400_BAD_REQUEST)

        chatroom = get_object_or_404(ChatRoom, room_name=room_name)

        messages = Messages.objects.filter(chat_room=chatroom).order_by('-created_at')[offset:offset + limit]
        serializer = self.serializer_class(messages, many=True)

        return Response({
            'room_name': room_name,
            'messages': serializer.data
        }, status=status.HTTP_200_OK)

class MessagesCreateView(APIView):
    serializer_class = MessagesCreateSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Message sent successfully',
                'messagedata': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

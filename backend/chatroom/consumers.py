# chatroom/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Messages

class ChatRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_group_name = f'chat_{self.room_name}'
            print(f'Connecting to room: {self.room_name}')

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            print('Added to group')
            await self.accept()
            print('WebSocket connection accepted')
        except Exception as e:
            print(f'Error in connect: {e}')
            await self.close()


    async def disconnect(self, close_code):
        print('WebSocket connection disconnected')
        if hasattr(self, 'room_group_name'):
            # Leave room group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        print('Received message')
        if not hasattr(self, 'room_group_name'):
            print('Error: room_group_name not set in receive')
            await self.close()
            return

        data = json.loads(text_data)
        room_name = data.get('room_name')
        user_name = data.get('user_name')
        message = data.get('message')

        if not all([room_name, user_name, message]):
            print('Invalid message data received')
            await self.send(text_data=json.dumps({
                'error': 'Invalid message data'
            }))
            return

        # Save message to the database asynchronously
        chat_room = await self.get_chat_room(room_name)
        if chat_room:
            await self.create_message(chat_room, user_name, message)
        else:
            print(f'Chat room "{room_name}" does not exist.')
            await self.send(text_data=json.dumps({
                'error': f'Chat room "{room_name}" does not exist.'
            }))
            return

        # Broadcast message to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'user_name': user_name,
                'message': message
            }
        )

    async def chat_message(self, event):
        print('Broadcasting message')
        await self.send(text_data=json.dumps({
            'user_name': event['user_name'],
            'message': event['message']
        }))

    @database_sync_to_async
    def get_chat_room(self, room_name):
        try:
            return ChatRoom.objects.get(room_name=room_name)
        except ChatRoom.DoesNotExist:
            return None

    @database_sync_to_async
    def create_message(self, chat_room, user_name, message):
        return Messages.objects.create(chat_room=chat_room, user_name=user_name, message=message)

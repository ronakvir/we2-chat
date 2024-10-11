# chatroom/consumers.py
import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import ChatRoom, Events, Messages


class ChatRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_group_name = f'chat_{self.room_name}'
            print(f'Connecting to room: {self.room_name}')

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            print('Added to group')
            await self.increment_user_count_or_create()
            await self.accept()
            print('WebSocket connection accepted')
        except Exception as e:
            print(f'Error in connect: {e}')
            await self.close()


    async def disconnect(self, close_code):
        print('WebSocket connection disconnected')
        await self.decrement_user_count_or_delete()
        if hasattr(self, 'room_group_name'):
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

        chat_room = await self.get_chat_room(room_name)
        if chat_room:
            await self.create_message(chat_room, user_name, message)
        else:
            print(f'Chat room "{room_name}" does not exist.')
            await self.send(text_data=json.dumps({
                'error': f'Chat room "{room_name}" does not exist.'
            }))
            return

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

    @database_sync_to_async
    def increment_user_count_or_create(self):
        try:
            chatroom = ChatRoom.objects.get(room_name=self.room_name)
            chatroom.user_count += 1
            chatroom.save()
        except ChatRoom.DoesNotExist:
            ChatRoom.objects.create(room_name=self.room_name, user_count=1)
    @database_sync_to_async
    def decrement_user_count_or_delete(self):
        try:
            chatroom = ChatRoom.objects.get(room_name=self.room_name)
            print(f"Room found: {chatroom.room_name}, current user count: {chatroom.user_count}")
            if chatroom.user_count > 1:
                chatroom.user_count -= 1
                chatroom.save()
                print(f"Decremented user count for room: {self.room_name}, new count: {chatroom.user_count}")
            else:
                associated_events = Events.objects.filter(chat_room=self.room_name, is_active=True).exists()
                if associated_events:
                    chatroom.user_count -= 1
                    chatroom.save()
                    print(f'Successfuly left - ChatRoom "{self.room_name}" cannot be deleted as it has associated events.')
                else:
                    chatroom.delete()
                    print(f"Deleted chatroom: {self.room_name}")
        except ChatRoom.DoesNotExist:
            print(f"Chat room {self.room_name} does not exist.")
        except Exception as e:
            print(f"Error deleting or decrementing user count: {e}")

from .views import ChatRoomViewSet


routes = [
    {"regex": r"chatroom", "viewset": ChatRoomViewSet, "basename": "chatroom"},
]

from django.contrib import admin
from django.urls import include, path

import django_js_reverse.views
from chatroom.routes import routes as chatroom_routes
from chatroom.views import (
    CreateEvent,
    MessagesCreateView,
    MessagesListView,
    Top5ActiveChatsCount,
)
from common.routes import routes as common_routes
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework.routers import DefaultRouter
from users.routes import routes as users_routes


router = DefaultRouter()

routes = common_routes + users_routes + chatroom_routes
for route in routes:
    router.register(route["regex"], route["viewset"], basename=route["basename"])

urlpatterns = [
    path("", include("common.urls"), name="common"),
    path("admin/", admin.site.urls, name="admin"),
    path("admin/defender/", include("defender.urls")),
    path("jsreverse/", django_js_reverse.views.urls_js, name="js_reverse"),
    path("api/", include(router.urls), name="api"),

    # chatrooms
    path('api/chatrooms/top5/', Top5ActiveChatsCount.as_view(), name='chatroom-top5'),
    # messages
    path('api/messages/get/', MessagesListView.as_view(), name='messages-list'),  # For GET
    path('api/messages/create/', MessagesCreateView.as_view(), name='messages-create'),  # For POST
    #events
    path('api/events/create/', CreateEvent.as_view(), name='event-create'),


    # drf-spectacular
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]

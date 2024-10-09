from rest_framework import serializers


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField()
    image = serializers.URLField(allow_blank=True)

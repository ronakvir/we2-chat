# Generated by Django 5.1.2 on 2024-10-10 06:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatroom', '0005_messages'),
    ]

    operations = [
        migrations.AlterField(
            model_name='messages',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]

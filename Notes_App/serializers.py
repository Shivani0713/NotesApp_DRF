from .models import *
from rest_framework import serializers
from django.contrib.auth.models import User

class NotesAppSerializers(serializers.ModelSerializer):
    class Meta:
        model = NotesApp
        fields = "__all__"
        read_only_fields = ["user", "create_date"]
        
class RegisterUserSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        
    def create(self, validated_data):
        return User.objects.create_user(
            username = validated_data['username'],
            password= validated_data['password'],
            email= validated_data['email']
        )
        
        
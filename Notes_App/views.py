from .models import *
from .serializers import *
from django.shortcuts import render
from datetime import date
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, permissions,status
from rest_framework_simplejwt.tokens import RefreshToken

@csrf_exempt
def register_page(request):
    return render(request, "reg_login.html")

@csrf_exempt
def index_page(request):
    return render(request, 'index.html')

class NotesAppData(viewsets.ModelViewSet):
    serializer_class = NotesAppSerializers
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        notedata = NotesApp.objects.filter(user = self.request.user).order_by('-id') 
        return notedata
    
    def perform_create(self, serializer):
        serializer.save(user = self.request.user, create_date = date.today())
        

class NewUserData(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializers

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid()
        user =  serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user":{
                "username": user.username,
                "email" : user.email
            },
            "refresh" : str(refresh),
            "access" : str(refresh.access_token)
        }, status = status.HTTP_201_CREATED) 

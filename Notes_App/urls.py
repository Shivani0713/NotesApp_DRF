from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'notes', NotesAppData, basename='task')
router.register(r'register',NewUserData , basename='register')
urlpatterns = router.urls

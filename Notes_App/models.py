from django.db import models
from django.contrib.auth.models import User

class NotesApp(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    create_date = models.DateField()

    def __str__(self):
        return self.title
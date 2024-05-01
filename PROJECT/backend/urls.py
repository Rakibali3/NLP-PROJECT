# urls.py

from django.urls import path
from .app import index

urlpatterns = [
    path('/app', index, name='app'),
]

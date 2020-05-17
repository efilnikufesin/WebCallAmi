from django.urls import path, re_path
from django.conf.urls import include, url
from . import views
from .views import current_user, UserList, session

urlpatterns = [
    path('api/test/', views.LeadListCreate.as_view() ),
    path('api/contacts/', views.ContactListCreate.as_view() ),
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
    path('session/', views.session),
    path('call/', views.call),
]

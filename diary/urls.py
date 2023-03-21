from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),  # 首页
    path('home/', views.home, name='home'),  # 我的主页
    path('add/', views.add, name='add'),  # 写日记

    path('get_diary_date/', views.get_diary_date, name='get_diary_date'),
    path('show_diary_by_date/', views.show_diary_by_date, name='show_diary_by_date'),
]

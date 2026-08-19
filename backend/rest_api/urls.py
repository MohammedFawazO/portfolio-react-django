from django.urls import path
from .views import (
    home, hello, profile, skills, projects,
    education, experience, certificates, socials, contact
)

urlpatterns = [
    path('', home, name='home'),
    path('hello/', hello, name='hello'),
    path('profile/', profile, name='profile'),
    path('skills/', skills, name='skills'),
    path('projects/', projects, name='projects'),
    path('education/', education, name='education'),
    path('experience/', experience, name='experience'),
    path('certificates/', certificates, name='certificates'),
    path('socials/', socials, name='socials'),
    path('contact/', contact, name='contact'),
]

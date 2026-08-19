from django.contrib import admin
from .models import (
    Profile, Skill, Project, Education,
    Experience, Certificate, Social, ContactMessage
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'email', 'location')
    search_fields = ('name', 'title', 'email')


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'category', 'order')
    list_filter = ('category',)
    ordering = ('order',)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'featured', 'order', 'created_at')
    list_filter = ('featured',)
    search_fields = ('title', 'description')
    ordering = ('order', '-created_at')


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('institution', 'degree', 'field', 'start_date', 'end_date')
    search_fields = ('institution', 'degree')
    ordering = ('-start_date',)


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'location', 'start_date', 'end_date')
    search_fields = ('title', 'company')
    ordering = ('-start_date',)


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('name', 'issuer', 'date')
    search_fields = ('name', 'issuer')
    ordering = ('-date',)


@admin.register(Social)
class SocialAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'order')
    ordering = ('order',)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at', 'read')
    list_filter = ('read',)
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('name', 'email', 'message', 'created_at')
    ordering = ('-created_at',)

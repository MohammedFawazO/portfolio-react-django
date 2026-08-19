import logging
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import (
    Profile, Skill, Project, Education,
    Experience, Certificate, Social, ContactMessage
)
from ..serializers import (
    ProfileSerializer, SkillSerializer, ProjectSerializer,
    EducationSerializer, ExperienceSerializer, CertificateSerializer,
    SocialSerializer, ContactMessageSerializer
)

logger = logging.getLogger(__name__)


@api_view(['GET'])
def home(request):
    return Response({"status": "running", "message": "Welcome to the Portfolio API"})


@api_view(['GET'])
def hello(request):
    return Response({"message": "Hello React"})


@api_view(['GET'])
def profile(request):
    try:
        profile = Profile.objects.first()
        if profile:
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        return Response(
            {"success": False, "message": "No profile found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error fetching profile: {str(e)}")
        return Response(
            {"success": False, "message": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def skills(request):
    try:
        skills = Skill.objects.all()
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching skills: {str(e)}")
        return Response(
            {"success": False, "message": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def projects(request):
    try:
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching projects: {str(e)}")
        return Response(
            {"success": False, "message": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def education(request):
    try:
        education = Education.objects.all()
        serializer = EducationSerializer(education, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching education: {str(e)}")
        return Response(
            {"success": False, "message": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def experience(request):
    try:
        experience = Experience.objects.all()
        serializer = ExperienceSerializer(experience, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching experience: {str(e)}")
        return Response(
            {"success": False, "message": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def certificates(request):
    try:
        certificates = Certificate.objects.all()
        serializer = CertificateSerializer(certificates, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching certificates: {str(e)}")
        return Response(
            {"success": False, "message": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def socials(request):
    try:
        socials = Social.objects.all()
        serializer = SocialSerializer(socials, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching socials: {str(e)}")
        return Response(
            {"success": False, "message": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@ratelimit(key='ip', rate='5/m', method='POST', block=True)
def contact(request):
    try:
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"New contact message from {request.data.get('email')}")
            return Response(
                {"success": True, "message": "Message sent successfully!"},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {"success": False, "message": "Validation failed", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Error sending contact message: {str(e)}")
        return Response(
            {"success": False, "message": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

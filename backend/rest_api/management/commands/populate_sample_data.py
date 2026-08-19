from django.core.management.base import BaseCommand
from rest_api.models import (
    Profile, Skill, Project, Education,
    Experience, Certificate, Social
)


class Command(BaseCommand):
    help = 'Populates the database with sample portfolio data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Populating sample data...')

        # Profile
        Profile.objects.get_or_create(
            id=1,
            defaults={
                'name': 'Mohammed Fawaz O',
                'title': 'Python Full Stack Developer',
                'bio': 'Passionate developer with 5+ years of experience building web applications.',
                'email': 'your-email@example.com',
                'phone': '',
                'location': 'Kerala, India',
            }
        )
        self.stdout.write(self.style.SUCCESS('[OK] Profile created'))

        # Skills
        skills_data = [
            # Backend
            {'name': 'Python', 'level': 90, 'category': 'Backend', 'order': 1},
            {'name': 'Django', 'level': 90, 'category': 'Backend', 'order': 2},
            {'name': 'Django REST Framework', 'level': 90, 'category': 'Backend', 'order': 3},
            {'name': 'REST APIs', 'level': 90, 'category': 'Backend', 'order': 4},
            {'name': 'Authentication', 'level': 85, 'category': 'Backend', 'order': 5},
            {'name': 'Database Design', 'level': 80, 'category': 'Backend', 'order': 6},
            # Frontend
            {'name': 'React', 'level': 75, 'category': 'Frontend', 'order': 7},
            {'name': 'JavaScript', 'level': 75, 'category': 'Frontend', 'order': 8},
            {'name': 'HTML', 'level': 90, 'category': 'Frontend', 'order': 9},
            {'name': 'CSS', 'level': 90, 'category': 'Frontend', 'order': 10},
            {'name': 'Tailwind CSS', 'level': 80, 'category': 'Frontend', 'order': 11},
            {'name': 'Bootstrap', 'level': 85, 'category': 'Frontend', 'order': 12},
            # Databases
            {'name': 'PostgreSQL', 'level': 75, 'category': 'Databases', 'order': 13},
            {'name': 'MySQL', 'level': 75, 'category': 'Databases', 'order': 14},
            {'name': 'SQLite', 'level': 90, 'category': 'Databases', 'order': 15},
            {'name': 'Supabase', 'level': 75, 'category': 'Databases', 'order': 16},
            # Tools
            {'name': 'Git', 'level': 90, 'category': 'Tools', 'order': 17},
            {'name': 'GitHub', 'level': 90, 'category': 'Tools', 'order': 18},
            {'name': 'Postman', 'level': 80, 'category': 'Tools', 'order': 19},
            {'name': 'Vite', 'level': 75, 'category': 'Tools', 'order': 20},
            # Deployment
            {'name': 'Render', 'level': 80, 'category': 'Deployment', 'order': 21},
            {'name': 'Railway', 'level': 75, 'category': 'Deployment', 'order': 22},
            {'name': 'Cloudflare', 'level': 80, 'category': 'Deployment', 'order': 23},
            {'name': 'WhiteNoise', 'level': 75, 'category': 'Deployment', 'order': 24},
        ]
        for skill in skills_data:
            Skill.objects.get_or_create(
                name=skill['name'],
                defaults=skill
            )
        self.stdout.write(self.style.SUCCESS('[OK] Skills created'))

        # Projects
        projects_data = [
            {
                'title': 'CarCure',
                'description': 'Production-level roadside assistance and vehicle spare parts platform for UAE users. Built with Django, DRF, Bootstrap, and Supabase. Features vehicle spare parts enquiry, SOS emergency recovery requests, vehicle maintenance booking, user and staff dashboards, authentication, email notifications, file uploads, and Supabase storage integration.',
                'tags': 'Django,DRF,Bootstrap,Supabase,PostgreSQL,Cloudflare',
                'link': '',
                'github': '',
                'featured': True,
                'order': 1,
            },
            {
                'title': 'Sandra International Website',
                'description': 'Business portfolio website for a UAE startup. Clean design, fast performance, and mobile-first responsive layout. Features SEO optimization, contact forms, and image optimization.',
                'tags': 'HTML,CSS,JavaScript,Responsive Design,SEO',
                'link': '',
                'github': '',
                'featured': True,
                'order': 2,
            },
            {
                'title': 'Al Shamil Turning LLC',
                'description': 'Corporate portfolio website for an engineering company in Fujairah, UAE. Professional design with improved UI and responsive layout. Business-focused content structure for an engineering firm.',
                'tags': 'HTML,CSS,JavaScript,Responsive Design,UI/UX',
                'link': '',
                'github': '',
                'featured': True,
                'order': 3,
            },
            {
                'title': 'Dubai Travel AI Assistant',
                'description': 'AI-powered travel assistant for exploring Dubai. Built with Python and Streamlit. Uses AI to help travelers plan their trips with interactive recommendations.',
                'tags': 'Python,Streamlit,AI/ML',
                'link': '',
                'github': '',
                'featured': False,
                'order': 4,
            },
            {
                'title': 'Tour Package Management System',
                'description': 'Django-based tour package management system with CRUD operations, authentication, booking workflow, and database management. Demonstrates core web development concepts.',
                'tags': 'Django,SQLite,Python,HTML,CSS',
                'link': '',
                'github': '',
                'featured': False,
                'order': 5,
            },
            {
                'title': 'Portfolio Website',
                'description': 'This portfolio website built with Django REST Framework and React. Features animated components, REST API integration, and production deployment.',
                'tags': 'Django,DRF,React,Tailwind CSS,Vite',
                'link': '',
                'github': '',
                'featured': False,
                'order': 6,
            },
        ]
        for project in projects_data:
            Project.objects.get_or_create(
                title=project['title'],
                defaults=project
            )
        self.stdout.write(self.style.SUCCESS('[OK] Projects created'))

        # Education
        education_data = [
            {
                'institution': 'University',
                'degree': 'Bachelor of Computer Applications (BCA)',
                'field': 'Computer Science',
                'start_date': '2018-01-01',
                'end_date': '2021-12-31',
                'description': 'Graduated with focus on programming and software development.',
                'order': 1,
            },
        ]
        for edu in education_data:
            Education.objects.get_or_create(
                institution=edu['institution'],
                defaults=edu
            )
        self.stdout.write(self.style.SUCCESS('[OK] Education created'))

        # Experience
        experience_data = [
            {
                'title': 'Full Stack Developer',
                'company': 'UAE Startup',
                'location': 'Remote',
                'start_date': '2023-01-01',
                'description': 'Developed production websites, built REST APIs, handled deployments, and worked directly with international clients. Responsibilities included developing production websites for real clients, building and maintaining REST APIs, deploying applications to production environments, debugging and fixing issues in live applications, performing regular maintenance and updates, gathering client requirements, and implementing continuous improvements based on feedback.',
                'order': 1,
            },
        ]
        for exp in experience_data:
            Experience.objects.get_or_create(
                title=exp['title'],
                company=exp['company'],
                defaults=exp
            )
        self.stdout.write(self.style.SUCCESS('[OK] Experience created'))

        # Certificates
        certificates_data = [
            {
                'name': 'Python Development',
                'issuer': 'Professional Certification',
                'date': '2022-01-01',
                'link': '',
                'order': 1,
            },
            {
                'name': 'Web Development Fundamentals',
                'issuer': 'Professional Certification',
                'date': '2022-06-01',
                'link': '',
                'order': 2,
            },
            {
                'name': 'Database Management',
                'issuer': 'Professional Certification',
                'date': '2023-01-01',
                'link': '',
                'order': 3,
            },
            {
                'name': 'API Development',
                'issuer': 'Professional Certification',
                'date': '2023-06-01',
                'link': '',
                'order': 4,
            },
        ]
        for cert in certificates_data:
            Certificate.objects.get_or_create(
                name=cert['name'],
                defaults=cert
            )
        self.stdout.write(self.style.SUCCESS('[OK] Certificates created'))

        # Social Links
        socials_data = [
            {'name': 'GitHub', 'url': 'https://github.com/mohammedfawaz-o', 'icon': 'github', 'order': 1},
            {'name': 'LinkedIn', 'url': 'https://linkedin.com/in/mohammedfawaz-o', 'icon': 'linkedin', 'order': 2},
        ]
        for social in socials_data:
            Social.objects.get_or_create(
                name=social['name'],
                defaults=social
            )
        self.stdout.write(self.style.SUCCESS('[OK] Social links created'))

        self.stdout.write(self.style.SUCCESS('\n[DONE] Sample data populated successfully!'))
        self.stdout.write(f'Profile: {Profile.objects.count()}')
        self.stdout.write(f'Skills: {Skill.objects.count()}')
        self.stdout.write(f'Projects: {Project.objects.count()}')
        self.stdout.write(f'Education: {Education.objects.count()}')
        self.stdout.write(f'Experience: {Experience.objects.count()}')
        self.stdout.write(f'Certificates: {Certificate.objects.count()}')
        self.stdout.write(f'Socials: {Social.objects.count()}')

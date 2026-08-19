# Portfolio - Developer Guide

A full-stack portfolio website built with Django REST Framework (Backend) and React (Frontend).

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Backend Guide](#backend-guide)
6. [Frontend Guide](#frontend-guide)
7. [API Reference](#api-reference)
8. [Design System](#design-system)
9. [Admin Panel](#admin-panel)
10. [Deployment](#deployment)

---

## Project Overview

This is a professional portfolio website where:
- **Content is managed via Django Admin** (no code changes needed)
- **React frontend fetches data from Django API** (dynamic rendering)
- **Tailwind CSS** for styling with a custom design system

### How It Works

```
┌─────────────┐     GET/POST      ┌─────────────┐     Database     ┌─────────────┐
│             │  ◄──────────────► │             │  ◄────────────► │             │
│  React App  │     /api/*        │  Django API │                 │   SQLite    │
│  (Port 5173)│                   │  (Port 8000)│                 │  (or Postgres)│
│             │                   │             │                 │             │
└─────────────┘                   └─────────────┘                 └─────────────┘
      │                                   │
      │                                   │
      ▼                                   ▼
┌─────────────┐                   ┌─────────────┐
│   Browser   │                   │ Admin Panel │
│             │                   │ /admin/     │
└─────────────┘                   └─────────────┘
```

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Django 6.0.4 | Web framework |
| Django REST Framework | API framework |
| django-cors-headers | Cross-origin requests |
| django-environ | Environment variables |
| django-ratelimit | API rate limiting |
| whitenoise | Static file serving |
| Pillow | Image handling |
| SQLite/PostgreSQL | Database |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19.2.8 | UI library |
| React Router 7.18.2 | Client-side routing |
| Axios 1.19.0 | HTTP client |
| Tailwind CSS 4.3.3 | Utility-first CSS |
| Framer Motion 12.43.0 | Animations |
| React Helmet Async | SEO meta tags |
| React Hot Toast | Notifications |
| Vite 8.2.0 | Build tool |

---

## Project Structure

```
Portfolio/
│
├── backend/                          # Django project
│   ├── .env                          # Environment variables (SECRET_KEY, DEBUG, etc.)
│   ├── manage.py                     # Django management commands
│   ├── requirements.txt              # Python dependencies
│   ├── db.sqlite3                    # SQLite database (auto-created)
│   ├── logs/                         # Application logs
│   │   └── application.log
│   ├── media/                        # User-uploaded files (images)
│   ├── static/                       # Static files (CSS, JS, images)
│   │
│   ├── portfolio_Fawz/               # Django project settings
│   │   ├── settings.py               # Main configuration
│   │   ├── urls.py                   # URL routing
│   │   ├── wsgi.py                   # WSGI entry point
│   │   └── asgi.py                   # ASGI entry point
│   │
│   └── rest_api/                     # Main Django app
│       ├── admin.py                  # Admin panel configuration
│       ├── apps.py                   # App configuration
│       ├── urls.py                   # API URL routes
│       ├── models/
│       │   └── __init__.py           # Database models (8 models)
│       ├── views/
│       │   └── __init__.py           # API view functions
│       ├── serializers/
│       │   └── __init__.py           # Data serialization + validation
│       ├── utils/
│       │   └── __init__.py           # Custom exception handler
│       ├── permissions/              # Custom permissions (empty)
│       ├── services/                 # Business logic (empty)
│       ├── signals/                  # Django signals (empty)
│       └── management/
│           └── commands/
│               └── populate_sample_data.py  # Seed database
│
├── frontend/                         # React project
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Node dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── eslint.config.js              # ESLint rules
│   │
│   └── src/                          # React source code
│       ├── main.jsx                  # App entry point (BrowserRouter, Toaster)
│       ├── App.jsx                   # Routes configuration
│       ├── index.css                 # Global styles + Tailwind
│       │
│       ├── styles/                   # Design system
│       │   ├── variables.css         # Colors, shadows, spacing
│       │   ├── typography.css        # Fonts, sizes, weights
│       │   └── utilities.css         # Utility classes
│       │
│       ├── services/                 # API service layer
│       │   ├── api.js                # Axios instance (base config)
│       │   ├── profileService.js     # Profile API calls
│       │   ├── projectService.js     # Projects API calls
│       │   ├── skillService.js       # Skills API calls
│       │   ├── contactService.js     # Contact form API calls
│       │   └── experienceService.js  # Experience/Education API calls
│       │
│       ├── layouts/                  # Layout components
│       │   └── MainLayout.jsx        # Navbar + Outlet + Footer
│       │
│       ├── pages/                    # Route pages
│       │   ├── Home.jsx              # Homepage (all sections)
│       │   ├── About.jsx             # About page
│       │   ├── Projects.jsx          # Projects page
│       │   ├── Contact.jsx           # Contact page
│       │   ├── Resume.jsx            # Resume page
│       │   └── NotFound.jsx          # 404 page
│       │
│       └── components/               # Reusable components
│           ├── ui/                   # Base UI components
│           │   ├── Button.jsx        # Button (6 variants)
│           │   ├── Card.jsx          # Card container
│           │   ├── Badge.jsx         # Badge/label
│           │   ├── Tag.jsx           # Tag (removable)
│           │   ├── Input.jsx         # Form input
│           │   ├── Textarea.jsx      # Form textarea
│           │   ├── Modal.jsx         # Modal dialog
│           │   ├── Container.jsx     # Page container
│           │   ├── SectionHeading.jsx # Section title
│           │   ├── LoadingSpinner.jsx # Loading indicator
│           │   ├── Skeleton.jsx      # Content skeleton
│           │   ├── Toast.jsx         # Notification helpers
│           │   └── ThemeToggle.jsx   # Dark/light toggle
│           │
│           ├── navigation/           # Navigation components
│           │   └── Navbar.jsx        # Top navigation bar
│           │
│           ├── common/               # Shared components
│           │   ├── Footer.jsx        # Page footer
│           │   └── ContactForm.jsx   # Contact form
│           │
│           ├── cards/                # Card components
│           │   ├── ProjectCard.jsx   # Project display card
│           │   └── ExperienceCard.jsx # Experience display card
│           │
│           ├── sections/             # Homepage sections
│           │   ├── Hero.jsx          # Hero banner
│           │   ├── Skills.jsx        # Skills showcase
│           │   ├── Projects.jsx      # Projects grid
│           │   ├── Timeline.jsx      # Experience timeline
│           │   ├── Certificates.jsx  # Certificates grid
│           │   └── Contact.jsx       # Contact section
│           │
│           ├── animations/           # Animation components (empty)
│           ├── buttons/              # Button variants (empty)
│           └── ui/                   # UI components
│
├── portfolioenv/                     # Python virtual environment
├── docs/                             # Documentation
├── .gitignore                        # Git ignore rules
└── README.md                         # Project readme
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Portfolio
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment (if not exists)
python -m venv ../portfolioenv

# Activate virtual environment
# Windows:
../portfolioenv/Scripts/activate
# Mac/Linux:
source ../portfolioenv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser

# Populate sample data (optional)
python manage.py populate_sample_data

# Start development server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend (new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 4. Access Admin Panel

Open `http://localhost:8000/admin/` and login with your superuser credentials.

---

## Backend Guide

### Models (Database Tables)

#### Profile
Stores your personal information.

| Field | Type | Description |
|-------|------|-------------|
| name | CharField | Your full name |
| title | CharField | Job title (e.g., "Full Stack Developer") |
| bio | TextField | Short biography |
| image | ImageField | Profile photo |
| email | EmailField | Contact email |
| phone | CharField | Phone number |
| location | CharField | City/Country |

#### Skill
Stores your technical skills.

| Field | Type | Description |
|-------|------|-------------|
| name | CharField | Skill name (e.g., "Python") |
| level | IntegerField | Proficiency 0-100 |
| category | CharField | Group (e.g., "Backend", "Frontend") |
| icon | CharField | Icon class name |
| order | IntegerField | Display order |

#### Project
Stores your portfolio projects.

| Field | Type | Description |
|-------|------|-------------|
| title | CharField | Project name |
| description | TextField | Project description |
| image | ImageField | Project screenshot |
| tags | CharField | Comma-separated tags |
| link | URLField | Live demo URL |
| github | URLField | GitHub repository URL |
| featured | BooleanField | Show on homepage |
| order | IntegerField | Display order |

#### Experience
Stores work experience.

| Field | Type | Description |
|-------|------|-------------|
| title | CharField | Job title |
| company | CharField | Company name |
| location | CharField | Work location |
| start_date | DateField | Start date |
| end_date | DateField | End date (null = present) |
| description | TextField | Job description |
| order | IntegerField | Display order |

#### Education
Stores education history.

| Field | Type | Description |
|-------|------|-------------|
| institution | CharField | School/University name |
| degree | CharField | Degree type |
| field | CharField | Field of study |
| start_date | DateField | Start date |
| end_date | DateField | End date |
| description | TextField | Additional info |
| order | IntegerField | Display order |

#### Certificate
Stores certifications.

| Field | Type | Description |
|-------|------|-------------|
| name | CharField | Certificate name |
| issuer | CharField | Issuing organization |
| date | DateField | Date earned |
| link | URLField | Verification URL |
| image | ImageField | Certificate image |
| order | IntegerField | Display order |

#### Social
Stores social media links.

| Field | Type | Description |
|-------|------|-------------|
| name | CharField | Platform name (e.g., "GitHub") |
| url | URLField | Profile URL |
| icon | CharField | Icon class name |
| order | IntegerField | Display order |

#### ContactMessage
Stores contact form submissions.

| Field | Type | Description |
|-------|------|-------------|
| name | CharField | Sender's name |
| email | EmailField | Sender's email |
| message | TextField | Message content |
| created_at | DateTimeField | Auto-set on creation |
| read | BooleanField | Admin read status |

---

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/` | API status check |
| GET | `/api/hello/` | Hello message |
| GET | `/api/profile/` | Get profile data |
| GET | `/api/skills/` | Get all skills |
| GET | `/api/projects/` | Get all projects |
| GET | `/api/education/` | Get education history |
| GET | `/api/experience/` | Get work experience |
| GET | `/api/certificates/` | Get certificates |
| GET | `/api/socials/` | Get social links |
| POST | `/api/contact/` | Send contact message |

### API Response Format

**Success:**
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": {}
}
```

### Rate Limiting

- Contact form: **5 requests per minute** per IP address
- Other endpoints: No rate limit

### Logging

Logs are written to `backend/logs/application.log`:
- API errors
- Contact submissions
- Server errors

---

## Frontend Guide

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Full homepage with all sections |
| About | `/about` | About me page |
| Projects | `/projects` | All projects grid |
| Contact | `/contact` | Contact form page |
| Resume | `/resume` | Resume page |
| NotFound | `*` | 404 error page |

### Components

#### UI Components (src/components/ui/)

**Button**
```jsx
import Button from '../components/ui/Button'

<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>

// Variants: primary, secondary, outline, ghost, danger, success
// Sizes: sm, md, lg, xl
```

**Card**
```jsx
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'

<Card hover>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

**Badge**
```jsx
import Badge from '../components/ui/Badge'

<Badge variant="success">Active</Badge>

// Variants: default, primary, secondary, success, warning, danger
```

**Input**
```jsx
import Input from '../components/ui/Input'

<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  error={errors.email}
/>
```

**Modal**
```jsx
import Modal from '../components/ui/Modal'

<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="My Modal">
  <p>Modal content</p>
</Modal>
```

#### Section Components (src/components/sections/)

These are homepage sections that fetch data from the API:

- **Hero** — Profile name, title, bio, social links
- **Skills** — Skills grouped by category with progress bars
- **Projects** — Project cards grid
- **Timeline** — Experience timeline
- **Certificates** — Certificates grid
- **Contact** — Contact form

#### Card Components (src/components/cards/)

- **ProjectCard** — Displays project with image, title, description, tags
- **ExperienceCard** — Displays experience entry

### Services (API Layer)

Each service handles one resource:

```javascript
import profileService from '../services/profileService'
import projectService from '../services/projectService'
import skillService from '../services/skillService'
import contactService from '../services/contactService'
import experienceService from '../services/experienceService'

// Get profile
const { data } = await profileService.get()

// Get projects
const { data } = await projectService.getAll()

// Get skills
const { data } = await skillService.getAll()

// Send contact message
await contactService.send({ name, email, message })

// Get experience
const { data } = await experienceService.getAll()
```

### Design System

Colors, typography, and utilities are defined in:

- `src/styles/variables.css` — CSS custom properties
- `src/styles/typography.css` — Font definitions
- `src/styles/utilities.css` — Utility classes

---

## Admin Panel

### Access

URL: `http://localhost:8000/admin/`

### Managing Content

1. **Profile** — Add/edit your personal info
2. **Skills** — Add technical skills with levels
3. **Projects** — Add portfolio projects
4. **Experience** — Add work history
5. **Education** — Add education history
6. **Certificates** — Add certifications
7. **Social** — Add social media links
8. **Contact Message** — View submitted messages

### Workflow

```
1. Login to Admin Panel
2. Add/Edit/Delete content
3. Save changes
4. React frontend automatically shows updates
5. No code changes needed!
```

---

## Deployment

### Backend (Production)

1. Set `DEBUG=False` in `.env`
2. Configure PostgreSQL database
3. Set `SECRET_KEY` to a secure random string
4. Configure `ALLOWED_HOSTS`
5. Run: `python manage.py collectstatic`
6. Use Gunicorn: `gunicorn portfolio_Fawz.wsgi:application`

### Frontend (Production)

1. Build: `npm run build`
2. Deploy `dist/` folder to hosting (Vercel, Netlify, etc.)
3. Update API URL in `src/services/api.js`

---

## Common Commands

### Backend

```bash
# Run server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Populate sample data
python manage.py populate_sample_data

# Access Django shell
python manage.py shell
```

### Frontend

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

---

## Troubleshooting

### "No module named 'environ'"
```bash
pip install django-environ
```

### "API connection refused"
- Ensure Django server is running on port 8000
- Check CORS settings in `.env`

### "ModuleNotFoundError: No module named 'rest_api'"
```bash
cd backend
python manage.py migrate
```

### Styling not working
```bash
cd frontend
npm install
npm run dev
```

---

## Support

For issues or questions:
- Check the [README.md](../README.md)
- Review this guide
- Check Django/React documentation

# Portfolio

A full-stack portfolio website built with Django REST Framework and React.

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin/

## Documentation

- [Developer Guide](docs/DEVELOPER_GUIDE.md) — Full project documentation

## Tech Stack

- **Backend:** Django, Django REST Framework, SQLite/PostgreSQL
- **Frontend:** React, Tailwind CSS, Vite
- **Styling:** Custom Design System with Tailwind

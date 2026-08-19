// Static content for the portfolio.
// This replaces the Django REST backend. Edit these values to update the site.
// No server required - everything is bundled at build time.

export const profile = {
  name: 'Mohammed Fawaz O',
  title: 'Python Full Stack Developer',
  bio: 'Passionate developer with 5+ years of experience building web applications.',
  email: 'your-email@example.com',
  phone: '',
  location: 'Kerala, India',
  image: '',
}

export const socials = [
  { id: 1, name: 'GitHub', url: 'https://github.com/mohammedfawaz-o', icon: 'github' },
  { id: 2, name: 'LinkedIn', url: 'https://linkedin.com/in/mohammedfawaz-o', icon: 'linkedin' },
]

export const skills = [
  // Backend
  { id: 1, name: 'Python', level: 90, category: 'Backend', order: 1 },
  { id: 2, name: 'Django', level: 90, category: 'Backend', order: 2 },
  { id: 3, name: 'Django REST Framework', level: 90, category: 'Backend', order: 3 },
  { id: 4, name: 'REST APIs', level: 90, category: 'Backend', order: 4 },
  { id: 5, name: 'Authentication', level: 85, category: 'Backend', order: 5 },
  { id: 6, name: 'Database Design', level: 80, category: 'Backend', order: 6 },
  // Frontend
  { id: 7, name: 'React', level: 75, category: 'Frontend', order: 7 },
  { id: 8, name: 'JavaScript', level: 75, category: 'Frontend', order: 8 },
  { id: 9, name: 'HTML', level: 90, category: 'Frontend', order: 9 },
  { id: 10, name: 'CSS', level: 90, category: 'Frontend', order: 10 },
  { id: 11, name: 'Tailwind CSS', level: 80, category: 'Frontend', order: 11 },
  { id: 12, name: 'Bootstrap', level: 85, category: 'Frontend', order: 12 },
  // Databases
  { id: 13, name: 'PostgreSQL', level: 75, category: 'Databases', order: 13 },
  { id: 14, name: 'MySQL', level: 75, category: 'Databases', order: 14 },
  { id: 15, name: 'SQLite', level: 90, category: 'Databases', order: 15 },
  { id: 16, name: 'Supabase', level: 75, category: 'Databases', order: 16 },
  // Tools
  { id: 17, name: 'Git', level: 90, category: 'Tools', order: 17 },
  { id: 18, name: 'GitHub', level: 90, category: 'Tools', order: 18 },
  { id: 19, name: 'Postman', level: 80, category: 'Tools', order: 19 },
  { id: 20, name: 'Vite', level: 75, category: 'Tools', order: 20 },
  // Deployment
  { id: 21, name: 'Render', level: 80, category: 'Deployment', order: 21 },
  { id: 22, name: 'Railway', level: 75, category: 'Deployment', order: 22 },
  { id: 23, name: 'Cloudflare', level: 80, category: 'Deployment', order: 23 },
  { id: 24, name: 'WhiteNoise', level: 75, category: 'Deployment', order: 24 },
]

export const projects = [
  {
    id: 1,
    title: 'CarCure',
    description:
      'Production-level roadside assistance and vehicle spare parts platform for UAE users. Built with Django, DRF, Bootstrap, and Supabase. Features vehicle spare parts enquiry, SOS emergency recovery requests, vehicle maintenance booking, user and staff dashboards, authentication, email notifications, file uploads, and Supabase storage integration.',
    tags: 'Django,DRF,Bootstrap,Supabase,PostgreSQL,Cloudflare',
    link: '',
    github: '',
    featured: true,
    order: 1,
    image: '',
  },
  {
    id: 2,
    title: 'Sandra International Website',
    description:
      'Business portfolio website for a UAE startup. Clean design, fast performance, and mobile-first responsive layout. Features SEO optimization, contact forms, and image optimization.',
    tags: 'HTML,CSS,JavaScript,Responsive Design,SEO',
    link: '',
    github: '',
    featured: true,
    order: 2,
    image: '',
  },
  {
    id: 3,
    title: 'Al Shamil Turning LLC',
    description:
      'Corporate portfolio website for an engineering company in Fujairah, UAE. Professional design with improved UI and responsive layout. Business-focused content structure for an engineering firm.',
    tags: 'HTML,CSS,JavaScript,Responsive Design,UI/UX',
    link: '',
    github: '',
    featured: true,
    order: 3,
    image: '',
  },
  {
    id: 4,
    title: 'Dubai Travel AI Assistant',
    description:
      'AI-powered travel assistant for exploring Dubai. Built with Python and Streamlit. Uses AI to help travelers plan their trips with interactive recommendations.',
    tags: 'Python,Streamlit,AI/ML',
    link: '',
    github: '',
    featured: false,
    order: 4,
    image: '',
  },
  {
    id: 5,
    title: 'Tour Package Management System',
    description:
      'Django-based tour package management system with CRUD operations, authentication, booking workflow, and database management. Demonstrates core web development concepts.',
    tags: 'Django,SQLite,Python,HTML,CSS',
    link: '',
    github: '',
    featured: false,
    order: 5,
    image: '',
  },
  {
    id: 6,
    title: 'Portfolio Website',
    description:
      'This portfolio website built with Django REST Framework and React. Features animated components, REST API integration, and production deployment.',
    tags: 'Django,DRF,React,Tailwind CSS,Vite',
    link: '',
    github: '',
    featured: false,
    order: 6,
    image: '',
  },
]

export const experience = [
  {
    id: 1,
    title: 'Full Stack Developer',
    company: 'UAE Startup',
    location: 'Remote',
    start_date: '2023-01-01',
    end_date: '',
    description:
      'Developed production websites, built REST APIs, handled deployments, and worked directly with international clients. Responsibilities included developing production websites for real clients, building and maintaining REST APIs, deploying applications to production environments, debugging and fixing issues in live applications, performing regular maintenance and updates, gathering client requirements, and implementing continuous improvements based on feedback.',
    technologies: 'Python,Django,React,PostgreSQL',
  },
]

export const education = [
  {
    id: 1,
    institution: 'University',
    degree: 'Bachelor of Computer Applications (BCA)',
    field: 'Computer Science',
    start_date: '2018-01-01',
    end_date: '2021-12-31',
    description: 'Graduated with focus on programming and software development.',
    order: 1,
  },
]

export const certificates = [
  { id: 1, name: 'Python Development', issuer: 'Professional Certification', date: '2022-01-01', link: '', order: 1 },
  { id: 2, name: 'Web Development Fundamentals', issuer: 'Professional Certification', date: '2022-06-01', link: '', order: 2 },
  { id: 3, name: 'Database Management', issuer: 'Professional Certification', date: '2023-01-01', link: '', order: 3 },
  { id: 4, name: 'API Development', issuer: 'Professional Certification', date: '2023-06-01', link: '', order: 4 },
]

export const content = {
  profile,
  socials,
  skills,
  projects,
  experience,
  education,
  certificates,
}

export default content

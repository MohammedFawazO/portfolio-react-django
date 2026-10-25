// Static content for the portfolio.
// This replaces the Django REST backend. Edit these values to update the site.
// No server required - everything is bundled at build time.

export const profile = {
  name: 'Mohammed Fawaz O',
  title: 'Python Full Stack Developer',
  bio: 'Passionate developer with 5+ years of experience building web applications.',
  email: 'fawz9479@gmail.com',
  phone: '',
  location: 'Fujairah, UAE',
  image: '',
}

export const socials = [
  { id: 1, name: 'GitHub', url: 'https://github.com/MohammedFawazO', icon: 'github' },
  { id: 2, name: 'LinkedIn', url: 'https://www.linkedin.com/in/mohammed-fawaz-o-176695306', icon: 'linkedin' },
  { id: 3, name: 'WhatsApp', url: 'https://wa.me/971541413726', icon: 'whatsapp' },
  // TODO: replace with the real handle - this placeholder 404s on Instagram.
  { id: 4, name: 'Instagram', url: 'https://instagram.com/YOUR_HANDLE', icon: 'instagram' },
]

// Prefilled prompts for the floating WhatsApp panel. `label` is the row shown in
// the panel, `text` is what lands in WhatsApp's composer via ?text=. Editing the
// opening line here keeps it consistent with the number in `socials` above,
// instead of the name being repeated in a component.
// `icon` is a key into WhatsAppButton's PROMPT_ICONS map - the same inline-path
// pattern the projects console uses for its highlights.
// This is the base data section for the WhatsApp CTA: the icon, the number and
// every auto-message are set here, never inside the component.
export const whatsappPrompts = {
  name: 'Fawaz',
  options: [
    {
      // Audience: someone with an idea, website or application to build.
      id: 'project',
      icon: 'bulb',
      label: 'Have a project in mind?',
      text: "Hi {name}, I have a project in mind and would love to discuss it with you.",
    },
    {
      // Audience: recruiters and companies with a full-time opening.
      id: 'fulltime',
      icon: 'suitcase',
      label: 'Hiring a developer?',
      text: "Hi {name}, I'm reaching out about a potential job opportunity that might be a good fit for you.",
    },
    {
      // Audience: clients needing freelance development or short-term help.
      id: 'freelance',
      icon: 'laptop',
      label: 'Need a freelance developer?',
      text: "Hi {name}, I'm looking for a freelance developer and would like to discuss a potential collaboration.",
    },
    {
      // Audience: networking, collaborations, questions, or a cold approach.
      id: 'connect',
      icon: 'clouds',
      label: 'Just want to connect?',
      text: "Hi {name}, I came across your portfolio and wanted to get in touch.",
    },
  ],
}

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
      'An automotive marketplace and service platform for UAE drivers, bringing a genuine spare-parts catalogue, enquiry handling and maintenance scheduling into one place. Django and DRF run the backend, Supabase handles accounts and file storage, and separate dashboards keep customers and staff working from the same records.',
    tags: 'Django,DRF,Bootstrap,Supabase,PostgreSQL,Cloudflare',
    link: 'https://carcure.ae/',
    github: '',
    featured: true,
    order: 1,
    image: '',
  },
  {
    id: 3,
    title: 'Al Shamil Turning LLC',
    description:
      'A corporate portfolio site for an engineering company in Fujairah, restructured so heavy technical work stays easy to follow. Cleaner typography, a service-led content structure and a fully responsive layout across phones and desktop.',
    tags: 'HTML,CSS,JavaScript,Responsive Design,UI/UX',
    link: 'https://alshamilturning.com/',
    github: '',
    featured: true,
    order: 3,
    image: '',
  },
  {
    id: 4,
    title: 'Dubai Travel AI Assistant',
    description:
      'A conversational travel companion for exploring Dubai, built in Python with Streamlit. Visitors describe a budget, a day or a mood and get back a shaped itinerary they can actually follow, then refine it without starting over.',
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
      'A booking platform for tour operators covering packages, availability and customers in one place. Built on Django with SQLite for a zero-friction setup, it carries a reservation from first enquiry through confirmation with a staff admin panel for everyday changes.',
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
      'This portfolio, built with Django REST Framework and React. Framer Motion drives the transitions, a custom scroll-driven hero pins through its sequence, and the whole thing is bundled and deployed as a static build.',
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
  whatsappPrompts,
  skills,
  projects,
  experience,
  education,
  certificates,
}

export default content

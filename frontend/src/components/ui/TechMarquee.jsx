export const technologies = [
  { name: 'Python', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
  { name: 'Django', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg' },
  { name: 'React', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'JavaScript', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  { name: 'HTML5', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original-wordmark.svg' },
  { name: 'CSS3', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original-wordmark.svg' },
  { name: 'Tailwind', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'PostgreSQL', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
  { name: 'SQLite', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg' },
  { name: 'GitHub', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg' },
  { name: 'Supabase', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg' },
  { name: 'Render', svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="#000" d="M18.263.007c-3.121-.147-5.744 2.109-6.192 5.082-.018.138-.045.272-.067.405-.696 3.703-3.936 6.507-7.827 6.507-1.388 0-2.691-.356-3.825-.979a.2024.2024 0 0 0-.302.178V24H12v-8.999c0-1.656 1.338-3 2.987-3h2.988c3.382 0 6.103-2.817 5.97-6.244-.12-3.084-2.61-5.603-5.682-5.75"/></svg> },
  { name: 'Vercel', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg' },
  { name: 'VS Code', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg' },
  { name: 'Railway', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/railway/railway-original.svg' },
  { name: 'Next.js', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' },
]

function TechMarquee() {
  return (
    <div className="relative overflow-hidden py-4">
      <div
        className="flex w-max animate-marquee gap-12 whitespace-nowrap"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
        }}
      >
        {[...technologies, ...technologies].map((tech, index) => (
          <div key={index} className="flex items-center gap-2">
            {tech.svg ? (
              <span className="opacity-60" style={tech.name === 'Render' ? { filter: 'invert(1)' } : undefined}>{tech.svg}</span>
            ) : (
              <img
                src={tech.image}
                alt={tech.name}
                className="h-5 w-auto opacity-60"
                style={(tech.name === 'GitHub' || tech.name === 'Django') ? { filter: 'invert(1)' } : undefined}
              />
            )}
            <span className="text-[#59636E] text-sm font-medium tracking-wide">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TechMarquee

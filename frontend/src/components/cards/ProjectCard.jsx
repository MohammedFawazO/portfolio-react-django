import CandyButton from '../ui/CandyButton'

function ProjectCard({ title, description, image, tags, link }) {
  return (
    <>
      <style>{`
        @property --angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
        @keyframes spin { to { --angle: 360deg; } }

        .spinning-border-card {
          border-radius: 16px;
          border: 4px solid transparent;
          background:
            linear-gradient(#10151A, #10151A) padding-box,
            conic-gradient(from var(--angle), #6FE7FF, #35C9E8, #6FE7FF) border-box;
          transition: all 0.2s ease;
        }
        .spinning-border-card:hover {
          box-shadow: 0 18px 20px rgba(0, 0, 0, 0.2);
          animation: spin 3s linear infinite;
        }
      `}</style>
      <div className="spinning-border-card overflow-hidden">
        {image && (
          <img src={image} alt={title} className="w-full h-48 object-cover" />
        )}
        <div className="p-8">
          <h3 className="text-[18px] font-light text-[#F2F5F7] leading-[1.5] mb-2">{title}</h3>
          <p className="text-[#8D98A4] mb-4 text-[16px] leading-[1.5]">{description}</p>
          {tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[rgba(255,255,255,0.06)] text-[#8D98A4] text-[12px] rounded-[8px] font-[family-name:var(--font-mono)] uppercase tracking-[0.016em]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CandyButton>View Project</CandyButton>
            </a>
          )}
        </div>
      </div>
    </>
  )
}

export default ProjectCard

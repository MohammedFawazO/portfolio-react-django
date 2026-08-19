function ExperienceCard({ year, title, company, description }) {
  return (
    <div className="bg-[#10151A] p-6 rounded-lg border border-[#202830] hover:border-[#35C9E8] transition-colors">
      <span className="text-[#6FE7FF] text-sm font-semibold">{year}</span>
      <h3 className="text-xl font-bold text-[#F2F5F7] mt-2">{title}</h3>
      <p className="text-[#8D98A4] font-medium">{company}</p>
      <p className="text-[#8D98A4] mt-3">{description}</p>
    </div>
  )
}

export default ExperienceCard

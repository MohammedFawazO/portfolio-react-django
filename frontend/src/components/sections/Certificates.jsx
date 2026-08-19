import { useState, useEffect } from 'react'
import experienceService from '../../services/experienceService'
import Container from '../ui/Container'

function Certificates() {
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    experienceService.getCertificates()
      .then(res => setCertificates(res.data))
      .catch(err => console.error(err))
  }, [])

  if (certificates.length === 0) return null

  return (
    <section className="py-20 bg-[#0B0F13]">
      <Container>
        <h2 className="text-3xl font-bold text-[#F2F5F7] text-center mb-12">
          Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="bg-[#10151A] p-6 rounded-lg border border-[#202830] hover:border-[#35C9E8] transition-colors"
            >
              <h3 className="text-xl font-bold text-[#F2F5F7] mb-2">{cert.name}</h3>
              <p className="text-[#8D98A4] mb-2">{cert.issuer}</p>
              <p className="text-[#59636E] text-sm">{cert.date}</p>
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-[#6FE7FF] hover:text-[#35C9E8]"
                >
                  View Certificate
                </a>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Certificates

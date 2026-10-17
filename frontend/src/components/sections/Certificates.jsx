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
    <section className="py-20 bg-white">
      <Container>
        <h2 className="text-3xl font-bold text-black text-center mb-12">
          Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="ct-panel p-6 transition-colors"
            >
              <h3 className="text-xl font-bold text-black mb-2">{cert.name}</h3>
              <p className="text-[#666] mb-2">{cert.issuer}</p>
              <p className="text-[#666] text-sm">{cert.date}</p>
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-[#2d8cf0] hover:text-black"
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

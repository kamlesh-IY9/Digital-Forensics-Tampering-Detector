import { useState } from 'react'
import { ChevronDown, Building2 } from 'lucide-react'

function AboutSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'var(--bg-card-hover)'
          e.currentTarget.style.borderColor = 'var(--accent)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'var(--bg-card)'
          e.currentTarget.style.borderColor = 'var(--border)'
        }}
      >
        About This Project
        <ChevronDown
          size={20}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        />
      </button>

      {/* Content */}
      {isOpen && (
        <div
          className="fade-in"
          style={{
            marginTop: '16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '32px'
          }}
        >
          {/* Title Block */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: 700,
              marginBottom: '8px'
            }}>
              PROJECT TITLE
            </label>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--text-primary)'
            }}>
              Digital Forensics Tampering Detector
            </h2>
          </div>

          {/* Abstract Block */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: 700,
              marginBottom: '8px'
            }}>
              ABSTRACT
            </label>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.8
            }}>
              This project develops a computer vision-based system capable of detecting digital
              tampering in images and documents used as evidence. ML models analyze noise patterns,
              compression artifacts, and pixel inconsistencies to identify manipulated regions.
              Metadata validation helps uncover editing history or suspicious file alterations.
              The system highlights forged or modified sections with detailed forensic markings.
              This solution strengthens digital evidence authentication and enhances reliability
              in legal investigations.
            </p>
          </div>

          {/* Keywords Row */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: 700,
              marginBottom: '8px'
            }}>
              KEYWORDS
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <span className="pill">Technology</span>
              <span className="pill">Data Science & Machine Learning With Data Analytics</span>
            </div>
          </div>

          {/* Two-Column Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px'
          }}>
            {/* LEFT Column */}
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '16px'
              }}>
                Technology & Tools
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <InfoItem
                  label="Technology"
                  value="Data Science & Machine Learning With Data Analytics"
                />
                <InfoItem
                  label="Development Tools"
                  value="Jupyter Notebook / JupyterLab – Experimentation"
                />
                <InfoItem
                  label="Programming Language"
                  value="Python – Primary language for data science & ML"
                />
                <InfoItem
                  label="Web Framework"
                  value="FastAPI (Backend) · React + Vite (Frontend)"
                />
              </div>
            </div>

            {/* RIGHT Column */}
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '16px'
              }}>
                Project Info
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <InfoItem
                  label="Type"
                  value="M.Sc Final Year Project"
                />
                <InfoItem
                  label="Domain"
                  value="Computer Vision & Digital Forensics"
                />
                <InfoItem
                  label="Specialization"
                  value="Data Science & Machine Learning"
                />
                <InfoItem
                  label="Year"
                  value="2026"
                />
              </div>
            </div>
          </div>

          {/* Forensic Techniques */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px'
            }}>
              Forensic Algorithms Used
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <InfoItem label="Algorithm 1" value="Error Level Analysis (ELA) — Compression artifact detection" />
              <InfoItem label="Algorithm 2" value="Noise Pattern Analysis — Sensor noise inconsistency" />
              <InfoItem label="Algorithm 3" value="EXIF Metadata Forensics — Editing software & date anomalies" />
              <InfoItem label="Algorithm 4" value="Forensic Heatmap — Color-coded tampering localization" />
            </div>
          </div>

          {/* Company Badge */}
          <div style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 32px',
              background: 'rgba(255,176,32,0.08)',
              border: '2px solid var(--amber)',
              borderRadius: '8px'
            }}>
              <Building2 size={24} color="var(--amber)" />
              <strong style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--amber)',
                letterSpacing: '0.5px'
              }}>
                Brainybeam Info-Tech PVT LTD
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Sub-component
function InfoItem({ label, value }) {
  return (
    <div style={{
      padding: '12px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '6px'
    }}>
      <div style={{
        fontSize: '10px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '4px',
        fontWeight: 700
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '12px',
        color: 'var(--text-primary)',
        lineHeight: 1.5
      }}>
        {value}
      </div>
    </div>
  )
}

export default AboutSection

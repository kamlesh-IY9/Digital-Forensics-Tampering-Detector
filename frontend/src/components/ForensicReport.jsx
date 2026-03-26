import { useState } from 'react'
import { ChevronDown, ChevronRight, Cpu, AlertTriangle, Database, FileText, CheckCircle, Info } from 'lucide-react'

function ForensicReport({ result }) {
  const [openSections, setOpenSections] = useState({
    scores: true,
    indicators: true,
    metadata: false,
    fileInfo: false
  })

  function toggleSection(section) {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const scoreColors = {
    getColor: (value) => {
      if (value < 25) return 'var(--green)'
      if (value < 55) return 'var(--amber)'
      return 'var(--red)'
    }
  }

  const verdictColors = {
    'AUTHENTIC': 'var(--green)',
    'SUSPICIOUS': 'var(--amber)',
    'TAMPERED': 'var(--red)'
  }

  const verdictColor = verdictColors[result.verdict] || 'var(--accent)'

  return (
    <div style={{ padding: '32px 24px' }}>
      {/* Verdict Hero (Always Visible) */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '12px',
          fontWeight: 700
        }}>
          FORENSIC VERDICT
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '36px',
          fontWeight: 800,
          letterSpacing: '4px',
          color: verdictColor,
          textShadow: `0 0 20px ${verdictColor}40`,
          marginBottom: '12px'
        }}>
          {result.verdict}
        </h1>

        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          marginBottom: '24px',
          lineHeight: 1.6
        }}>
          {result.verdict_desc}
        </p>

        <div style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '16px 32px',
          background: 'var(--bg-card)',
          border: `2px solid ${verdictColor}`,
          borderRadius: '8px'
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            fontWeight: 800,
            color: scoreColors.getColor(result.tampering_probability)
          }}>
            {result.tampering_probability.toFixed(1)}%
          </span>
          <span style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 700
          }}>
            TAMPERING PROBABILITY
          </span>
        </div>
      </div>

      {/* Section 1: Analysis Scores */}
      <AccordionSection
        title="Analysis Scores"
        icon={<Cpu size={18} />}
        isOpen={openSections.scores}
        onToggle={() => toggleSection('scores')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ScoreMeter
            label="ELA Score"
            value={result.ela_score}
            color={scoreColors.getColor(result.ela_score)}
          />
          {result.noise_analysis.available && (
            <ScoreMeter
              label="Noise Inconsistency"
              value={result.noise_analysis.inconsistency_score}
              color={scoreColors.getColor(result.noise_analysis.inconsistency_score)}
            />
          )}
          <ScoreMeter
            label="Overall Probability"
            value={result.tampering_probability}
            color={scoreColors.getColor(result.tampering_probability)}
          />
        </div>
      </AccordionSection>

      {/* Section 2: Forensic Indicators */}
      <AccordionSection
        title={`Forensic Indicators (${result.indicators.length})`}
        icon={<AlertTriangle size={18} />}
        isOpen={openSections.indicators}
        onToggle={() => toggleSection('indicators')}
      >
        {result.indicators.length === 0 ? (
          <div style={{
            padding: '16px',
            background: 'rgba(0,230,118,0.08)',
            border: '1px solid var(--green-dim)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <CheckCircle size={20} color="var(--green)" />
            <span style={{ fontSize: '13px', color: 'var(--green)' }}>
              No suspicious indicators detected
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result.indicators.map((indicator, idx) => (
              <IndicatorCard key={idx} indicator={indicator} />
            ))}
          </div>
        )}
      </AccordionSection>

      {/* Section 3: Image Metadata */}
      <AccordionSection
        title="Image Metadata"
        icon={<Database size={18} />}
        isOpen={openSections.metadata}
        onToggle={() => toggleSection('metadata')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <StatBox label="Format" value={result.metadata.format} />
            <StatBox label="Dimensions" value={result.metadata.size_display} />
            <StatBox label="Color Mode" value={result.metadata.mode} />
            <StatBox label="EXIF Fields" value={result.metadata.exif_count} />
          </div>

          {result.metadata.editing_software.length > 0 && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255,59,59,0.08)',
              border: '1px solid var(--red-dim)',
              borderRadius: '8px'
            }}>
              <strong style={{ fontSize: '12px', color: 'var(--red)', display: 'block', marginBottom: '6px' }}>
                EDITING SOFTWARE DETECTED
              </strong>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {result.metadata.editing_software.join(', ')}
              </p>
            </div>
          )}

          {result.metadata.exif_count > 0 && (
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '11px'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {Object.entries(result.metadata.exif).slice(0, 30).map(([key, value]) => (
                    <tr key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{
                        padding: '8px 12px',
                        color: 'var(--text-muted)',
                        fontWeight: 700,
                        width: '40%'
                      }}>
                        {key}
                      </td>
                      <td style={{
                        padding: '8px 12px',
                        color: 'var(--text-secondary)',
                        wordBreak: 'break-word'
                      }}>
                        {String(value).substring(0, 100)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* Section 4: File Information */}
      <AccordionSection
        title="File Information"
        icon={<FileText size={18} />}
        isOpen={openSections.fileInfo}
        onToggle={() => toggleSection('fileInfo')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <InfoRow label="Filename" value={result.file_info.filename} />
          <InfoRow label="File Size" value={`${result.file_info.size_kb} KB`} />
          <InfoRow label="MIME Type" value={result.file_info.content_type} />
          <InfoRow label="Processing Time" value={`${result.processing_time_s} seconds`} />
        </div>
      </AccordionSection>
    </div>
  )
}

// Sub-components

function AccordionSection({ title, icon, isOpen, onToggle, children }) {
  return (
    <div style={{
      marginBottom: '16px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: 'var(--accent)' }}>{icon}</div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown size={18} color="var(--text-muted)" />
        ) : (
          <ChevronRight size={18} color="var(--text-muted)" />
        )}
      </button>
      {isOpen && (
        <div style={{ padding: '0 16px 16px 16px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

function ScoreMeter({ label, value, color }) {
  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </span>
        <strong style={{ fontSize: '14px', color: color, fontWeight: 700 }}>
          {value.toFixed(1)}%
        </strong>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(100, value)}%`,
            background: color
          }}
        ></div>
      </div>
    </div>
  )
}

function IndicatorCard({ indicator }) {
  const severityStyles = {
    high: { bg: 'rgba(255,59,59,0.08)', border: 'var(--red-dim)', color: 'var(--red)', icon: AlertTriangle },
    medium: { bg: 'rgba(255,176,32,0.08)', border: 'var(--amber-dim)', color: 'var(--amber)', icon: AlertTriangle },
    low: { bg: 'rgba(0,200,255,0.08)', border: 'var(--accent-dim)', color: 'var(--accent)', icon: Info }
  }

  const style = severityStyles[indicator.severity] || severityStyles.low
  const Icon = style.icon

  return (
    <div style={{
      padding: '12px 16px',
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: '8px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px'
      }}>
        <Icon size={16} color={style.color} />
        <span style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: 700,
          flex: 1
        }}>
          {indicator.type.replace(/_/g, ' ')}
        </span>
        <span style={{
          fontSize: '9px',
          padding: '3px 8px',
          background: style.color,
          color: 'var(--bg-primary)',
          borderRadius: '4px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {indicator.severity}
        </span>
      </div>
      <p style={{
        fontSize: '12px',
        color: 'var(--text-secondary)',
        lineHeight: 1.5
      }}>
        {indicator.message}
      </p>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div style={{
      padding: '12px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '6px'
    }}>
      <div style={{
        fontSize: '10px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '4px'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '13px',
        color: 'var(--text-primary)',
        fontWeight: 700
      }}>
        {value}
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '6px'
    }}>
      <span style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '12px',
        color: 'var(--text-primary)',
        fontWeight: 700,
        textAlign: 'right',
        wordBreak: 'break-all',
        maxWidth: '60%'
      }}>
        {value}
      </span>
    </div>
  )
}

export default ForensicReport

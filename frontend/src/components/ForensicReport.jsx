import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Cpu,
  AlertTriangle,
  Database,
  FileText,
  CheckCircle,
  Info,
} from 'lucide-react'

function ForensicReport({ result }) {
  const [openSections, setOpenSections] = useState({
    scores: true,
    breakdown: true,
    indicators: true,
    metadata: false,
    fileInfo: false,
  })

  function toggleSection(section) {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const scoreColors = {
    getColor: (value) => {
      if (value < 25) return 'var(--green)'
      if (value < 55) return 'var(--amber)'
      return 'var(--red)'
    },
  }

  const verdictColors = {
    AUTHENTIC: 'var(--green)',
    SUSPICIOUS: 'var(--amber)',
    TAMPERED: 'var(--red)',
  }

  const confidenceColors = {
    HIGH: 'var(--green)',
    MEDIUM: 'var(--amber)',
    LOW: 'var(--accent)',
  }

  const verdictColor = verdictColors[result.verdict] || 'var(--accent)'
  const confidenceColor = confidenceColors[result.confidence_level] || 'var(--accent)'
  const evidenceTypes = result.signal_summary?.evidence_types || []

  return (
    <div style={{ padding: '32px 24px' }}>
      <div className="report-hero-card" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '12px',
            fontWeight: 700,
          }}
        >
          FORENSIC VERDICT
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '36px',
            fontWeight: 800,
            letterSpacing: '4px',
            color: verdictColor,
            textShadow: `0 0 20px ${verdictColor}40`,
            marginBottom: '12px',
          }}
        >
          {result.verdict}
        </h1>

        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '20px',
            lineHeight: 1.7,
          }}
        >
          {result.verdict_desc}
        </p>

        <div className="assessment-grid">
          <MetricCard
            label="Tampering Probability"
            value={`${result.tampering_probability.toFixed(1)}%`}
            accent={scoreColors.getColor(result.tampering_probability)}
          />
          <MetricCard
            label="Confidence"
            value={`${result.confidence_level} · ${result.confidence_score.toFixed(1)}%`}
            accent={confidenceColor}
          />
          <MetricCard
            label="Processing Time"
            value={`${result.processing_time_s}s`}
            accent="var(--accent)"
          />
        </div>

        <div
          style={{
            marginTop: '18px',
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.02)',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1.3px',
              marginBottom: '6px',
              fontWeight: 700,
            }}
          >
            Assessment Summary
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            {result.analysis_summary}
          </p>
        </div>

        <div className="signal-pill-row">
          {evidenceTypes.length === 0 ? (
            <span className="signal-pill">No major evidence signals</span>
          ) : (
            evidenceTypes.map((signal) => (
              <span key={signal} className="signal-pill">
                {signal.replace(/_/g, ' ')}
              </span>
            ))
          )}
          {result.signal_summary?.corroborated && (
            <span className="signal-pill corroborated">Corroborated signals</span>
          )}
        </div>
      </div>

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

      <AccordionSection
        title={`Score Breakdown (${result.score_breakdown.length})`}
        icon={<Info size={18} />}
        isOpen={openSections.breakdown}
        onToggle={() => toggleSection('breakdown')}
      >
        {result.score_breakdown.length === 0 ? (
          <EmptyState message="No major risk factors contributed to this assessment." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.score_breakdown.map((item) => (
              <BreakdownRow key={item.label} item={item} />
            ))}
          </div>
        )}
      </AccordionSection>

      <AccordionSection
        title={`Forensic Indicators (${result.indicators.length})`}
        icon={<AlertTriangle size={18} />}
        isOpen={openSections.indicators}
        onToggle={() => toggleSection('indicators')}
      >
        {result.indicators.length === 0 ? (
          <EmptyState
            icon={<CheckCircle size={20} color="var(--green)" />}
            message="No suspicious indicators detected"
            tone="success"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result.indicators.map((indicator, idx) => (
              <IndicatorCard key={idx} indicator={indicator} />
            ))}
          </div>
        )}
      </AccordionSection>

      <AccordionSection
        title="Image Metadata"
        icon={<Database size={18} />}
        isOpen={openSections.metadata}
        onToggle={() => toggleSection('metadata')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="metadata-grid">
            <StatBox label="Format" value={result.metadata.format} />
            <StatBox label="Dimensions" value={result.metadata.size_display} />
            <StatBox label="Color Mode" value={result.metadata.mode} />
            <StatBox label="EXIF Fields" value={result.metadata.exif_count} />
          </div>

          {result.metadata.editing_software.length > 0 && (
            <div className="meta-alert-card">
              <strong style={{ fontSize: '12px', color: 'var(--red)', display: 'block', marginBottom: '6px' }}>
                EDITING SOFTWARE DETECTED
              </strong>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {result.metadata.editing_software.join(', ')}
              </p>
            </div>
          )}

          {result.metadata.exif_count > 0 && (
            <div className="metadata-table-shell">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {Object.entries(result.metadata.exif).slice(0, 30).map(([key, value]) => (
                    <tr key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td
                        style={{
                          padding: '8px 12px',
                          color: 'var(--text-muted)',
                          fontWeight: 700,
                          width: '40%',
                        }}
                      >
                        {key}
                      </td>
                      <td
                        style={{
                          padding: '8px 12px',
                          color: 'var(--text-secondary)',
                          wordBreak: 'break-word',
                        }}
                      >
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

function AccordionSection({ title, icon, isOpen, onToggle, children }) {
  return (
    <div className="report-section-card" style={{ marginBottom: '16px' }}>
      <button className="accordion-trigger" onClick={onToggle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: 'var(--accent)' }}>{icon}</div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown size={18} color="var(--text-muted)" />
        ) : (
          <ChevronRight size={18} color="var(--text-muted)" />
        )}
      </button>
      {isOpen && <div style={{ padding: '0 16px 16px 16px' }}>{children}</div>}
    </div>
  )
}

function MetricCard({ label, value, accent }) {
  return (
    <div className="metric-card">
      <span className="metric-card-label">{label}</span>
      <strong style={{ color: accent, fontSize: '22px', letterSpacing: '0.5px' }}>{value}</strong>
    </div>
  )
}

function ScoreMeter({ label, value, color }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {label}
        </span>
        <strong style={{ fontSize: '14px', color: color, fontWeight: 700 }}>{value.toFixed(1)}%</strong>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${Math.min(100, value)}%`, background: color }}></div>
      </div>
    </div>
  )
}

function BreakdownRow({ item }) {
  return (
    <div className="breakdown-row">
      <div>
        <div className="breakdown-label">{item.label}</div>
      </div>
      <strong className="breakdown-points">+{item.points.toFixed(1)}</strong>
    </div>
  )
}

function IndicatorCard({ indicator }) {
  const severityStyles = {
    high: { bg: 'rgba(255,59,59,0.08)', border: 'var(--red-dim)', color: 'var(--red)', icon: AlertTriangle },
    medium: { bg: 'rgba(255,176,32,0.08)', border: 'var(--amber-dim)', color: 'var(--amber)', icon: AlertTriangle },
    low: { bg: 'rgba(0,200,255,0.08)', border: 'var(--accent-dim)', color: 'var(--accent)', icon: Info },
  }

  const style = severityStyles[indicator.severity] || severityStyles.low
  const Icon = style.icon

  return (
    <div
      style={{
        padding: '12px 16px',
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
        }}
      >
        <Icon size={16} color={style.color} />
        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: 700,
            flex: 1,
          }}
        >
          {indicator.type.replace(/_/g, ' ')}
        </span>
        <span
          style={{
            fontSize: '9px',
            padding: '3px 8px',
            background: style.color,
            color: 'var(--bg-primary)',
            borderRadius: '999px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {indicator.severity}
        </span>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {indicator.message}
      </p>
    </div>
  )
}

function EmptyState({ icon, message, tone = 'neutral' }) {
  const toneStyles = tone === 'success'
    ? {
        background: 'rgba(0,230,118,0.08)',
        border: '1px solid var(--green-dim)',
        color: 'var(--green)',
      }
    : {
        background: 'rgba(0,200,255,0.08)',
        border: '1px solid var(--accent-dim)',
        color: 'var(--accent)',
      }

  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        ...toneStyles,
      }}
    >
      {icon || <Info size={20} color="currentColor" />}
      <span style={{ fontSize: '13px', color: toneStyles.color }}>{message}</span>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="report-info-card">
      <div className="report-info-label">{label}</div>
      <div className="report-info-value">{value}</div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="report-info-row">
      <span className="report-info-label">{label}</span>
      <span className="report-row-value">{value}</span>
    </div>
  )
}

export default ForensicReport

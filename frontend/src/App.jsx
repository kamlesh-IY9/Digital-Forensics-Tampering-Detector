import { useEffect, useState } from 'react'
import { Shield, RefreshCw, AlertTriangle } from 'lucide-react'
import UploadZone from './components/UploadZone'
import ComparisonView from './components/ComparisonView'
import ForensicReport from './components/ForensicReport'
import AboutSection from './components/AboutSection'

function App() {
  const [state, setState] = useState('idle') // idle | loading | results | error
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const isBusy = state === 'loading'
  const resultViewKey = result ? `${result.file_info?.filename || 'result'}-${result.processing_time_s}` : 'empty'

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [state])

  async function handleAnalyze(file) {
    setState('loading')
    setErrorMsg('')
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || 'Analysis failed')
      }

      const data = await res.json()
      setResult(data)
      setState('results')
    } catch (err) {
      setErrorMsg(err.message)
      setState('error')
    }
  }

  function handleNewAnalysis() {
    setState('idle')
    setResult(null)
    setErrorMsg('')
  }

  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="app-backdrop" aria-hidden="true"></div>
      {/* Header */}
      <header className="app-header" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(10px)'
      }}>
        <div
          className="app-brand"
          onClick={() => window.location.reload()}
          style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          title="Refresh Application"
        >
          <div style={{
            width: '48px',
            height: '48px',
            background: 'rgba(0,200,255,0.1)',
            border: '2px solid var(--accent)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={28} color="var(--accent)" />
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}>
              <span style={{ color: 'var(--accent)' }}>DFT</span>
              <span style={{ color: 'var(--text-primary)' }}> Detector</span>
            </h1>
            <p style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginTop: '4px'
            }}>
              Evidence Screening Interface
            </p>
          </div>
        </div>

        <div className="app-header-meta" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="header-status-chip" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="status-dot green"></div>
            <span style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {isBusy ? 'ANALYZING' : 'API LIVE'}
            </span>
          </div>
          <div className="header-meta-copy" style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>
            v1.0 · M.Sc Forensics Project<br />
            Brainybeam Info-Tech
          </div>
          {state === 'results' && (
            <button
              onClick={handleNewAnalysis}
              className="primary-action-button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: 'var(--accent)',
                color: 'var(--bg-primary)',
                fontWeight: 700,
                fontSize: '13px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.2s ease'
              }}
            >
              <RefreshCw size={16} />
              New Analysis
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {state === 'idle' && (
          <div className="app-page-section" style={{ flex: 1, padding: '60px 32px' }}>
            <UploadZone onFileSelect={handleAnalyze} isLoading={false} />
            <div style={{ marginTop: '48px' }}>
              <AboutSection />
            </div>
          </div>
        )}

        {state === 'loading' && (
          <div className="app-page-section" style={{ flex: 1, padding: '60px 32px' }}>
            <UploadZone onFileSelect={handleAnalyze} isLoading={true} />
            <div style={{
              marginTop: '32px',
              textAlign: 'center',
              color: 'var(--accent)',
              fontSize: '14px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontWeight: 700
            }}>
              <span style={{ animation: 'blink 1s linear infinite' }}>█</span> Running forensic algorithms...
            </div>
          </div>
        )}

        {state === 'results' && (
          <div className="results-layout" style={{ flex: 1 }} key={resultViewKey}>
            <div className="results-canvas-panel" style={{ overflow: 'hidden' }}>
              <ComparisonView images={result.images} verdict={result.verdict} />
            </div>
            <div className="results-report-panel">
              <ForensicReport result={result} />
            </div>
          </div>
        )}

        {state === 'error' && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px'
          }}>
            <div style={{
              maxWidth: '500px',
              background: 'var(--bg-card)',
              border: '2px solid var(--red-dim)',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <AlertTriangle size={48} color="var(--red)" style={{ marginBottom: '16px' }} />
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                color: 'var(--red)',
                marginBottom: '12px'
              }}>
                Analysis Failed
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                {errorMsg}
              </p>
              <button
                onClick={handleNewAnalysis}
                className="primary-action-button"
                style={{
                  padding: '12px 24px',
                  background: 'var(--accent)',
                  color: 'var(--bg-primary)',
                  fontWeight: 700,
                  fontSize: '14px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer (only visible in idle/error states) */}
      {(state === 'idle' || state === 'error') && (
        <footer style={{
          padding: '24px 32px',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--text-muted)',
          lineHeight: 1.8
        }}>
          Digital Forensics Tampering Detector · M.Sc Final Year Project · Brainybeam Info-Tech PVT LTD
          <br />
          Techniques: ELA · Noise Analysis · EXIF Metadata Forensics
        </footer>
      )}
    </div>
  )
}

export default App

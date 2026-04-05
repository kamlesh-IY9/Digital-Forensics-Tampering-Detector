import { useRef, useState } from 'react'
import { Upload, AlertCircle } from 'lucide-react'
import DemoSamples from './DemoSamples'

function UploadZone({ onFileSelect, isLoading }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  function validateFile(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/bmp', 'image/tiff', 'image/webp']
    if (!allowed.includes(file.type)) {
      return 'Invalid file type. Please upload a JPEG, PNG, BMP, TIFF, or WebP image.'
    }
    if (file.size > 20 * 1024 * 1024) {
      return 'File too large. Maximum size is 20 MB.'
    }
    return null
  }

  function handleFileSelect(file) {
    if (!file) return

    setError('')
    const validationError = validateFile(file)
    
    // Reset the input after a file is processed
    if (inputRef.current) inputRef.current.value = ''
    
    if (validationError) {
      setError(validationError)
      return
    }

    onFileSelect(file)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  function handleClick() {
    if (!isLoading && inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>
      {/* Hero Section */}
      <div className="hero-block" style={{ marginBottom: '48px' }}>
        <div className="badge online" style={{ marginBottom: '16px' }}>
          <div className="status-dot cyan"></div>
          System Online
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '48px',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '16px',
          background: 'linear-gradient(to bottom, var(--text-primary), var(--accent))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Digital Forensics<br />Tampering Detector
        </h1>

        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.8,
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          Upload an image to analyze for digital tampering using advanced computer vision
          and machine learning algorithms. Detects manipulation, splicing, and forgery.
        </p>

        <div className="hero-stats">
          <div className="hero-stat-card">
            <span className="hero-stat-value">4</span>
            <span className="hero-stat-label">Forensic Signals</span>
          </div>
          <div className="hero-stat-card">
            <span className="hero-stat-value">1-Click</span>
            <span className="hero-stat-label">Demo Experience</span>
          </div>
          <div className="hero-stat-card">
            <span className="hero-stat-value">Live</span>
            <span className="hero-stat-label">Heatmap + Metadata</span>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className="upload-zone-shell"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border-bright)'}`,
          borderRadius: '12px',
          padding: '64px 40px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          background: isDragging ? 'rgba(0,200,255,0.05)' : 'transparent',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Corner Brackets */}
        <span style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          width: '20px',
          height: '20px',
          borderTop: '3px solid var(--accent)',
          borderLeft: '3px solid var(--accent)'
        }}></span>
        <span style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          width: '20px',
          height: '20px',
          borderTop: '3px solid var(--accent)',
          borderRight: '3px solid var(--accent)'
        }}></span>
        <span style={{
          position: 'absolute',
          bottom: '-2px',
          left: '-2px',
          width: '20px',
          height: '20px',
          borderBottom: '3px solid var(--accent)',
          borderLeft: '3px solid var(--accent)'
        }}></span>
        <span style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          width: '20px',
          height: '20px',
          borderBottom: '3px solid var(--accent)',
          borderRight: '3px solid var(--accent)'
        }}></span>

        {/* Content */}
        {!isLoading ? (
          <>
            <div style={{
              width: '72px',
              height: '72px',
              margin: '0 auto 20px',
              background: 'rgba(0,200,255,0.1)',
              border: '2px solid var(--accent)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Upload size={28} color="var(--accent)" />
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Drop image here or click to browse
            </h3>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-muted)'
            }}>
              Supports JPEG · PNG · BMP · TIFF · WebP | Max 20 MB
            </p>
            <p style={{
              marginTop: '14px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.4px'
            }}>
              Drag evidence into the scan field or browse locally. Prefer the guided demo below if you want to understand the workflow first.
            </p>
          </>
        ) : (
          <>
            <div
              className="spinner"
              style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 20px'
              }}
            ></div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--accent)',
              marginBottom: '8px',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              ANALYZING IMAGE...
            </h3>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-muted)'
            }}>
              Running forensic algorithms
            </p>
            <div className="analysis-steps">
              <span>ELA</span>
              <span>Noise</span>
              <span>Metadata</span>
              <span>Heatmap</span>
            </div>
          </>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files[0])}
      />

      {/* Error Display */}
      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(255,59,59,0.1)',
          border: '1px solid var(--red-dim)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'left'
        }}>
          <AlertCircle size={20} color="var(--red)" />
          <span style={{ fontSize: '13px', color: 'var(--red)' }}>{error}</span>
        </div>
      )}

      {/* Technique Pills */}
      {!isLoading && (
        <div style={{
          marginTop: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center'
        }}>
          <span className="pill">Error Level Analysis</span>
          <span className="pill">Noise Pattern Analysis</span>
          <span className="pill">EXIF Metadata Inspection</span>
          <span className="pill">Compression Artifact Detection</span>
        </div>
      )}

      {!isLoading && <DemoSamples isLoading={isLoading} onTryDemo={handleFileSelect} />}
    </div>
  )
}

export default UploadZone

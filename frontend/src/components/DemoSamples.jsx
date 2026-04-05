import { useState } from 'react'
import authenticDemoImage from '../assets/demo/authentic-evidence.jpg'
import tamperedDemoImage from '../assets/demo/tampered-evidence.jpg'

const demoSamples = [
  {
    id: 'authentic-evidence',
    label: 'Authentic Sample',
    filename: 'authentic-evidence.jpg',
    imageUrl: authenticDemoImage,
    badgeClass: 'badge online',
    caption: 'A clean sample that the detector currently reads as authentic, useful for understanding the normal baseline view.',
    outcome: 'Best for seeing an authentic verdict, low-risk signals, and a quieter heatmap.',
  },
  {
    id: 'tampered-evidence',
    label: 'Tampered Sample',
    filename: 'tampered-evidence.jpg',
    imageUrl: tamperedDemoImage,
    badgeClass: 'badge red',
    caption: 'A manipulated sample that the detector flags as tampered, so users can compare how the forensic report changes.',
    outcome: 'Best for seeing a tampered verdict, stronger indicators, and a more active risk profile.',
  },
]

function DemoSamples({ isLoading, onTryDemo }) {
  const [demoError, setDemoError] = useState('')

  async function handleTryDemo(sample) {
    if (isLoading) {
      return
    }

    setDemoError('')

    try {
      const response = await fetch(sample.imageUrl)
      if (!response.ok) {
        throw new Error(`Unable to load demo image: ${sample.filename}`)
      }

      const blob = await response.blob()
      const file = new File([blob], sample.filename, { type: blob.type || 'image/jpeg' })
      onTryDemo(file)
    } catch (error) {
      setDemoError(error.message || 'Unable to load demo image.')
    }
  }

  return (
    <section
      className="fade-in"
      style={{
        marginTop: '40px',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '18px',
        }}
      >
        <div>
          <div className="badge amber" style={{ marginBottom: '12px' }}>
            Guided Demo
          </div>
          <h2
            style={{
              fontSize: '24px',
              marginBottom: '8px',
              color: 'var(--text-primary)',
            }}
          >
            See how the detector behaves before uploading your own evidence
          </h2>
          <p
            style={{
              maxWidth: '640px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              lineHeight: 1.8,
            }}
          >
            Each card uses a real bundled sample. Click a button and the app runs the exact same
            forensic pipeline used for uploaded images, so first-time visitors can understand the
            workflow in a few seconds.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gap: '6px',
            minWidth: '220px',
          }}
        >
          <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            How it works
          </span>
          <span style={{ color: 'var(--text-primary)', fontSize: '12px' }}>1. Pick a sample</span>
          <span style={{ color: 'var(--text-primary)', fontSize: '12px' }}>2. Watch live analysis</span>
          <span style={{ color: 'var(--text-primary)', fontSize: '12px' }}>3. Review verdict and heatmap</span>
        </div>
      </div>

      <div className="demo-grid">
        {demoSamples.map((sample) => (
          <article key={sample.id} className="demo-card">
            <div className="demo-image-frame">
              <img
                src={sample.imageUrl}
                alt={sample.label}
                className="demo-image"
              />
              <div className="demo-image-overlay" />
            </div>

            <div className="demo-card-body">
              <div className={sample.badgeClass} style={{ marginBottom: '14px' }}>
                {sample.label}
              </div>

              <h3
                style={{
                  fontSize: '18px',
                  marginBottom: '10px',
                  color: 'var(--text-primary)',
                }}
              >
                {sample.filename}
              </h3>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  lineHeight: 1.75,
                  marginBottom: '16px',
                }}
              >
                {sample.caption}
              </p>

              <div
                style={{
                  padding: '10px 12px',
                  marginBottom: '18px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.02)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
              >
                {sample.outcome}
              </div>

              <button
                type="button"
                onClick={() => handleTryDemo(sample)}
                disabled={isLoading}
                className="demo-button"
              >
                {isLoading ? 'Preparing Analysis...' : `Try ${sample.label}`}
              </button>
            </div>
          </article>
        ))}
      </div>

      {demoError && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid var(--red-dim)',
            background: 'rgba(255, 59, 59, 0.08)',
            color: 'var(--red)',
            fontSize: '12px',
          }}
        >
          {demoError}
        </div>
      )}
    </section>
  )
}

export default DemoSamples

import { useState } from 'react'
import { ZoomIn, ZoomOut, Layers } from 'lucide-react'

function ComparisonView({ images, verdict }) {
  const [activeView, setActiveView] = useState('original')
  const [zoom, setZoom] = useState(1)
  const [overlayOpacity, setOverlayOpacity] = useState(0.7)
  const viewDescriptions = {
    original: 'Reference view for the uploaded evidence image.',
    ela: 'Amplified compression differences for spotting local edits.',
    heatmap: 'Overlay suspicious regions on top of the original image.',
  }

  const verdictColors = {
    'AUTHENTIC': 'var(--green)',
    'SUSPICIOUS': 'var(--amber)',
    'TAMPERED': 'var(--red)'
  }

  const verdictColor = verdictColors[verdict] || 'var(--accent)'

  function handleZoomIn() {
    setZoom(prev => Math.min(3.0, prev + 0.25))
  }

  function handleZoomOut() {
    setZoom(prev => Math.max(0.5, prev - 0.25))
  }

  return (
    <div className="comparison-shell" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div className="comparison-toolbar" style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* View Switcher */}
        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveView('original')}
            className={`segmented-button ${activeView === 'original' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              borderRadius: '6px',
              background: activeView === 'original' ? 'rgba(0,200,255,0.15)' : 'transparent',
              color: activeView === 'original' ? 'var(--accent)' : 'var(--text-muted)',
              border: `1px solid ${activeView === 'original' ? 'var(--accent)' : 'var(--border)'}`,
              transition: 'all 0.2s ease'
            }}
          >
            Original
          </button>
          <button
            onClick={() => setActiveView('ela')}
            className={`segmented-button ${activeView === 'ela' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              borderRadius: '6px',
              background: activeView === 'ela' ? 'rgba(0,200,255,0.15)' : 'transparent',
              color: activeView === 'ela' ? 'var(--accent)' : 'var(--text-muted)',
              border: `1px solid ${activeView === 'ela' ? 'var(--accent)' : 'var(--border)'}`,
              transition: 'all 0.2s ease'
            }}
          >
            ELA
          </button>
          <button
            onClick={() => setActiveView('heatmap')}
            className={`segmented-button ${activeView === 'heatmap' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              borderRadius: '6px',
              background: activeView === 'heatmap' ? 'rgba(0,200,255,0.15)' : 'transparent',
              color: activeView === 'heatmap' ? 'var(--accent)' : 'var(--text-muted)',
              border: `1px solid ${activeView === 'heatmap' ? 'var(--accent)' : 'var(--border)'}`,
              transition: 'all 0.2s ease'
            }}
          >
            Heatmap Overlay
          </button>
        </div>
          <span style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            {viewDescriptions[activeView]}
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Overlay Opacity (only for heatmap view) */}
          {activeView === 'heatmap' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} color="var(--text-muted)" />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Overlay
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                style={{ width: '80px' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700, minWidth: '35px' }}>
                {Math.round(overlayOpacity * 100)}%
              </span>
            </div>
          )}

          {/* Zoom Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="icon-control-button"
              style={{
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                opacity: zoom <= 0.5 ? 0.4 : 1
              }}
            >
              <ZoomOut size={14} color="var(--text-primary)" />
            </button>
            <span style={{
              fontSize: '12px',
              color: 'var(--accent)',
              fontWeight: 700,
              minWidth: '45px',
              textAlign: 'center'
            }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3.0}
              className="icon-control-button"
              style={{
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                opacity: zoom >= 3.0 ? 0.4 : 1
              }}
            >
              <ZoomIn size={14} color="var(--text-primary)" />
            </button>
          </div>
        </div>
      </div>

      {/* Verdict Banner */}
      <div className="verdict-banner" style={{
        background: verdictColor,
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div
          className="status-dot"
          style={{
            background: verdictColor,
            width: '10px',
            height: '10px',
            animation: 'pulse-glow 2s ease-in-out infinite'
          }}
        ></div>
        <strong style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '1px',
          color: 'var(--bg-primary)'
        }}>
          VERDICT: {verdict}
        </strong>
      </div>

      {/* Image Canvas */}
      <div className="image-canvas-shell" style={{
        flex: 1,
        background: '#020810',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div className="image-canvas-frame" style={{
          position: 'relative',
          display: 'inline-block',
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease'
        }}>
          {/* Base Image */}
          <img
            src={`data:image/jpeg;base64,${images.original}`}
            alt="Original"
            className="analysis-image"
            style={{
              display: 'block',
              maxWidth: '100%',
              height: 'auto',
              opacity: activeView === 'ela' ? 0 : 1,
              transition: 'opacity 0.3s ease'
            }}
          />

          {/* ELA View */}
          {activeView === 'ela' && (
            <img
              src={`data:image/png;base64,${images.ela}`}
              alt="ELA"
              className="analysis-image overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          )}

          {/* Heatmap Overlay */}
          {activeView === 'heatmap' && (
            <img
              src={`data:image/png;base64,${images.heatmap}`}
              alt="Heatmap"
              className="analysis-image overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: overlayOpacity,
                mixBlendMode: 'screen',
                transition: 'opacity 0.2s ease'
              }}
            />
          )}
        </div>
      </div>

      {/* Legend (for ELA and Heatmap views) */}
      {(activeView === 'ela' || activeView === 'heatmap') && (
        <div className="legend-bar" style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '11px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <span style={{ fontWeight: 700 }}>LEGEND:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#0066ff',
              borderRadius: '2px'
            }}></div>
            <span>Clean Region</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#ffbb00',
              borderRadius: '2px'
            }}></div>
            <span>Minor Anomaly</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#ff3333',
              borderRadius: '2px'
            }}></div>
            <span>Suspicious Area</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ComparisonView

import { useEffect, useState } from 'react'

function TitleBar({ title = 'DevnovaTech POS' }) {
  const [time, setTime] = useState(new Date())
  const [isWCO, setIsWCO] = useState(false)
  const [maximized, setMaximized] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Detect if Window Controls Overlay is active (PWA installed on desktop)
    if ('windowControlsOverlay' in navigator) {
      const update = () => setIsWCO(navigator.windowControlsOverlay.visible)
      update()
      navigator.windowControlsOverlay.addEventListener('geometrychange', update)
      return () => navigator.windowControlsOverlay.removeEventListener('geometrychange', update)
    }
  }, [])

  const pad = (n) => String(n).padStart(2, '0')
  const formatTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  const formatDate = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  const handleMinimize = () => {
    // PWA doesn't expose minimize directly — best UX workaround
    if ('windowControlsOverlay' in navigator) {
      window.resizeTo(window.outerWidth, 1) // collapses on some systems
    }
  }

  const handleMaximize = () => {
    if (!maximized) {
      window.moveTo(0, 0)
      window.resizeTo(screen.availWidth, screen.availHeight)
      setMaximized(true)
    } else {
      window.resizeTo(1200, 750)
      window.moveTo(
        (screen.availWidth - 1200) / 2,
        (screen.availHeight - 750) / 2
      )
      setMaximized(false)
    }
  }

  const handleClose = () => {
    window.close()
  }

  return (
    <>
      <style>{`
        .titlebar {
          background: #1E3A5F;
          padding: 7px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-shrink: 0;
          -webkit-app-region: drag;
          app-region: drag;
          user-select: none;
        }
        .titlebar-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .titlebar-dots {
          display: flex;
          gap: 5px;
          -webkit-app-region: no-drag;
          app-region: no-drag;
        }
        .titlebar-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          cursor: pointer;
          flex-shrink: 0;
          border: none;
          padding: 0;
          transition: filter 0.15s;
        }
        .titlebar-dot:hover { filter: brightness(1.2); }
        .titlebar-dot:active { filter: brightness(0.85); }
        .titlebar-title {
          color: #90aac8;
          font-size: 11px;
          font-family: inherit;
        }
        .titlebar-time {
          color: #aac4e0;
          font-size: 11px;
          white-space: nowrap;
          font-family: inherit;
        }
        .red-stripe {
          height: 3px;
          background: #DC2626;
          flex-shrink: 0;
        }
      `}</style>

      <div className="titlebar">
        <div className="titlebar-left">
          <div className="titlebar-dots">
            {/* Close — red */}
            <button
              className="titlebar-dot"
              style={{ background: '#FF5F57' }}
              onClick={handleClose}
              title="Close"
              aria-label="Close window"
            />
            {/* Minimize — yellow */}
            <button
              className="titlebar-dot"
              style={{ background: '#FFBD2E' }}
              onClick={handleMinimize}
              title="Minimize"
              aria-label="Minimize window"
            />
            {/* Maximize — green */}
            <button
              className="titlebar-dot"
              style={{ background: '#28CA41' }}
              onClick={handleMaximize}
              title={maximized ? 'Restore' : 'Maximize'}
              aria-label={maximized ? 'Restore window' : 'Maximize window'}
            />
          </div>
          {title && <span className="titlebar-title">{title}</span>}
        </div>
        <span className="titlebar-time">
          {formatDate(time)} &nbsp;|&nbsp; {formatTime(time)}
        </span>
      </div>

      <div className="red-stripe" />
    </>
  )
}

export default TitleBar
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import homebg from '../assets/homebg.png'
import logo from '../assets/logo.png'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState(new Date())
  const [maximized, setMaximized] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')
  const formatTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  const formatDate = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  const handleClose = () => window.close()

  const handleMinimize = () => {
    window.resizeTo(window.outerWidth, 1)
  }

  const handleMaximize = () => {
    if (!maximized) {
      window.moveTo(0, 0)
      window.resizeTo(screen.availWidth, screen.availHeight)
      setMaximized(true)
    } else {
      window.resizeTo(1200, 750)
      window.moveTo((screen.availWidth - 1200) / 2, (screen.availHeight - 750) / 2)
      setMaximized(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await login(email, password)
      if (user.role === 'super_admin') navigate('/super-admin')
      else if (user.business_type === 'pharmacy') navigate('/pharmacy')
      else if (user.business_type === 'electronics') navigate('/electronics')
      else if (user.business_type === 'hardware') navigate('/hardware')
      else if (user.business_type === 'restaurant') navigate('/restaurant')
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.')
      } else if (err.response?.status === 400) {
        setError('Please enter your email and password.')
      } else {
        setError('Unable to connect. Please check your connection.')
      }
    } finally {
      setLoading(false)
    }
  }

  const industries = [
    { name: 'Pharmacy', active: true },
    { name: 'Electronics', active: true },
    { name: 'Hardware', active: true },
    { name: 'Restaurant', active: true },
    { name: 'Supermarket', active: false },
    { name: 'Cosmetics', active: false },
    { name: 'Bookshop', active: false },
    { name: 'Clothing', active: false },
  ]

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; font-family: 'Inter', system-ui, sans-serif; background: #f0f2f5; }

        .lw {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          background: #f0f2f5;
          overflow: hidden;
        }

        .lc {
          width: 100%;
          max-width: 820px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0,0,0,0.16);
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - 24px);
        }

        .tb {
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

        .tb-dots {
          display: flex;
          gap: 5px;
          flex-shrink: 0;
          -webkit-app-region: no-drag;
          app-region: no-drag;
        }

        .tb-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          flex-shrink: 0;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: filter 0.15s, transform 0.1s;
          display: inline-block;
        }
        .tb-dot:hover { filter: brightness(1.25); transform: scale(1.15); }
        .tb-dot:active { filter: brightness(0.8); transform: scale(0.92); }

        .tb-time { color: #aac4e0; font-size: 11px; white-space: nowrap; }

        .rs { height: 3px; background: #DC2626; flex-shrink: 0; }

        .mc {
          display: flex;
          flex-direction: row;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        .lp {
          flex: 1 1 55%;
          background-size: cover;
          background-position: center;
          padding: 20px 22px;
          position: relative;
          overflow: hidden;
        }
        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(8,20,45,0.80);
        }
        .lp-inner {
          position: relative;
          z-index: 1;
          color: #fff;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .rp {
          flex: 0 0 340px;
          background: #fff;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-left: 1px solid #E2E6EA;
          overflow-y: auto;
        }

        .form-box {
          border: 1.5px solid #E2E6EA;
          border-radius: 8px;
          padding: 18px 16px 14px;
          background: #fafbfc;
        }

        .sb {
          background: #fff;
          border-top: 1px solid #E2E6EA;
          padding: 5px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          color: #4A5568;
          flex-shrink: 0;
        }

        .inp {
          width: 100%;
          border: 1.5px solid #E2E6EA;
          border-radius: 6px;
          font-size: 12px;
          background: #F0F2F5;
          outline: none;
          font-family: inherit;
          color: #1A1A2E;
          transition: border-color 0.2s;
        }
        .inp:focus { border-color: #2B5393; background: #fff; }

        .btn {
          width: 100%;
          padding: 9px;
          background: #1E3A5F;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border-left: 4px solid #DC2626;
          font-family: inherit;
          margin-top: 10px;
        }
        .btn:hover:not(:disabled) { background: #2B5393; }
        .btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .ind-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px 12px;
          margin-top: 6px;
        }
        .ind-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
        }

        @media (max-width: 620px) {
          html, body { overflow: auto; }
          .lw {
            height: auto;
            min-height: 100vh;
            overflow: auto;
            padding: 0;
            align-items: flex-start;
          }
          .lc {
            border-radius: 0;
            box-shadow: none;
            max-height: none;
            overflow: visible;
          }
          .mc {
            flex-direction: column;
            overflow: visible;
          }
          .rp {
            order: 1;
            flex: none;
            border-left: none;
            padding: 20px 16px;
          }
          .lp {
            order: 2;
            flex: none;
            min-height: 380px;
          }
          .sb {
            flex-direction: column;
            gap: 2px;
            text-align: center;
          }
        }
      `}</style>

      <div className="lw">
        <div className="lc">

          <div className="tb">
            <div className="tb-dots">
              <button
                className="tb-dot"
                style={{ background: '#FF5F57' }}
                onClick={handleClose}
                title="Close"
                aria-label="Close"
              />
              <button
                className="tb-dot"
                style={{ background: '#FFBD2E' }}
                onClick={handleMinimize}
                title="Minimize"
                aria-label="Minimize"
              />
              <button
                className="tb-dot"
                style={{ background: '#28CA41' }}
                onClick={handleMaximize}
                title={maximized ? 'Restore' : 'Maximize'}
                aria-label={maximized ? 'Restore' : 'Maximize'}
              />
            </div>
            <span className="tb-time">{formatDate(time)} &nbsp;|&nbsp; {formatTime(time)}</span>
          </div>

          <div className="rs" />

          <div className="mc">

            <div className="lp" style={{ backgroundImage: `url(${homebg})` }}>
              <div className="overlay" />
              <div className="lp-inner">

                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
                  <img src={logo} alt="Logo" style={{
                    width: 38, height: 38, borderRadius: '50%',
                    objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)',
                    flexShrink: 0
                  }} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>
                      <span style={{ color: '#fff' }}>Devnova</span>
                      <span style={{ color: '#DC2626' }}>Tech</span>
                    </div>
                    <div style={{ fontSize: 8, letterSpacing: 2.5, color: '#90aac8', marginTop: 1 }}>
                      POINT OF SALE SYSTEM
                    </div>
                  </div>
                </div>

                <div style={{ width: 28, height: 2, background: '#DC2626', marginBottom: 10 }} />

                <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>
                  One platform.<br />Every business.
                </h2>

                <p style={{ fontSize: 11.5, lineHeight: 1.65, color: '#b8cfe0', marginBottom: 14 }}>
                  A complete multi-tenant POS for Kenyan businesses with <b style={{ color: '#fff' }}>stock management, sales reports, customer management, invoicing</b> and <b style={{ color: '#fff' }}>expense tracking</b>, all in one fast, offline-ready dashboard.
                </p>

                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: '#90aac8' }}>
                  SUPPORTED INDUSTRIES
                </div>
                <div className="ind-grid">
                  {industries.map(({ name, active }) => (
                    <div key={name} className="ind-item">
                      <svg width="6" height="6" viewBox="0 0 6 6" style={{ flexShrink: 0 }}>
                        <circle cx="3" cy="3" r="3" fill={active ? '#DC2626' : '#3a4a5a'} />
                      </svg>
                      <span style={{ color: active ? '#fff' : '#5a7080' }}>{name}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 14 }}>
                  <a href="https://wa.me/254700000000" target="_blank" rel="noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#25D366', color: '#fff',
                    padding: '7px 14px', borderRadius: 50,
                    textDecoration: 'none', fontSize: 11, fontWeight: 600
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp Support
                  </a>
                </div>

              </div>
            </div>

            <div className="rp">
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>
                Welcome back
              </h2>
              <div style={{ width: 32, height: 3, background: '#DC2626', marginBottom: 16 }} />

              <div className="form-box">
                {error && (
                  <div style={{
                    background: '#fef2f2', color: '#DC2626',
                    padding: '8px 10px', borderRadius: 6,
                    fontSize: 11, marginBottom: 12,
                    border: '1px solid #fecaca'
                  }}>{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: '#4A5568', display: 'block', marginBottom: 4 }}>
                    EMAIL ADDRESS
                  </label>
                  <div style={{ position: 'relative', marginBottom: 10 }}>
                    <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input
                      className="inp"
                      type="email"
                      placeholder="you@business.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      style={{ padding: '9px 10px 9px 30px' }}
                    />
                  </div>

                  <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: '#4A5568', display: 'block', marginBottom: 4 }}>
                    PASSWORD
                  </label>
                  <div style={{ position: 'relative', marginBottom: 10 }}>
                    <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input
                      className="inp"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      style={{ padding: '9px 32px 9px 30px' }}
                    />
                    <span onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', lineHeight: 0 }}>
                      {showPassword ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0, gap: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, cursor: 'pointer', color: '#4A5568', whiteSpace: 'nowrap' }}>
                      <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                      Remember me
                    </label>
                    <a href="#" style={{ fontSize: 11, color: '#DC2626', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      Forgot password?
                    </a>
                  </div>

                  <button className="btn" type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              </div>

              <p style={{ textAlign: 'center', marginTop: 12, fontSize: 10, color: '#aaa' }}>
                Powered by <b style={{ color: '#1A1A2E' }}>DevnovaTech</b> · © 2025
              </p>
            </div>

          </div>

          <div className="sb">
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="7" height="7" viewBox="0 0 7 7">
                <circle cx="3.5" cy="3.5" r="3.5" fill="#16A34A" />
              </svg>
              System online · All services operational
            </div>
            <span>v1.0.0</span>
          </div>

        </div>
      </div>
    </>
  )
}

export default Login
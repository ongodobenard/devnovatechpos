import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { businessesAPI } from '../api/axios'
import logo from '../assets/logo.png'

const ICONS = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  businesses: 'M3 21h18 M3 7l9-4 9 4 M4 7v14 M20 7v14 M9 21V12h6v9',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75 M9 7a4 4 0 100 8 4 4 0 000-8z',
  subscriptions: 'M20 12V22H4V12 M22 7H2v5h20V7z M12 22V7 M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z',
  reports: 'M18 20V10 M12 20V4 M6 20v-6',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
  menu: 'M3 12h18 M3 6h18 M3 18h18',
  plus: 'M12 5v14 M5 12h14',
  close: 'M18 6L6 18 M6 6l12 12',
}

const SVGIcon = ({ name, size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {ICONS[name]?.split(' M').map((seg, i) => (
      <path key={i} d={i === 0 ? seg : 'M' + seg} />
    ))}
  </svg>
)

const planColors = {
  basic:      { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' },
  pro:        { bg: '#F5F3FF', color: '#5B21B6', border: '#DDD6FE' },
  enterprise: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
}

const typeLabel = {
  pharmacy: 'Pharmacy', electronics: 'Electronics',
  hardware: 'Hardware', restaurant: 'Restaurant',
  cosmetics: 'Cosmetics', other: 'Other'
}

const NAV = [
  { id: 'dashboard',     label: 'Dashboard'     },
  { id: 'businesses',    label: 'Businesses'    },
  { id: 'users',         label: 'Users'         },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'reports',       label: 'Reports'       },
  { id: 'settings',      label: 'Settings'      },
]

function SuperAdmin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [time, setTime] = useState(new Date())
  const [businesses, setBusinesses] = useState([])
  const [loadingBiz, setLoadingBiz] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [bizError, setBizError] = useState('')
  const [bizLoading, setBizLoading] = useState(false)
  const [bizSuccess, setBizSuccess] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640)
  const [form, setForm] = useState({
    name: '', business_type: 'pharmacy', phone: '', email: '',
    address: '', subscription_plan: 'basic', subscription_expires_at: '',
    admin_name: '', admin_email: '', admin_password: '',
  })

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 640
      setIsMobile(mobile)
      if (!mobile) setMobileNavOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => { fetchBiz() }, [])

  const pad = n => String(n).padStart(2, '0')
  const fmtTime = d => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  const fmtDate = d => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  const handleClose    = () => window.close()
  const handleMinimize = () => window.resizeTo(window.outerWidth, 1)
  const handleMaximize = () => {
    if (!maximized) {
      window.moveTo(0, 0); window.resizeTo(screen.availWidth, screen.availHeight); setMaximized(true)
    } else {
      window.resizeTo(1300, 800); window.moveTo((screen.availWidth-1300)/2,(screen.availHeight-800)/2); setMaximized(false)
    }
  }

  const handleLogout = async () => { await logout(); navigate('/') }

  const fetchBiz = async () => {
    setLoadingBiz(true)
    try { const r = await businessesAPI.list(); setBusinesses(r.data.data || []) }
    catch (e) { console.error(e) }
    finally { setLoadingBiz(false) }
  }

 const handleSubmit = async e => {
    e.preventDefault(); setBizLoading(true); setBizError('')
    try {
      await businessesAPI.create(form)
      setShowModal(false)
      setBizSuccess(`✓ "${form.name}" created successfully! Admin login: ${form.admin_email}`)
      setForm({ name:'',business_type:'pharmacy',phone:'',email:'',address:'',subscription_plan:'basic',subscription_expires_at:'',admin_name:'',admin_email:'',admin_password:'' })
      fetchBiz()
      setTimeout(() => setBizSuccess(''), 6000)
    } catch (err) { setBizError(err.response?.data?.error || 'Failed to create business') }
    finally { setBizLoading(false) }
  }

  const handleToggle = async biz => {
    try { await businessesAPI.update({ ...biz, is_active: biz.is_active == 1 ? 0 : 1 }); fetchBiz() }
    catch (e) { console.error(e) }
  }

  const activeBiz   = businesses.filter(b => b.is_active == 1).length
  const inactiveBiz = businesses.length - activeBiz

  const handleNavClick = id => {
    setTab(id)
    if (isMobile) setMobileNavOpen(false)
  }

  const F = ({ label, children, half }) => (
    <div style={{ flex: half ? '1 1 calc(50% - 6px)' : '1 1 100%', minWidth: half ? 130 : 'auto', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
      <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, color: '#6B7280', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  )

  const inp = { border: '1.5px solid #E5E7EB', borderRadius: 6, padding: '8px 10px', fontSize: 12, fontFamily: 'inherit', color: '#111827', background: '#F9FAFB', outline: 'none', width: '100%', boxSizing: 'border-box' }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; font-family: 'Inter', system-ui, sans-serif; background: #E8EAF0; overflow: hidden; }

        /* ── WRAPPER ── */
        .sw {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 24px;
        }

        /* ── WINDOW ── */
        .swindow {
          width: 100%;
          max-width: 1100px;
          height: calc(100vh - 40px);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 14px 44px rgba(0,0,0,0.18);
          display: flex;
          flex-direction: column;
          background: #F4F5F7;
        }

        /* ── TITLE BAR ── */
        .stb {
          background: #1E3A5F;
          padding: 7px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          user-select: none;
          min-height: 36px;
        }
        .stb-l { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .sdots { display: flex; gap: 5px; flex-shrink: 0; }
        .sdot {
          width: 11px; height: 11px; border-radius: 50%;
          border: none; padding: 0; cursor: pointer;
          transition: filter .15s, transform .1s;
          flex-shrink: 0;
        }
        .sdot:hover { filter: brightness(1.25); transform: scale(1.15); }
        .sdot:active { filter: brightness(.8); transform: scale(.92); }
        .stb-title {
          color: #90aac8;
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .stb-time {
          color: #aac4e0;
          font-size: 11px;
          white-space: nowrap;
          flex-shrink: 0;
          margin-left: 8px;
        }

        .srs { height: 3px; background: #DC2626; flex-shrink: 0; }

        /* ── BODY ── */
        .sbody { display: flex; flex: 1; min-height: 0; overflow: hidden; }

        /* ── SIDEBAR ── */
        .snav {
          width: ${sidebarOpen ? '200px' : '52px'};
          background: #1E3A5F;
          display: flex; flex-direction: column;
          flex-shrink: 0;
          transition: width .2s ease;
          overflow: hidden;
        }
        .snav-logo {
          padding: 13px 12px; display: flex; align-items: center; gap: 9px;
          border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0;
        }
        .snav-logo img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 1.5px solid rgba(255,255,255,0.25); }
        .snav-items { flex: 1; padding: 8px 0; overflow-y: auto; }
        .snav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 14px; cursor: pointer; color: #8BAAC8;
          font-size: 12px; white-space: nowrap;
          border-left: 3px solid transparent;
          transition: background .12s, color .12s;
          user-select: none;
        }
        .snav-item:hover { background: rgba(255,255,255,0.05); color: #C9DCF0; }
        .snav-item.active { background: rgba(220,38,38,0.1); color: #fff; border-left-color: #DC2626; }
        .snav-icon { display: flex; align-items: center; flex-shrink: 0; width: 20px; justify-content: center; }
        .snav-foot { padding: 10px; border-top: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
        .snav-user {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 8px; border-radius: 6px;
          background: rgba(255,255,255,0.05);
        }
        .snav-avatar {
          width: 26px; height: 26px; border-radius: 50%; background: #DC2626;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 10px; font-weight: 700; flex-shrink: 0;
        }

        /* ── MAIN ── */
        .smain { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; background: #F4F5F7; }

        /* ── TOP BAR ── */
        .stopbar {
          background: #fff;
          height: 46px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #E5E7EB;
          flex-shrink: 0;
          gap: 8px;
        }
        .stopbar-left { display: flex; align-items: center; gap: 8px; min-width: 0; flex-shrink: 1; }
        .stopbar-right { display: flex; align-items: center; flex-shrink: 0; }

        /* ── ADD BUTTON — fluid/responsive ── */
        .add-biz-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 14px;
          border-radius: 6px;
          font-family: inherit;
          font-weight: 700;
          cursor: pointer;
          border: none;
          background: #1E3A5F;
          color: #fff;
          border-left: 3px solid #DC2626;
          transition: background .15s;
          white-space: nowrap;
          font-size: clamp(10px, 1.8vw, 13px);
        }
        .add-biz-btn:hover { background: #2B5393; }
        .add-biz-btn .btn-text { display: inline; }

        /* ── CONTENT ── */
        .scontent { flex: 1; overflow-y: auto; padding: 14px; }

        .scard { background: #fff; border-radius: 8px; border: 1px solid #E5E7EB; overflow: hidden; margin-bottom: 14px; }
        .scard-head { padding: 12px 14px; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; justify-content: space-between; }

        .sstats { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 14px; }
        .sstat { background: #fff; border-radius: 8px; border: 1px solid #E5E7EB; padding: 12px 14px; }

        .st-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        table.st { width: 100%; border-collapse: collapse; min-width: 380px; }
        table.st th {
          text-align: left; padding: 8px 12px;
          font-size: 10px; font-weight: 700; letter-spacing: .7px;
          color: #9CA3AF; text-transform: uppercase;
          background: #F9FAFB; border-bottom: 1px solid #E5E7EB;
        }
        table.st td {
          padding: 9px 12px; font-size: 12px; color: #374151;
          border-bottom: 1px solid #F3F4F6; vertical-align: middle;
        }
        table.st tr:last-child td { border-bottom: none; }
        table.st tr:hover td { background: #FAFAFA; }

        .sbadge { display: inline-block; padding: 2px 7px; border-radius: 20px; font-size: 10px; font-weight: 700; border: 1px solid; }

        .sswitch { position: relative; display: inline-block; width: 32px; height: 17px; }
        .sswitch input { opacity: 0; width: 0; height: 0; }
        .sthumb { position: absolute; cursor: pointer; inset: 0; border-radius: 17px; background: #D1D5DB; transition: background .2s; }
        .sthumb:before { content:''; position: absolute; width: 11px; height: 11px; border-radius: 50%; background: #fff; left: 3px; top: 3px; transition: transform .2s; }
        .sswitch input:checked + .sthumb { background: #16A34A; }
        .sswitch input:checked + .sthumb:before { transform: translateX(15px); }

        /* ── FOOTER ── */
        .sbar {
          background: #fff;
          border-top: 1px solid #E5E7EB;
          padding: 5px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          color: #9CA3AF;
          flex-shrink: 0;
          gap: 8px;
          flex-wrap: nowrap;
        }
        .sbar-left { display: flex; align-items: center; gap: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sbar-right { white-space: nowrap; flex-shrink: 0; }

        /* ── MODAL ── */
        .sovl {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center;
          z-index: 300; padding: 16px;
        }
        .smod {
          background: #fff; border-radius: 10px;
          width: 100%; max-width: 500px; max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
        }
        .smod-head {
          padding: 13px 16px; border-bottom: 1px solid #E5E7EB;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; background: #fff; z-index: 1;
        }
        .smod-foot {
          padding: 11px 16px; border-top: 1px solid #E5E7EB;
          display: flex; gap: 8px; justify-content: flex-end;
          position: sticky; bottom: 0; background: #fff;
        }
        .sbtn-primary {
          padding: 7px 16px; border-radius: 6px; font-size: 12px; font-weight: 700;
          cursor: pointer; font-family: inherit; border: none;
          background: #1E3A5F; color: #fff; border-left: 3px solid #DC2626;
          transition: background .15s;
        }
        .sbtn-primary:hover:not(:disabled) { background: #2B5393; }
        .sbtn-primary:disabled { opacity: .6; cursor: not-allowed; }
        .sbtn-ghost {
          padding: 7px 13px; border-radius: 6px; font-size: 12px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          border: 1.5px solid #E5E7EB; background: #fff; color: #6B7280;
          transition: background .15s;
        }
        .sbtn-ghost:hover { background: #F3F4F6; }

        .sempty { text-align: center; padding: 36px 20px; color: #9CA3AF; font-size: 12px; }
        .scoming { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 220px; gap: 8px; color: #D1D5DB; }

        /* ── MOBILE NAV DRAWER ── */
        .mob-nav-overlay {
          display: none;
          position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200;
        }
        .mob-nav-drawer {
          position: absolute; left: 0; top: 0; bottom: 0; width: 220px;
          background: #1E3A5F; display: flex; flex-direction: column; overflow: hidden;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .sstats { grid-template-columns: repeat(2,1fr); }
        }

        @media (max-width: 640px) {
          html, body { overflow: auto; }
          .snav-item { font-size: 14px; padding: 10px 15px; gap: 11px; }
          .snav-icon svg { width: 17px; height: 17px; }

          .sw {
            padding: 0;
            align-items: flex-start;
            height: auto;
            min-height: 100vh;
          }

          .swindow {
            border-radius: 0;
            box-shadow: none;
            height: 100dvh;
            max-width: 100%;
          }

          /* hide desktop sidebar */
          .snav { display: none !important; }

          /* show mobile drawer when open */
          .mob-nav-overlay.open { display: block; }

          .stopbar { height: 50px; padding: 0 12px; }

          .scontent { padding: 10px 8px; }

          .sstats { grid-template-columns: repeat(2,1fr); gap: 8px; }
          .sstat { padding: 10px 10px; }

          /* title bar — smaller on mobile */
          .stb { padding: 6px 10px; }
          .stb-title { font-size: 10px; }
          .stb-time { font-size: 10px; }

          /* footer single line on mobile */
          .sbar { padding: 5px 10px; }
          .sbar-right { display: none; }
        }

        @media (max-width: 400px) {
          .sstats { grid-template-columns: 1fr 1fr; }
          
        }
      `}</style>

      <div className="sw">
        <div className="swindow">

          {/* ── Title bar ── */}
          <div className="stb">
            <div className="stb-l">
              <div className="sdots">
                <button className="sdot" style={{ background: '#FF5F57' }} onClick={handleClose}    title="Close" />
                <button className="sdot" style={{ background: '#FFBD2E' }} onClick={handleMinimize} title="Minimize" />
                <button className="sdot" style={{ background: '#28CA41' }} onClick={handleMaximize} title={maximized ? 'Restore' : 'Maximize'} />
              </div>
              {/* ✅ Simplified title */}
              <span className="stb-title">Super Admin</span>
            </div>
            <span className="stb-time">{fmtDate(time)}&nbsp;|&nbsp;{fmtTime(time)}</span>
          </div>

          {/* Red stripe */}
          <div className="srs" />

          {/* Body */}
          <div className="sbody">

            {/* Desktop sidebar */}
            <div className="snav">
              <div className="snav-logo">
                <img src={logo} alt="logo" />
                {sidebarOpen && (
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                      <span>Devnova</span><span style={{ color: '#DC2626' }}>Tech</span>
                    </div>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: '#8BAAC8', marginTop: 1 }}>SUPER ADMIN</div>
                  </div>
                )}
              </div>
              <div className="snav-items">
                {NAV.map(n => (
                  <div key={n.id} className={`snav-item${tab === n.id ? ' active' : ''}`} onClick={() => setTab(n.id)}>
                    <span className="snav-icon"><SVGIcon name={n.id} size={14} color={tab === n.id ? '#fff' : '#8BAAC8'} /></span>
                    {sidebarOpen && <span>{n.label}</span>}
                  </div>
                ))}
              </div>
              <div className="snav-foot">
                <div className="snav-user">
                  <div className="snav-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'S'}</div>
                  {sidebarOpen && (
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.name || 'Super Admin'}
                      </div>
                      <div style={{ fontSize: 9, color: '#8BAAC8' }}>Super Administrator</div>
                    </div>
                  )}
                  {sidebarOpen && (
                    <button onClick={handleLogout}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8BAAC8', padding: 2, display: 'flex', alignItems: 'center', flexShrink: 0 }}
                      title="Logout"
                      onMouseEnter={e => e.currentTarget.style.color='#DC2626'}
                      onMouseLeave={e => e.currentTarget.style.color='#8BAAC8'}
                    >
                      <SVGIcon name="logout" size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile nav drawer */}
            <div className={`mob-nav-overlay${mobileNavOpen ? ' open' : ''}`} onClick={() => setMobileNavOpen(false)}>
              <div className="mob-nav-drawer" onClick={e => e.stopPropagation()}>
                <div className="snav-logo" style={{ padding: '14px' }}>
                  <img src={logo} alt="logo" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                      <span>Devnova</span><span style={{ color: '#DC2626' }}>Tech</span>
                    </div>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: '#8BAAC8', marginTop: 1 }}>SUPER ADMIN</div>
                  </div>
                  <button onClick={() => setMobileNavOpen(false)}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#8BAAC8', display: 'flex', padding: 4 }}>
                    <SVGIcon name="close" size={15} />
                  </button>
                </div>
                <div className="snav-items">
                  {NAV.map(n => (
                    <div key={n.id} className={`snav-item${tab === n.id ? ' active' : ''}`} onClick={() => handleNavClick(n.id)}>
                      <span className="snav-icon"><SVGIcon name={n.id} size={14} color={tab === n.id ? '#fff' : '#8BAAC8'} /></span>
                      <span>{n.label}</span>
                    </div>
                  ))}
                </div>
                <div className="snav-foot">
                  <div className="snav-user">
                    <div className="snav-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'S'}</div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.name || 'Super Admin'}
                      </div>
                      <div style={{ fontSize: 9, color: '#8BAAC8' }}>Super Administrator</div>
                    </div>
                    <button onClick={handleLogout}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8BAAC8', padding: 2, display: 'flex', alignItems: 'center', flexShrink: 0 }}
                      title="Logout"
                      onMouseEnter={e => e.currentTarget.style.color='#DC2626'}
                      onMouseLeave={e => e.currentTarget.style.color='#8BAAC8'}
                    >
                      <SVGIcon name="logout" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="smain">

              {/* Top bar */}
              <div className="stopbar">
                <div className="stopbar-left">
                  <button
                    onClick={() => isMobile ? setMobileNavOpen(o => !o) : setSidebarOpen(o => !o)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', padding: 3, flexShrink: 0 }}
                    aria-label="Toggle sidebar"
                  >
                    <SVGIcon name="menu" size={24} />
                  </button>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1E3A5F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {NAV.find(n => n.id === tab)?.label}
                  </span>
                </div>

                {/* ✅ Responsive Add Business button — never overflows */}
                <div className="stopbar-right">
                  {tab === 'businesses' && (
                    <button className="add-biz-btn" onClick={() => setShowModal(true)}>
                      <SVGIcon name="plus" size={isMobile ? 14 : 12} color="#fff" />
                      <span className="btn-text">Add Business</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="scontent">

                {/* Success toast */}
                {bizSuccess && (
                  <div style={{ background:'#F0FDF4', color:'#15803D', padding:'10px 14px', borderRadius:8, fontSize:12, marginBottom:14, border:'1px solid #BBF7D0', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
                    <span>{bizSuccess}</span>
                    <button onClick={() => setBizSuccess('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#15803D', fontSize:16, lineHeight:1, padding:0 }}>×</button>
                  </div>
                )}

                {/* DASHBOARD */}
                {tab === 'dashboard' && (
                  <>
                    <div className="sstats">
                      {[
                        { label: 'Total Businesses', value: businesses.length, sub: `${activeBiz} active` },
                        { label: 'Active Tenants',   value: activeBiz,          sub: 'Paying subscribers' },
                        { label: 'Inactive',         value: inactiveBiz,        sub: 'Suspended accounts' },
                        { label: 'Monthly Revenue',  value: 'KES 0',            sub: 'Across all tenants' },
                      ].map(s => (
                        <div className="sstat" key={s.label}>
                          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 5 }}>{s.label}</div>
                          <div style={{ fontSize: 22, fontWeight: 700, color: '#1E3A5F', lineHeight: 1 }}>{s.value}</div>
                          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3 }}>{s.sub}</div>
                        </div>
                      ))}
                    </div>

                    <div className="scard">
                      <div className="scard-head">
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F' }}>Recent businesses</span>
                        <span style={{ fontSize: 11, color: '#DC2626', cursor: 'pointer', fontWeight: 600 }} onClick={() => setTab('businesses')}>View all →</span>
                      </div>
                      {loadingBiz ? <div className="sempty">Loading…</div> : businesses.length === 0 ? (
                        <div className="sempty">No businesses yet. <span style={{ color: '#DC2626', cursor: 'pointer', fontWeight: 600 }} onClick={() => setShowModal(true)}>Add your first →</span></div>
                      ) : (
                        <div className="st-wrap">
                          <table className="st">
                            <thead><tr><th>Name</th><th>Type</th><th>Plan</th><th>Status</th><th>Owner</th></tr></thead>
                            <tbody>
                              {businesses.slice(0, 6).map(b => {
                                const pc = planColors[b.subscription_plan] || planColors.basic
                                return (
                                  <tr key={b.id}>
                                    <td><div style={{ fontWeight: 600, color: '#1E3A5F' }}>{b.name}</div><div style={{ fontSize: 10, color: '#9CA3AF' }}>{b.email || '—'}</div></td>
                                    <td style={{ textTransform: 'capitalize' }}>{typeLabel[b.business_type] || b.business_type}</td>
                                    <td><span className="sbadge" style={{ background: pc.bg, color: pc.color, borderColor: pc.border }}>{b.subscription_plan}</span></td>
                                    <td>
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: b.is_active == 1 ? '#16A34A' : '#DC2626', display: 'inline-block' }} />
                                        {b.is_active == 1 ? 'Active' : 'Inactive'}
                                      </span>
                                    </td>
                                    <td>{b.owner_name || '—'}</td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* BUSINESSES */}
                {tab === 'businesses' && (
                  <div className="scard">
                    <div className="scard-head">
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F' }}>All businesses ({businesses.length})</span>
                    </div>
                    {loadingBiz ? <div className="sempty">Loading…</div> : businesses.length === 0 ? (
                      <div className="sempty">No businesses yet. <span style={{ color: '#DC2626', cursor: 'pointer', fontWeight: 600 }} onClick={() => setShowModal(true)}>Add your first →</span></div>
                    ) : (
                      <div className="st-wrap">
                        <table className="st">
                          <thead><tr><th>#</th><th>Business</th><th>Type</th><th>Contact</th><th>Plan</th><th>Owner</th><th>Status</th><th>Toggle</th></tr></thead>
                          <tbody>
                            {businesses.map((b, i) => {
                              const pc = planColors[b.subscription_plan] || planColors.basic
                              return (
                                <tr key={b.id}>
                                  <td style={{ color: '#D1D5DB', fontSize: 11 }}>{i + 1}</td>
                                  <td><div style={{ fontWeight: 600, color: '#1E3A5F' }}>{b.name}</div><div style={{ fontSize: 10, color: '#9CA3AF' }}>{b.address || '—'}</div></td>
                                  <td style={{ textTransform: 'capitalize' }}>{typeLabel[b.business_type] || b.business_type}</td>
                                  <td><div>{b.phone || '—'}</div><div style={{ fontSize: 10, color: '#9CA3AF' }}>{b.email || '—'}</div></td>
                                  <td><span className="sbadge" style={{ background: pc.bg, color: pc.color, borderColor: pc.border }}>{b.subscription_plan}</span></td>
                                  <td><div>{b.owner_name || '—'}</div><div style={{ fontSize: 10, color: '#9CA3AF' }}>{b.owner_email || '—'}</div></td>
                                  <td>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: b.is_active == 1 ? '#16A34A' : '#DC2626', display: 'inline-block' }} />
                                      {b.is_active == 1 ? 'Active' : 'Inactive'}
                                    </span>
                                  </td>
                                  <td>
                                    <label className="sswitch">
                                      <input type="checkbox" checked={b.is_active == 1} onChange={() => handleToggle(b)} />
                                      <span className="sthumb" />
                                    </label>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* COMING SOON */}
                {['users','subscriptions','reports','settings'].includes(tab) && (
                  <div className="scoming">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#9CA3AF' }}>{NAV.find(n => n.id === tab)?.label} — coming soon</div>
                    <div style={{ fontSize: 11, color: '#D1D5DB' }}>This section is being built</div>
                  </div>
                )}
              </div>

              {/* ✅ Footer — single clean row, version hidden on tiny screens */}
              <div className="sbar">
                <div className="sbar-left">
                  <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="#16A34A"/></svg>
                  System online · All services operational
                </div>
                <span className="sbar-right">v1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Business Modal ── */}
      {showModal && (
        <div className="sovl" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="smod">
            <div className="smod-head">
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1E3A5F' }}>Add new business</span>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
                <SVGIcon name="close" size={16} />
              </button>
            </div>

            <form id="bizform" onSubmit={handleSubmit} style={{ padding: '16px 18px' }}>
  {bizError && (
    <div style={{ background:'#FEF2F2', color:'#DC2626', padding:'8px 12px', borderRadius:6, fontSize:12, marginBottom:14, border:'1px solid #FECACA' }}>
      {bizError}
    </div>
  )}

  <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.2, color:'#9CA3AF', textTransform:'uppercase', marginBottom:10, paddingBottom:6, borderBottom:'1px solid #F3F4F6' }}>Business details</div>

  <div style={{ display:'flex', gap:12, marginBottom:12 }}>
    <div style={{ flex:'1 1 50%', display:'flex', flexDirection:'column', gap:4 }}>
      <label style={{ fontSize:10, fontWeight:700, letterSpacing:.6, color:'#6B7280', textTransform:'uppercase' }}>Business name *</label>
      <input style={inp} required placeholder="e.g. Nairobi Pharmacy"
        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
    </div>
    <div style={{ flex:'1 1 50%', display:'flex', flexDirection:'column', gap:4 }}>
      <label style={{ fontSize:10, fontWeight:700, letterSpacing:.6, color:'#6B7280', textTransform:'uppercase' }}>Business type *</label>
      <select style={inp} value={form.business_type} onChange={e => setForm(f => ({ ...f, business_type: e.target.value }))}>
       <option value="pharmacy">Pharmacy</option>
       <option value="electronics">Electronics</option>
       <option value="hardware">Hardware</option>
       <option value="restaurant">Restaurant</option>
       <option value="cosmetics">Cosmetics</option>
       <option value="other">Other</option>
      </select>
    </div>
  </div>

  <div style={{ display:'flex', gap:12, marginBottom:12 }}>
    <div style={{ flex:'1 1 50%', display:'flex', flexDirection:'column', gap:4 }}>
      <label style={{ fontSize:10, fontWeight:700, letterSpacing:.6, color:'#6B7280', textTransform:'uppercase' }}>Phone</label>
      <input style={inp} placeholder="+254700000000"
        value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
    </div>
    <div style={{ flex:'1 1 50%', display:'flex', flexDirection:'column', gap:4 }}>
      <label style={{ fontSize:10, fontWeight:700, letterSpacing:.6, color:'#6B7280', textTransform:'uppercase' }}>Email</label>
      <input style={inp} type="email" placeholder="business@email.com"
        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
    </div>
  </div>

  <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:12 }}>
    <label style={{ fontSize:10, fontWeight:700, letterSpacing:.6, color:'#6B7280', textTransform:'uppercase' }}>Address</label>
    <input style={inp} placeholder="Tom Mboya Street, Nairobi"
      value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
  </div>

  <div style={{ display:'flex', gap:12, marginBottom:12 }}>
    <div style={{ flex:'1 1 50%', display:'flex', flexDirection:'column', gap:4 }}>
      <label style={{ fontSize:10, fontWeight:700, letterSpacing:.6, color:'#6B7280', textTransform:'uppercase' }}>Subscription plan *</label>
      <select style={inp} value={form.subscription_plan} onChange={e => setForm(f => ({ ...f, subscription_plan: e.target.value }))}>
        <option value="basic">Basic</option>
        <option value="pro">Pro</option>
        <option value="enterprise">Enterprise</option>
      </select>
    </div>
    <div style={{ flex:'1 1 50%', display:'flex', flexDirection:'column', gap:4 }}>
      <label style={{ fontSize:10, fontWeight:700, letterSpacing:.6, color:'#6B7280', textTransform:'uppercase' }}>Expires on</label>
      <input style={inp} type="date"
        value={form.subscription_expires_at} onChange={e => setForm(f => ({ ...f, subscription_expires_at: e.target.value }))} />
    </div>
  </div>

  <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.2, color:'#9CA3AF', textTransform:'uppercase', marginTop:6, marginBottom:10, paddingBottom:6, borderBottom:'1px solid #F3F4F6' }}>Admin account</div>

  <div style={{ display:'flex', gap:12, marginBottom:12 }}>
    <div style={{ flex:'1 1 50%', display:'flex', flexDirection:'column', gap:4 }}>
      <label style={{ fontSize:10, fontWeight:700, letterSpacing:.6, color:'#6B7280', textTransform:'uppercase' }}>Admin name *</label>
      <input style={inp} required placeholder="John Doe"
        value={form.admin_name} onChange={e => setForm(f => ({ ...f, admin_name: e.target.value }))} />
    </div>
    <div style={{ flex:'1 1 50%', display:'flex', flexDirection:'column', gap:4 }}>
      <label style={{ fontSize:10, fontWeight:700, letterSpacing:.6, color:'#6B7280', textTransform:'uppercase' }}>Admin email *</label>
      <input style={inp} type="email" required placeholder="admin@business.com"
        value={form.admin_email} onChange={e => setForm(f => ({ ...f, admin_email: e.target.value }))} />
    </div>
  </div>

  <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:4 }}>
    <label style={{ fontSize:10, fontWeight:700, letterSpacing:.6, color:'#6B7280', textTransform:'uppercase' }}>Admin password *</label>
    <input style={inp} type="password" required minLength={8} placeholder="Minimum 8 characters"
      value={form.admin_password} onChange={e => setForm(f => ({ ...f, admin_password: e.target.value }))} />
  </div>
</form>

            <div className="smod-foot">
              <button className="sbtn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="sbtn-primary" type="submit" form="bizform" disabled={bizLoading}>
                {bizLoading ? 'Creating…' : 'Create business'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SuperAdmin
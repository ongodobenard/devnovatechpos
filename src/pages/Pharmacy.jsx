import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { productsAPI, salesAPI, reportsAPI, usersAPI, customersAPI, expensesAPI, categoriesAPI } from '../api/axios'

const SI = ({ d, size = 14, color = 'currentColor', stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {d.split('||').map((seg, i) => <path key={i} d={seg} />)}
  </svg>
)

const PATHS = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z||M9 22V12h6v10',
  pos: 'M3 3h18v18H3z||M3 9h18||M9 3v18',
  products: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z||M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z',
  sales: 'M12 2L2 7l10 5 10-5-10-5z||M2 17l10 5 10-5||M2 12l10 5 10-5',
  customers: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2||M9 7a4 4 0 100 8 4 4 0 000-8z||M23 21v-2a4 4 0 00-3-3.87||M16 3.13a4 4 0 010 7.75',
  cashiers: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2||M9 7a4 4 0 100 8 4 4 0 000-8z||M23 21v-2a4 4 0 00-3-3.87||M16 3.13a4 4 0 010 7.75',
  expenses: 'M12 2v20||M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  reports: 'M18 20V10||M12 20V4||M6 20v-6',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z||M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4||M16 17l5-5-5-5||M21 12H9',
  menu: 'M3 12h18||M3 6h18||M3 18h18',
  plus: 'M12 5v14||M5 12h14',
  trash: 'M3 6h18||M8 6V4h8v2||M19 6l-1 14H6L5 6',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16z||M21 21l-4.35-4.35',
  close: 'M18 6L6 18||M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
  alert: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z||M12 9v4||M12 17h.01',
  cart: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z||M3 6h18||M16 10a4 4 0 01-8 0',
  receipt: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z||M14 2v6h6||M16 13H8||M16 17H8||M10 9H8',
  pill: 'M10.5 3.5a6 6 0 018.49 8.49l-8.49 8.49a6 6 0 01-8.49-8.49l8.49-8.49z||M12 12L6.5 6.5',
  scan: 'M3 5h2||M3 12h2||M3 19h2||M9 5v14||M15 5v14||M21 5h-2||M21 12h-2||M21 19h-2',
  hold: 'M18 11V6a2 2 0 00-4 0v5||M14 10V4a2 2 0 00-4 0v2||M10 10.5V6a2 2 0 00-4 0v8||M18 8a2 2 0 114 0v6a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 012.83-2.82L8 15',
  returns: 'M1 4v6h6||M3.51 15a9 9 0 100 .49-4.51',
  drawer: 'M5 3a2 2 0 00-2 2||M19 3a2 2 0 012 2||M21 19a2 2 0 01-2 2||M5 21a2 2 0 01-2-2||M9 3h1||M9 21h1||M14 3h1||M14 21h1||M3 9v1||M21 9v1||M3 14v1||M21 14v1',
  discount: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  calc: 'M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z||M8 6h8||M8 10h2||M14 10h2||M8 14h2||M14 14h2||M8 18h2||M14 18h2',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7||M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  cash: 'M12 2a10 10 0 100 20A10 10 0 0012 2z||M12 6v6l4 2',
  card: 'M1 4h22v16H1z||M1 10h22',
  mpesa: 'M12 2a10 10 0 100 20A10 10 0 0012 2z||M8 12h8||M12 8v8',
  transfer: 'M12 2v20||M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  print: 'M6 9V2h12v7||M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2||M6 14h12v8H6z',
  grid: 'M3 3h7v7H3z||M14 3h7v7h-7z||M14 14h7v7h-7z||M3 14h7v7H3z',
  list: 'M8 6h13||M8 12h13||M8 18h13||M3 6h.01||M3 12h.01||M3 18h.01',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z||M7 7h.01',
  percent: 'M19 5L5 19||M6.5 6.5h.01||M17.5 17.5h.01',
  trend: 'M23 6l-9.5 9.5-5-5L1 18||M17 6h6v6',
  package: 'M12 2l10 6.5v7L12 22 2 15.5v-7L12 2z||M12 22v-6.5||M22 8.5l-10 7-10-7',
  building: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  save: 'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z||M17 21v-8H7v8||M7 3v5h8',
  chartline: 'M3 3v18h18||M18.7 8l-5.1 5.2-2.8-2.7L7 14.3',
  chartbar: 'M18 20V10||M12 20V4||M6 20v-6',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2||M12 3a4 4 0 100 8 4 4 0 000-8z',
  lock: 'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z||M7 11V7a5 5 0 0110 0v4',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z||M12 9a3 3 0 100 6 3 3 0 000-6z',
  refresh: 'M23 4v6h-6||M1 20v-6h6||M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
  folder: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z',
  upload: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4||M17 8l-5-5-5 5||M12 3v12',
  audit: 'M9 12h6||M9 16h6||M9 8h6||M5 3h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z',
  download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4||M7 10l5 5 5-5||M12 15V3',
}

const NAV_ADMIN = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'pos', label: 'POS / Sales' },
  { id: 'products', label: 'Products' },
  { id: 'sales', label: 'Sales History' },
  { id: 'customers', label: 'Customers' },
  { id: 'cashiers', label: 'Cashiers' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'reports', label: 'Reports' },
  { id: 'audit', label: 'Audit Log' },
  { id: 'settings', label: 'Settings' },
]

const NAV_CASHIER = [
  { id: 'pos', label: 'POS / Sales' },
  { id: 'sales', label: 'My Sales Today' },
  { id: 'customers', label: 'Customers' },
]

const TAX_RATE = 0.16
const EXP_CATS = ['Rent', 'Utilities', 'Salaries', 'Stock Purchase', 'Equipment', 'Transport', 'Marketing', 'Miscellaneous']
const COLORS = ['#2B5393', '#16A34A', '#EA580C', '#7C3AED', '#0891B2', '#B45309', '#DC2626', '#0D9488']

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function playCartSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.type = 'sine'
    o.frequency.setValueAtTime(880, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.05)
    g.gain.setValueAtTime(0.7, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.18)
  } catch (e) {}
}

function BarChart({ data, color = '#2B5393', height = 120 }) {
  if (!data || data.length === 0) return <div style={{ color: '#9CA3AF', fontSize: 11, textAlign: 'center', padding: 20 }}>No data</div>
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height, padding: '0 4px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
          <div style={{ fontSize: 8, color: '#9CA3AF', textAlign: 'center' }}>{typeof d.value === 'number' && d.value >= 1000 ? (d.value / 1000).toFixed(1) + 'k' : d.value}</div>
          <div style={{ width: '100%', background: color, borderRadius: '3px 3px 0 0', height: `${Math.max(4, (d.value / max) * (height - 30))}px`, transition: 'height 0.4s', opacity: 0.85 }} />
          <div style={{ fontSize: 8, color: '#6B7280', textAlign: 'center', lineHeight: 1.2, maxWidth: 36, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</div>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ data, size = 100 }) {
  if (!data || data.length === 0) return null
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return null
  let cumulative = 0
  const cx = size / 2, cy = size / 2, r = size * 0.38, inner = size * 0.22
  const slices = data.map((d, i) => {
    const pct = d.value / total
    const start = cumulative
    cumulative += pct
    const startAngle = start * 2 * Math.PI - Math.PI / 2
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle)
    const ix1 = cx + inner * Math.cos(startAngle), iy1 = cy + inner * Math.sin(startAngle)
    const ix2 = cx + inner * Math.cos(endAngle), iy2 = cy + inner * Math.sin(endAngle)
    const largeArc = pct > 0.5 ? 1 : 0
    return { path: `M${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} L${ix2},${iy2} A${inner},${inner} 0 ${largeArc},0 ${ix1},${iy1} Z`, color: COLORS[i % COLORS.length], label: d.label, pct: Math.round(pct * 100) }
  })
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} opacity={0.88} />)}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 9, height: 9, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: '#4A5568' }}>{s.label}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#1E3A5F', marginLeft: 'auto', paddingLeft: 8 }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// CSV Import helper
function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase().replace(/\s+/g, '_'))
  return lines.slice(1).map(line => {
    const values = []
    let cur = '', inQ = false
    for (let ch of line) {
      if (ch === '"') inQ = !inQ
      else if (ch === ',' && !inQ) { values.push(cur.trim()); cur = '' }
      else cur += ch
    }
    values.push(cur.trim())
    const row = {}
    headers.forEach((h, i) => { row[h] = values[i] !== undefined ? values[i].replace(/^"|"$/g, '').trim() : '' })
    return row
  }).filter(r => Object.values(r).some(v => v !== ''))
}

function mapCSVRow(row) {
  // Map flexible column names
  const get = (...keys) => {
    for (const k of keys) {
      const found = Object.keys(row).find(rk => rk.replace(/[\s_]/g, '').toLowerCase() === k.replace(/[\s_]/g, '').toLowerCase())
      if (found && row[found] !== '') return row[found]
    }
    return ''
  }
  const vatRaw = get('vat', 'apply_tax', 'tax', 'vat_applicable')
  const applyTax = vatRaw !== '' && vatRaw !== null && !['0', 'false', 'no', 'n'].includes(vatRaw.toLowerCase())
  return {
    name: get('name', 'product_name', 'product'),
    category: get('category', 'cat'),
    buying_price: get('buying', 'buying_price', 'cost', 'cost_price') || '0',
    selling_price: get('selling_price', 'selling', 'price', 'sale_price') || '0',
    stock_quantity: get('stock_quantity', 'stock', 'qty', 'quantity') || '0',
    apply_tax: applyTax,
    expiry_date: get('expiry_date', 'expiry', 'expiration', 'exp_date') || '',
    generic_name: get('generic_name', 'generic') || '',
    unit: get('unit', 'units') || '',
    reorder_level: get('reorder_level', 'reorder') || '10',
    barcode: get('barcode') || '',
  }
}

export default function Pharmacy() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
  const NAV = isAdmin ? NAV_ADMIN : NAV_CASHIER
  const bizId = user?.business_id
  const bizName = user?.business_name || 'Pharmacy'

  const [tab, setTab] = useState(() => localStorage.getItem('pos_tab') || (isAdmin ? 'dashboard' : 'pos'))
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640)
  const [time, setTime] = useState(new Date())

  const [products, setProducts] = useState([])
  const [loadingProds, setLoadingProds] = useState(true)
  const [prodSearch, setProdSearch] = useState('')
  const [showAddProd, setShowAddProd] = useState(false)
  const [editProd, setEditProd] = useState(null)
  const [prodForm, setProdForm] = useState({ name: '', generic_name: '', category: '', buying_price: '', selling_price: '', profit_margin: '', apply_tax: false, stock_quantity: '', reorder_level: '10', unit: '', barcode: '', expiry_date: '' })
  const [prodLoading, setProdLoading] = useState(false)
  const [prodError, setProdError] = useState('')

  // CSV Import state
  const csvInputRef = useRef(null)
  const [csvImporting, setCsvImporting] = useState(false)
  const [csvFeedback, setCsvFeedback] = useState(null) // {success, failed, errors}
  const [showCsvFeedback, setShowCsvFeedback] = useState(false)

  // Audit log state
  const [auditLogs, setAuditLogs] = useState([])
  const [loadingAudit, setLoadingAudit] = useState(false)
  const [auditFilter, setAuditFilter] = useState('all')

  const [categories, setCategories] = useState([])
  const [showAddCat, setShowAddCat] = useState(false)
  const [catForm, setCatForm] = useState({ name: '' })
  const [catLoading, setCatLoading] = useState(false)
  const [catError, setCatError] = useState('')

  const [cart, setCart] = useState([])
  const [posSearch, setPosSearch] = useState('')
  const [posCat, setPosCat] = useState('all')
  const [posView, setPosView] = useState('list')
  const [payMethod, setPayMethod] = useState('cash')
  const [amountPaid, setAmountPaid] = useState('')
  const [discount, setDiscount] = useState('0')
  const [discType, setDiscType] = useState('fixed')
  const [saleLoading, setSaleLoading] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const [showPayModal, setShowPayModal] = useState(false)
  const [txnCount, setTxnCount] = useState(0)
  const [todaySales, setTodaySales] = useState(0)
  const [todayItems, setTodayItems] = useState(0)
  const [showCalc, setShowCalc] = useState(false)
  const [calcDisplay, setCalcDisplay] = useState('0')
  const [calcPrev, setCalcPrev] = useState(null)
  const [calcOp, setCalcOp] = useState(null)
  const [calcNewNum, setCalcNewNum] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [custPaySearch, setCustPaySearch] = useState('')

  const [sales, setSales] = useState([])
  const [loadingSales, setLoadingSales] = useState(false)
  const [salesDateFrom, setSalesDateFrom] = useState('')
  const [salesDateTo, setSalesDateTo] = useState('')

  const [todaySalesList, setTodaySalesList] = useState([])
  const [loadingTodaySales, setLoadingTodaySales] = useState(false)

  const [stats, setStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)

  const [cashiers, setCashiers] = useState([])
  const [loadingCash, setLoadingCash] = useState(false)
  const [showAddCash, setShowAddCash] = useState(false)
  const [cashForm, setCashForm] = useState({ name: '', email: '', password: '' })
  const [cashLoading, setCashLoading] = useState(false)
  const [cashError, setCashError] = useState('')
  const [cashSuccess, setCashSuccess] = useState('')

  const [customers, setCustomers] = useState([])
  const [loadingCusts, setLoadingCusts] = useState(false)
  const [showAddCust, setShowAddCust] = useState(false)
  const [editCust, setEditCust] = useState(null)
  const [custForm, setCustForm] = useState({ name: '', phone: '', email: '', address: '' })
  const [custLoading, setCustLoading] = useState(false)
  const [custError, setCustError] = useState('')
  const [custSuccess, setCustSuccess] = useState('')
  const [custSearch, setCustSearch] = useState('')

  const [expenses, setExpenses] = useState([])
  const [loadingExp, setLoadingExp] = useState(false)
  const [showAddExp, setShowAddExp] = useState(false)
  const [expForm, setExpForm] = useState({ category: '', description: '', amount: '', date: new Date().toISOString().split('T')[0], payment_method: 'cash' })
  const [expLoading, setExpLoading] = useState(false)
  const [expError, setExpError] = useState('')
  const [expSuccess, setExpSuccess] = useState('')
  const [expMonth, setExpMonth] = useState(new Date().toISOString().slice(0, 7))

  const [reportData, setReportData] = useState(null)
  const [loadingReport, setLoadingReport] = useState(false)
  const [reportPeriod, setReportPeriod] = useState('today')
  const [reportRange, setReportRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  })

  const [settingsForm, setSettingsForm] = useState({ business_name: bizName, phone: '', email: '', address: '', tax_rate: '16', currency: 'KES', receipt_footer: 'Thank you for shopping with us!' })
  const [settingsSaved, setSettingsSaved] = useState(false)

  const [showAdminPwModal, setShowAdminPwModal] = useState(false)
  const [adminPw, setAdminPw] = useState('')
  const [adminPwError, setAdminPwError] = useState('')
  const [pendingRefundSale, setPendingRefundSale] = useState(null)
  const [reprintReceipt, setReprintReceipt] = useState(null)

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])
  useEffect(() => {
    const fn = () => { const m = window.innerWidth <= 640; setIsMobile(m); if (!m) setMobileNavOpen(false) }
    window.addEventListener('resize', fn); return () => window.removeEventListener('resize', fn)
  }, [])
  useEffect(() => {
    if (bizId) {
      fetchProducts(); fetchCustomers(); fetchCategories()
      if (isAdmin) { fetchStats(); fetchCashiers(); fetchTodaySales() }
    }
  }, [bizId])
  useEffect(() => {
    if (!bizId) return
    if (tab === 'sales') fetchSales()
    if (tab === 'expenses') fetchExpenses()
    if (tab === 'customers') fetchCustomers()
    if (tab === 'dashboard' && isAdmin) { fetchStats(); fetchTodaySales() }
    if (tab === 'audit' && isAdmin) fetchAuditLogs()
  }, [tab, expMonth, bizId])
  useEffect(() => { if (tab === 'sales' && bizId) fetchSales() }, [salesDateFrom, salesDateTo])

  const pad = n => String(n).padStart(2, '0')
  const fmtT = d => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  const fmtD = d => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const fmtKES = n => `KES ${Number(n || 0).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`
  const getColor = i => COLORS[i % COLORS.length]
  const todayStr = () => new Date().toISOString().split('T')[0]

  const handleLogout = async () => { await logout(); navigate('/') }
  const handleNavClick = id => { setTab(id); localStorage.setItem('pos_tab', id); if (isMobile) setMobileNavOpen(false) }
  const handleMaximize = () => {
    if (!maximized) { window.moveTo(0, 0); window.resizeTo(screen.availWidth, screen.availHeight); setMaximized(true) }
    else { window.resizeTo(1300, 800); window.moveTo((screen.availWidth - 1300) / 2, (screen.availHeight - 800) / 2); setMaximized(false) }
  }

  const fetchProducts = async () => {
    setLoadingProds(true)
    try { const r = await productsAPI.list(bizId); setProducts(r.data.data || []) }
    catch (e) { console.error(e) } finally { setLoadingProds(false) }
  }

  const fetchCategories = async () => {
    try { const r = await categoriesAPI.list(bizId); setCategories(r.data.data || []) }
    catch (e) { console.error(e) }
  }

  const handleAddCategory = async e => {
    e.preventDefault(); setCatLoading(true); setCatError('')
    try {
      await categoriesAPI.create({ name: catForm.name, business_id: bizId })
      setCatForm({ name: '' }); setShowAddCat(false); fetchCategories()
    } catch (err) { setCatError(err.response?.data?.error || 'Failed') }
    finally { setCatLoading(false) }
  }

  const handleDeleteCategory = async id => {
    if (!window.confirm('Delete this category?')) return
    try { await categoriesAPI.delete(id); fetchCategories() } catch (e) { console.error(e) }
  }

  // CSV Import handler
  const handleCSVImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.name.endsWith('.csv')) { alert('Please select a CSV file.'); return }
    setCsvImporting(true)
    try {
      const text = await file.text()
      const rows = parseCSV(text)
      if (rows.length === 0) { alert('CSV is empty or invalid.'); setCsvImporting(false); return }

      let success = 0, failed = 0, errors = []
      for (let i = 0; i < rows.length; i++) {
        const mapped = mapCSVRow(rows[i])
        if (!mapped.name) { failed++; errors.push(`Row ${i + 2}: Missing product name`); continue }
        try {
          await productsAPI.add({ ...mapped, business_id: bizId })
          success++
        } catch (err) {
          failed++
          errors.push(`Row ${i + 2} (${mapped.name}): ${err.response?.data?.error || 'Failed'}`)
        }
      }
      setCsvFeedback({ success, failed, errors, total: rows.length })
      setShowCsvFeedback(true)
      if (success > 0) fetchProducts()
    } catch (err) {
      alert('Failed to read CSV file.')
    } finally {
      setCsvImporting(false)
      e.target.value = ''
    }
  }

  // Audit log fetch (client-side from sales/products actions for demo; replace with real API)
  const fetchAuditLogs = async () => {
    setLoadingAudit(true)
    try {
      // Try real audit API first, fallback to composing from sales
      const r = await salesAPI.listAll(bizId, '', '')
      const saleLogs = (r.data.data || []).map(s => ({
        id: `sale-${s.id}`,
        action: 'SALE',
        description: `Sale ${s.receipt_number} ; ${fmtKES(s.total_amount)}`,
        user: s.cashier_name || ';',
        timestamp: s.created_at,
        meta: s.payment_method,
        type: 'sale'
      }))
      setAuditLogs(saleLogs)
    } catch (e) {
      setAuditLogs([])
    } finally { setLoadingAudit(false) }
  }

  const calcSellingPrice = (buying, margin, applyTax) => {
    const b = parseFloat(buying) || 0, m = parseFloat(margin) || 0
    const w = b * (1 + m / 100)
    return applyTax ? (w * (1 + TAX_RATE)).toFixed(2) : w.toFixed(2)
  }

  const openAddProd = () => {
    setEditProd(null)
    setProdForm({ name: '', generic_name: '', category: '', buying_price: '', selling_price: '', profit_margin: '', apply_tax: false, stock_quantity: '', reorder_level: '10', unit: '', barcode: '', expiry_date: '' })
    setProdError(''); setShowAddProd(true)
  }

  const openEditProd = p => {
    setEditProd(p)
    setProdForm({ name: p.name, generic_name: p.generic_name || '', category: p.category || '', buying_price: p.buying_price, selling_price: p.selling_price, profit_margin: '', apply_tax: false, stock_quantity: p.stock_quantity, reorder_level: p.reorder_level, unit: p.unit || '', barcode: p.barcode || '', expiry_date: p.expiry_date || '' })
    setProdError(''); setShowAddProd(true)
  }

  const handleSaveProd = async e => {
    e.preventDefault(); setProdLoading(true); setProdError('')
    try {
      if (editProd) await productsAPI.update({ ...prodForm, id: editProd.id, business_id: bizId })
      else await productsAPI.add({ ...prodForm, business_id: bizId })
      setShowAddProd(false); fetchProducts()
    } catch (err) { setProdError(err.response?.data?.error || 'Failed to save') }
    finally { setProdLoading(false) }
  }

  const handleDeleteProd = async id => {
    if (!window.confirm('Delete this product?')) return
    try { await productsAPI.delete(id); fetchProducts() } catch (e) { console.error(e) }
  }

  const fetchCashiers = async () => {
    setLoadingCash(true)
    try { const r = await usersAPI.list(bizId); setCashiers((r.data.data || []).filter(u => u.role === 'cashier')) }
    catch (e) { console.error(e) } finally { setLoadingCash(false) }
  }

  const handleAddCashier = async e => {
    e.preventDefault(); setCashLoading(true); setCashError('')
    try {
      await usersAPI.create({ ...cashForm, role: 'cashier', business_id: bizId })
      setShowAddCash(false); setCashForm({ name: '', email: '', password: '' })
      setCashSuccess('Cashier added'); fetchCashiers(); setTimeout(() => setCashSuccess(''), 4000)
    } catch (err) { setCashError(err.response?.data?.error || 'Failed') }
    finally { setCashLoading(false) }
  }

  const handleDeleteCashier = async id => {
    if (!window.confirm('Remove this cashier?')) return
    try { await usersAPI.delete(id); fetchCashiers() } catch (e) { console.error(e) }
  }

  const fetchCustomers = async () => {
    setLoadingCusts(true)
    try { const r = await customersAPI.list(bizId); setCustomers(r.data.data || []) }
    catch (e) { console.error(e) } finally { setLoadingCusts(false) }
  }

  const openAddCust = () => { setEditCust(null); setCustForm({ name: '', phone: '', email: '', address: '' }); setCustError(''); setShowAddCust(true) }
  const openEditCust = c => { setEditCust(c); setCustForm({ name: c.name, phone: c.phone || '', email: c.email || '', address: c.address || '' }); setCustError(''); setShowAddCust(true) }

  const handleSaveCustomer = async e => {
    e.preventDefault(); setCustLoading(true); setCustError('')
    try {
      if (editCust) await customersAPI.update({ ...custForm, id: editCust.id, business_id: bizId })
      else await customersAPI.create({ ...custForm, business_id: bizId })
      setShowAddCust(false); setCustForm({ name: '', phone: '', email: '', address: '' })
      setCustSuccess(editCust ? 'Customer updated' : 'Customer added'); fetchCustomers()
      setTimeout(() => setCustSuccess(''), 4000)
    } catch (err) { setCustError(err.response?.data?.error || 'Failed') }
    finally { setCustLoading(false) }
  }

  const handleDeleteCustomer = async id => {
    if (!window.confirm('Remove this customer?')) return
    try { await customersAPI.delete(id); fetchCustomers() } catch (e) { console.error(e) }
  }

  const fetchExpenses = async () => {
    setLoadingExp(true)
    try { const r = await expensesAPI.list(bizId, expMonth); setExpenses(r.data.data || []) }
    catch (e) { console.error(e) } finally { setLoadingExp(false) }
  }

  const handleAddExpense = async e => {
    e.preventDefault(); setExpLoading(true); setExpError('')
    try {
      await expensesAPI.create({ ...expForm, business_id: bizId })
      setShowAddExp(false); setExpForm({ category: '', description: '', amount: '', date: new Date().toISOString().split('T')[0], payment_method: 'cash' })
      setExpSuccess('Expense recorded'); fetchExpenses(); setTimeout(() => setExpSuccess(''), 4000)
    } catch (err) { setExpError(err.response?.data?.error || 'Failed to save') }
    finally { setExpLoading(false) }
  }

  const handleDeleteExpense = async id => {
    if (!window.confirm('Delete this expense?')) return
    try { await expensesAPI.delete(id); fetchExpenses() } catch (e) { console.error(e) }
  }

  const fetchReport = async () => {
    setLoadingReport(true); setReportData(null)
    try {
      const r = await reportsAPI.fullReport(bizId, reportRange.from, reportRange.to, reportPeriod)
      setReportData(r.data.data)
    } catch (e) {
      console.error('Report error:', e)
      setReportData(null)
    } finally { setLoadingReport(false) }
  }

  const fetchTodaySales = async () => {
    setLoadingTodaySales(true)
    try { const r = await salesAPI.list(bizId, todayStr()); setTodaySalesList(r.data.data || []) }
    catch (e) { console.error(e) } finally { setLoadingTodaySales(false) }
  }

  const fetchSales = async () => {
    setLoadingSales(true)
    try {
      let data = []
      if (isAdmin) {
        const r = await salesAPI.listAll(bizId, salesDateFrom, salesDateTo)
        data = r.data.data || []
      } else {
        const r = await salesAPI.list(bizId, todayStr())
        data = (r.data.data || []).filter(s => String(s.cashier_id) === String(user.id))
      }
      setSales(data)
    } catch (e) { console.error(e) } finally { setLoadingSales(false) }
  }

  const fetchStats = async () => {
    setLoadingStats(true)
    try { const r = await reportsAPI.dashboardStats(bizId); setStats(r.data.data) }
    catch (e) { console.error(e) } finally { setLoadingStats(false) }
  }

  const POS_CATS = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]
  const posProducts = products.filter(p => {
    const mc = posCat === 'all' || p.category === posCat
    const ms = p.name.toLowerCase().includes(posSearch.toLowerCase()) ||
      (p.generic_name || '').toLowerCase().includes(posSearch.toLowerCase()) ||
      (p.barcode || '').includes(posSearch)
    return mc && ms
  })

  const addToCart = p => {
    if (p.stock_quantity < 1) return
    playCartSound()
    setCart(c => {
      const ex = c.find(i => i.id === p.id)
      if (ex) { if (ex.qty >= p.stock_quantity) return c; return c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) }
      return [...c, { ...p, qty: 1 }]
    })
  }

  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return }
    const p = products.find(p => p.id === id)
    if (qty > p?.stock_quantity) return
    setCart(c => c.map(i => i.id === id ? { ...i, qty } : i))
  }

  const removeFromCart = id => setCart(c => c.filter(i => i.id !== id))

  const cartSubtotal = cart.reduce((s, i) => s + Number(i.selling_price) * i.qty, 0)
  const discountAmt = discType === 'percent' ? Math.min(cartSubtotal * Number(discount) / 100, cartSubtotal) : Math.min(Number(discount) || 0, cartSubtotal)
  const taxable = cartSubtotal - discountAmt
  const vatAmt = Math.round(taxable / (1 + TAX_RATE) * TAX_RATE)
  const cartTotal = taxable
  const change = Math.max(0, (Number(amountPaid) || 0) - cartTotal)

  const buildReceiptHTML = (txnNo, now, tendered, chg, pm, custName = null) => {
    const sub = cartSubtotal, disc = discountAmt, vat = vatAmt, total = cartTotal
    const vatExcl = taxable - vat
    const ds = now.toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
    const ts = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
    const rno = 'INV-' + now.toISOString().slice(0, 10).replace(/-/g, '') + '-' + String(txnNo).padStart(4, '0')
    const items = cart.map(i =>
      `<div style="display:flex;justify-content:space-between;font-size:10px;padding:2px 0;">
        <span style="flex:1">${i.name}</span>
        <span style="min-width:24px;text-align:center">x${i.qty}</span>
        <span style="min-width:65px;text-align:right;font-weight:700">KES ${(Number(i.selling_price) * i.qty).toLocaleString()}</span>
      </div>`).join('')
    return `<div style="font-family:'Courier New',monospace;font-size:10px;color:#000;max-width:300px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:6px;">
        <div style="font-size:14px;font-weight:700;">${bizName.toUpperCase()}</div>
        <div style="font-size:9px;color:#555;">PHARMACY POS</div>
        <div style="font-size:9px;color:#555;">${ds} ${ts}</div>
        <div style="font-size:9px;color:#666;">Receipt: ${rno}</div>
        <div style="font-size:9px;color:#666;">Served by: ${user?.name || 'Cashier'}</div>
        ${custName ? `<div style="font-size:9px;color:#333;font-weight:700;">Customer: ${custName}</div>` : ''}
      </div>
      <hr style="border:none;border-top:1px dashed #999;margin:5px 0;"/>
      <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:700;padding:2px 0;"><span>ITEM</span><span>QTY</span><span>TOTAL</span></div>
      <hr style="border:none;border-top:1px solid #000;margin:3px 0;"/>
      ${items}
      <hr style="border:none;border-top:1px dashed #999;margin:5px 0;"/>
      <div style="display:flex;justify-content:space-between;font-size:10px;padding:2px 0;"><span>SUBTOTAL</span><span>KES ${sub.toLocaleString()}</span></div>
      ${disc > 0 ? `<div style="display:flex;justify-content:space-between;font-size:10px;padding:2px 0;"><span>DISCOUNT</span><span>-KES ${disc.toLocaleString()}</span></div>` : ''}
      <hr style="border:none;border-top:1px solid #000;margin:4px 0;"/>
      <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;padding:2px 0;"><span>TOTAL DUE</span><span>KES ${total.toLocaleString()}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:10px;font-weight:700;color:#16A34A;padding:2px 0;"><span>TENDERED (${pm.toUpperCase()})</span><span>KES ${tendered.toLocaleString()}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:10px;font-weight:700;color:#2B5393;padding:2px 0;"><span>CHANGE</span><span>KES ${chg.toLocaleString()}</span></div>
      <hr style="border:none;border-top:1px dashed #999;margin:5px 0;"/>
      <div style="font-size:9px;font-weight:700;margin-bottom:3px;">TAX ANALYSIS</div>
      <div style="display:flex;justify-content:space-between;font-size:9px;padding:1px 0;"><span>VATABLE EXCL.</span><span>KES ${vatExcl.toLocaleString()}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:9px;padding:1px 0;"><span>VAT 16%</span><span>KES ${vat.toLocaleString()}</span></div>
      <hr style="border:none;border-top:1px dashed #999;margin:5px 0;"/>
      <div style="text-align:center;font-size:9px;color:#666;margin-top:6px;">Thank you for shopping with us!<br/>Powered by DevnovaTech POS</div>
    </div>`
  }

  const buildReprintHTML = (sale) => {
    const ds = new Date(sale.created_at).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
    const ts = new Date(sale.created_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
    return `<div style="font-family:'Courier New',monospace;font-size:10px;color:#000;max-width:300px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:6px;">
        <div style="font-size:14px;font-weight:700;">${bizName.toUpperCase()}</div>
        <div style="font-size:9px;color:#555;">PHARMACY POS ; REPRINT</div>
        <div style="font-size:9px;color:#555;">${ds} ${ts}</div>
        <div style="font-size:9px;color:#666;">Receipt: ${sale.receipt_number}</div>
        <div style="font-size:9px;color:#666;">Cashier: ${sale.cashier_name || ';'}</div>
        ${sale.customer_name ? `<div style="font-size:9px;color:#333;font-weight:700;">Customer: ${sale.customer_name}</div>` : ''}
      </div>
      <hr style="border:none;border-top:1px dashed #999;margin:5px 0;"/>
      <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;padding:2px 0;"><span>TOTAL</span><span>KES ${Number(sale.total_amount).toLocaleString()}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:10px;padding:2px 0;"><span>PAID (${(sale.payment_method || '').toUpperCase()})</span><span>KES ${Number(sale.amount_paid).toLocaleString()}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:10px;padding:2px 0;"><span>CHANGE</span><span>KES ${Number(sale.change_given).toLocaleString()}</span></div>
      <hr style="border:none;border-top:1px dashed #999;margin:5px 0;"/>
      <div style="text-align:center;font-size:9px;color:#666;margin-top:6px;">Thank you for shopping with us!<br/>Powered by DevnovaTech POS</div>
    </div>`
  }

  const handlePrintReceipt = (html) => {
    const w = window.open('', '_blank', 'width=400,height=600')
    w.document.write(`<!DOCTYPE html><html><head><title>Receipt</title><style>body{margin:0;padding:16px;background:#fff;}@media print{body{margin:0;padding:0;}}</style></head><body>${html}</body></html>`)
    w.document.close(); w.focus()
    setTimeout(() => { w.print(); w.close() }, 300)
  }

  const handleSale = async () => {
    if (!cart.length) return alert('Cart is empty')
    if (!amountPaid || Number(amountPaid) < cartTotal) return alert('Amount paid is less than total')
    setSaleLoading(true)
    try {
      const r = await salesAPI.create({
        business_id: bizId, cashier_id: user.id,
        customer_id: selectedCustomer?.id || null,
        customer_name: selectedCustomer?.name || null,
        items: cart.map(i => ({ product_id: i.id, product_name: i.name, quantity: i.qty, unit_price: i.selling_price, subtotal: i.selling_price * i.qty })),
        total_amount: cartTotal, discount: discountAmt, tax: vatAmt,
        amount_paid: Number(amountPaid), change_given: change, payment_method: payMethod,
      })
      const now = new Date()
      const txn = txnCount + 1
      const custName = selectedCustomer?.name || null
      const html = buildReceiptHTML(txn, now, Number(amountPaid), change, payMethod, custName)
      setTxnCount(txn)
      setTodaySales(s => s + cartTotal)
      setTodayItems(s => s + cart.reduce((a, i) => a + i.qty, 0))
      setReceipt({ html, saleId: r.data.sale_id })
      setShowPayModal(false)
      setCart([]); setAmountPaid(''); setDiscount('0'); setPosSearch('')
      setSelectedCustomer(null); setCustPaySearch('')
      fetchProducts()
      if (isAdmin) { fetchStats(); fetchTodaySales() }
    } catch (e) { alert(e.response?.data?.error || 'Sale failed') }
    finally { setSaleLoading(false) }
  }

  const handleReturn = (sale) => {
    if (!isAdmin) {
      setPendingRefundSale(sale)
      setAdminPw('')
      setAdminPwError('')
      setShowAdminPwModal(true)
    } else {
      processReturn(sale, '')
    }
  }

  const processReturn = async (sale, adminPassword) => {
    if (!window.confirm(`Process return for receipt ${sale.receipt_number}? Stock will be restored and revenue reduced.`)) return
    try {
      const r = await salesAPI.return(sale.id, adminPassword, bizId)
      alert(`Return processed. KES ${Number(r.data.amount_returned || sale.total_amount).toLocaleString()} deducted from revenue.`)
      fetchSales()
      fetchTodaySales()
      if (isAdmin) fetchStats()
    } catch (e) { alert(e.response?.data?.error || 'Return failed') }
  }

  const handleAdminPwSubmit = async (e) => {
    e.preventDefault()
    setShowAdminPwModal(false)
    await processReturn(pendingRefundSale, adminPw)
    setAdminPw('')
  }

  const calcPress = key => {
    if (key === 'C') { setCalcDisplay('0'); setCalcPrev(null); setCalcOp(null); setCalcNewNum(true); return }
    if (key === '±') { setCalcDisplay(d => String(-parseFloat(d) || 0)); return }
    if (key === '%') { setCalcDisplay(d => String(parseFloat(d) / 100)); return }
    if (['+', '−', '×', '÷'].includes(key)) { setCalcPrev(parseFloat(calcDisplay)); setCalcOp(key); setCalcNewNum(true); return }
    if (key === '=') {
      if (calcPrev === null || !calcOp) return
      const a = calcPrev, b = parseFloat(calcDisplay)
      let res = a
      if (calcOp === '+') res = a + b
      if (calcOp === '−') res = a - b
      if (calcOp === '×') res = a * b
      if (calcOp === '÷') res = b !== 0 ? a / b : 0
      setCalcDisplay(String(parseFloat(res.toFixed(8)))); setCalcPrev(null); setCalcOp(null); setCalcNewNum(true); return
    }
    if (key === '.') {
      if (calcNewNum) { setCalcDisplay('0.'); setCalcNewNum(false); return }
      if (!calcDisplay.includes('.')) setCalcDisplay(d => d + '.'); return
    }
    if (key === '⌫') { setCalcDisplay(d => d.length > 1 ? d.slice(0, -1) : '0'); return }
    if (calcNewNum) { setCalcDisplay(key); setCalcNewNum(false) }
    else setCalcDisplay(d => d === '0' ? key : d + key)
  }

  const filteredProds = products.filter(p =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(prodSearch.toLowerCase())
  )
  const filteredCusts = customers.filter(c =>
    c.name.toLowerCase().includes(custSearch.toLowerCase()) ||
    (c.phone || '').includes(custSearch) ||
    (c.email || '').toLowerCase().includes(custSearch.toLowerCase())
  )
  const filteredCustsPay = customers.filter(c =>
    c.name.toLowerCase().includes(custPaySearch.toLowerCase()) ||
    (c.phone || '').includes(custPaySearch)
  )
  const lowStock = products.filter(p => Number(p.stock_quantity) <= Number(p.reorder_level))
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0)

  const inp = { border: '1.5px solid #E5E7EB', borderRadius: 6, padding: '8px 10px', fontSize: 12, fontFamily: 'inherit', color: '#111827', background: '#F9FAFB', outline: 'none', width: '100%', boxSizing: 'border-box' }

  const expByCategory = EXP_CATS.map(cat => ({
    label: cat.slice(0, 5),
    value: expenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0)
  })).filter(d => d.value > 0)

  const expDonutData = expByCategory.map(d => ({ label: d.label, value: d.value }))
  const todayTxnCount = todaySalesList.length
  const todayRevenue = todaySalesList.reduce((s, r) => s + Number(r.total_amount), 0)

  const CASHIER_QA = [
    { icon: PATHS.scan, label: 'Scan', bg: '#EBF2FC', color: '#2B5393', fn: () => alert('Coming soon') },
    { icon: PATHS.returns, label: 'Return', bg: '#FEF2F2', color: '#DC2626', fn: () => setTab('sales') },
    { icon: PATHS.customers, label: 'Customers', bg: '#EBF2FC', color: '#2B5393', fn: () => setTab('customers') },
    { icon: PATHS.calc, label: 'Calc', bg: '#F0FDF4', color: '#16A34A', fn: () => setShowCalc(true) },
    { icon: PATHS.products, label: 'Products', bg: '#F0FDF4', color: '#16A34A', fn: () => setTab('products') },
  ]

  const ADMIN_QA = [
    { icon: PATHS.scan, label: 'Scan', bg: '#EBF2FC', color: '#2B5393', fn: () => alert('Coming soon') },
    { icon: PATHS.returns, label: 'Return', bg: '#FEF2F2', color: '#DC2626', fn: () => setTab('sales') },
    { icon: PATHS.sales, label: 'Sales', bg: '#F0FDF4', color: '#16A34A', fn: () => setTab('sales') },
    { icon: PATHS.customers, label: 'Customers', bg: '#EBF2FC', color: '#2B5393', fn: () => setTab('customers') },
    { icon: PATHS.expenses, label: 'Expenses', bg: '#FFF7ED', color: '#EA580C', fn: () => setTab('expenses') },
    { icon: PATHS.reports, label: 'Reports', bg: '#F5F3FF', color: '#7C3AED', fn: () => setTab('reports') },
    { icon: PATHS.products, label: 'Products', bg: '#F0FDF4', color: '#16A34A', fn: () => setTab('products') },
    { icon: PATHS.calc, label: 'Calc', bg: '#F0FDF4', color: '#16A34A', fn: () => setShowCalc(true) },
  ]

  const QA_LIST = isAdmin ? ADMIN_QA : CASHIER_QA

  const auditTypeColors = {
    sale: { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' },
    return: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
    product: { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
    expense: { bg: '#FFF7ED', color: '#EA580C', border: '#FED7AA' },
    login: { bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' },
    import: { bg: '#F0FDF4', color: '#0891B2', border: '#A5F3FC' },
  }

  const filteredAudit = auditFilter === 'all' ? auditLogs : auditLogs.filter(l => l.type === auditFilter)

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{height:100%;font-family:'Inter',system-ui,sans-serif;background:#E8EAF0;overflow:hidden;}
        .pw{height:100vh;display:flex;align-items:center;justify-content:center;padding:20px 24px;}
        .pwin{width:100%;max-width:1100px;height:calc(100vh - 40px);border-radius:10px;overflow:hidden;box-shadow:0 14px 44px rgba(0,0,0,0.18);display:flex;flex-direction:column;background:#F4F5F7;}
        .ptb{background:#1E3A5F;padding:5px 12px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;user-select:none;min-height:34px;}
        .pdots{display:flex;gap:5px;}
        .pdot{width:11px;height:11px;border-radius:50%;border:none;padding:0;cursor:pointer;flex-shrink:0;}
        .prs{height:3px;background:#DC2626;flex-shrink:0;}
        .pbody{display:flex;flex:1;min-height:0;overflow:hidden;}
        .pnav{background:#1E3A5F;display:flex;flex-direction:column;flex-shrink:0;transition:width .2s;overflow:hidden;}
        .pnav-logo{padding:10px 11px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;}
        .pnav-biz-av{width:26px;height:26px;border-radius:7px;background:#DC2626;display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:700;flex-shrink:0;}
        .pnav-items{flex:1;padding:6px 0;overflow-y:auto;overflow-x:hidden;}
        .pnav-item{display:flex;align-items:center;gap:9px;padding:8px 13px;cursor:pointer;color:#8BAAC8;font-size:12px;white-space:nowrap;border-left:3px solid transparent;transition:all .12s;user-select:none;}
        .pnav-item:hover{background:rgba(255,255,255,0.05);color:#C9DCF0;}
        .pnav-item.active{background:rgba(220,38,38,0.1);color:#fff;border-left-color:#DC2626;}
        .pnav-icon{display:flex;align-items:center;flex-shrink:0;width:20px;justify-content:center;}
        .pnav-foot{padding:8px;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0;}
        .pnav-user{display:flex;align-items:center;gap:7px;padding:6px;border-radius:6px;background:rgba(255,255,255,0.05);}
        .pnav-avatar{width:24px;height:24px;border-radius:50%;background:#DC2626;display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:700;flex-shrink:0;}
        .pmain{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;background:#F4F5F7;}
        .ptopbar{background:#fff;min-height:44px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #E5E7EB;flex-shrink:0;gap:6px;flex-wrap:wrap;}
        .pcontent{flex:1;overflow-y:auto;overflow-x:hidden;padding:12px;}
        .pbar{background:#fff;border-top:1px solid #E5E7EB;padding:4px 12px;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#9CA3AF;flex-shrink:0;}
        .pcard{background:#fff;border-radius:8px;border:1px solid #E5E7EB;overflow:hidden;margin-bottom:12px;}
        .pcard-head{padding:10px 14px;border-bottom:1px solid #E5E7EB;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;}
        .pstats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px;}
        .pstat{background:#fff;border-radius:8px;border:1px solid #E5E7EB;padding:10px 12px;}

        /* TABLE SCROLL ; CRITICAL FIX for mobile POS */
        .tbl-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
        .tbl-wrap::-webkit-scrollbar{height:6px;display:block;}
        .tbl-wrap::-webkit-scrollbar-thumb{background:#9CA3AF;border-radius:4px;}
        .tbl-wrap::-webkit-scrollbar-track{background:#F3F4F6;}

        /* POS list specific scroll fix */
        .pos-list-outer{flex:1;overflow:hidden;background:#fff;border-radius:8px;border:1px solid #E5E7EB;display:block;min-height:0;max-height:340px;}
        .pos-list-scroll-x{overflow-x:scroll;overflow-y:auto;-webkit-overflow-scrolling:touch;flex:1;scroll-behavior:smooth;}
        .pos-list-scroll-x::-webkit-scrollbar{width:4px;height:8px;display:block;}
        .pos-list-scroll-x::-webkit-scrollbar-thumb{background:#9CA3AF;border-radius:4px;}
        .pos-list-scroll-x::-webkit-scrollbar-track{background:#F3F4F6;}

        table.pt{width:100%;border-collapse:collapse;min-width:400px;}
        table.pt th{text-align:left;padding:8px 12px;font-size:10px;font-weight:700;letter-spacing:.7px;color:#9CA3AF;text-transform:uppercase;background:#F9FAFB;border-bottom:1px solid #E5E7EB;white-space:nowrap;}
        table.pt td{padding:8px 12px;font-size:12px;color:#374151;border-bottom:1px solid #F3F4F6;vertical-align:middle;}
        table.pt tr:last-child td{border-bottom:none;}
        table.pt tr:hover td{background:#FAFAFA;}
        .pbadge{display:inline-block;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:700;border:1px solid;}
        .pbtn{padding:6px 12px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;border:none;background:#1E3A5F;color:#fff;border-left:3px solid #DC2626;transition:background .15s;display:inline-flex;align-items:center;gap:5px;white-space:nowrap;}
        .pbtn:hover:not(:disabled){background:#2B5393;}
        .pbtn:disabled{opacity:.6;cursor:not-allowed;}
        .pbtn-ghost{padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;border:1.5px solid #E5E7EB;background:#fff;color:#6B7280;transition:background .15s;display:inline-flex;align-items:center;gap:4px;}
        .pbtn-ghost:hover{background:#F3F4F6;}
        .pbtn-danger{padding:5px 9px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;border:1.5px solid #FECACA;background:#FEF2F2;color:#DC2626;transition:background .15s;display:inline-flex;align-items:center;gap:4px;}
        .pbtn-danger:hover{background:#FEE2E2;}
        .pbtn-orange{padding:5px 9px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;border:1.5px solid #FED7AA;background:#FFF7ED;color:#EA580C;transition:background .15s;display:inline-flex;align-items:center;gap:4px;}
        .pbtn-orange:hover{background:#FFEDD5;}
        .pbtn-blue{padding:5px 9px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;border:1.5px solid #BFDBFE;background:#EFF6FF;color:#2B5393;transition:background .15s;display:inline-flex;align-items:center;gap:4px;}
        .pbtn-blue:hover{background:#DBEAFE;}

        /* CSV Import button */
        .btn-import{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 16px;border-radius:8px;border:2px dashed #2B5393;background:linear-gradient(135deg,#EBF2FC,#F0F7FF);color:#2B5393;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;transition:all .2s;width:100%;}
        .btn-import:hover:not(:disabled){background:linear-gradient(135deg,#DBEAFE,#EBF2FC);border-color:#1E3A5F;transform:translateY(-1px);box-shadow:0 4px 12px rgba(43,83,147,0.15);}
        .btn-import:disabled{opacity:.6;cursor:not-allowed;transform:none;}
        .csv-feedback{border-radius:8px;padding:12px 14px;margin-bottom:0;}
        .csv-feedback.success{background:#F0FDF4;border:1px solid #BBF7D0;}
        .csv-feedback.partial{background:#FFF7ED;border:1px solid #FED7AA;}
        .csv-feedback.failed{background:#FEF2F2;border:1px solid #FECACA;}
        .audit-badge{display:inline-flex;align-items:center;padding:3px 8px;border-radius:20px;font-size:10px;font-weight:700;border:1px solid;}

        .pos-wrap{display:flex;gap:10px;align-items:flex-start;height:calc(100vh - 120px);}
        .pos-left{flex:1;display:flex;flex-direction:column;gap:7px;min-width:0;height:100%;overflow:hidden;}
        .pos-right{width:275px;display:flex;flex-direction:column;flex-shrink:0;height:100%;}
        .cat-bar{display:flex;gap:1px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;}
        .cat-bar::-webkit-scrollbar{display:none;}
        .cat-tab{padding:4px 10px;white-space:nowrap;font-size:11px;font-weight:500;color:#9AA3B0;cursor:pointer;border-bottom:2px solid transparent;background:none;border-top:none;border-left:none;border-right:none;font-family:inherit;transition:all .14s;}
        .cat-tab:hover{color:#2B5393;}
        .cat-tab.active{color:#2B5393;border-bottom-color:#2B5393;font-weight:600;}

        .pos-list-table{width:100%;border-collapse:collapse;min-width:650px;}
        .pos-list-table thead th{background:#F9FAFB;font-size:10px;font-weight:700;color:#9AA3B0;text-transform:uppercase;padding:8px 10px;border-bottom:1px solid #E5E7EB;text-align:left;position:sticky;top:0;z-index:2;white-space:nowrap;}
        .pos-list-table tbody tr{border-bottom:1px solid #F3F4F6;cursor:pointer;transition:background .12s;}
        .pos-list-table tbody tr:hover{background:#EBF2FC;}
        .pos-list-table tbody tr.out-row{opacity:.5;cursor:not-allowed;}
        .pos-list-table tbody td{padding:7px 10px;font-size:11px;color:#374151;vertical-align:middle;}
        .pos-grid-wrap{flex:1;overflow-y:auto;}
        .pos-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:6px;align-content:start;}
        .pcard2{background:#fff;border:1px solid #E5E7EB;border-radius:8px;padding:8px;cursor:pointer;transition:all .14s;display:flex;flex-direction:column;gap:3px;position:relative;user-select:none;}
        .pcard2:hover{border-color:#2B5393;box-shadow:0 2px 8px rgba(30,58,95,0.10);transform:translateY(-1px);}
        .pcard2.out{opacity:.5;cursor:not-allowed;}
        .pcard2__img{width:100%;aspect-ratio:1;border-radius:6px;margin-bottom:2px;display:flex;align-items:center;justify-content:center;}
        .pcard2__name{font-size:10px;font-weight:600;color:#1A1A2E;line-height:1.3;}
        .pcard2__price{font-size:11px;font-weight:700;color:#2B5393;margin-top:1px;}
        .pcard2__stock{font-size:9px;color:#9AA3B0;}
        .pcard2__stock.low{color:#EA580C;}
        .pcard2__stock.out2{color:#DC2626;}
        .pcard2__badge{position:absolute;top:4px;right:4px;background:#DC2626;color:#fff;font-size:8px;font-weight:700;padding:1px 4px;border-radius:3px;}
        .cart-panel{display:flex;flex-direction:column;background:#fff;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;height:100%;}
        .cart-hdr{flex:0 0 auto;padding:8px 10px 6px;border-bottom:1px solid #E5E7EB;}
        .cart-title-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;}
        .cart-title-txt{font-size:12px;font-weight:700;color:#1A1A2E;display:flex;align-items:center;gap:5px;}
        .cart-cnt{background:#DC2626;color:#fff;font-size:9px;font-weight:700;width:15px;height:15px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
        .btn-clear{font-size:10px;color:#DC2626;background:none;border:none;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:3px;padding:2px 4px;border-radius:4px;}
        .cart-items{flex:1;overflow-y:auto;padding:4px 8px;display:flex;flex-direction:column;gap:4px;min-height:0;}
        .cart-items::-webkit-scrollbar{width:3px;}
        .cart-items::-webkit-scrollbar-thumb{background:#E2E6EA;border-radius:2px;}
        .cart-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#9AA3B0;padding:16px;text-align:center;}
        .cart-item{display:flex;align-items:center;gap:4px;padding:4px 6px;border:1px solid #E2E6EA;border-radius:6px;background:#F7F8FA;flex-shrink:0;}
        .cart-item:hover{border-color:#2B5393;}
        .cart-item__info{flex:1;min-width:0;}
        .cart-item__name{font-size:10px;font-weight:600;color:#1A1A2E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .cart-item__unit{font-size:9px;color:#9AA3B0;}
        .qty-ctrl{display:flex;align-items:center;gap:2px;}
        .qty-btn{width:17px;height:17px;border-radius:3px;border:1px solid #E2E6EA;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;color:#4A5568;font-family:inherit;transition:all .13s;}
        .qty-btn:hover{background:#1E3A5F;color:#fff;border-color:#1E3A5F;}
        .qty-btn.minus:hover{background:#DC2626;border-color:#DC2626;}
        .qty-val{font-size:11px;font-weight:600;color:#1A1A2E;min-width:14px;text-align:center;}
        .cart-item__price{font-size:11px;font-weight:700;color:#2B5393;min-width:46px;text-align:right;}
        .cart-item__rm{width:14px;height:14px;background:none;border:none;cursor:pointer;color:#9AA3B0;display:flex;align-items:center;justify-content:center;border-radius:3px;}
        .cart-item__rm:hover{background:#FEF2F2;color:#DC2626;}
        .cart-footer{flex:0 0 auto;border-top:1px solid #E5E7EB;padding:7px 10px;display:flex;flex-direction:column;gap:3px;}
        .cart-row{display:flex;justify-content:space-between;align-items:center;}
        .cart-lbl{font-size:10px;color:#9AA3B0;}
        .cart-val{font-size:10px;color:#4A5568;font-weight:500;}
        .disc-wrap{display:flex;align-items:center;gap:3px;}
        .disc-input{width:48px;border:1px solid #E2E6EA;border-radius:4px;background:#F7F8FA;padding:2px 4px;font-size:10px;color:#1A1A2E;font-family:inherit;outline:none;text-align:right;}
        .disc-type{font-size:9px;color:#4A5568;background:#F0F2F5;border:1px solid #E2E6EA;border-radius:4px;padding:2px 4px;cursor:pointer;font-family:inherit;outline:none;}
        .cart-divider{height:1px;background:#E5E7EB;margin:2px 0;}
        .cart-total-row{display:flex;justify-content:space-between;align-items:center;}
        .cart-total-lbl{font-size:12px;font-weight:700;color:#1A1A2E;}
        .cart-total-val{font-size:15px;font-weight:700;color:#1E3A5F;}
        .cart-actions{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:2px;}
        .btn-hold{padding:7px;border:1px solid #E2E6EA;border-radius:6px;background:#fff;color:#4A5568;font-size:10px;font-weight:600;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:3px;}
        .btn-checkout{padding:7px;border:none;border-radius:6px;background:linear-gradient(135deg,#16A34A,#15803D);color:#fff;font-size:10px;font-weight:600;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:3px;}
        .btn-checkout:disabled{opacity:.4;cursor:not-allowed;}
        .qa-wrap{border-top:1px solid #E5E7EB;padding:6px 10px;flex:0 0 auto;}
        .qa-title{font-size:9px;font-weight:600;color:#9AA3B0;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;}
        .qa-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;}
        .qa-grid.admin-qa{grid-template-columns:repeat(4,1fr);}
        .qa-btn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 2px;border-radius:5px;border:1px solid #E2E6EA;background:#F7F8FA;cursor:pointer;font-family:inherit;}
        .qa-btn:hover{border-color:#2B5393;background:#EBF2FC;}
        .qa-icon{width:20px;height:20px;border-radius:4px;display:flex;align-items:center;justify-content:center;}
        .qa-lbl{font-size:8px;font-weight:500;color:#4A5568;text-align:center;}
        .povl{position:fixed;inset:0;background:rgba(15,25,40,0.55);display:flex;align-items:center;justify-content:center;z-index:300;padding:12px;opacity:0;pointer-events:none;transition:opacity .2s;}
        .povl.open{opacity:1;pointer-events:all;}
        .pmod{background:#fff;border-radius:10px;width:100%;overflow:hidden;max-height:92vh;display:flex;flex-direction:column;transform:scale(.97);transition:transform .2s;}
        .povl.open .pmod{transform:scale(1);}
        .pmod-head{background:#1E3A5F;padding:10px 15px;display:flex;align-items:center;justify-content:space-between;flex:0 0 auto;}
        .pmod-stripe{height:3px;background:#DC2626;flex:0 0 auto;}
        .pmod-body{padding:13px;overflow-y:auto;flex:1;}
        .pmod-foot{padding:10px 15px;border-top:1px solid #E5E7EB;display:flex;gap:7px;justify-content:flex-end;flex:0 0 auto;}
        .pmod-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
        .pm-total-box{text-align:center;padding:10px;background:#F0F2F5;border-radius:8px;border:1px solid #E2E6EA;margin-bottom:10px;}
        .pm-total-lbl{font-size:9px;color:#9AA3B0;text-transform:uppercase;}
        .pm-total-amt{font-size:20px;font-weight:700;color:#1E3A5F;margin-top:2px;}
        .pm-methods{display:flex;gap:4px;margin-bottom:10px;flex-wrap:wrap;}
        .pm-method{flex:1;min-width:50px;padding:5px 3px;border:1px solid #E2E6EA;border-radius:6px;background:#F7F8FA;cursor:pointer;text-align:center;font-size:10px;font-weight:500;color:#4A5568;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:3px;transition:all .14s;}
        .pm-method:hover{border-color:#2B5393;color:#2B5393;}
        .pm-method.active{background:#1E3A5F;color:#fff;border-color:#1E3A5F;}
        .pm-label{display:block;font-size:9px;font-weight:600;color:#4A5568;margin-bottom:3px;text-transform:uppercase;}
        .pm-input{width:100%;background:#F7F8FA;border:1px solid #E2E6EA;border-radius:6px;padding:6px 9px;font-size:12px;color:#1A1A2E;font-family:inherit;outline:none;margin-bottom:7px;}
        .pm-input:focus{border-color:#2B5393;background:#fff;}
        .pm-key{padding:7px;border-radius:5px;border:1px solid #E2E6EA;background:#F7F8FA;font-size:13px;font-weight:500;color:#1A1A2E;font-family:inherit;cursor:pointer;text-align:center;transition:all .12s;}
        .pm-key:hover{background:#1E3A5F;color:#fff;border-color:#1E3A5F;}
        .change-box{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:6px;padding:6px 9px;display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
        .pm-info{background:#F7F8FA;border:1px solid #E2E6EA;border-radius:6px;padding:8px 9px;font-size:11px;color:#4A5568;line-height:1.6;margin-bottom:8px;}
        .btn-confirm{width:100%;padding:9px;background:linear-gradient(135deg,#16A34A,#15803D);border:none;border-radius:6px;color:#fff;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;}
        .btn-confirm:hover{opacity:.88;}
        .btn-confirm:disabled{opacity:.5;cursor:not-allowed;}
        .receipt-preview{background:#fff;border:1px solid #E2E6EA;border-radius:8px;padding:10px;font-family:'Courier New',monospace;font-size:10px;color:#000;line-height:1.5;overflow-y:auto;max-height:320px;}
        .rec-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:0 14px 14px;}
        .btn-rec{padding:8px;border-radius:6px;font-size:11px;font-weight:600;font-family:inherit;cursor:pointer;border:none;display:flex;align-items:center;justify-content:center;gap:4px;}
        .calc-wrap{background:#1A1A2E;border-radius:12px;overflow:hidden;width:min(260px,90vw);}
        .calc-display{padding:14px 16px;text-align:right;}
        .calc-display .prev{font-size:12px;color:rgba(255,255,255,0.4);min-height:18px;}
        .calc-display .cur{font-size:clamp(18px,5vw,28px);font-weight:700;color:#fff;word-break:break-all;}
        .calc-keys{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#0F0F1A;}
        .calc-key{padding:clamp(10px,3vw,14px) 8px;font-size:clamp(12px,3.5vw,14px);font-weight:500;border:none;cursor:pointer;font-family:inherit;text-align:center;}
        .calc-key.fn{background:#3A3A4E;color:#fff;}
        .calc-key.op{background:#DC2626;color:#fff;}
        .calc-key.eq{background:#16A34A;color:#fff;}
        .calc-key.num{background:#2A2A3E;color:#fff;}
        .rep-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;}
        .rep-card{background:#fff;border-radius:8px;border:1px solid #E5E7EB;padding:12px;}
        .rep-bar-wrap{background:#fff;border-radius:8px;border:1px solid #E5E7EB;padding:12px;margin-bottom:12px;}
        .bar-row{display:flex;align-items:center;gap:7px;margin-bottom:6px;}
        .bar-label{font-size:11px;color:#4A5568;width:100px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .bar-track{flex:1;height:7px;background:#F3F4F6;border-radius:4px;overflow:hidden;}
        .bar-fill{height:100%;border-radius:4px;transition:width .4s;}
        .bar-val{font-size:11px;font-weight:600;color:#1E3A5F;width:80px;text-align:right;flex-shrink:0;}
        .set-section{background:#fff;border-radius:8px;border:1px solid #E5E7EB;padding:14px;margin-bottom:12px;}
        .set-label{font-size:10px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;display:block;}
        .set-inp{border:1.5px solid #E5E7EB;border-radius:6px;padding:7px 9px;font-size:12px;font-family:inherit;color:#111827;background:#F9FAFB;outline:none;width:100%;}
        .set-inp:focus{border-color:#2B5393;background:#fff;}
        .mob-ovl{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:200;}
        .mob-drawer{position:absolute;left:0;top:0;bottom:0;width:210px;background:#1E3A5F;display:flex;flex-direction:column;}
        .pempty{text-align:center;padding:28px 14px;color:#9AA3B0;font-size:12px;}
        .success-bar{background:#F0FDF4;color:#15803D;padding:7px 12px;font-size:12px;font-weight:600;border-bottom:1px solid #BBF7D0;}
        .cust-sel-item{display:flex;align-items:center;gap:7px;padding:6px 7px;border-radius:6px;cursor:pointer;border:1px solid #E2E6EA;margin-bottom:4px;}
        .cust-sel-item:hover,.cust-sel-item.selected{border-color:#2B5393;background:#EBF2FC;}
        .chart-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;}
        .chart-box{background:#fff;border-radius:8px;border:1px solid #E5E7EB;padding:12px;}
        .period-btn{padding:4px 10px;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;border:1px solid #E5E7EB;background:#F9FAFB;color:#4A5568;transition:all .15s;}
        .period-btn.active{background:#1E3A5F;color:#fff;border-color:#1E3A5F;}
        @media(max-width:1100px){.pstats{grid-template-columns:repeat(2,1fr);}.rep-grid{grid-template-columns:repeat(2,1fr);}.pmod-grid{grid-template-columns:1fr 1fr;}}
        @media(max-width:900px){.pos-right{width:240px;}.chart-grid{grid-template-columns:1fr;}}
        @media(max-width:640px){
             html{overflow:hidden;}
             body{overflow:hidden;}
           .pos-list-scroll-x::-webkit-scrollbar,
           div[style*="overflowX"]::-webkit-scrollbar { height: 8px !important; display: block !important; }
           div[style*="overflowX"]::-webkit-scrollbar-thumb { background: #2B5393 !important; border-radius: 4px !important; }
           div[style*="overflowX"]::-webkit-scrollbar-track { background: #E5E7EB !important; }
           .pnav-item{ font-size: 14px; padding: 10px 15px; gap: 11px; }
           .pnav-icon svg{ width: 17px; height: 17px; }
          .ptopbar{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;}
          .ptopbar::-webkit-scrollbar{display:none;}
          .pw{padding:0;align-items:flex-start;height:auto;min-height:100vh;}
          .pwin{border-radius:0;box-shadow:none;height:100dvh;max-width:100%;}
          .pnav{display:none!important;}
          .mob-ovl.open{display:block;}
          .ptopbar{height:48px;padding:0 10px;}
          .pcontent{padding:8px 6px;}
          .pstats{grid-template-columns:repeat(2,1fr);gap:6px;}
          .pstat{padding:8px 10px;}
          .pos-wrap{flex-direction:column;height:auto;gap:8px;}
          .pos-left{height:auto;overflow:hidden;min-width:0;}
          .pos-right{width:100%;position:sticky;top:8px;max-height:70vh;}
          .pos-list-outer{max-height:340px;}
          .pmod-grid{grid-template-columns:1fr;}
          .pmod-grid .pmod-col:last-child{display:none;}
          .rep-grid{grid-template-columns:1fr 1fr;}
          .chart-grid{grid-template-columns:1fr;}
          .ptb-biz-name{display:none;}
        }
        @media(max-width:480px){.pstats{grid-template-columns:1fr 1fr;}.rep-grid{grid-template-columns:1fr;}}
      `}</style>

      {/* Hidden CSV file input */}
      <input ref={csvInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCSVImport} />

      <div className="pw">
        <div className="pwin">
          <div className="ptb">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="pdots">
                <button className="pdot" style={{ background: '#FF5F57' }} onClick={() => window.close()} />
                <button className="pdot" style={{ background: '#FFBD2E' }} onClick={() => {}} />
                <button className="pdot" style={{ background: '#28CA41' }} onClick={handleMaximize} />
              </div>
              <span className="ptb-biz-name" style={{ color: '#90aac8', fontSize: 11 }}>DevnovaTech POS ; {bizName}</span>
            </div>
            <span style={{ color: '#aac4e0', fontSize: isMobile ? 9 : 11 }}>{fmtD(time)} | {fmtT(time)}</span>
          </div>
          <div className="prs" />

          <div className="pbody">
            <div className="pnav" style={{ width: sidebarOpen ? '185px' : '46px' }}>
              <div className="pnav-logo">
                <div className="pnav-biz-av">{getInitials(bizName)}</div>
                {sidebarOpen && <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{bizName}</div>
                  <div style={{ fontSize: 8, letterSpacing: 2, color: '#8BAAC8' }}>PHARMACY POS</div>
                </div>}
              </div>
              <div className="pnav-items">
                {NAV.map(n => (
                  <div key={n.id} className={`pnav-item${tab === n.id ? ' active' : ''}`} onClick={() => { setTab(n.id); localStorage.setItem('pos_tab', n.id) }}>
                    <span className="pnav-icon"><SI d={PATHS[n.id] || PATHS.dashboard} size={14} color={tab === n.id ? '#fff' : '#8BAAC8'} /></span>
                    {sidebarOpen && <span>{n.label}</span>}
                  </div>
                ))}
              </div>
              <div className="pnav-foot">
                <div className="pnav-user">
                  <div className="pnav-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                  {sidebarOpen && <>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 10, color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                      <div style={{ fontSize: 9, color: '#8BAAC8', textTransform: 'capitalize' }}>{user?.role}</div>
                    </div>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8BAAC8', padding: 2, display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#DC2626'} onMouseLeave={e => e.currentTarget.style.color = '#8BAAC8'}>
                      <SI d={PATHS.logout} size={13} />
                    </button>
                  </>}
                </div>
              </div>
            </div>

            <div className={`mob-ovl${mobileNavOpen ? ' open' : ''}`} onClick={() => setMobileNavOpen(false)}>
              <div className="mob-drawer" onClick={e => e.stopPropagation()}>
                <div className="pnav-logo" style={{ padding: 12 }}>
                  <div className="pnav-biz-av">{getInitials(bizName)}</div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{bizName}</div>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: '#8BAAC8' }}>PHARMACY POS</div>
                  </div>
                  <button onClick={() => setMobileNavOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8BAAC8', display: 'flex', padding: 4 }}>
                    <SI d={PATHS.close} size={15} />
                  </button>
                </div>
                <div className="pnav-items">
                  {NAV.map(n => (
                    <div key={n.id} className={`pnav-item${tab === n.id ? ' active' : ''}`} onClick={() => handleNavClick(n.id)}>
                      <span className="pnav-icon"><SI d={PATHS[n.id] || PATHS.dashboard} size={14} color={tab === n.id ? '#fff' : '#8BAAC8'} /></span>
                      <span>{n.label}</span>
                    </div>
                  ))}
                </div>
                <div className="pnav-foot">
                  <div className="pnav-user">
                    <div className="pnav-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>{user?.name}</div>
                      <div style={{ fontSize: 9, color: '#8BAAC8', textTransform: 'capitalize' }}>{user?.role}</div>
                    </div>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8BAAC8', padding: 2, display: 'flex' }}>
                      <SI d={PATHS.logout} size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pmain">
              <div className="ptopbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <button onClick={() => isMobile ? setMobileNavOpen(o => !o) : setSidebarOpen(o => !o)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', padding: 3 }}>
                    <SI d={PATHS.menu} size={24} />
                  </button>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1E3A5F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: isMobile ? 120 : 300 }}>
                    {NAV.find(n => n.id === tab)?.label || NAV_ADMIN.find(n => n.id === tab)?.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
                  {tab === 'products' && isAdmin && <>
                    <button className="pbtn-ghost" onClick={() => setShowAddCat(true)} style={{ fontSize: 'clamp(9px,2.5vw,11px)', padding: 'clamp(3px,1vw,5px) clamp(6px,2vw,10px)' }}>
                      <SI d={PATHS.folder} size={11} /> <span className="btn-label-text">Category</span>
                    </button>
                    <button className="pbtn" onClick={openAddProd} style={{ fontSize: 'clamp(9px,2.5vw,11px)', padding: 'clamp(4px,1vw,6px) clamp(8px,2vw,12px)' }}>
                      <span>Add Product</span>
                    </button>
                  </>}
                  {tab === 'cashiers' && isAdmin && <button className="pbtn" onClick={() => setShowAddCash(true)}><SI d={PATHS.plus} size={11} color="#fff" /><span>Add Cashier</span></button>}
                  {tab === 'customers' && <button className="pbtn" onClick={openAddCust}><SI d={PATHS.plus} size={11} color="#fff" /><span>Add Customer</span></button>}
                  {tab === 'expenses' && isAdmin && <button className="pbtn" onClick={() => { setExpForm({ category: '', description: '', amount: '', date: new Date().toISOString().split('T')[0], payment_method: 'cash' }); setShowAddExp(true) }}><SI d={PATHS.plus} size={11} color="#fff" /><span>Add Expense</span></button>}
                  {tab === 'reports' && isAdmin && <button className="pbtn" onClick={fetchReport} disabled={loadingReport}><SI d={PATHS.chartbar} size={11} color="#fff" /><span>{loadingReport ? 'Loading…' : 'Generate'}</span></button>}
                  {tab === 'audit' && isAdmin && <button className="pbtn-ghost" onClick={fetchAuditLogs} style={{ fontSize: 10 }}><SI d={PATHS.refresh} size={11} /> Refresh</button>}
                </div>
              </div>

              <div className="pcontent">

                {/* DASHBOARD */}
                {tab === 'dashboard' && isAdmin && (
                  <>
                    <div className="pstats">
                      {[
                        { label: "Today's Sales", value: loadingStats ? '…' : todayTxnCount, sub: 'Transactions today' },
                        { label: "Today's Revenue", value: loadingStats ? '…' : fmtKES(todayRevenue), sub: 'Gross revenue today', big: true },
                        { label: 'Total Products', value: loadingStats ? '…' : stats?.total_products ?? products.length, sub: `${lowStock.length} low stock` },
                        { label: 'Customers', value: loadingStats ? '…' : stats?.total_customers ?? customers.length, sub: 'Registered' },
                      ].map(s => (
                        <div className="pstat" key={s.label}>
                          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                          <div style={{ fontSize: s.big ? 'clamp(13px,2.5vw,20px)' : 'clamp(16px,3.5vw,24px)', fontWeight: 700, color: '#1E3A5F', lineHeight: 1, wordBreak: 'break-all' }}>{s.value}</div>
                          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3 }}>{s.sub}</div>
                        </div>
                      ))}
                    </div>

                    <div className="pcard" style={{ marginBottom: 12 }}>
                      <div className="pcard-head">
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F' }}>Today's Sales ; {fmtD(new Date())}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button className="pbtn-ghost" onClick={fetchTodaySales} style={{ fontSize: 10 }}>
                            <SI d={PATHS.refresh} size={11} color="#6B7280" /> Refresh
                          </button>
                          <button className="pbtn" onClick={() => setTab('sales')} style={{ fontSize: 10 }}>View All →</button>
                        </div>
                      </div>
                      {loadingTodaySales ? <div className="pempty">Loading…</div> : todaySalesList.length === 0 ? <div className="pempty">No sales today yet.</div> : (
                        <div className="tbl-wrap">
                          <table className="pt">
                            <thead><tr><th>Receipt</th><th>Cashier</th><th>Total</th><th>Method</th><th>Time</th><th>Actions</th></tr></thead>
                            <tbody>
                              {todaySalesList.slice(0, 8).map(s => (
                                <tr key={s.id}>
                                  <td style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B7280' }}>{s.receipt_number}</td>
                                  <td style={{ fontSize: 11 }}>{s.cashier_name || ';'}</td>
                                  <td style={{ fontWeight: 700, color: '#1E3A5F' }}>{fmtKES(s.total_amount)}</td>
                                  <td><span className="pbadge" style={{ background: '#EFF6FF', color: '#1E40AF', borderColor: '#BFDBFE', textTransform: 'capitalize' }}>{s.payment_method}</span></td>
                                  <td style={{ fontSize: 10, color: '#9CA3AF' }}>{new Date(s.created_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</td>
                                  <td>
                                    <div style={{ display: 'flex', gap: 3 }}>
                                      <button className="pbtn-blue" onClick={() => setReprintReceipt(s)} title="Reprint"><SI d={PATHS.print} size={10} color="#2B5393" /></button>
                                      <button className="pbtn-orange" onClick={() => handleReturn(s)} title="Return"><SI d={PATHS.returns} size={10} color="#EA580C" /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div style={{ padding: '8px 12px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', fontSize: 11, flexWrap: 'wrap', gap: 8 }}>
                            <span style={{ color: '#9CA3AF' }}>Transactions: <b style={{ color: '#1E3A5F' }}>{todaySalesList.length}</b></span>
                            <span style={{ color: '#9CA3AF' }}>Total Revenue: <b style={{ color: '#16A34A' }}>{fmtKES(todayRevenue)}</b></span>
                          </div>
                        </div>
                      )}
                    </div>

                    {lowStock.length > 0 && (
                      <div className="pcard">
                        <div className="pcard-head">
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <SI d={PATHS.alert} size={13} color="#DC2626" /> Low Stock ({lowStock.length})
                          </span>
                        </div>
                        <div className="tbl-wrap">
                          <table className="pt">
                            <thead><tr><th>Product</th><th>Stock</th><th>Reorder</th><th>Unit</th></tr></thead>
                            <tbody>
                              {lowStock.map(p => (
                                <tr key={p.id}>
                                  <td><div style={{ fontWeight: 600, color: '#1E3A5F' }}>{p.name}</div><div style={{ fontSize: 10, color: '#9CA3AF' }}>{p.category || ';'}</div></td>
                                  <td><span className="pbadge" style={{ background: '#FEF2F2', color: '#DC2626', borderColor: '#FECACA' }}>{p.stock_quantity}</span></td>
                                  <td>{p.reorder_level}</td>
                                  <td>{p.unit || ';'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* POS */}
                {tab === 'pos' && (
                  <div className="pos-wrap" style={{ height: isMobile ? 'auto' : 'calc(100vh - 168px)' }}>
                    <div className="pos-left">
                      <div style={{ background: '#fff', borderRadius: 7, border: '1px solid #E5E7EB', padding: '7px 9px', display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, overflow: 'visible', minWidth: 0 }}>
                        <div style={{ position: 'relative', minWidth: 0, width: '100%' }}>
                          <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><SI d={PATHS.search} size={12} color="#9AA3B0" /></span>
                          <input style={{ ...inp, paddingLeft: 28, fontSize: 11, width: '100%', minWidth: 0 }} placeholder="Search by name, generic name or barcode…" value={posSearch} onChange={e => setPosSearch(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                          <div className="cat-bar">
                            {POS_CATS.map(c => <button key={c} className={`cat-tab${posCat === c ? ' active' : ''}`} onClick={() => setPosCat(c)}>{c === 'all' ? 'All' : c}</button>)}
                          </div>
                          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                            {[['list', PATHS.list], ['grid', PATHS.grid]].map(([v, d]) => (
                              <button key={v} onClick={() => setPosView(v)} style={{ width: 25, height: 25, borderRadius: 4, border: '1px solid #E2E6EA', background: posView === v ? '#1E3A5F' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <SI d={d} size={11} color={posView === v ? '#fff' : '#9AA3B0'} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                     {posView === 'list' && (
  <div style={{
    background: '#fff',
    borderRadius: 8,
    border: '1px solid #E5E7EB',
    maxHeight: isMobile ? '340px' : 'calc(100vh - 280px)',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',
  }}>
    {/* This wrapper is the ONLY element that scrolls — both X and Y */}
    <div style={{
      overflowX: 'scroll',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      
      flex: 1,
      // Force scrollbar to always show on all platforms
      scrollbarWidth: 'thin',        /* Firefox */
      scrollbarColor: '#2B5393 #E5E7EB',
    }}>
      <table
        className="pos-list-table"
        style={{
          /* This is the key fix: table must be wider than viewport to FORCE overflow */
          minWidth: '700px',
          width: 'max-content',      /* ← grow to content, never shrink */
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr>
            <th style={{ minWidth: 180 }}>Product</th>
            <th style={{ minWidth: 110 }}>Category</th>
            <th style={{ minWidth: 110 }}>Price</th>
            <th style={{ minWidth: 90 }}>Stock</th>
            <th style={{ minWidth: 50 }}></th>
          </tr>
        </thead>
        <tbody>
          {posProducts.length === 0
            ? <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9AA3B0', padding: 18 }}>No products found</td></tr>
            : posProducts.map(p => (
              <tr key={p.id} className={p.stock_quantity < 1 ? 'out-row' : ''} onClick={() => addToCart(p)}>
                <td><div style={{ fontWeight: 600, color: '#1E3A5F', fontSize: 11 }}>{p.name}</div><div style={{ fontSize: 9, color: '#9AA3B0' }}>{p.generic_name || '—'}</div></td>
                <td style={{ fontSize: 10, color: '#9AA3B0' }}>{p.category || '—'}</td>
                <td style={{ fontWeight: 700, color: '#2B5393', fontSize: 11 }}>{fmtKES(p.selling_price)}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 7px', borderRadius: 999, fontSize: 9, fontWeight: 600, background: p.stock_quantity < 1 ? '#FEF2F2' : Number(p.stock_quantity) <= Number(p.reorder_level) ? '#FFF7ED' : '#F0FDF4', color: p.stock_quantity < 1 ? '#DC2626' : Number(p.stock_quantity) <= Number(p.reorder_level) ? '#EA580C' : '#16A34A' }}>
                    {p.stock_quantity < 1 ? 'Out' : `${p.stock_quantity} ${p.unit || ''}`}
                  </span>
                </td>
                <td>
                  <button disabled={p.stock_quantity < 1} onClick={e => { e.stopPropagation(); addToCart(p) }}
                    style={{ width: 24, height: 24, borderRadius: 4, background: p.stock_quantity < 1 ? '#E2E6EA' : '#2B5393', border: 'none', cursor: p.stock_quantity < 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
                    <SI d={PATHS.plus} size={11} color="#fff" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
)}

                      {posView === 'grid' && (
                        <div className="pos-grid-wrap">
                          <div className="pos-grid">
                            {posProducts.length === 0
                              ? <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#9AA3B0', fontSize: 12, padding: 18 }}>No products found</div>
                              : posProducts.map((p, i) => {
                                const c = getColor(i)
                                const sl = p.stock_quantity < 1 ? 'out2' : Number(p.stock_quantity) <= Number(p.reorder_level) ? 'low' : ''
                                return (
                                  <div key={p.id} className={`pcard2${p.stock_quantity < 1 ? ' out' : ''}`} onClick={() => addToCart(p)}>
                                    <div className="pcard2__img" style={{ background: `${c}18` }}>
                                      <SI d={PATHS.pill} size={18} color={c} />
                                    </div>
                                    <div className="pcard2__name">{p.name}</div>
                                    <div className="pcard2__price">{fmtKES(p.selling_price)}</div>
                                    <div className={`pcard2__stock${sl ? ' ' + sl : ''}`}>Stock: {p.stock_quantity} {p.unit || ''}</div>
                                    {p.stock_quantity < 1 && <span className="pcard2__badge">Out</span>}
                                  </div>
                                )
                              })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pos-right">
                      <div className="cart-panel" style={{ minHeight: isMobile ? 380 : 'auto' }}>
                        <div className="cart-hdr">
                          <div className="cart-title-row">
                            <div className="cart-title-txt">
                              <SI d={PATHS.cart} size={12} color="#4A5568" />
                              Cart <span className="cart-cnt">{cart.reduce((s, i) => s + i.qty, 0)}</span>
                            </div>
                            {cart.length > 0 && <button className="btn-clear" onClick={() => setCart([])}><SI d={PATHS.trash} size={10} color="#DC2626" /> Clear</button>}
                          </div>
                          <div style={{ display: 'flex', gap: 8, fontSize: 10, color: '#4A5568' }}>
                            <span>Sales: <b style={{ color: '#16A34A' }}>{fmtKES(todaySales)}</b></span>
                            <span>· Txn: <b>{txnCount}</b></span>
                          </div>
                        </div>
                        <div className="cart-items">
                          {cart.length === 0
                            ? <div className="cart-empty"><SI d={PATHS.cart} size={30} color="#E2E6EA" /><p style={{ fontSize: 11 }}>Cart is empty.<br />Click a product to add.</p></div>
                            : cart.map(item => (
                              <div key={item.id} className="cart-item">
                                <div className="cart-item__info">
                                  <div className="cart-item__name">{item.name}</div>
                                  <div className="cart-item__unit">{fmtKES(item.selling_price)} each</div>
                                </div>
                                <div className="qty-ctrl">
                                  <button className="qty-btn minus" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                                  <span className="qty-val">{item.qty}</span>
                                  <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                                </div>
                                <div className="cart-item__price">{fmtKES(Number(item.selling_price) * item.qty)}</div>
                                <button className="cart-item__rm" onClick={() => removeFromCart(item.id)}><SI d={PATHS.close} size={9} /></button>
                              </div>
                            ))}
                        </div>
                        <div className="cart-footer">
                          <div className="cart-row"><span className="cart-lbl">Subtotal</span><span className="cart-val">{fmtKES(cartSubtotal)}</span></div>
                          <div className="cart-row">
                            <span className="cart-lbl">Discount</span>
                            <div className="disc-wrap">
                              <input className="disc-input" type="number" value={discount} min="0" onChange={e => setDiscount(e.target.value)} />
                              <select className="disc-type" value={discType} onChange={e => setDiscType(e.target.value)}>
                                <option value="fixed">KES</option>
                                <option value="percent">%</option>
                              </select>
                            </div>
                          </div>
                          <div className="cart-row"><span className="cart-lbl">Tax (16%)</span><span className="cart-val">{fmtKES(vatAmt)}</span></div>
                          <div className="cart-divider" />
                          <div className="cart-total-row">
                            <span className="cart-total-lbl">Total</span>
                            <span className="cart-total-val">{fmtKES(cartTotal)}</span>
                          </div>
                          <div className="cart-actions">
                            <button className="btn-hold" onClick={() => alert('Hold Sale ; coming soon')}><SI d={PATHS.hold} size={11} /> Hold</button>
                            <button className="btn-checkout" disabled={cart.length === 0} onClick={() => setShowPayModal(true)}>Checkout <SI d={PATHS.check} size={11} color="#fff" /></button>
                          </div>
                        </div>
                        <div className="qa-wrap">
                          <div className="qa-title">Quick Actions</div>
                          <div className={`qa-grid${isAdmin ? ' admin-qa' : ''}`}>
                            {QA_LIST.map((q, i) => (
                              <button key={i} className="qa-btn" onClick={q.fn}>
                                <div className="qa-icon" style={{ background: q.bg }}>
                                  <SI d={q.icon} size={11} color={q.color} />
                                </div>
                                <span className="qa-lbl">{q.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PRODUCTS */}
                {tab === 'products' && (
                  <div className="pcard">
                    <div className="pcard-head">
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F' }}>Products ({products.length})</span>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><SI d={PATHS.search} size={11} color="#9AA3B0" /></span>
                        <input style={{ ...inp, paddingLeft: 26, width: 180, padding: '5px 7px 5px 26px', fontSize: 11 }} placeholder="Search…" value={prodSearch} onChange={e => setProdSearch(e.target.value)} />
                      </div>
                    </div>
                    {loadingProds ? <div className="pempty">Loading…</div> : filteredProds.length === 0 ? <div className="pempty">No products found.</div> : (
                      <div className="tbl-wrap">
                        <table className="pt" style={{ minWidth: 560 }}>
                          <thead><tr><th>#</th><th>Product</th><th>Category</th><th>Buying</th><th>Selling</th><th>Stock</th><th>Expiry</th>{isAdmin && <th>Actions</th>}</tr></thead>
                          <tbody>
                            {filteredProds.map((p, i) => (
                              <tr key={p.id}>
                                <td style={{ color: '#D1D5DB', fontSize: 10 }}>{i + 1}</td>
                                <td><div style={{ fontWeight: 600, color: '#1E3A5F', fontSize: 11 }}>{p.name}</div><div style={{ fontSize: 9, color: '#9CA3AF' }}>{p.generic_name || ';'}</div></td>
                                <td style={{ fontSize: 11 }}>{p.category || ';'}</td>
                                <td style={{ fontSize: 11 }}>{fmtKES(p.buying_price)}</td>
                                <td style={{ fontWeight: 600, fontSize: 11 }}>{fmtKES(p.selling_price)}</td>
                                <td><span className="pbadge" style={{ background: p.stock_quantity <= p.reorder_level ? '#FEF2F2' : '#F0FDF4', color: p.stock_quantity <= p.reorder_level ? '#DC2626' : '#16A34A', borderColor: p.stock_quantity <= p.reorder_level ? '#FECACA' : '#BBF7D0' }}>{p.stock_quantity} {p.unit || ''}</span></td>
                                <td style={{ fontSize: 10, color: p.expiry_date && new Date(p.expiry_date) < new Date() ? '#DC2626' : '#374151' }}>{p.expiry_date || ';'}</td>
                                {isAdmin && (
                                  <td>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                      <button className="pbtn-ghost" onClick={() => openEditProd(p)}><SI d={PATHS.edit} size={11} /> Edit</button>
                                      <button className="pbtn-danger" onClick={() => handleDeleteProd(p.id)}><SI d={PATHS.trash} size={11} color="#DC2626" /> Del</button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* SALES HISTORY */}
                {tab === 'sales' && (
                  <div className="pcard">
                    <div className="pcard-head">
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F' }}>
                        {isAdmin ? 'Sales History ; All Cashiers' : `My Sales Today (${fmtD(new Date())})`}
                      </span>
                      {isAdmin && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, color: '#9CA3AF' }}>From:</span>
                          <input type="date" value={salesDateFrom} onChange={e => setSalesDateFrom(e.target.value)} style={{ border: '1.5px solid #E5E7EB', borderRadius: 5, padding: '4px 7px', fontSize: 11, fontFamily: 'inherit', color: '#111', background: '#F9FAFB', outline: 'none' }} />
                          <span style={{ fontSize: 11, color: '#9CA3AF' }}>To:</span>
                          <input type="date" value={salesDateTo} onChange={e => setSalesDateTo(e.target.value)} style={{ border: '1.5px solid #E5E7EB', borderRadius: 5, padding: '4px 7px', fontSize: 11, fontFamily: 'inherit', color: '#111', background: '#F9FAFB', outline: 'none' }} />
                          <button className="pbtn-ghost" onClick={fetchSales} style={{ fontSize: 10 }}><SI d={PATHS.refresh} size={11} /> Refresh</button>
                          {(salesDateFrom || salesDateTo) && <button className="pbtn-ghost" onClick={() => { setSalesDateFrom(''); setSalesDateTo(''); }} style={{ fontSize: 10 }}>Clear</button>}
                        </div>
                      )}
                    </div>
                    {loadingSales ? <div className="pempty">Loading…</div> : sales.length === 0 ? <div className="pempty">{isAdmin ? 'No sales found.' : 'No sales made today.'}</div> : (
                      <div className="tbl-wrap">
                        <table className="pt" style={{ minWidth: 520 }}>
                          <thead><tr><th>Receipt</th>{isAdmin && <th>Cashier</th>}<th>Customer</th><th>Total</th><th>Paid</th><th>Change</th><th>Method</th><th>Time</th><th>Actions</th></tr></thead>
                          <tbody>
                            {sales.map(s => (
                              <tr key={s.id}>
                                <td style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B7280' }}>{s.receipt_number}</td>
                                {isAdmin && <td style={{ fontSize: 11 }}>{s.cashier_name || ';'}</td>}
                                <td style={{ fontSize: 11, color: s.customer_name ? '#1E3A5F' : '#9CA3AF' }}>{s.customer_name || ';'}</td>
                                <td style={{ fontWeight: 700, color: '#1E3A5F', fontSize: 11 }}>{fmtKES(s.total_amount)}</td>
                                <td style={{ fontSize: 11 }}>{fmtKES(s.amount_paid)}</td>
                                <td style={{ fontSize: 11 }}>{fmtKES(s.change_given)}</td>
                                <td><span className="pbadge" style={{ background: '#EFF6FF', color: '#1E40AF', borderColor: '#BFDBFE', textTransform: 'capitalize' }}>{s.payment_method}</span></td>
                                <td style={{ fontSize: 10, color: '#9CA3AF' }}>{new Date(s.created_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</td>
                                <td>
                                  <div style={{ display: 'flex', gap: 3 }}>
                                    <button className="pbtn-blue" onClick={() => setReprintReceipt(s)} title="Reprint"><SI d={PATHS.print} size={10} color="#2B5393" /></button>
                                    <button className="pbtn-orange" onClick={() => handleReturn(s)} title="Return"><SI d={PATHS.returns} size={10} color="#EA580C" /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div style={{ padding: '8px 12px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', fontSize: 11, flexWrap: 'wrap', gap: 8 }}>
                          <span style={{ color: '#9CA3AF' }}>Transactions: <b style={{ color: '#1E3A5F' }}>{sales.length}</b></span>
                          <span style={{ color: '#9CA3AF' }}>Total Revenue: <b style={{ color: '#16A34A' }}>{fmtKES(sales.reduce((s, r) => s + Number(r.total_amount), 0))}</b></span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CUSTOMERS */}
                {tab === 'customers' && (
                  <div className="pcard">
                    <div className="pcard-head">
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F' }}>Customers ({customers.length})</span>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><SI d={PATHS.search} size={11} color="#9AA3B0" /></span>
                        <input style={{ ...inp, paddingLeft: 26, width: 170, padding: '5px 7px 5px 26px', fontSize: 11 }} placeholder="Search…" value={custSearch} onChange={e => setCustSearch(e.target.value)} />
                      </div>
                    </div>
                    {custSuccess && <div className="success-bar">{custSuccess}</div>}
                    {loadingCusts ? <div className="pempty">Loading…</div> : filteredCusts.length === 0 ? (
                      <div className="pempty">No customers. <span style={{ color: '#DC2626', cursor: 'pointer', fontWeight: 600 }} onClick={openAddCust}>Add first →</span></div>
                    ) : (
                      <div className="tbl-wrap">
                        <table className="pt" style={{ minWidth: 400 }}>
                          <thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Address</th><th>Actions</th></tr></thead>
                          <tbody>
                            {filteredCusts.map((c, i) => (
                              <tr key={c.id}>
                                <td style={{ color: '#D1D5DB', fontSize: 10 }}>{i + 1}</td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#EBF2FC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2B5393', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{c.name?.charAt(0).toUpperCase()}</div>
                                    <span style={{ fontWeight: 600, color: '#1E3A5F', fontSize: 11 }}>{c.name}</span>
                                  </div>
                                </td>
                                <td style={{ fontSize: 11 }}>{c.phone || ';'}</td>
                                <td style={{ fontSize: 11, color: '#6B7280' }}>{c.email || ';'}</td>
                                <td style={{ fontSize: 11, color: '#6B7280' }}>{c.address || ';'}</td>
                                <td>
                                  <div style={{ display: 'flex', gap: 4 }}>
                                    <button className="pbtn-ghost" onClick={() => openEditCust(c)}><SI d={PATHS.edit} size={11} /> Edit</button>
                                    {isAdmin && <button className="pbtn-danger" onClick={() => handleDeleteCustomer(c.id)}><SI d={PATHS.trash} size={11} color="#DC2626" /> Del</button>}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* CASHIERS */}
                {tab === 'cashiers' && isAdmin && (
                  <div className="pcard">
                    <div className="pcard-head">
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F' }}>Cashiers ({cashiers.length})</span>
                    </div>
                    {cashSuccess && <div className="success-bar">{cashSuccess}</div>}
                    {loadingCash ? <div className="pempty">Loading…</div> : cashiers.length === 0 ? (
                      <div className="pempty">No cashiers. <span style={{ color: '#DC2626', cursor: 'pointer', fontWeight: 600 }} onClick={() => setShowAddCash(true)}>Add first →</span></div>
                    ) : (
                      <div className="tbl-wrap">
                        <table className="pt" style={{ minWidth: 380 }}>
                          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
                          <tbody>
                            {cashiers.map((c, i) => (
                              <tr key={c.id}>
                                <td style={{ color: '#D1D5DB', fontSize: 10 }}>{i + 1}</td>
                                <td>
                                  <div style={{ fontWeight: 600, color: '#1E3A5F', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#2B5393', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{c.name?.charAt(0).toUpperCase()}</div>
                                    {c.name}
                                  </div>
                                </td>
                                <td style={{ fontSize: 11, color: '#6B7280' }}>{c.email}</td>
                                <td><span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: c.is_active == 1 ? '#16A34A' : '#DC2626', display: 'inline-block', marginRight: 4 }} />{c.is_active == 1 ? 'Active' : 'Inactive'}</span></td>
                                <td><button className="pbtn-danger" onClick={() => handleDeleteCashier(c.id)}><SI d={PATHS.trash} size={11} color="#DC2626" /> Remove</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* EXPENSES */}
                {tab === 'expenses' && isAdmin && (
                  <>
                    {expSuccess && <div style={{ background: '#F0FDF4', color: '#15803D', padding: '7px 12px', fontSize: 12, borderRadius: 7, marginBottom: 10, border: '1px solid #BBF7D0', fontWeight: 600 }}>{expSuccess}</div>}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                      <div className="pstat" style={{ flex: 1, minWidth: 150 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Total This Month</div>
                        <div style={{ fontSize: 'clamp(16px,4vw,22px)', fontWeight: 700, color: '#DC2626' }}>{fmtKES(totalExpenses)}</div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3 }}>{expenses.length} records</div>
                      </div>
                      <div className="pstat" style={{ flex: 1, minWidth: 150 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Filter Month</div>
                        <input type="month" value={expMonth} onChange={e => setExpMonth(e.target.value)} style={{ ...inp, marginTop: 3 }} />
                      </div>
                    </div>
                    {expenses.length > 0 && (
                      <div className="chart-grid">
                        <div className="chart-box">
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#1E3A5F', marginBottom: 10 }}>By Category</div>
                          <BarChart data={expByCategory} color="#EA580C" height={130} />
                        </div>
                        <div className="chart-box">
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#1E3A5F', marginBottom: 10 }}>Distribution</div>
                          <DonutChart data={expDonutData} size={90} />
                        </div>
                      </div>
                    )}
                    <div className="pcard">
                      <div className="pcard-head">
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F' }}>Expenses ; {expMonth}</span>
                      </div>
                      {loadingExp ? <div className="pempty">Loading…</div> : expenses.length === 0 ? (
                        <div className="pempty">No expenses for {expMonth}. <span style={{ color: '#DC2626', cursor: 'pointer', fontWeight: 600 }} onClick={() => setShowAddExp(true)}>Add first →</span></div>
                      ) : (
                        <div className="tbl-wrap">
                          <table className="pt" style={{ minWidth: 460 }}>
                            <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th><th>Method</th><th>Actions</th></tr></thead>
                            <tbody>
                              {expenses.map(e => (
                                <tr key={e.id}>
                                  <td style={{ fontSize: 10 }}>{e.date}</td>
                                  <td><span className="pbadge" style={{ background: '#FFF7ED', color: '#EA580C', borderColor: '#FED7AA' }}>{e.category}</span></td>
                                  <td style={{ color: '#6B7280', fontSize: 11 }}>{e.description || ';'}</td>
                                  <td style={{ fontWeight: 700, color: '#DC2626', fontSize: 11 }}>{fmtKES(e.amount)}</td>
                                  <td style={{ fontSize: 10, textTransform: 'capitalize' }}>{e.payment_method}</td>
                                  <td><button className="pbtn-danger" onClick={() => handleDeleteExpense(e.id)}><SI d={PATHS.trash} size={11} color="#DC2626" /> Del</button></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* REPORTS */}
                {tab === 'reports' && isAdmin && (
                  <>
                    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB', padding: '10px 13px', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F', marginRight: 4 }}>Period:</span>
                        {[['today', 'Today'], ['week', 'This Week'], ['month', 'This Month'], ['year', 'This Year'], ['custom', 'Custom']].map(([v, l]) => (
                          <button key={v} className={`period-btn${reportPeriod === v ? ' active' : ''}`}
                            onClick={() => {
                              setReportPeriod(v)
                              const today = new Date().toISOString().split('T')[0]
                              const now = new Date()
                              if (v === 'today') { setReportRange({ from: today, to: today }) }
                              if (v === 'week') {
                                const mon = new Date(now); mon.setDate(now.getDate() - now.getDay() + 1)
                                setReportRange({ from: mon.toISOString().split('T')[0], to: today })
                              }
                              if (v === 'month') { setReportRange({ from: today.slice(0, 8) + '01', to: today }) }
                              if (v === 'year') { setReportRange({ from: today.slice(0, 5) + '01-01', to: today }) }
                            }}>{l}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>From:</span>
                        <input type="date" value={reportRange.from} onChange={e => { setReportPeriod('custom'); setReportRange(r => ({ ...r, from: e.target.value })) }} style={{ border: '1.5px solid #E5E7EB', borderRadius: 5, padding: '4px 7px', fontSize: 11, fontFamily: 'inherit', color: '#111', background: '#F9FAFB', outline: 'none' }} />
                        <span style={{ color: '#9CA3AF', fontSize: 11 }}>To:</span>
                        <input type="date" value={reportRange.to} onChange={e => { setReportPeriod('custom'); setReportRange(r => ({ ...r, to: e.target.value })) }} style={{ border: '1.5px solid #E5E7EB', borderRadius: 5, padding: '4px 7px', fontSize: 11, fontFamily: 'inherit', color: '#111', background: '#F9FAFB', outline: 'none' }} />
                        <button className="pbtn" onClick={fetchReport} disabled={loadingReport}>
                          <SI d={PATHS.chartbar} size={11} color="#fff" /> {loadingReport ? 'Loading…' : 'Generate Report'}
                        </button>
                      </div>
                    </div>

                    {loadingReport && <div className="pempty">Generating report…</div>}
                    {!loadingReport && !reportData && <div className="pempty">Select a period and click Generate Report.</div>}

                    {!loadingReport && reportData && (
                      <>
                        <div className="rep-grid">
                          {[
                            { label: 'Total Revenue', value: fmtKES(reportData.total_revenue || 0), color: '#16A34A', icon: PATHS.trend },
                            { label: 'Gross Profit', value: fmtKES(reportData.gross_profit || 0), color: '#0891B2', icon: PATHS.chartline },
                            { label: 'Net Profit', value: fmtKES(reportData.net_profit || 0), color: '#7C3AED', icon: PATHS.chartline },
                            { label: 'Total Expenses', value: fmtKES(reportData.total_expenses || 0), color: '#DC2626', icon: PATHS.expenses },
                            { label: 'Transactions', value: reportData.total_transactions || 0, color: '#2B5393', icon: PATHS.receipt },
                            { label: 'Tax Collected', value: fmtKES(reportData.total_tax || 0), color: '#EA580C', icon: PATHS.percent },
                            { label: 'Avg Sale', value: fmtKES(reportData.avg_sale || 0), color: '#7C3AED', icon: PATHS.chartline },
                            { label: 'Discounts', value: fmtKES(reportData.total_discount || 0), color: '#9CA3AF', icon: PATHS.tag },
                          ].map(c => (
                            <div className="rep-card" key={c.label}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                                <div style={{ width: 26, height: 26, borderRadius: 6, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <SI d={c.icon} size={12} color={c.color} />
                                </div>
                                <span style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>{c.label}</span>
                              </div>
                              <div style={{ fontSize: 'clamp(13px,2.5vw,18px)', fontWeight: 700, color: c.color }}>{c.value}</div>
                            </div>
                          ))}
                        </div>

                        {reportData.daily_breakdown && reportData.daily_breakdown.length > 0 && (
                          <div className="chart-box" style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#1E3A5F', marginBottom: 10 }}>Daily Revenue ({reportData.from} → {reportData.to})</div>
                            <BarChart data={reportData.daily_breakdown.map(d => ({ label: d.sale_date?.slice(5), value: Math.round(Number(d.daily_revenue)) }))} color="#2B5393" height={130} />
                          </div>
                        )}

                        {reportData.by_payment_method && Object.keys(reportData.by_payment_method).length > 0 && (
                          <div className="chart-grid" style={{ marginBottom: 12 }}>
                            <div className="chart-box">
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#1E3A5F', marginBottom: 10 }}>Revenue by Payment Method</div>
                              <BarChart data={Object.entries(reportData.by_payment_method).map(([label, value]) => ({ label, value }))} color="#2B5393" height={130} />
                            </div>
                            <div className="chart-box">
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#1E3A5F', marginBottom: 10 }}>Payment Mix</div>
                              <DonutChart data={Object.entries(reportData.by_payment_method).map(([label, value]) => ({ label, value }))} size={90} />
                            </div>
                          </div>
                        )}

                        {reportData.expenses_by_category && reportData.expenses_by_category.length > 0 && (
                          <div className="chart-grid" style={{ marginBottom: 12 }}>
                            <div className="chart-box">
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#1E3A5F', marginBottom: 10 }}>Expenses by Category</div>
                              <BarChart data={reportData.expenses_by_category.map(d => ({ label: d.category?.slice(0, 6), value: Math.round(Number(d.total)) }))} color="#EA580C" height={130} />
                            </div>
                            <div className="chart-box">
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#1E3A5F', marginBottom: 10 }}>Expense Distribution</div>
                              <DonutChart data={reportData.expenses_by_category.map(d => ({ label: d.category, value: Number(d.total) }))} size={90} />
                            </div>
                          </div>
                        )}

                        {reportData.by_payment_method && Object.keys(reportData.by_payment_method).length > 0 && (
                          <div className="rep-bar-wrap">
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#1E3A5F', marginBottom: 10 }}>Revenue Breakdown</div>
                            {Object.entries(reportData.by_payment_method).map(([method, amount], i) => {
                              const max = Math.max(...Object.values(reportData.by_payment_method))
                              return (
                                <div className="bar-row" key={method}>
                                  <span className="bar-label" style={{ textTransform: 'capitalize' }}>{method}</span>
                                  <div className="bar-track"><div className="bar-fill" style={{ width: `${max > 0 ? (amount / max) * 100 : 0}%`, background: COLORS[i % COLORS.length] }} /></div>
                                  <span className="bar-val">{fmtKES(amount)}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {reportData.top_products && reportData.top_products.length > 0 && (
                          <div className="pcard">
                            <div className="pcard-head"><span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F' }}>Top Selling Products</span></div>
                            <div className="chart-box" style={{ margin: 12 }}>
                              <BarChart data={reportData.top_products.slice(0, 8).map(p => ({ label: p.product_name?.slice(0, 6), value: Number(p.total_qty) }))} color="#16A34A" height={120} />
                            </div>
                            <div className="tbl-wrap">
                              <table className="pt">
                                <thead><tr><th>#</th><th>Product</th><th>Qty Sold</th><th>Revenue</th></tr></thead>
                                <tbody>
                                  {reportData.top_products.slice(0, 10).map((p, i) => (
                                    <tr key={i}>
                                      <td style={{ color: '#D1D5DB', fontSize: 10 }}>{i + 1}</td>
                                      <td style={{ fontWeight: 600, color: '#1E3A5F', fontSize: 11 }}>{p.product_name}</td>
                                      <td><span className="pbadge" style={{ background: '#EFF6FF', color: '#1E40AF', borderColor: '#BFDBFE' }}>{p.total_qty}</span></td>
                                      <td style={{ fontWeight: 700, color: '#16A34A', fontSize: 11 }}>{fmtKES(p.total_revenue)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        <div className="pcard" style={{ marginTop: 12 }}>
                          <div className="pcard-head"><span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F' }}>Profit & Loss Summary</span></div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 0 }}>
                            {[
                              { label: 'Gross Revenue', value: fmtKES(reportData.total_revenue || 0), color: '#16A34A', bg: '#F0FDF4' },
                              { label: 'Total Expenses', value: fmtKES(reportData.total_expenses || 0), color: '#DC2626', bg: '#FEF2F2' },
                              { label: 'Gross Profit', value: fmtKES(reportData.gross_profit || 0), color: '#0891B2', bg: '#EFF6FF' },
                              { label: 'Net Profit', value: fmtKES(reportData.net_profit || 0), color: '#7C3AED', bg: '#F5F3FF' },
                              { label: 'Tax Collected', value: fmtKES(reportData.total_tax || 0), color: '#EA580C', bg: '#FFF7ED' },
                              { label: 'Discounts Given', value: fmtKES(reportData.total_discount || 0), color: '#9CA3AF', bg: '#F9FAFB' },
                            ].map((s, i) => (
                              <div key={i} style={{ padding: '12px 14px', background: s.bg }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                                <div style={{ fontSize: 'clamp(13px,2.5vw,17px)', fontWeight: 700, color: s.color }}>{s.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* AUDIT LOG ; Admin Only */}
                {tab === 'audit' && isAdmin && (
                  <>
                    {/* Header stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 8, marginBottom: 12 }}>
                      {[
                        { label: 'Total Events', value: auditLogs.length, color: '#2B5393', bg: '#EBF2FC' },
                        { label: 'Sales Events', value: auditLogs.filter(l => l.type === 'sale').length, color: '#16A34A', bg: '#F0FDF4' },
                        { label: 'Returns', value: auditLogs.filter(l => l.type === 'return').length, color: '#DC2626', bg: '#FEF2F2' },
                        { label: 'Imports', value: auditLogs.filter(l => l.type === 'import').length, color: '#0891B2', bg: '#ECFEFF' },
                      ].map(s => (
                        <div key={s.label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 12px' }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
                          <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="pcard">
                      <div className="pcard-head">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <SI d={PATHS.audit} size={14} color="#1E3A5F" />
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F' }}>Audit History</span>
                          <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 4 }}>Admin-only view</span>
                        </div>
                        {/* Filter tabs */}
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {[['all', 'All'], ['sale', 'Sales'], ['return', 'Returns'], ['product', 'Products'], ['import', 'Imports'], ['expense', 'Expenses']].map(([v, l]) => (
                            <button key={v} className={`period-btn${auditFilter === v ? ' active' : ''}`} style={{ fontSize: 10, padding: '3px 8px' }} onClick={() => setAuditFilter(v)}>{l}</button>
                          ))}
                        </div>
                      </div>

                      {loadingAudit ? (
                        <div className="pempty">Loading audit log…</div>
                      ) : filteredAudit.length === 0 ? (
                        <div className="pempty">
                          <SI d={PATHS.audit} size={32} color="#E5E7EB" />
                          <div style={{ marginTop: 8 }}>No audit events found.</div>
                          <div style={{ fontSize: 10, color: '#D1D5DB', marginTop: 4 }}>Events are recorded as actions happen in the system.</div>
                        </div>
                      ) : (
                        <div className="tbl-wrap">
                          <table className="pt" style={{ minWidth: 500 }}>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Event</th>
                                <th>Description</th>
                                <th>User</th>
                                <th>Meta</th>
                                <th>Timestamp</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredAudit.map((log, i) => {
                                const tc = auditTypeColors[log.type] || auditTypeColors.sale
                                return (
                                  <tr key={log.id}>
                                    <td style={{ color: '#D1D5DB', fontSize: 10 }}>{i + 1}</td>
                                    <td>
                                      <span className="audit-badge" style={{ background: tc.bg, color: tc.color, borderColor: tc.border, textTransform: 'uppercase', fontSize: 9 }}>
                                        {log.action}
                                      </span>
                                    </td>
                                    <td style={{ fontSize: 11, color: '#374151', maxWidth: 220 }}>{log.description}</td>
                                    <td>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#EBF2FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#2B5393', flexShrink: 0 }}>{(log.user || 'S').charAt(0).toUpperCase()}</div>
                                        <span style={{ fontSize: 11, color: '#1E3A5F', fontWeight: 600 }}>{log.user || ';'}</span>
                                      </div>
                                    </td>
                                    <td style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'capitalize' }}>{log.meta || ';'}</td>
                                    <td style={{ fontSize: 10, color: '#6B7280', whiteSpace: 'nowrap' }}>
                                      {log.timestamp ? new Date(log.timestamp).toLocaleString('en-KE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ';'}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Audit info footer */}
                      <div style={{ padding: '8px 14px', borderTop: '1px solid #E5E7EB', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <SI d={PATHS.lock} size={10} color="#9CA3AF" />
                        <span style={{ fontSize: 10, color: '#9CA3AF' }}>Audit log is read-only and visible to administrators only. All system actions are automatically recorded.</span>
                      </div>
                    </div>
                  </>
                )}

                {/* SETTINGS */}
                {tab === 'settings' && isAdmin && (
                  <>
                    {settingsSaved && <div style={{ background: '#F0FDF4', color: '#15803D', padding: '7px 12px', fontSize: 12, borderRadius: 7, marginBottom: 10, border: '1px solid #BBF7D0', fontWeight: 600 }}>Settings saved.</div>}
                    <div className="set-section">
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <SI d={PATHS.building} size={13} color="#1E3A5F" /> Business Information
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10 }}>
                        {[{ label: 'Business Name', key: 'business_name', type: 'text' }, { label: 'Phone', key: 'phone', type: 'tel' }, { label: 'Email', key: 'email', type: 'email' }, { label: 'Address', key: 'address', type: 'text' }].map(f => (
                          <div key={f.key}>
                            <label className="set-label">{f.label}</label>
                            <input className="set-inp" type={f.type} value={settingsForm[f.key]} onChange={e => setSettingsForm(s => ({ ...s, [f.key]: e.target.value }))} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="set-section">
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F', marginBottom: 12 }}>Tax & Currency</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10 }}>
                        <div><label className="set-label">VAT Rate (%)</label><input className="set-inp" type="number" value={settingsForm.tax_rate} onChange={e => setSettingsForm(s => ({ ...s, tax_rate: e.target.value }))} /></div>
                        <div><label className="set-label">Currency</label>
                          <select className="set-inp" value={settingsForm.currency} onChange={e => setSettingsForm(s => ({ ...s, currency: e.target.value }))}>
                            <option value="KES">KES ; Kenyan Shilling</option>
                            <option value="USD">USD ; US Dollar</option>
                            <option value="UGX">UGX ; Ugandan Shilling</option>
                            <option value="TZS">TZS ; Tanzanian Shilling</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="set-section">
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F', marginBottom: 12 }}>Receipt Settings</div>
                      <label className="set-label">Footer Message</label>
                      <input className="set-inp" type="text" value={settingsForm.receipt_footer} onChange={e => setSettingsForm(s => ({ ...s, receipt_footer: e.target.value }))} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button className="pbtn" onClick={() => { setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 4000) }}>
                        <SI d={PATHS.save} size={11} color="#fff" /> Save Settings
                      </button>
                    </div>
                  </>
                )}

              </div>
              <div className="pbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="#16A34A" /></svg>
                  Online · {bizName} · {user?.role}
                </div>
                <span>v1.2.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <div className={`povl${showPayModal ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && setShowPayModal(false)}>
        <div className="pmod" style={{ maxWidth: 800 }}>
          <div className="pmod-head">
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Checkout</span>
            <button onClick={() => setShowPayModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex' }}><SI d={PATHS.close} size={15} color="rgba(255,255,255,0.7)" /></button>
          </div>
          <div className="pmod-stripe" />
          <div className="pmod-body">
            <div className="pmod-grid">
              <div className="pmod-col">
                <div style={{ fontSize: 10, fontWeight: 700, color: '#1A1A2E', marginBottom: 7, textTransform: 'uppercase' }}>Customer (Optional)</div>
                {selectedCustomer ? (
                  <div style={{ background: '#EBF2FC', border: '1.5px solid #2B5393', borderRadius: 7, padding: '8px 10px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: '#1E3A5F' }}>{selectedCustomer.name}</div>
                      <div style={{ fontSize: 10, color: '#4A5568' }}>{selectedCustomer.phone || 'No phone'}</div>
                    </div>
                    <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', display: 'flex' }}><SI d={PATHS.close} size={13} color="#DC2626" /></button>
                  </div>
                ) : (
                  <input style={{ ...inp, marginBottom: 8, fontSize: 11 }} placeholder="Search customer…" value={custPaySearch} onChange={e => setCustPaySearch(e.target.value)} />
                )}
                {!selectedCustomer && (
                  <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                    {(custPaySearch ? filteredCustsPay : customers).slice(0, 8).map((c, i) => (
                      <div key={i} className="cust-sel-item" onClick={() => { setSelectedCustomer(c); setCustPaySearch('') }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#2B5393', flexShrink: 0 }}>{c.name?.charAt(0)}</div>
                        <div><div style={{ fontSize: 11, fontWeight: 600, color: '#1A1A2E' }}>{c.name}</div><div style={{ fontSize: 9, color: '#9AA3B0' }}>{c.phone || 'No phone'}</div></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pmod-col">
                <div style={{ fontSize: 10, fontWeight: 700, color: '#1A1A2E', marginBottom: 7, textTransform: 'uppercase' }}>Payment</div>
                <div className="pm-total-box">
                  <div className="pm-total-lbl">Total Payable</div>
                  <div className="pm-total-amt">{fmtKES(cartTotal)}</div>
                  {selectedCustomer && <div style={{ fontSize: 10, color: '#2B5393', fontWeight: 600, marginTop: 3 }}>Customer: {selectedCustomer.name}</div>}
                </div>
                <div className="pm-methods">
                  {[['cash', 'Cash', PATHS.cash], ['card', 'Card', PATHS.card], ['transfer', 'Transfer', PATHS.transfer], ['mpesa', 'M-Pesa', PATHS.mpesa]].map(([v, l, d]) => (
                    <button key={v} className={`pm-method${payMethod === v ? ' active' : ''}`} onClick={() => setPayMethod(v)}>
                      <SI d={d} size={13} color={payMethod === v ? '#fff' : '#9AA3B0'} />{l}
                    </button>
                  ))}
                </div>
                {payMethod === 'cash' && (
                  <div>
                    <label className="pm-label">Amount Received</label>
                    <input className="pm-input" type="number" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} placeholder="0.00" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, marginBottom: 7 }}>
                      {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '00', '⌫'].map(k => (
                        <button key={k} className="pm-key" onClick={() => {
                          if (k === '⌫') setAmountPaid(p => p.slice(0, -1) || '')
                          else setAmountPaid(p => (p || '') + k)
                        }}>{k}</button>
                      ))}
                    </div>
                    <div className="change-box">
                      <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 600 }}>Change</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#16A34A' }}>{fmtKES(change)}</span>
                    </div>
                  </div>
                )}
                {payMethod === 'card' && <div className="pm-info"><b>Card Payment</b><br />Swipe or insert card. Confirm once approved.</div>}
                {payMethod === 'transfer' && (
                  <div>
                    <div className="pm-info"><b>Bank Transfer</b><br />Confirm once received.</div>
                    <label className="pm-label">Reference</label>
                    <input className="pm-input" placeholder="e.g. REF123456" onChange={() => setAmountPaid(String(cartTotal))} />
                  </div>
                )}
                {payMethod === 'mpesa' && (
                  <div>
                    <div className="pm-info"><b>M-Pesa</b><br />Ask customer to send <b>{fmtKES(cartTotal)}</b> to till number.</div>
                    <label className="pm-label">M-Pesa Code</label>
                    <input className="pm-input" placeholder="e.g. QGH7X2KL9P" style={{ textTransform: 'uppercase' }} onChange={() => setAmountPaid(String(cartTotal))} />
                  </div>
                )}
                <button className="btn-confirm" onClick={handleSale} disabled={saleLoading || (!amountPaid && payMethod === 'cash')}>
                  {saleLoading ? 'Processing…' : 'Confirm & Complete Sale'}
                </button>
              </div>

              <div className="pmod-col">
                <div style={{ fontSize: 10, fontWeight: 700, color: '#1A1A2E', marginBottom: 7, textTransform: 'uppercase' }}>Receipt Preview</div>
                <div className="receipt-preview" dangerouslySetInnerHTML={{ __html: cart.length > 0 ? buildReceiptHTML(txnCount + 1, new Date(), Number(amountPaid) || cartTotal, change, payMethod, selectedCustomer?.name || null) : '<div style="text-align:center;color:#9AA3B0;padding:20px;font-size:11px;">Add items to preview</div>' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {receipt && (
        <div className="povl open" onClick={e => e.target === e.currentTarget && setReceipt(null)}>
          <div className="pmod" style={{ maxWidth: 360 }}>
            <div className="pmod-head">
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                <SI d={PATHS.check} size={14} color="#4ADE80" /> Sale Complete
              </span>
              <button onClick={() => setReceipt(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex' }}><SI d={PATHS.close} size={15} color="rgba(255,255,255,0.7)" /></button>
            </div>
            <div className="pmod-stripe" />
            <div style={{ padding: 12 }} dangerouslySetInnerHTML={{ __html: receipt.html }} />
            <div className="rec-actions">
              <button className="btn-rec" style={{ background: '#1E3A5F', color: '#fff' }} onClick={() => handlePrintReceipt(receipt.html)}>
                <SI d={PATHS.print} size={12} color="#fff" /> Print Receipt
              </button>
              <button className="btn-rec" style={{ background: '#F0F2F5', color: '#4A5568', border: '1px solid #E2E6EA' }} onClick={() => setReceipt(null)}>
                <SI d={PATHS.plus} size={12} /> New Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reprint Modal */}
      {reprintReceipt && (
        <div className="povl open" onClick={e => e.target === e.currentTarget && setReprintReceipt(null)}>
          <div className="pmod" style={{ maxWidth: 360 }}>
            <div className="pmod-head">
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                <SI d={PATHS.print} size={14} color="#fff" /> Reprint Receipt
              </span>
              <button onClick={() => setReprintReceipt(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><SI d={PATHS.close} size={15} color="rgba(255,255,255,0.7)" /></button>
            </div>
            <div className="pmod-stripe" />
            <div style={{ padding: 12 }} dangerouslySetInnerHTML={{ __html: buildReprintHTML(reprintReceipt) }} />
            <div className="rec-actions">
              <button className="btn-rec" style={{ background: '#1E3A5F', color: '#fff' }} onClick={() => handlePrintReceipt(buildReprintHTML(reprintReceipt))}>
                <SI d={PATHS.print} size={12} color="#fff" /> Print
              </button>
              <button className="btn-rec" style={{ background: '#F0F2F5', color: '#4A5568', border: '1px solid #E2E6EA' }} onClick={() => setReprintReceipt(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Modal */}
      {showAdminPwModal && (
        <div className="povl open" onClick={e => e.target === e.currentTarget && setShowAdminPwModal(false)}>
          <div className="pmod" style={{ maxWidth: 360 }}>
            <div className="pmod-head">
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                <SI d={PATHS.lock} size={14} color="#fff" /> Admin Authorization
              </span>
              <button onClick={() => setShowAdminPwModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><SI d={PATHS.close} size={15} color="rgba(255,255,255,0.7)" /></button>
            </div>
            <div className="pmod-stripe" />
            <form onSubmit={handleAdminPwSubmit} style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: '#374151', marginBottom: 12, background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 6, padding: '8px 10px' }}>
                <b>Return requires admin approval.</b><br />Enter the admin password to proceed.
              </div>
              {adminPwError && <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '6px 9px', borderRadius: 5, fontSize: 11, marginBottom: 10, border: '1px solid #FECACA' }}>{adminPwError}</div>}
              <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Admin Password</label>
              <input style={{ ...inp, marginBottom: 12 }} type="password" placeholder="Enter admin password…" value={adminPw} onChange={e => setAdminPw(e.target.value)} required autoFocus />
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="pbtn-ghost" onClick={() => setShowAdminPwModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="pbtn" style={{ flex: 1 }}>Authorize Return</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddProd && isAdmin && (
        <div className="povl open" onClick={e => e.target === e.currentTarget && setShowAddProd(false)}>
          <div className="pmod" style={{ maxWidth: 540 }}>
            <div className="pmod-head">
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{editProd ? 'Edit Product' : 'Add New Product'}</span>
              <button onClick={() => setShowAddProd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex' }}><SI d={PATHS.close} size={15} color="rgba(255,255,255,0.7)" /></button>
            </div>
            <div className="pmod-stripe" />
            <form id="prodform" onSubmit={handleSaveProd} style={{ padding: '12px 15px', overflowY: 'auto', maxHeight: '65vh' }}>
              {prodError && <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '6px 9px', borderRadius: 5, fontSize: 11, marginBottom: 10, border: '1px solid #FECACA' }}>{prodError}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>Product Name *</label>
                  <input style={inp} type="text" required placeholder="e.g. Paracetamol 500mg" value={prodForm.name} onChange={e => setProdForm(p => ({ ...p, name: e.target.value }))} />
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>Category</label>
                  <select style={inp} value={prodForm.category} onChange={e => setProdForm(p => ({ ...p, category: e.target.value }))}>
                    <option value="">Select category…</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    <option value="__other__">Other (type below)</option>
                  </select>
                  {prodForm.category === '__other__' && (
                    <input style={{ ...inp, marginTop: 5 }} placeholder="Type category name" onChange={e => setProdForm(p => ({ ...p, category: e.target.value }))} />
                  )}
                </div>

                {[
                  { label: 'Generic Name', key: 'generic_name', type: 'text', ph: 'e.g. Acetaminophen' },
                  { label: 'Unit', key: 'unit', type: 'text', ph: 'e.g. Tablets' },
                  { label: 'Stock Qty *', key: 'stock_quantity', type: 'number', ph: '0', req: true },
                  { label: 'Reorder Level', key: 'reorder_level', type: 'number', ph: '10' },
                  { label: 'Barcode', key: 'barcode', type: 'text', ph: 'Optional' },
                  { label: 'Expiry Date', key: 'expiry_date', type: 'date', ph: '' },
                  { label: 'Buying Price *', key: 'buying_price', type: 'number', ph: '0.00', req: true },
                  { label: 'Profit Margin (%)', key: 'profit_margin', type: 'number', ph: 'e.g. 30' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>{f.label}</label>
                    <input style={inp} type={f.type} required={f.req} placeholder={f.ph}
                      value={prodForm[f.key]}
                      onChange={e => {
                        const val = e.target.value
                        if (f.key === 'buying_price') setProdForm(p => ({ ...p, buying_price: val, selling_price: p.profit_margin ? calcSellingPrice(val, p.profit_margin, p.apply_tax) : p.selling_price }))
                        else if (f.key === 'profit_margin') setProdForm(p => ({ ...p, profit_margin: val, selling_price: calcSellingPrice(p.buying_price, val, p.apply_tax) }))
                        else setProdForm(p => ({ ...p, [f.key]: val }))
                      }} />
                  </div>
                ))}

                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>Selling Price *</label>
                  <input style={{ ...inp, background: prodForm.profit_margin ? '#EFF6FF' : '#F9FAFB', borderColor: prodForm.profit_margin ? '#93C5FD' : '#E5E7EB' }}
                    type="number" required placeholder="0.00" value={prodForm.selling_price}
                    onChange={e => setProdForm(p => ({ ...p, selling_price: e.target.value, profit_margin: '' }))} />
                  {prodForm.profit_margin && <span style={{ fontSize: 9, color: '#2B5393', fontWeight: 600 }}>Auto-calculated{prodForm.apply_tax ? ' + VAT' : ''}</span>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 18 }}>
                  <input type="checkbox" id="apply_tax" checked={prodForm.apply_tax} onChange={e => {
                    const at = e.target.checked
                    setProdForm(p => ({ ...p, apply_tax: at, selling_price: p.profit_margin ? calcSellingPrice(p.buying_price, p.profit_margin, at) : p.selling_price }))
                  }} style={{ width: 13, height: 13, cursor: 'pointer' }} />
                  <label htmlFor="apply_tax" style={{ fontSize: 11, color: '#374151', cursor: 'pointer', fontWeight: 600 }}>Include 16% VAT</label>
                </div>

                {/* CSV Import Section ; spans full width, at bottom of form */}
                {!editProd && (
                  <div style={{ gridColumn: '1/-1', marginTop: 8 }}>
                    <div style={{ height: 1, background: 'linear-gradient(to right, #E5E7EB, #2B5393, #E5E7EB)', marginBottom: 12, borderRadius: 1 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 5, background: '#EBF2FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SI d={PATHS.upload} size={11} color="#2B5393" />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#1E3A5F' }}>Bulk Import via CSV</span>
                      <span style={{ fontSize: 10, color: '#9CA3AF' }}>; or add products one by one above</span>
                    </div>
                    <button
                      type="button"
                      className="btn-import"
                      disabled={csvImporting}
                      onClick={() => csvInputRef.current?.click()}
                    >
                      {csvImporting ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2B5393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                          Importing products…
                        </>
                      ) : (
                        <>
                          <SI d={PATHS.upload} size={14} color="#2B5393" />
                          Click to Import CSV File
                        </>
                      )}
                    </button>
                    <div style={{ marginTop: 8, padding: '7px 10px', background: '#F8FAFF', border: '1px solid #DBEAFE', borderRadius: 6 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#2B5393', marginBottom: 3 }}>Expected CSV columns:</div>
                      <div style={{ fontSize: 10, color: '#6B7280', fontFamily: 'monospace', lineHeight: 1.6 }}>
                        Name, Category, Buying Price, Selling Price, Stock Quantity, VAT*, Expiry Date*
                      </div>
                      <div style={{ fontSize: 9, color: '#9CA3AF', marginTop: 3 }}>* VAT and Expiry Date are optional ; leave blank if not applicable</div>
                    </div>
                    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                  </div>
                )}
              </div>
            </form>
            <div className="pmod-foot">
              <button className="pbtn-ghost" onClick={() => setShowAddProd(false)}>Cancel</button>
              <button className="pbtn" type="submit" form="prodform" disabled={prodLoading}>{prodLoading ? 'Saving…' : editProd ? 'Update Product' : 'Add Product'}</button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Feedback Modal */}
      {showCsvFeedback && csvFeedback && (
        <div className="povl open" onClick={e => e.target === e.currentTarget && setShowCsvFeedback(false)}>
          <div className="pmod" style={{ maxWidth: 440 }}>
            <div className="pmod-head">
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                <SI d={PATHS.upload} size={14} color="#fff" /> Import Results
              </span>
              <button onClick={() => setShowCsvFeedback(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><SI d={PATHS.close} size={15} color="rgba(255,255,255,0.7)" /></button>
            </div>
            <div className="pmod-stripe" />
            <div style={{ padding: 16 }}>
              {/* Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
                <div style={{ textAlign: 'center', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '10px 6px' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#16A34A' }}>{csvFeedback.success}</div>
                  <div style={{ fontSize: 10, color: '#16A34A', fontWeight: 600 }}>Imported</div>
                </div>
                <div style={{ textAlign: 'center', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 6px' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#DC2626' }}>{csvFeedback.failed}</div>
                  <div style={{ fontSize: 10, color: '#DC2626', fontWeight: 600 }}>Failed</div>
                </div>
                <div style={{ textAlign: 'center', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '10px 6px' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#2B5393' }}>{csvFeedback.total}</div>
                  <div style={{ fontSize: 10, color: '#2B5393', fontWeight: 600 }}>Total Rows</div>
                </div>
              </div>

              {/* Success message */}
              {csvFeedback.success > 0 && (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 7, padding: '9px 12px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <SI d={PATHS.check} size={14} color="#16A34A" />
                  <span style={{ fontSize: 12, color: '#15803D', fontWeight: 600 }}>
                    {csvFeedback.success} product{csvFeedback.success !== 1 ? 's' : ''} imported successfully and added to your product list.
                  </span>
                </div>
              )}

              {/* Errors */}
              {csvFeedback.errors.length > 0 && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, padding: '9px 12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <SI d={PATHS.alert} size={12} color="#DC2626" /> Import Errors ({csvFeedback.errors.length})
                  </div>
                  <div style={{ maxHeight: 150, overflowY: 'auto' }}>
                    {csvFeedback.errors.map((err, i) => (
                      <div key={i} style={{ fontSize: 10, color: '#DC2626', padding: '3px 0', borderBottom: i < csvFeedback.errors.length - 1 ? '1px solid #FECACA' : 'none' }}>
                        {err}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button className="pbtn-ghost" style={{ flex: 1 }} onClick={() => { setShowCsvFeedback(false); setShowAddProd(false) }}>Done</button>
                <button className="pbtn" style={{ flex: 1 }} onClick={() => { setShowCsvFeedback(false); csvInputRef.current?.click() }}>
                  <SI d={PATHS.upload} size={11} color="#fff" /> Import Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCat && isAdmin && (
        <div className="povl open" onClick={e => e.target === e.currentTarget && setShowAddCat(false)}>
          <div className="pmod" style={{ maxWidth: 360 }}>
            <div className="pmod-head">
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Manage Categories</span>
              <button onClick={() => setShowAddCat(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex' }}><SI d={PATHS.close} size={15} color="rgba(255,255,255,0.7)" /></button>
            </div>
            <div className="pmod-stripe" />
            <form id="catform" onSubmit={handleAddCategory} style={{ padding: '12px 15px' }}>
              {catError && <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '6px 9px', borderRadius: 5, fontSize: 11, marginBottom: 10, border: '1px solid #FECACA' }}>{catError}</div>}
              <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>New Category Name *</label>
              <input style={inp} type="text" required placeholder="e.g. Antibiotics" value={catForm.name} onChange={e => setCatForm({ name: e.target.value })} />
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button type="button" className="pbtn-ghost" style={{ flex: 1 }} onClick={() => setShowAddCat(false)}>Cancel</button>
                <button type="submit" className="pbtn" style={{ flex: 1 }} disabled={catLoading}>{catLoading ? 'Adding…' : 'Add Category'}</button>
              </div>
              {categories.length > 0 && (
                <div style={{ marginTop: 14, borderTop: '1px solid #E5E7EB', paddingTop: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: 7 }}>Existing Categories</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {categories.map(c => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: '#F0F2F5', borderRadius: 999, fontSize: 11, color: '#1E3A5F' }}>
                        {c.name}
                        <button onClick={() => handleDeleteCategory(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', display: 'flex', padding: 1 }}>
                          <SI d={PATHS.close} size={9} color="#DC2626" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Add Cashier Modal */}
      {showAddCash && isAdmin && (
        <div className="povl open" onClick={e => e.target === e.currentTarget && setShowAddCash(false)}>
          <div className="pmod" style={{ maxWidth: 390 }}>
            <div className="pmod-head">
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Add Cashier</span>
              <button onClick={() => setShowAddCash(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex' }}><SI d={PATHS.close} size={15} color="rgba(255,255,255,0.7)" /></button>
            </div>
            <div className="pmod-stripe" />
            <form id="cashform" onSubmit={handleAddCashier} style={{ padding: '12px 15px' }}>
              {cashError && <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '6px 9px', borderRadius: 5, fontSize: 11, marginBottom: 10, border: '1px solid #FECACA' }}>{cashError}</div>}
              {[{ label: 'Full Name *', key: 'name', type: 'text', ph: 'e.g. Jane Doe', req: true }, { label: 'Email *', key: 'email', type: 'email', ph: 'jane@pharmacy.com', req: true }, { label: 'Password *', key: 'password', type: 'password', ph: 'Min 8 characters', req: true }].map(f => (
                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>{f.label}</label>
                  <input style={inp} type={f.type} required={f.req} placeholder={f.ph} value={cashForm[f.key]} onChange={e => setCashForm(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
            </form>
            <div className="pmod-foot">
              <button className="pbtn-ghost" onClick={() => setShowAddCash(false)}>Cancel</button>
              <button className="pbtn" type="submit" form="cashform" disabled={cashLoading}>{cashLoading ? 'Adding…' : 'Add Cashier'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Customer Modal */}
      {showAddCust && (
        <div className="povl open" onClick={e => e.target === e.currentTarget && setShowAddCust(false)}>
          <div className="pmod" style={{ maxWidth: 410 }}>
            <div className="pmod-head">
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{editCust ? 'Edit Customer' : 'Add Customer'}</span>
              <button onClick={() => setShowAddCust(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex' }}><SI d={PATHS.close} size={15} color="rgba(255,255,255,0.7)" /></button>
            </div>
            <div className="pmod-stripe" />
            <form id="custform" onSubmit={handleSaveCustomer} style={{ padding: '12px 15px' }}>
              {custError && <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '6px 9px', borderRadius: 5, fontSize: 11, marginBottom: 10, border: '1px solid #FECACA' }}>{custError}</div>}
              {[{ label: 'Full Name *', key: 'name', type: 'text', ph: 'e.g. John Kamau', req: true }, { label: 'Phone', key: 'phone', type: 'tel', ph: '07XXXXXXXX' }, { label: 'Email', key: 'email', type: 'email', ph: 'john@email.com' }, { label: 'Address', key: 'address', type: 'text', ph: 'e.g. Nairobi, Kenya' }].map(f => (
                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>{f.label}</label>
                  <input style={inp} type={f.type} required={f.req} placeholder={f.ph} value={custForm[f.key]} onChange={e => setCustForm(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
            </form>
            <div className="pmod-foot">
              <button className="pbtn-ghost" onClick={() => setShowAddCust(false)}>Cancel</button>
              <button className="pbtn" type="submit" form="custform" disabled={custLoading}>{custLoading ? 'Saving…' : editCust ? 'Update Customer' : 'Add Customer'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExp && isAdmin && (
        <div className="povl open" onClick={e => e.target === e.currentTarget && setShowAddExp(false)}>
          <div className="pmod" style={{ maxWidth: 410 }}>
            <div className="pmod-head">
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Record Expense</span>
              <button onClick={() => setShowAddExp(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex' }}><SI d={PATHS.close} size={15} color="rgba(255,255,255,0.7)" /></button>
            </div>
            <div className="pmod-stripe" />
            <form id="expform" onSubmit={handleAddExpense} style={{ padding: '12px 15px' }}>
              {expError && <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '6px 9px', borderRadius: 5, fontSize: 11, marginBottom: 10, border: '1px solid #FECACA' }}>{expError}</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Category *</label>
                <select style={inp} required value={expForm.category} onChange={e => setExpForm(p => ({ ...p, category: e.target.value }))}>
                  <option value="">Select category…</option>
                  {EXP_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Description</label>
                <input style={inp} type="text" placeholder="Brief description…" value={expForm.description} onChange={e => setExpForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>Amount (KES) *</label>
                  <input style={inp} type="number" required placeholder="0.00" value={expForm.amount} onChange={e => setExpForm(p => ({ ...p, amount: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>Date *</label>
                  <input style={inp} type="date" required value={expForm.date} onChange={e => setExpForm(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Payment Method</label>
                <select style={inp} value={expForm.payment_method} onChange={e => setExpForm(p => ({ ...p, payment_method: e.target.value }))}>
                  <option value="cash">Cash</option>
                  <option value="mpesa">M-Pesa</option>
                  <option value="card">Card</option>
                  <option value="transfer">Bank Transfer</option>
                </select>
              </div>
            </form>
            <div className="pmod-foot">
              <button className="pbtn-ghost" onClick={() => setShowAddExp(false)}>Cancel</button>
              <button className="pbtn" type="submit" form="expform" disabled={expLoading}>{expLoading ? 'Saving…' : 'Save Expense'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Calculator */}
      {showCalc && (
        <div className="povl open" onClick={e => e.target === e.currentTarget && setShowCalc(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <div className="calc-wrap">
              <div className="calc-display">
                <div className="prev">{calcPrev !== null ? `${calcPrev} ${calcOp || ''}` : ''}</div>
                <div className="cur">{calcDisplay}</div>
              </div>
              <div className="calc-keys">
                {[{ k: 'C', cls: 'fn' }, { k: '±', cls: 'fn' }, { k: '%', cls: 'fn' }, { k: '÷', cls: 'op' },
                  { k: '7', cls: 'num' }, { k: '8', cls: 'num' }, { k: '9', cls: 'num' }, { k: '×', cls: 'op' },
                  { k: '4', cls: 'num' }, { k: '5', cls: 'num' }, { k: '6', cls: 'num' }, { k: '−', cls: 'op' },
                  { k: '1', cls: 'num' }, { k: '2', cls: 'num' }, { k: '3', cls: 'num' }, { k: '+', cls: 'op' },
                  { k: '⌫', cls: 'fn' }, { k: '0', cls: 'num' }, { k: '.', cls: 'num' }, { k: '=', cls: 'eq' },
                ].map(({ k, cls }) => <button key={k} className={`calc-key ${cls}`} onClick={() => calcPress(k)}>{k}</button>)}
              </div>
            </div>
            <button onClick={() => setShowCalc(false)} style={{ marginTop: 12, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, padding: '7px 20px', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}
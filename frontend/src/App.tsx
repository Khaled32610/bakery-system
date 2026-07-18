import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

// استيراد الشاشات الأساسية
import Dashboard from './pages/Dashboard'
import Materials from './pages/Materials'
import Branches from './pages/Branches'
import Products from './pages/Products'
import Invoices from './pages/Invoices'
import DailyClosings from './pages/DailyClosings'

// استيراد شاشات العملاء الجديدة بعد الفصل
import AddClient from './pages/AddClient'
import ClientsList from './pages/ClientsList'
import ClientDetails from './pages/ClientDetails'

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar')
  const isAr = lang === 'ar'

  // إجبار المتصفح على إزالة الهوامش لتجنب أي شريط تمرير زائد
  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.backgroundColor = '#f4f7f6'
  }, [])

  // قاموس الترجمة
  const t = {
    title: isAr ? '🍞 إدارة المخبز' : '🍞 Bakery ERP',
    dash: isAr ? '📈 لوحة التحكم' : '📈 Dashboard',
    mat: isAr ? '📦 المواد الخام' : '📦 Raw Materials',
    bra: isAr ? '🏪 الفروع' : '🏪 Branches',
    pro: isAr ? '🥖 أنواع المخبوزات' : '🥖 Bread Types',
    cliAdd: isAr ? '➕ إضافة عميل' : '➕ Add Client',
    cliList: isAr ? '👥 سجل العملاء' : '👥 Clients List',
    inv: isAr ? '🧾 الفواتير' : '🧾 Invoices',
    cls: isAr ? '📊 التقفيل اليومي' : '📊 Daily Closings',
    langBtn: isAr ? 'English 🇬🇧' : 'عربي 🇪🇬'
  }

  return (
    <Router>
      <div style={{ 
        direction: isAr ? 'rtl' : 'ltr',
        fontFamily: 'Tahoma, system-ui, sans-serif',
        minHeight: '100vh',
        display: 'flex'
      }}>
        
        {/* Sidebar (Fixed Position) */}
        <div style={{ 
          width: '260px', 
          height: '100vh',
          position: 'fixed',
          top: 0, 
          [isAr ? 'right' : 'left']: 0, 
          backgroundColor: '#2c3e50', 
          color: 'white', 
          padding: '20px',
          boxSizing: 'border-box',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <h2 style={{ borderBottom: '1px solid #455a64', paddingBottom: '15px', marginTop: 0 }}>
            {t.title}
          </h2>
          <ul style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
            <li style={{ marginBottom: '20px' }}><Link to="/" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px', display: 'block' }}>{t.dash}</Link></li>
            <li style={{ marginBottom: '20px' }}><Link to="/materials" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px', display: 'block' }}>{t.mat}</Link></li>
            <li style={{ marginBottom: '20px' }}><Link to="/branches" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px', display: 'block' }}>{t.bra}</Link></li>
            <li style={{ marginBottom: '20px' }}><Link to="/products" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px', display: 'block' }}>{t.pro}</Link></li>
            
            {/* روابط العملاء الجديدة */}
            <li style={{ marginBottom: '20px' }}><Link to="/clients/add" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px', display: 'block' }}>{t.cliAdd}</Link></li>
            <li style={{ marginBottom: '20px' }}><Link to="/clients/list" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px', display: 'block' }}>{t.cliList}</Link></li>
            
            <li style={{ marginBottom: '20px' }}><Link to="/invoices" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px', display: 'block' }}>{t.inv}</Link></li>
            <li style={{ marginBottom: '20px' }}><Link to="/closings" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px', display: 'block' }}>{t.cls}</Link></li>
          </ul>
        </div>

        {/* Main Content Container */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          [isAr ? 'marginRight' : 'marginLeft']: '260px',
          minWidth: 0 
        }}>
          
          {/* Top Navbar */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center',
            padding: '10px 30px', 
            backgroundColor: 'white', 
            borderBottom: '1px solid #ddd',
            position: 'sticky',
            top: 0,
            zIndex: 999
          }}>
            <button 
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f8f9fa', color: '#333', border: '1px solid #ccc',
                borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
              }}
            >
              {t.langBtn}
            </button>
          </div>

          {/* Page Content */}
          <div style={{ padding: '40px', flex: 1, overflowX: 'auto', boxSizing: 'border-box' }}>
            <Routes>
              <Route path="/" element={<Dashboard isAr={isAr} />} />
              <Route path="/materials" element={<Materials isAr={isAr} />} />
              <Route path="/branches" element={<Branches isAr={isAr} />} />
              <Route path="/products" element={<Products isAr={isAr} />} />
              
              {/* مسارات العملاء الجديدة */}
              <Route path="/clients/add" element={<AddClient isAr={isAr} />} />
              <Route path="/clients/list" element={<ClientsList isAr={isAr} />} />
              <Route path="/clients/:id" element={<ClientDetails isAr={isAr} />} />
              
              <Route path="/invoices" element={<Invoices isAr={isAr} />} />
              <Route path="/closings" element={<DailyClosings isAr={isAr} />} />
            </Routes>
          </div>

        </div>
      </div>
    </Router>
  )
}
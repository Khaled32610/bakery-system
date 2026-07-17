import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Materials from './pages/Materials'
import Branches from './pages/Branches'
import Clients from './pages/Clients'
import Products from './pages/Products'
import Invoices from './pages/Invoices'
import DailyClosings from './pages/DailyClosings' // NEW IMPORT

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* Sidebar */}
        <div style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px' }}>
          <h2 style={{ borderBottom: '1px solid #455a64', paddingBottom: '15px' }}>🍞 Bakery ERP</h2>
          <ul style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
            <li style={{ marginBottom: '15px' }}>
              <Link to="/" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px' }}>📦 Raw Materials</Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to="/branches" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px' }}>🏪 Branches</Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to="/products" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px' }}>🥖 Bread Types</Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to="/clients" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px' }}>👥 Clients</Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to="/invoices" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px' }}>🧾 Invoices</Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to="/closings" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '18px' }}>📊 Daily Closings</Link>
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, padding: '40px', backgroundColor: '#f4f7f6' }}>
          <Routes>
            <Route path="/" element={<Materials />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/products" element={<Products />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/closings" element={<DailyClosings />} /> {/* NEW ROUTE */}
          </Routes>
        </div>

      </div>
    </Router>
  )
}

export default App
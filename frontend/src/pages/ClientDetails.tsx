import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

interface Client { id: number; name: string; contact_info: string; current_balance: number; }
interface Invoice { id: number; client_id: number; product_id: number; date: string; quantity: number; total_amount: number; paid_amount: number; remaining_amount: number; }
interface Product { id: number; name: string; price: number; }

interface Props { isAr: boolean; }

export default function ClientDetails({ isAr }: Props) {
  const { id } = useParams() // سحب رقم العميل من الرابط
  const [client, setClient] = useState<Client | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const cRes = await axios.get('http://127.0.0.1:8000/clients/')
      const iRes = await axios.get('http://127.0.0.1:8000/invoices/')
      const pRes = await axios.get('http://127.0.0.1:8000/products/')
      
      const foundClient = cRes.data.find((c: Client) => c.id === Number(id))
      setClient(foundClient || null)
      
      // فلترة الفواتير لهذا العميل فقط
      const clientInvs = iRes.data.filter((inv: Invoice) => inv.client_id === Number(id))
      setInvoices(clientInvs)
      setProducts(pRes.data)
    }
    fetchData()
  }, [id])

  if (!client) return <div style={{ padding: '40px', fontSize: '20px' }}>{isAr ? 'جاري تحميل الملف...' : 'Loading Profile...'}</div>

  const t = {
    backBtn: isAr ? '🔙 العودة للقائمة' : '🔙 Back to List',
    profile: isAr ? 'ملف العميل' : 'Client Profile',
    phone: isAr ? 'رقم التليفون' : 'Phone',
    debt: isAr ? 'المديونية الحالية' : 'Current Debt',
    todayAct: isAr ? '🌟 مسحوبات اليوم' : '🌟 Today\'s Activity',
    allHist: isAr ? '📅 السجل الكامل للفواتير' : '📅 Complete Invoice History',
    date: isAr ? 'التاريخ' : 'Date',
    prod: isAr ? 'الصنف' : 'Product',
    qty: isAr ? 'الكمية' : 'Quantity',
    total: isAr ? 'الإجمالي' : 'Total',
    paid: isAr ? 'المدفوع' : 'Paid',
    rem: isAr ? 'المتبقي (آجل)' : 'Remaining',
    currency: isAr ? 'جنيه' : 'EGP',
    noData: isAr ? 'لا توجد مسحوبات سابقة.' : 'No previous activity.'
  }

  const getProductName = (pid: number) => products.find(p => p.id === pid)?.name || (isAr ? 'غير معروف' : 'Unknown')
  const todayDate = new Date().toISOString().split('T')[0]
  const todayInvoices = invoices.filter(inv => inv.date === todayDate)

  return (
    <div>
      <Link to="/clients/list" style={{ display: 'inline-block', marginBottom: '20px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
        {t.backBtn}
      </Link>

      {/* بطاقة بيانات العميل الأساسية */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>{client.name}</h1>
          <p style={{ fontSize: '18px', color: '#666', margin: '10px 0 0 0' }}>{t.phone}: {client.contact_info}</p>
        </div>
        <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', border: '1px solid #ffeeba', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#856404' }}>{t.debt}</h3>
          <h2 style={{ margin: '10px 0 0 0', color: '#dc3545', fontSize: '32px' }}>{client.current_balance} {t.currency}</h2>
        </div>
      </div>

      {/* مسحوبات اليوم */}
      {todayInvoices.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', borderLeft: isAr ? 'none' : '5px solid #28a745', borderRight: isAr ? '5px solid #28a745' : 'none', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#28a745' }}>{t.todayAct}</h3>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {todayInvoices.map(inv => (
              <li key={inv.id} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '15px 0', borderBottom: '1px dashed #eee', fontSize: '16px' }}>
                <span><strong>{t.prod}:</strong> {getProductName(inv.product_id)}</span>
                <span><strong>{t.qty}:</strong> {inv.quantity}</span>
                <span><strong>{t.total}:</strong> {inv.total_amount} {t.currency}</span>
                <span style={{ color: 'green' }}><strong>{t.paid}:</strong> {inv.paid_amount} {t.currency}</span>
                <span style={{ color: 'red' }}><strong>{t.rem}:</strong> {inv.remaining_amount} {t.currency}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* سجل الفواتير بالكامل */}
      <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>{t.allHist}</h3>
      {invoices.length === 0 ? <p>{t.noData}</p> : (
        <table style={{ width: '100%', textAlign: isAr ? 'right' : 'left', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <thead style={{ backgroundColor: '#343a40', color: 'white' }}>
            <tr>
              <th style={{ padding: '12px' }}>#</th>
              <th style={{ padding: '12px' }}>{t.date}</th>
              <th style={{ padding: '12px' }}>{t.prod}</th>
              <th style={{ padding: '12px' }}>{t.qty}</th>
              <th style={{ padding: '12px' }}>{t.total}</th>
              <th style={{ padding: '12px' }}>{t.paid}</th>
              <th style={{ padding: '12px' }}>{t.rem}</th>
            </tr>
          </thead>
          <tbody>
            {invoices.slice().reverse().map(inv => (
              <tr key={inv.id} style={{ borderTop: '1px solid #ddd', backgroundColor: inv.date === todayDate ? '#f0fff4' : 'transparent' }}>
                <td style={{ padding: '12px' }}>{inv.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{inv.date}</td>
                <td style={{ padding: '12px' }}>{getProductName(inv.product_id)}</td>
                <td style={{ padding: '12px' }}>{inv.quantity}</td>
                <td style={{ padding: '12px' }}>{inv.total_amount}</td>
                <td style={{ padding: '12px', color: 'green' }}>{inv.paid_amount}</td>
                <td style={{ padding: '12px', color: 'red' }}>{inv.remaining_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
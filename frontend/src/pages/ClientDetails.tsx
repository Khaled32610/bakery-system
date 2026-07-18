import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

interface Client { id: number; name: string; contact_info: string; current_balance: number; }
interface Invoice { id: number; client_id: number; product_id: number; date: string; quantity: number; total_amount: number; paid_amount: number; remaining_amount: number; }
interface Payment { id: number; client_id: number; date: string; amount: number; }
interface Product { id: number; name: string; price: number; }

interface Props { isAr: boolean; }

export default function ClientDetails({ isAr }: Props) {
  const { id } = useParams() 
  const [client, setClient] = useState<Client | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [products, setProducts] = useState<Product[]>([])
  
  // حالة نافذة الدفع
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('')

  const fetchData = async () => {
    const cRes = await axios.get('http://127.0.0.1:8000/clients/')
    const iRes = await axios.get('http://127.0.0.1:8000/invoices/')
    const pRes = await axios.get('http://127.0.0.1:8000/products/')
    const payRes = await axios.get('http://127.0.0.1:8000/payments/')
    
    setClient(cRes.data.find((c: Client) => c.id === Number(id)) || null)
    setInvoices(iRes.data.filter((inv: Invoice) => inv.client_id === Number(id)))
    setPayments(payRes.data.filter((p: Payment) => p.client_id === Number(id)))
    setProducts(pRes.data)
  }

  useEffect(() => { fetchData() }, [id])

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentAmount) return

    const newPayment = {
      client_id: Number(id),
      date: new Date().toISOString().split('T')[0],
      amount: Number(paymentAmount)
    }

    axios.post('http://127.0.0.1:8000/payments/', newPayment).then(() => {
      fetchData() // تحديث البيانات عشان الرصيد يتظبط
      setShowPaymentForm(false)
      setPaymentAmount('')
    }).catch(err => console.error(err))
  }

  if (!client) return <div style={{ padding: '40px', fontSize: '20px' }}>{isAr ? 'جاري تحميل الملف...' : 'Loading Profile...'}</div>

  const t = {
    backBtn: isAr ? '🔙 العودة للقائمة' : '🔙 Back to List',
    phone: isAr ? 'رقم التليفون' : 'Phone',
    debt: isAr ? 'المديونية الحالية' : 'Current Debt',
    currency: isAr ? 'جنيه' : 'EGP',
    payBtn: isAr ? '💵 سداد دفعة' : '💵 Make Payment',
    payTitle: isAr ? 'تسجيل دفعة نقدية' : 'Record Cash Payment',
    amount: isAr ? 'المبلغ' : 'Amount',
    cancel: isAr ? 'إلغاء' : 'Cancel',
    save: isAr ? 'حفظ' : 'Save',
    paymentsHist: isAr ? '💵 سجل المدفوعات النقدية' : '💵 Cash Payments History',
    allHist: isAr ? '📅 السجل الكامل للفواتير' : '📅 Complete Invoice History',
    date: isAr ? 'التاريخ' : 'Date',
    prod: isAr ? 'الصنف' : 'Product',
    qty: isAr ? 'الكمية' : 'Quantity',
    total: isAr ? 'الإجمالي' : 'Total',
    paid: isAr ? 'المدفوع' : 'Paid',
    rem: isAr ? 'المتبقي (آجل)' : 'Remaining',
    noData: isAr ? 'لا توجد بيانات مسجلة.' : 'No records found.'
  }

  const getProductName = (pid: number) => products.find(p => p.id === pid)?.name || (isAr ? 'غير معروف' : 'Unknown')

  return (
    <div>
      <Link to="/clients/list" style={{ display: 'inline-block', marginBottom: '20px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
        {t.backBtn}
      </Link>

      {/* بطاقة العميل */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>{client.name}</h1>
          <p style={{ fontSize: '18px', color: '#666', margin: '10px 0 0 0' }}>{t.phone}: {client.contact_info}</p>
          <button 
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {t.payBtn}
          </button>
        </div>
        <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', border: '1px solid #ffeeba', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#856404' }}>{t.debt}</h3>
          <h2 style={{ margin: '10px 0 0 0', color: '#dc3545', fontSize: '32px' }}>{client.current_balance} {t.currency}</h2>
        </div>
      </div>

      {/* فورم الدفع */}
      {showPaymentForm && (
        <div style={{ backgroundColor: '#e9ecef', padding: '20px', borderRadius: '10px', marginBottom: '30px', display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t.amount} ({t.currency})</label>
            <input type="number" step="0.01" value={paymentAmount} onChange={e => setPaymentAmount(Number(e.target.value))} style={{ padding: '10px', width: '200px', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
          <button onClick={handlePaymentSubmit} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>{t.save}</button>
          <button onClick={() => setShowPaymentForm(false)} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>{t.cancel}</button>
        </div>
      )}

      {/* سجل المدفوعات النقدية */}
      {payments.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ color: '#28a745' }}>{t.paymentsHist}</h3>
          <table style={{ width: '100%', textAlign: isAr ? 'right' : 'left', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <thead style={{ backgroundColor: '#28a745', color: 'white' }}>
              <tr>
                <th style={{ padding: '12px' }}>#</th>
                <th style={{ padding: '12px' }}>{t.date}</th>
                <th style={{ padding: '12px' }}>{t.amount}</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice().reverse().map(pay => (
                <tr key={pay.id} style={{ borderTop: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>#{pay.id}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{pay.date}</td>
                  <td style={{ padding: '12px', color: 'green', fontWeight: 'bold' }}>{pay.amount} {t.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* سجل الفواتير */}
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
              <tr key={inv.id} style={{ borderTop: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{inv.id}</td>
                <td style={{ padding: '12px' }}>{inv.date}</td>
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
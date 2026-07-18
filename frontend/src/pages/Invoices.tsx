import { useEffect, useState } from 'react'
import axios from 'axios'

interface Client { id: number; name: string; current_balance: number; }
interface Product { id: number; name: string; price: number; }
interface Invoice { id: number; client_id: number; product_id: number; date: string; quantity: number; total_amount: number; paid_amount: number; remaining_amount: number; }

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [clientId, setClientId] = useState<number | ''>('')
  const [productId, setProductId] = useState<number | ''>('')
  const [quantity, setQuantity] = useState<number | ''>('')
  const [paidAmount, setPaidAmount] = useState<number | ''>('')

  const fetchData = () => {
    axios.get('http://127.0.0.1:8000/invoices/').then(res => setInvoices(res.data))
    axios.get('http://127.0.0.1:8000/clients/').then(res => setClients(res.data))
    axios.get('http://127.0.0.1:8000/products/').then(res => setProducts(res.data))
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedProduct = products.find(p => p.id === Number(productId))
    const price = selectedProduct ? selectedProduct.price : 0
    const total = price * Number(quantity)
    const paid = Number(paidAmount)

    const newInvoice = {
      client_id: Number(clientId),
      product_id: Number(productId),
      date: new Date().toISOString().split('T')[0],
      quantity: Number(quantity),
      total_amount: total,
      paid_amount: paid,
      remaining_amount: total - paid
    }

    axios.post('http://127.0.0.1:8000/invoices/', newInvoice).then(() => {
      fetchData()
      setClientId('')
      setProductId('')
      setQuantity('')
      setPaidAmount('')
    }).catch(err => console.error(err))
  }

  const getClientName = (id: number) => clients.find(c => c.id === id)?.name || 'Unknown'
  const getProductName = (id: number) => products.find(p => p.id === id)?.name || 'Unknown'

  // --- Print Invoice Function ---
  const printInvoice = (inv: Invoice) => {
    const clientName = getClientName(inv.client_id)
    const productName = getProductName(inv.product_id)
    
    const printWindow = window.open('', '_blank', 'width=400,height=600')
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>طباعة فاتورة #${inv.id}</title>
            <style>
              body { font-family: 'Tahoma', sans-serif; padding: 20px; text-align: center; }
              .receipt-box { border: 2px dashed #333; padding: 20px; border-radius: 10px; }
              h2 { margin-top: 0; }
              hr { border-top: 1px dashed #333; }
              .details { text-align: right; margin-top: 20px; font-size: 18px; line-height: 1.8; }
            </style>
          </head>
          <body>
            <div class="receipt-box">
              <h2>🍞 Bakery System</h2>
              <p>فاتورة توزيع رقم: <strong>#${inv.id}</strong></p>
              <p>التاريخ: ${inv.date}</p>
              <hr/>
              <div class="details">
                <div><strong>اسم المحل (العميل):</strong> ${clientName}</div>
                <div><strong>الصنف:</strong> ${productName}</div>
                <div><strong>الكمية:</strong> ${inv.quantity} رغيف</div>
                <hr/>
                <div><strong>الإجمالي:</strong> ${inv.total_amount} جنيه</div>
                <div><strong>المدفوع:</strong> ${inv.paid_amount} جنيه</div>
                <div><strong>المتبقي (آجل):</strong> ${inv.remaining_amount} جنيه</div>
              </div>
              <hr/>
              <p>تم الإصدار بواسطة نظام الإدارة</p>
            </div>
            <script>
              window.print();
              window.onafterprint = function(){ window.close(); };
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>🧾 Distribution Invoices</h2>
      
      {/* Form Section */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={clientId} onChange={(e) => setClientId(Number(e.target.value))} required style={{ padding: '8px', width: '200px' }}>
            <option value="" disabled>Select Client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={productId} onChange={(e) => setProductId(Number(e.target.value))} required style={{ padding: '8px', width: '200px' }}>
            <option value="" disabled>Select Bread Type</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required style={{ padding: '8px' }} />
          <input type="number" step="0.01" placeholder="Paid Amount" value={paidAmount} onChange={(e) => setPaidAmount(Number(e.target.value))} required style={{ padding: '8px' }} />
          <button type="submit" style={{ padding: '9px 20px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Invoice</button>
        </form>
      </div>

      {/* Table Section */}
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Date</th>
            <th style={{ padding: '12px' }}>Client</th>
            <th style={{ padding: '12px' }}>Quantity</th>
            <th style={{ padding: '12px' }}>Total</th>
            <th style={{ padding: '12px' }}>Paid</th>
            <th style={{ padding: '12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id} style={{ borderTop: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>#{inv.id}</td>
              <td style={{ padding: '12px' }}>{inv.date}</td>
              <td style={{ padding: '12px' }}><strong>{getClientName(inv.client_id)}</strong></td>
              <td style={{ padding: '12px' }}>{inv.quantity}</td>
              <td style={{ padding: '12px' }}>{inv.total_amount} EGP</td>
              <td style={{ padding: '12px', color: 'green' }}>{inv.paid_amount} EGP</td>
              <td style={{ padding: '12px' }}>
                {/* Print Button */}
                <button onClick={() => printInvoice(inv)} style={{ padding: '6px 12px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🖨️ Print</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
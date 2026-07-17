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
    
    // Calculate total price based on product selection
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
      fetchData() // Refresh tables and balances
      setClientId('')
      setProductId('')
      setQuantity('')
      setPaidAmount('')
    }).catch(err => console.error(err))
  }

  // Helper to display client name instead of ID in the table
  const getClientName = (id: number) => clients.find(c => c.id === id)?.name || 'Unknown'

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>🧾 Distribution Invoices</h2>
      
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          <select value={clientId} onChange={(e) => setClientId(Number(e.target.value))} required style={{ padding: '8px', width: '200px' }}>
            <option value="" disabled>Select Client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select value={productId} onChange={(e) => setProductId(Number(e.target.value))} required style={{ padding: '8px', width: '200px' }}>
            <option value="" disabled>Select Bread Type</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} - {p.price} EGP</option>)}
          </select>

          <input type="number" placeholder="Quantity (Loaves)" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required style={{ padding: '8px' }} />
          
          <input type="number" step="0.01" placeholder="Paid Amount (EGP)" value={paidAmount} onChange={(e) => setPaidAmount(Number(e.target.value))} required style={{ padding: '8px' }} />

          <button type="submit" style={{ padding: '9px 20px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Invoice</button>
        </form>
      </div>

      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Date</th>
            <th style={{ padding: '12px' }}>Client</th>
            <th style={{ padding: '12px' }}>Quantity</th>
            <th style={{ padding: '12px' }}>Total</th>
            <th style={{ padding: '12px' }}>Paid</th>
            <th style={{ padding: '12px' }}>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id} style={{ borderTop: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>#{inv.id}</td>
              <td style={{ padding: '12px' }}>{inv.date}</td>
              <td style={{ padding: '12px' }}><strong>{getClientName(inv.client_id)}</strong></td>
              <td style={{ padding: '12px' }}>{inv.quantity} Loaves</td>
              <td style={{ padding: '12px' }}>{inv.total_amount} EGP</td>
              <td style={{ padding: '12px', color: 'green' }}>{inv.paid_amount} EGP</td>
              <td style={{ padding: '12px', color: 'red' }}>{inv.remaining_amount} EGP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
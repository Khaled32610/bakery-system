import { useEffect, useState } from 'react'
import axios from 'axios'

interface Client {
  id: number;
  name: string;
  phone: string;
  current_balance: number;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [balance, setBalance] = useState<number | ''>('')

  const fetchClients = () => {
    axios.get('http://127.0.0.1:8000/clients/')
      .then(response => setClients(response.data))
      .catch(error => console.error(error))
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/clients/', { 
      name, 
      phone, 
      current_balance: Number(balance) 
    }).then(() => {
      fetchClients()
      setName('')
      setPhone('')
      setBalance('')
    })
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>👥 Clients & Shops</h2>
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input type="text" placeholder="Shop Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '8px' }} />
          <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ padding: '8px' }} />
          <input type="number" placeholder="Initial Balance (EGP)" value={balance} onChange={(e) => setBalance(Number(e.target.value))} required style={{ padding: '8px' }} />
          <button type="submit" style={{ padding: '9px 20px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Client</button>
        </form>
      </div>

      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr><th style={{ padding: '12px' }}>ID</th><th style={{ padding: '12px' }}>Name</th><th style={{ padding: '12px' }}>Phone</th><th style={{ padding: '12px' }}>Current Balance</th></tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id} style={{ borderTop: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{client.id}</td>
              <td style={{ padding: '12px' }}><strong>{client.name}</strong></td>
              <td style={{ padding: '12px' }}>{client.phone}</td>
              <td style={{ padding: '12px', color: client.current_balance > 0 ? 'red' : 'green' }}>
                {client.current_balance} EGP
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
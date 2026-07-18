import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

interface Client { id: number; name: string; contact_info: string; current_balance: number; }
interface Props { isAr: boolean; }

export default function ClientsList({ isAr }: Props) {
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/clients/').then(res => setClients(res.data))
  }, [])

  const t = {
    title: isAr ? '👥 قائمة العملاء والمحلات' : '👥 Clients & Shops List',
    tableId: isAr ? 'المعرف' : 'ID',
    name: isAr ? 'الاسم' : 'Name',
    contact: isAr ? 'التواصل' : 'Contact',
    debt: isAr ? 'المديونية' : 'Debt',
    actions: isAr ? 'التفاصيل' : 'Details',
    detailsBtn: isAr ? 'فتح الملف 📂' : 'Open Profile 📂',
    currency: isAr ? 'جنيه' : 'EGP'
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>{t.title}</h2>

      <table style={{ width: '100%', textAlign: isAr ? 'right' : 'left', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            <th style={{ padding: '12px' }}>{t.tableId}</th>
            <th style={{ padding: '12px' }}>{t.name}</th>
            <th style={{ padding: '12px' }}>{t.contact}</th>
            <th style={{ padding: '12px' }}>{t.debt}</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>{t.actions}</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id} style={{ borderTop: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>#{client.id}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{client.name}</td>
              <td style={{ padding: '12px' }}>{client.contact_info}</td>
              <td style={{ padding: '12px', color: '#dc3545', fontWeight: 'bold' }}>{client.current_balance} {t.currency}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                {/* رابط يوجه لصفحة العميل المستقلة */}
                <Link to={`/clients/${client.id}`} style={{ display: 'inline-block', padding: '8px 15px', backgroundColor: '#17a2b8', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                  {t.detailsBtn}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
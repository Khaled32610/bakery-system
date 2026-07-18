import { useState } from 'react'
import axios from 'axios'

interface Props { isAr: boolean; }

export default function AddClient({ isAr }: Props) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')

  const t = {
    title: isAr ? '➕ إضافة عميل جديد' : '➕ Add New Client',
    namePlh: isAr ? 'اسم المحل / العميل' : 'Client / Shop Name',
    contactPlh: isAr ? 'رقم التليفون / العنوان' : 'Phone / Address',
    saveBtn: isAr ? 'حفظ بيانات العميل' : 'Save Client',
    success: isAr ? '✅ تم إضافة العميل بنجاح!' : '✅ Client added successfully!'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/clients/', {
      name, contact_info: contact, current_balance: 0
    }).then(() => {
      setMessage(t.success)
      setName('')
      setContact('')
      setTimeout(() => setMessage(''), 3000)
    }).catch(err => console.error(err))
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>{t.title}</h2>
      
      <div style={{ maxWidth: '600px', backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t.namePlh}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '10px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '5px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t.contactPlh}</label>
            <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required style={{ padding: '10px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '5px' }} />
          </div>
          
          <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
            {t.saveBtn}
          </button>
        </form>

        {message && <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold' }}>{message}</div>}
      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import axios from 'axios'

interface Branch {
  id: number;
  name: string;
  location: string;
}

export default function Branches() {
  const [branches, setBranches] = useState<Branch[]>([])
  
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')

  const fetchBranches = () => {
    axios.get('http://127.0.0.1:8000/branches/')
      .then(response => setBranches(response.data))
      .catch(error => console.error(error))
  }

  useEffect(() => {
    fetchBranches()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/branches/', { name, location }).then(() => {
      fetchBranches()
      setName('')
      setLocation('')
    })
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>🏪 Branches Management</h2>
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input type="text" placeholder="Branch Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '8px' }} />
          <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required style={{ padding: '8px', width: '300px' }} />
          <button type="submit" style={{ padding: '9px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Branch</button>
        </form>
      </div>

      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr><th style={{ padding: '12px' }}>ID</th><th style={{ padding: '12px' }}>Branch Name</th><th style={{ padding: '12px' }}>Location</th></tr>
        </thead>
        <tbody>
          {branches.map(branch => (
            <tr key={branch.id} style={{ borderTop: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{branch.id}</td>
              <td style={{ padding: '12px' }}><strong>{branch.name}</strong></td>
              <td style={{ padding: '12px' }}>{branch.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
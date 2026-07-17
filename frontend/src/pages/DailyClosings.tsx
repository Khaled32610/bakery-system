import { useEffect, useState } from 'react'
import axios from 'axios'

interface Branch { id: number; name: string; location: string; }
interface DailyClosing {
  id: number;
  branch_id: number;
  date: string;
  flour_sacks_used: number;
  yeast_packs_used: number;
  gas_cylinders_used: number;
  actual_bread_produced: number;
}

export default function DailyClosings() {
  const [closings, setClosings] = useState<DailyClosing[]>([])
  const [branches, setBranches] = useState<Branch[]>([])

  const [branchId, setBranchId] = useState<number | ''>('')
  const [flour, setFlour] = useState<number | ''>('')
  const [yeast, setYeast] = useState<number | ''>('')
  const [gas, setGas] = useState<number | ''>('')
  const [produced, setProduced] = useState<number | ''>('')

  const fetchData = () => {
    axios.get('http://127.0.0.1:8000/closings/').then(res => setClosings(res.data))
    axios.get('http://127.0.0.1:8000/branches/').then(res => setBranches(res.data))
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newClosing = {
      branch_id: Number(branchId),
      date: new Date().toISOString().split('T')[0],
      flour_sacks_used: Number(flour),
      yeast_packs_used: Number(yeast),
      gas_cylinders_used: Number(gas),
      actual_bread_produced: Number(produced)
    }

    axios.post('http://127.0.0.1:8000/closings/', newClosing).then(() => {
      fetchData()
      setBranchId('')
      setFlour('')
      setYeast('')
      setGas('')
      setProduced('')
    }).catch(err => console.error(err))
  }

  const getBranchName = (id: number) => branches.find(b => b.id === id)?.name || 'Unknown'

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>📊 Daily Closings & Production</h2>
      
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          <select value={branchId} onChange={(e) => setBranchId(Number(e.target.value))} required style={{ padding: '8px', width: '200px' }}>
            <option value="" disabled>Select Branch</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>

          <input type="number" placeholder="Flour (Sacks)" value={flour} onChange={(e) => setFlour(Number(e.target.value))} required style={{ padding: '8px' }} />
          <input type="number" placeholder="Yeast (Packs)" value={yeast} onChange={(e) => setYeast(Number(e.target.value))} required style={{ padding: '8px' }} />
          <input type="number" placeholder="Gas (Cylinders)" value={gas} onChange={(e) => setGas(Number(e.target.value))} required style={{ padding: '8px' }} />
          <input type="number" placeholder="Produced Bread (Loaves)" value={produced} onChange={(e) => setProduced(Number(e.target.value))} required style={{ padding: '8px' }} />

          <button type="submit" style={{ padding: '9px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Report</button>
        </form>
      </div>

      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Date</th>
            <th style={{ padding: '12px' }}>Branch</th>
            <th style={{ padding: '12px' }}>Flour Used</th>
            <th style={{ padding: '12px' }}>Yeast Used</th>
            <th style={{ padding: '12px' }}>Gas Used</th>
            <th style={{ padding: '12px' }}>Bread Produced</th>
          </tr>
        </thead>
        <tbody>
          {closings.map(report => (
            <tr key={report.id} style={{ borderTop: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>#{report.id}</td>
              <td style={{ padding: '12px' }}>{report.date}</td>
              <td style={{ padding: '12px' }}><strong>{getBranchName(report.branch_id)}</strong></td>
              <td style={{ padding: '12px' }}>{report.flour_sacks_used} Sacks</td>
              <td style={{ padding: '12px' }}>{report.yeast_packs_used} Packs</td>
              <td style={{ padding: '12px' }}>{report.gas_cylinders_used} Cylinders</td>
              <td style={{ padding: '12px', color: 'blue', fontWeight: 'bold' }}>{report.actual_bread_produced} Loaves</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
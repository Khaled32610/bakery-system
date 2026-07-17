import { useEffect, useState } from 'react'
import axios from 'axios'

interface Material {
  id: number;
  name: string;
  unit_type: string;
  expected_yield: number;
}

export default function Materials() {
  const [materials, setMaterials] = useState<Material[]>([])
  
  const [name, setName] = useState('')
  const [unitType, setUnitType] = useState('Sack')
  const [yieldAmount, setYieldAmount] = useState<number | ''>('')

  const fetchMaterials = () => {
    axios.get('http://127.0.0.1:8000/materials/')
      .then(response => setMaterials(response.data))
      .catch(error => console.error(error))
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newMaterial = { name, unit_type: unitType, expected_yield: Number(yieldAmount) }
    axios.post('http://127.0.0.1:8000/materials/', newMaterial).then(() => {
      fetchMaterials()
      setName('')
      setYieldAmount('')
    })
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>📦 Raw Materials Inventory</h2>
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input type="text" placeholder="Material Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '8px' }} />
          <select value={unitType} onChange={(e) => setUnitType(e.target.value)} style={{ padding: '8px' }}>
            <option value="Sack">Sack</option>
            <option value="Pack">Pack</option>
            <option value="Cylinder">Cylinder</option>
            <option value="Kg">Kg</option>
          </select>
          <input type="number" placeholder="Expected Yield" value={yieldAmount} onChange={(e) => setYieldAmount(Number(e.target.value))} required style={{ padding: '8px' }} />
          <button type="submit" style={{ padding: '9px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
        </form>
      </div>

      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr><th style={{ padding: '12px' }}>ID</th><th style={{ padding: '12px' }}>Name</th><th style={{ padding: '12px' }}>Unit</th><th style={{ padding: '12px' }}>Yield</th></tr>
        </thead>
        <tbody>
          {materials.map(mat => (
            <tr key={mat.id} style={{ borderTop: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{mat.id}</td>
              <td style={{ padding: '12px' }}><strong>{mat.name}</strong></td>
              <td style={{ padding: '12px' }}>{mat.unit_type}</td>
              <td style={{ padding: '12px' }}>{mat.expected_yield} Loaves</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
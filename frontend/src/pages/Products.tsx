import { useEffect, useState } from 'react'
import axios from 'axios'

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState<number | ''>('')

  const fetchProducts = () => {
    axios.get('http://127.0.0.1:8000/products/')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error))
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/products/', { 
      name, 
      price: Number(price) 
    }).then(() => {
      fetchProducts()
      setName('')
      setPrice('')
    })
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>🥖 Bread Types (Products)</h2>
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input type="text" placeholder="Bread Type (e.g., Baladi)" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '8px' }} />
          <input type="number" step="0.01" placeholder="Price per Loaf" value={price} onChange={(e) => setPrice(Number(e.target.value))} required style={{ padding: '8px' }} />
          <button type="submit" style={{ padding: '9px 20px', backgroundColor: '#fd7e14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Product</button>
        </form>
      </div>

      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr><th style={{ padding: '12px' }}>ID</th><th style={{ padding: '12px' }}>Type / Name</th><th style={{ padding: '12px' }}>Price</th></tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} style={{ borderTop: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{product.id}</td>
              <td style={{ padding: '12px' }}><strong>{product.name}</strong></td>
              <td style={{ padding: '12px' }}>{product.price} EGP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
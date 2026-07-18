import { useEffect, useState } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Client { id: number; name: string; current_balance: number; }
interface Invoice { id: number; client_id: number; date: string; quantity: number; }
interface DailyClosing { branch_id: number; date: string; flour_sacks_used: number; yeast_packs_used: number; gas_cylinders_used: number; actual_bread_produced: number; }
interface Branch { id: number; name: string; }

interface Props { isAr: boolean; }

export default function Dashboard({ isAr }: Props) {
  const [totalDebts, setTotalDebts] = useState(0)
  const [productionData, setProductionData] = useState<any[]>([])
  const [todayDistributions, setTodayDistributions] = useState<{clientName: string, quantity: number}[]>([])
  const [todayConsumption, setTodayConsumption] = useState<any[]>([])

  useEffect(() => {
    const todayDate = new Date().toISOString().split('T')[0]
    const fetchData = async () => {
      const clientsRes = await axios.get('http://127.0.0.1:8000/clients/')
      const invoicesRes = await axios.get('http://127.0.0.1:8000/invoices/')
      const closingsRes = await axios.get('http://127.0.0.1:8000/closings/')
      const branchesRes = await axios.get('http://127.0.0.1:8000/branches/')

      const clients: Client[] = clientsRes.data
      const invoices: Invoice[] = invoicesRes.data
      const closings: DailyClosing[] = closingsRes.data
      const branches: Branch[] = branchesRes.data

      setTotalDebts(clients.reduce((sum, c) => sum + c.current_balance, 0))

      const chartDataMap: { [key: string]: number } = {}
      closings.forEach(cls => {
        if (!chartDataMap[cls.date]) chartDataMap[cls.date] = 0
        chartDataMap[cls.date] += cls.actual_bread_produced
      })
      setProductionData(Object.keys(chartDataMap).map(date => ({ date, produced: chartDataMap[date] })))

      const todayInvs = invoices.filter(i => i.date === todayDate)
      const clientDistMap: { [key: number]: number } = {}
      todayInvs.forEach(inv => {
        if (!clientDistMap[inv.client_id]) clientDistMap[inv.client_id] = 0
        clientDistMap[inv.client_id] += inv.quantity
      })
      
      const distArray = Object.keys(clientDistMap).map(cid => {
        const c = clients.find(cl => cl.id === Number(cid))
        return { clientName: c ? c.name : (isAr ? 'غير معروف' : 'Unknown'), quantity: clientDistMap[Number(cid)] }
      })
      setTodayDistributions(distArray)

      const todayClosings = closings.filter(c => c.date === todayDate)
      const consArray = todayClosings.map(cls => {
        const b = branches.find(br => br.id === cls.branch_id)
        return {
          branchName: b ? b.name : (isAr ? 'غير معروف' : 'Unknown'),
          flour: cls.flour_sacks_used,
          yeast: cls.yeast_packs_used,
          gas: cls.gas_cylinders_used,
          produced: cls.actual_bread_produced
        }
      })
      setTodayConsumption(consArray)
    }
    fetchData()
  }, [isAr])

  const t = {
    pageTitle: isAr ? '📈 لوحة التحكم وملخص اليوم' : '📈 Dashboard & Daily Summary',
    debtsTitle: isAr ? 'إجمالي ديون السوق' : 'Total Market Debts',
    currency: isAr ? 'جنيه' : 'EGP',
    branchAct: isAr ? '🏭 نشاط الفروع اليوم' : '🏭 Today\'s Branch Activity',
    noClosings: isAr ? 'لم يتم تسجيل أي تقفيل اليوم.' : 'No closings recorded today yet.',
    flour: isAr ? 'دقيق' : 'Flour',
    sacks: isAr ? 'شيكارة' : 'Sacks',
    yeast: isAr ? 'خميرة' : 'Yeast',
    packs: isAr ? 'باكو' : 'Packs',
    gas: isAr ? 'غاز' : 'Gas',
    cylinders: isAr ? 'أنبوبة' : 'Cylinders',
    producedTxt: isAr ? 'الإنتاج' : 'Produced',
    loaves: isAr ? 'رغيف' : 'Loaves',
    distTitle: isAr ? '🚚 توزيع اليوم' : '🚚 Today\'s Distribution',
    noInvoices: isAr ? 'لا توجد فواتير اليوم.' : 'No invoices recorded today yet.',
    clientShop: isAr ? 'المحل / العميل' : 'Client / Shop',
    totalBread: isAr ? 'إجمالي العيش' : 'Total Bread Taken',
    chartTitle: isAr ? '📊 تاريخ الإنتاج' : '📊 Bread Production History',
    chartLabel: isAr ? 'إجمالي الأرغفة المنتجة' : 'Total Produced Loaves'
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>{t.pageTitle}</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: 1, backgroundColor: '#dc3545', color: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>{t.debtsTitle}</h3>
          <h2 style={{ fontSize: '32px', margin: '10px 0 0 0' }}>{totalDebts} {t.currency}</h2>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#007bff' }}>{t.branchAct}</h3>
          {todayConsumption.length === 0 ? <p>{t.noClosings}</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {todayConsumption.map((cons, idx) => (
                <li key={idx} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                  <strong>{cons.branchName}</strong>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '5px', fontSize: '14px', color: '#555', flexWrap: 'wrap' }}>
                    <span>🌾 {t.flour}: {cons.flour} {t.sacks}</span>
                    <span>🍞 {t.yeast}: {cons.yeast} {t.packs}</span>
                    <span>🔥 {t.gas}: {cons.gas} {t.cylinders}</span>
                  </div>
                  <div style={{ marginTop: '5px', color: '#28a745', fontWeight: 'bold' }}>
                    ✅ {t.producedTxt}: {cons.produced} {t.loaves}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '2px solid #28a745', paddingBottom: '10px', color: '#28a745' }}>{t.distTitle}</h3>
          {todayDistributions.length === 0 ? <p>{t.noInvoices}</p> : (
            <table style={{ width: '100%', textAlign: isAr ? 'right' : 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f4f4f4' }}>
                  <th style={{ padding: '8px' }}>{t.clientShop}</th>
                  <th style={{ padding: '8px' }}>{t.totalBread}</th>
                </tr>
              </thead>
              <tbody>
                {todayDistributions.map((dist, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px' }}>{dist.clientName}</td>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{dist.quantity} {t.loaves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', height: '350px' }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>{t.chartTitle}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={productionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="produced" name={t.chartLabel} fill="#ffc107" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
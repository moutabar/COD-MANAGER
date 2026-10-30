'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendingUp, Package, Truck, AlertTriangle } from 'lucide-react'
import AddOrderModal from '@/components/AddOrderModal'

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*, customers(full_name, phone_number)').order('created_at', { ascending: false })
    if (!error && data) setOrders(data)
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    const { error } = await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId)
    if (error) { alert("Erreur"); fetchOrders() }
  }

  // --- CALCUL DES KPIs ---
  const totalOrders = orders.length
  const revenue = orders.filter(o => o.status === 'livre').reduce((sum, o) => sum + Number(o.total_mad), 0)
  const pending = orders.filter(o => o.status === 'en_attente' || o.status === 'expedie').length
  const returns = orders.filter(o => o.status === 'retourne').length
  const returnRate = totalOrders > 0 ? ((returns / totalOrders) * 100).toFixed(1) : 0
  const shippingToCollect = orders.filter(o => o.status === 'expedie' || o.status === 'en_attente').reduce((sum, o) => sum + Number(o.shipping_fees_mad), 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'livre': return 'bg-green-100 text-green-800'
      case 'expedie': return 'bg-blue-100 text-blue-800'
      case 'retourne': return 'bg-red-100 text-red-800'
      case 'annule': return 'bg-gray-100 text-gray-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Chargement...</div>

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bords</h1>
        <AddOrderModal onOrderAdded={fetchOrders} />
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires (Livré)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{revenue.toLocaleString()} DH</div><p className="text-xs text-muted-foreground">Commandes livrées uniquement</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes en cours</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{pending}</div><p className="text-xs text-muted-foreground">En attente ou expédiées</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de retour</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{returnRate}%</div><p className="text-xs text-muted-foreground">{returns} retours sur {totalOrders} commandes</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frais de port à récupérer</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{shippingToCollect} DH</div><p className="text-xs text-muted-foreground">À récupérer auprès des livreurs</p></CardContent>
        </Card>
      </div>

      {/* TABLEAU */}
      <Card>
        <CardHeader><CardTitle>Gestion des commandes COD</CardTitle></CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Aucune commande pour le moment.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Commande</TableHead><TableHead>Client</TableHead><TableHead>Total</TableHead><TableHead>Statut</TableHead><TableHead>Action</TableHead><TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>{order.customers?.full_name || 'N/A'}</TableCell>
                      <TableCell>{order.total_mad} DH</TableCell>
                      <TableCell><Badge variant="secondary" className={getStatusColor(order.status)}>{order.status.toUpperCase()}</Badge></TableCell>
                      <TableCell>
                        <Select value={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
                          <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Statut" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en_attente">En attente</SelectItem>
                            <SelectItem value="expedie">Expédié</SelectItem>
                            <SelectItem value="livre">Livré</SelectItem>
                            <SelectItem value="retourne">Retourné</SelectItem>
                            <SelectItem value="annule">Annulé</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{new Date(order.created_at).toLocaleDateString('fr-FR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

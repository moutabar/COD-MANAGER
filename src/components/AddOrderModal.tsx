'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { jsPDF } from 'jspdf'

export default function AddOrderModal({ onOrderAdded }: { onOrderAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const [form, setForm] = useState({ customerName: '', customerPhone: '', customerCity: '', customerAddress: '', productName: '', quantity: 1, price: 0, shippingFees: 30 })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) throw new Error("Non connecté")

      let { data: sellerData } = await supabase.from('sellers').select('id').eq('id', user.id).single()
      if (!sellerData) {
        await supabase.from('sellers').insert([{ id: user.id, email: user.email!, full_name: 'Vendeur', store_name: 'Ma Boutique', phone_number: '0600000000', city: 'Casablanca' }])
      }

      const { data: customerData, error: customerError } = await supabase.from('customers').insert([{ full_name: form.customerName, phone_number: form.customerPhone, city: form.customerCity, address: form.customerAddress, seller_id: user.id }]).select().single()
      if (customerError) throw customerError

      const orderNumber = `CMD-${Date.now().toString().slice(-6)}`
      const total = (Number(form.price) * Number(form.quantity)) + Number(form.shippingFees)

      const { error: orderError } = await supabase.from('orders').insert([{ order_number: orderNumber, customer_id: customerData.id, seller_id: user.id, product_name: form.productName, quantity: Number(form.quantity), price_mad: Number(form.price), shipping_fees_mad: Number(form.shippingFees), total_mad: total, status: 'en_attente' }])
      if (orderError) throw orderError

      const doc = new jsPDF()
      doc.setFontSize(22); doc.text('BON DE LIVRAISON', 105, 20, { align: 'center' })
      doc.setFontSize(12); doc.text(`N°: ${orderNumber}`, 20, 40); doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 48)
      doc.setFontSize(14); doc.text('DESTINATAIRE', 20, 70)
      doc.setFontSize(12); doc.text(`Nom: ${form.customerName}`, 20, 80); doc.text(`Tél: ${form.customerPhone}`, 20, 88); doc.text(`Adresse: ${form.customerAddress}`, 20, 96); doc.text(`Ville: ${form.customerCity}`, 20, 104)
      doc.setFontSize(14); doc.text('DÉTAILS', 20, 130)
      doc.setFontSize(12); doc.text(`Produit: ${form.productName}`, 20, 140); doc.text(`Qté: ${form.quantity}`, 20, 148); doc.text(`Prix: ${form.price} DH`, 20, 156); doc.text(`Livraison: ${form.shippingFees} DH`, 20, 164)
      doc.setFontSize(14); doc.text(`TOTAL: ${total} DH`, 20, 180)
      doc.save(`BL_${orderNumber}.pdf`)

      setOpen(false)
      setForm({ customerName: '', customerPhone: '', customerCity: '', customerAddress: '', productName: '', quantity: 1, price: 0, shippingFees: 30 })
      onOrderAdded()
    } catch (error: any) { alert('Erreur : ' + error.message) } finally { setLoading(false) }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" />Nouvelle commande</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Ajouter une commande COD</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium">Nom</label><Input name="customerName" value={form.customerName} onChange={handleChange} required /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Téléphone</label><Input name="customerPhone" value={form.customerPhone} onChange={handleChange} required /></div>
              <div className="space-y-2 col-span-2"><label className="text-sm font-medium">Adresse</label><Input name="customerAddress" value={form.customerAddress} onChange={handleChange} required /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Ville</label><Input name="customerCity" value={form.customerCity} onChange={handleChange} required /></div>
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Détails</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2"><label className="text-sm font-medium">Produit</label><Input name="productName" value={form.productName} onChange={handleChange} required /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Quantité</label><Input type="number" name="quantity" value={form.quantity} onChange={handleChange} required /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Prix (DH)</label><Input type="number" name="price" value={form.price} onChange={handleChange} required /></div>
                <div className="space-y-2 col-span-2"><label className="text-sm font-medium">Livraison (DH)</label><Input type="number" name="shippingFees" value={form.shippingFees} onChange={handleChange} required /></div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? '...' : 'Enregistrer et générer le BL'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
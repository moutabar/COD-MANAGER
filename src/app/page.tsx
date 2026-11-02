import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Package, TrendingUp, FileText } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">COD Manager</h1>
          <div className="flex gap-4">
            <Link href="/login"><Button variant="outline">Se connecter</Button></Link>
            <Link href="/dashboard"><Button>Essayer gratuitement</Button></Link>
          </div>
        </div>
      </header>
      <section className="max-w-7xl mx-auto px-8 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">Gérez vos commandes COD en 1 clic</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Arrêtez de perdre du temps avec Excel. Générez vos Bons de Livraison, 
          suivez vos retours et calculez votre chiffre d'affaires automatiquement.
        </p>
        <Link href="/dashboard"><Button size="lg" className="text-lg px-8">Commencer gratuitement →</Button></Link>
      </section>
      <section className="max-w-7xl mx-auto px-8 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Tout ce dont vous avez besoin</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Card><CardHeader><FileText className="w-8 h-8 mb-2 text-primary" /><CardTitle>Bons de Livraison PDF</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Générez automatiquement des BL professionnels pour Amana, Cathedis et tous les livreurs.</p></CardContent></Card>
          <Card><CardHeader><Package className="w-8 h-8 mb-2 text-primary" /><CardTitle>Suivi des statuts</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">En attente, expédié, livré, retourné. Sachez exactement où en est chaque commande.</p></CardContent></Card>
          <Card><CardHeader><TrendingUp className="w-8 h-8 mb-2 text-primary" /><CardTitle>Dashboard & KPIs</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Chiffre d'affaires, taux de retour, frais de port à récupérer. Tout en temps réel.</p></CardContent></Card>
        </div>
      </section>
      <footer className="border-t mt-20"><div className="max-w-7xl mx-auto px-8 py-8 text-center text-muted-foreground"><p>© 2026 COD Manager. Fait avec ❤️ au Maroc.</p></div></footer>
    </div>
  )
} 
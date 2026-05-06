'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ShoppingBag, TrendingUp, Calendar } from 'lucide-react'

type Purchase = {
  _id: string
  productName: string
  exhibitorName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  createdAt: string
}

export default function BuyerDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=/buyer-dashboard')
    }
  }, [status, router])

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch('/api/purchases')
        const data = await response.json()
        setPurchases(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch purchases:', error)
        setPurchases([])
      } finally {
        setIsLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchPurchases()
    }
  }, [status])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Calculate statistics
  const totalPurchases = purchases.length
  const totalSpent = purchases.reduce((sum, p) => sum + p.totalPrice, 0)
  const avgOrderValue = totalPurchases > 0 ? totalSpent / totalPurchases : 0

  // Group purchases by exhibitor
  const purchasesByExhibitor = purchases.reduce(
    (acc, purchase) => {
      const existing = acc.find(g => g.exhibitorName === purchase.exhibitorName)
      if (existing) {
        existing.purchases.push(purchase)
        existing.totalSpent += purchase.totalPrice
      } else {
        acc.push({
          exhibitorName: purchase.exhibitorName,
          purchases: [purchase],
          totalSpent: purchase.totalPrice,
        })
      }
      return acc
    },
    [] as Array<{ exhibitorName: string; purchases: Purchase[]; totalSpent: number }>
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Purchases</h1>
          <p className="mt-2 text-muted-foreground">Track and manage all your coffee purchases</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </CardTitle>
                <ShoppingBag className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalPurchases}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {purchasesByExhibitor.length} different {purchasesByExhibitor.length === 1 ? 'supplier' : 'suppliers'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Spent
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${totalSpent.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg order: ${avgOrderValue.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Quantity
                </CardTitle>
                <Calendar className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {purchases.reduce((sum, p) => sum + p.quantity, 0)} units
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg per order: {totalPurchases > 0 ? (purchases.reduce((sum, p) => sum + p.quantity, 0) / totalPurchases).toFixed(1) : 0} units
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {purchases.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No purchases yet</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Start exploring our exhibitor directory to discover premium coffee and make your first purchase.
                </p>
                <Button onClick={() => router.push('/exhibitors')}>
                  Browse Exhibitors
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {purchasesByExhibitor.map((group, idx) => (
                <div key={idx} className="space-y-4">
                  {/* Exhibitor Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">{group.exhibitorName}</h2>
                      <p className="text-sm text-muted-foreground">
                        {group.purchases.length} {group.purchases.length === 1 ? 'order' : 'orders'} • ${group.totalSpent.toFixed(2)} spent
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/exhibitors/${group.exhibitorName.toLowerCase().replace(/\s+/g, '-')}`)}
                    >
                      View Profile
                    </Button>
                  </div>

                  {/* Purchase Cards */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {group.purchases.map((purchase) => (
                      <Card key={purchase._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-foreground text-sm truncate">
                                {purchase.productName}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(purchase.createdAt)}
                              </p>
                            </div>

                            <div className="flex justify-between items-start text-sm">
                              <div className="space-y-1">
                                <p className="text-muted-foreground">Quantity</p>
                                <p className="font-semibold text-foreground">{purchase.quantity} units</p>
                              </div>
                              <div className="space-y-1 text-right">
                                <p className="text-muted-foreground">Unit Price</p>
                                <p className="font-semibold text-foreground">${purchase.unitPrice.toFixed(2)}</p>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-border">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Total</span>
                                <span className="text-lg font-bold text-primary">
                                  ${purchase.totalPrice.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

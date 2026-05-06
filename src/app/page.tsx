'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Coffee, Users, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-card to-secondary/50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-balance text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
                East Africa Coffee Market
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Discover premium coffee exhibitors and specialty suppliers from across East Africa. Connect with roasters, traders, and coffee innovators in one comprehensive directory.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/exhibitors">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 sm:w-auto">
                    Browse Exhibitors
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="h-96 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
              <Coffee className="h-32 w-32 text-accent/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-8 text-center">
              <Users className="h-8 w-8 text-primary" />
              <h3 className="text-3xl font-bold text-foreground">100+</h3>
              <p className="text-muted-foreground">Exhibitors & Suppliers</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-8 text-center">
              <Coffee className="h-8 w-8 text-primary" />
              <h3 className="text-3xl font-bold text-foreground">15+</h3>
              <p className="text-muted-foreground">Countries Represented</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-8 text-center">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h3 className="text-3xl font-bold text-foreground">Premium</h3>
              <p className="text-muted-foreground">Quality Guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="border-t border-border bg-card py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-foreground">Popular Categories</h2>
          <p className="mt-3 text-center text-muted-foreground">
            Explore exhibitors by specialty and industry
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Specialty Coffee',
              'Roastery',
              'Equipment & Machinery',
              'Direct Trade',
              'Sustainable Farming',
              'Processing & Innovation',
            ].map(category => (
              <Link
                key={category}
                href={`/exhibitors?category=${category}`}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-all hover:border-primary hover:bg-secondary/30"
              >
                <span className="font-medium text-foreground">{category}</span>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance text-3xl font-bold text-foreground">
            Ready to Connect?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start exploring the East Africa Coffee Market today and discover your next coffee partner.
          </p>
          <div className="mt-8 flex flex-col gap-3 justify-center sm:flex-row">
            <Link href="/exhibitors">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 sm:w-auto">
                View All Exhibitors
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

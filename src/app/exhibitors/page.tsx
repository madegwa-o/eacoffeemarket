'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, MapPin, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock data - replace with actual API call
const mockExhibitors = [
  {
    _id: '1',
    company_name: 'Ethiopian Highlands Coffee Co.',
    logo_url: '/coffee-1.jpg',
    description: 'Premium specialty coffee from the highlands of Ethiopia. Known for their fruity notes and vibrant acidity. Direct from farmers to your cup.',
    booth_number: 'A-102',
    country: 'Ethiopia',
    industries: ['Specialty Coffee', 'Direct Trade', 'Organic'],
    looking_for: ['Distributors', 'Cafes'],
  },
  {
    _id: '2',
    company_name: 'Kenya AA Roasters',
    logo_url: '/coffee-2.jpg',
    description: 'Artisanal roasting of Kenya\'s finest AA grade beans. Small batch roasts with exceptional clarity and balanced body.',
    booth_number: 'B-205',
    country: 'Kenya',
    industries: ['Specialty Coffee', 'Roastery', 'Fair Trade'],
    looking_for: ['Retailers', 'Restaurants'],
  },
  {
    _id: '3',
    company_name: 'Rwanda Burundi Coffee Trading',
    logo_url: '/coffee-3.jpg',
    description: 'Exporting premium Arabica from Rwanda and Burundi. Famous for their complex flavor profiles and sustainable farming practices.',
    booth_number: 'C-301',
    country: 'Rwanda',
    industries: ['Export', 'Sustainable Coffee', 'Wholesale'],
    looking_for: ['Importers', 'Roasters'],
  },
  {
    _id: '4',
    company_name: 'Uganda Coffee Innovations',
    logo_url: '/coffee-4.jpg',
    description: 'Pioneering sustainable coffee production in Uganda. Blending traditional methods with modern technology for exceptional results.',
    booth_number: 'D-104',
    country: 'Uganda',
    industries: ['Innovation', 'Sustainable Farming', 'Processing'],
    looking_for: ['Partners', 'Investors'],
  },
  {
    _id: '5',
    company_name: 'Tanzania Coffee Equipment Supplier',
    logo_url: '/coffee-5.jpg',
    description: 'Premium coffee equipment and machinery for roasters and processors. Backed by 20 years of industry expertise.',
    booth_number: 'E-203',
    country: 'Tanzania',
    industries: ['Equipment', 'Machinery', 'B2B Solutions'],
    looking_for: ['Coffee Businesses', 'Distributors'],
  },
  {
    _id: '6',
    company_name: 'Cameroon Premium Robusta',
    logo_url: '/coffee-6.jpg',
    description: 'High-quality Robusta beans from Cameroon. Perfect for espresso blends and instant coffee production.',
    booth_number: 'F-105',
    country: 'Cameroon',
    industries: ['Robusta', 'Espresso', 'Blending'],
    looking_for: ['Blenders', 'Instant Coffee Makers'],
  },
]

const COUNTRIES = ['All', 'Ethiopia', 'Kenya', 'Rwanda', 'Uganda', 'Tanzania', 'Cameroon']
const CATEGORIES = [
  'All',
  'Specialty Coffee',
  'Roastery',
  'Direct Trade',
  'Equipment',
  'Wholesale',
  'Sustainable Farming',
  'Innovation',
]
const ALPHABET = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

export default function ExhibitorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLetter, setSelectedLetter] = useState('All')

  const filteredExhibitors = useMemo(() => {
    return mockExhibitors.filter(exhibitor => {
      const matchesSearch = exhibitor.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCountry = selectedCountry === 'All' || exhibitor.country === selectedCountry
      const matchesCategory = selectedCategory === 'All' || exhibitor.industries.includes(selectedCategory)
      const matchesLetter = selectedLetter === 'All' || exhibitor.company_name.toUpperCase().startsWith(selectedLetter)

      return matchesSearch && matchesCountry && matchesCategory && matchesLetter
    })
  }, [searchTerm, selectedCountry, selectedCategory, selectedLetter])

  const hasFilters = searchTerm || selectedCountry !== 'All' || selectedCategory !== 'All' || selectedLetter !== 'All'

  return (
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-balance text-4xl font-bold text-foreground md:text-5xl">
            Coffee Market Exhibitors
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Discover premium coffee vendors and suppliers from across East Africa
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search exhibitors by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Dropdowns */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Country</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCountry('All')
                  setSelectedCategory('All')
                  setSelectedLetter('All')
                }}
                className="self-end"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Alphabetical Filters */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Filter by Name</label>
            <div className="flex flex-wrap gap-2">
              {ALPHABET.map(letter => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`h-10 w-10 rounded border transition-all ${
                    selectedLetter === letter
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:border-primary'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="mb-6 text-sm text-muted-foreground">
          Showing {filteredExhibitors.length} exhibitor{filteredExhibitors.length !== 1 ? 's' : ''}
        </p>

        {/* Exhibitor Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredExhibitors.length > 0 ? (
            filteredExhibitors.map(exhibitor => (
              <Link key={exhibitor._id} href={`/exhibitors/${exhibitor._id}`}>
                <article className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
                  {/* Logo and Header */}
                  <div className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 rounded-md bg-secondary" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground">{exhibitor.company_name}</h3>
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {exhibitor.country}
                      </div>
                      {exhibitor.booth_number && (
                        <p className="text-xs text-muted-foreground">Stand {exhibitor.booth_number}</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="line-clamp-2 text-sm text-foreground">
                    {exhibitor.description}
                  </p>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    {exhibitor.industries.slice(0, 3).map(industry => (
                      <span
                        key={industry}
                        className="inline-flex rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>

                  {/* View Profile Button */}
                  <Button variant="outline" className="mt-auto w-full">
                    View Profile
                  </Button>
                </article>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex min-h-96 items-center justify-center rounded-lg border border-border bg-card">
              <div className="text-center">
                <Filter className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No exhibitors found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

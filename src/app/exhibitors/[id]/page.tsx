'use client'

import Link from 'next/link'
import { ArrowLeft, MapPin, Globe, Mail, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Mock data - replace with actual API call
const mockExhibitors: Record<string, any> = {
  '1': {
    _id: '1',
    company_name: 'Ethiopian Highlands Coffee Co.',
    logo_url: '/coffee-1.jpg',
    description: 'Premium specialty coffee from the highlands of Ethiopia. Known for their fruity notes and vibrant acidity. Direct from farmers to your cup.',
    long_description: `Ethiopian Highlands Coffee Co. has been sourcing and exporting the world's finest specialty coffee directly from small-scale farmers in the Yirgacheffe and Sidamo regions for over 15 years.

Our commitment to quality begins in the field. We work exclusively with farmers who practice sustainable and organic methods, ensuring both exceptional flavor and environmental stewardship.

Every lot is carefully curated, processed, and quality-tested before leaving Ethiopia. We pride ourselves on our direct relationships with producers, ensuring fair prices and long-term partnerships that support farming communities.

Our coffee is characterized by bright acidity, complex fruit notes (ranging from blueberry to citrus), and a smooth, clean finish. Perfect for specialty coffee shops, roasters, and direct-to-consumer brands.`,
    booth_number: 'A-102',
    country: 'Ethiopia',
    website: 'https://example.com',
    industries: ['Specialty Coffee', 'Direct Trade', 'Organic', 'Arabica', 'Yirgacheffe'],
    looking_for: ['Distributors', 'Specialty Coffee Shops', 'Roasters', 'International Partners'],
  },
  '2': {
    _id: '2',
    company_name: 'Kenya AA Roasters',
    logo_url: '/coffee-2.jpg',
    description: 'Artisanal roasting of Kenya\'s finest AA grade beans. Small batch roasts with exceptional clarity and balanced body.',
    long_description: `Kenya AA Roasters specializes in single-origin roasts of Kenya's most prized AA grade beans. Every roast is done in small batches, allowing our master roasters to achieve perfect flavor development.

We work with cooperatives across Kenya's Central Province, including the renowned Nyeri and Embu regions. Our direct relationships with farmers allow us to source the highest quality beans and maintain consistency across seasons.

Our roasting philosophy emphasizes bringing out the inherent qualities of each bean. Kenya AA coffees are known for their balanced body, wine-like acidity, and complex flavor notes of berries, stone fruits, and chocolate.

Whether you're a café owner looking for distinctive single-origin offerings or a retailer seeking premium whole beans, we have the perfect roast profile for your needs.`,
    booth_number: 'B-205',
    country: 'Kenya',
    website: 'https://example.com',
    industries: ['Specialty Coffee', 'Roastery', 'Fair Trade', 'AA Grade', 'Small Batch'],
    looking_for: ['Retailers', 'Restaurants', 'Cafes', 'Online Retailers'],
  },
  '3': {
    _id: '3',
    company_name: 'Rwanda Burundi Coffee Trading',
    logo_url: '/coffee-3.jpg',
    description: 'Exporting premium Arabica from Rwanda and Burundi. Famous for their complex flavor profiles and sustainable farming practices.',
    long_description: `Rwanda Burundi Coffee Trading brings you the exceptional coffees from two of Africa's most dynamic coffee-producing nations.

Rwanda has emerged as a leading specialty coffee producer, known for its washed coffees with vibrant fruit acidity and floral notes. Burundi's volcanic soil produces complex, full-bodied beans with berry undertones.

We partner directly with washing stations and farmer cooperatives, ensuring quality from harvest to export. Our commitment to sustainability includes support for community development projects and environmental conservation.

Every shipment is quality-assured through rigorous cupping and analysis. We offer customized lot selections and can accommodate wholesale, import, and direct-to-consumer business models.

Our coffees have won numerous international competitions and are featured in specialty cafes worldwide.`,
    booth_number: 'C-301',
    country: 'Rwanda',
    website: 'https://example.com',
    industries: ['Export', 'Sustainable Coffee', 'Wholesale', 'Arabica', 'Specialty'],
    looking_for: ['Importers', 'Roasters', 'Distributors', 'Coffee Traders'],
  },
  '4': {
    _id: '4',
    company_name: 'Uganda Coffee Innovations',
    logo_url: '/coffee-4.jpg',
    description: 'Pioneering sustainable coffee production in Uganda. Blending traditional methods with modern technology for exceptional results.',
    long_description: `Uganda Coffee Innovations is revolutionizing the country's coffee industry through sustainable practices and technological advancement.

We focus on smallholder farmer development, providing training on organic farming, improved processing techniques, and climate adaptation strategies. Our innovation hub tests and implements new agritech solutions to boost yields while protecting the environment.

Uganda's Robusta is world-renowned for its full body and earthy character. Our carefully processed lots showcase the best of what Uganda has to offer, from deep, rich flavors to surprising complexity.

We also engage in value-added processing—pulped natural and fermented coffees that offer unique flavor profiles increasingly sought by adventurous roasters and cafes.

Partnership with us means investing in the future of African coffee while securing a reliable, sustainable supply of exceptional beans.`,
    booth_number: 'D-104',
    country: 'Uganda',
    website: 'https://example.com',
    industries: ['Innovation', 'Sustainable Farming', 'Processing', 'Robusta', 'Training'],
    looking_for: ['Partners', 'Investors', 'Roasters', 'Impact Investors'],
  },
}

export default function ExhibitorDetailsPage({ params }: { params: { id: string } }) {
  const exhibitor = mockExhibitors[params.id]

  if (!exhibitor) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/exhibitors">
            <Button variant="outline" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <h2 className="text-2xl font-bold text-foreground">Exhibitor not found</h2>
            <p className="mt-2 text-muted-foreground">The exhibitor you're looking for doesn't exist.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Back Button and Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/exhibitors">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-6">
              {/* Logo */}
              <div className="h-32 w-32 flex-shrink-0 rounded-lg bg-secondary" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground md:text-4xl">{exhibitor.company_name}</h1>
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>{exhibitor.country}</span>
                  </div>
                  {exhibitor.booth_number && (
                    <div className="text-muted-foreground">
                      Stand {exhibitor.booth_number}
                    </div>
                  )}
                  {exhibitor.website && (
                    <a href={exhibitor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                      <Globe className="h-5 w-5" />
                      <span>Visit Website</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button className="bg-primary hover:bg-primary/90">Contact Exhibitor</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* About Section */}
            <section className="mb-12">
              <h2 className="mb-4 text-2xl font-bold text-foreground">About</h2>
              <p className="mb-4 whitespace-pre-line text-foreground leading-relaxed">
                {exhibitor.long_description}
              </p>
            </section>

            {/* Industries/Categories Section */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {exhibitor.industries.map((industry: string) => (
                  <Badge key={industry} className="bg-accent/20 text-accent hover:bg-accent/30">
                    {industry}
                  </Badge>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            {/* Looking For Section */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-bold text-foreground">Looking For</h3>
              <ul className="space-y-2">
                {exhibitor.looking_for.map((item: string) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Section */}
            <div className="mt-6 rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-bold text-foreground">Contact</h3>
              <div className="space-y-3">
                {exhibitor.website && (
                  <a
                    href={exhibitor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    {exhibitor.website.replace('https://', '')}
                  </a>
                )}
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
              <p className="text-xs text-muted-foreground">
                📍 Stand {exhibitor.booth_number}
              </p>
              <p className="text-xs text-muted-foreground">
                🌍 Based in {exhibitor.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

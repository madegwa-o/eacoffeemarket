'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  User,
  History,
  Settings,
  Bell,
  Shield,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { usePushNotifications } from '@/hooks/use-push-notifications'

interface UserProfile {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  roles: string[]
  accountType: string
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const { isSupported, isSubscribed, subscribeToPush, unsubscribeFromPush } = usePushNotifications()
  const router = useRouter()

  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Exhibitor role request state
  const [isExhibitorDialogOpen, setIsExhibitorDialogOpen] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [isRequestingRole, setIsRequestingRole] = useState(false)
  const [roleError, setRoleError] = useState<string | null>(null)

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [isProcessingPush, setIsProcessingPush] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=/account')
    }
  }, [status, router])

  // Fetch user profile
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status])

  const fetchProfile = async () => {
    setIsLoadingProfile(true)
    try {
      const response = await fetch('/api/user/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      setProfile(data)
      setEditName(data.name)
      setEditPhone(data.phone)
      setEditAddress(data.address)
    } catch (error) {
      console.error('Profile fetch error:', error)
      setProfileError('Failed to load profile')
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(null)
    setIsSavingProfile(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          address: editAddress,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setProfileError(data.message || 'Failed to save profile')
      } else {
        setProfile(data)
        setProfileSuccess('Profile updated successfully!')
        setTimeout(() => setProfileSuccess(null), 3000)
      }
    } catch (error) {
      console.error('Profile save error:', error)
      setProfileError('An error occurred. Please try again.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleRequestExhibitorRole = async (e: React.FormEvent) => {
    e.preventDefault()
    setRoleError(null)
    setIsRequestingRole(true)

    try {
      const response = await fetch('/api/user/request-exhibitor-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          phone: companyPhone,
          website: companyWebsite,
          description: companyDescription,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setRoleError(data.message || 'Failed to request role')
      } else {
        // Refresh profile to show new role
        await fetchProfile()
        setIsExhibitorDialogOpen(false)
        setCompanyName('')
        setCompanyPhone('')
        setCompanyWebsite('')
        setCompanyDescription('')
      }
    } catch (error) {
      console.error('Exhibitor role request error:', error)
      setRoleError('An error occurred. Please try again.')
    } finally {
      setIsRequestingRole(false)
    }
  }

  const handleTogglePush = async (checked: boolean) => {
    setIsProcessingPush(true)
    try {
      if (checked) {
        await subscribeToPush()
      } else {
        await unsubscribeFromPush()
      }
    } catch (err) {
      console.error('Notification toggle error:', err)
    } finally {
      setIsProcessingPush(false)
    }
  }

  if (status === 'loading' || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session || !profile) {
    return null
  }

  const hasExhibitorRole = profile.roles.includes('EXHIBITOR')

  return (
    <main className="container px-4 py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-bold text-3xl mb-2">My Account</h1>
        <p className="text-muted-foreground">Manage your profile and account settings.</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your account details and roles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Info */}
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="text-lg font-medium text-foreground">{profile.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-lg font-medium text-foreground">{profile.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Account Type</Label>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                      {profile.accountType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Roles Section */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-foreground mb-4">Your Roles</h3>
                <div className="space-y-3">
                  {profile.roles.map(role => (
                    <div
                      key={role}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20"
                    >
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium text-foreground">{role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exhibitor Section */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-foreground mb-4">Exhibitor Status</h3>
                {hasExhibitorRole ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-900">You&apos;re an Exhibitor</p>
                        <p className="text-sm text-green-700">
                          You can post products and manage your listings.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push('/exhibitor-dashboard')}
                      className="w-full"
                    >
                      Go to Exhibitor Dashboard
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Become an exhibitor to post and sell your coffee products directly.
                    </p>
                    <Dialog open={isExhibitorDialogOpen} onOpenChange={setIsExhibitorDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          Become an Exhibitor
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Become an Exhibitor</DialogTitle>
                          <DialogDescription>
                            Tell us about your coffee business to get started as an exhibitor.
                          </DialogDescription>
                        </DialogHeader>

                        {roleError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{roleError}</AlertDescription>
                          </Alert>
                        )}

                        <form onSubmit={handleRequestExhibitorRole} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input
                              id="company-name"
                              placeholder="Your coffee company"
                              value={companyName}
                              onChange={e => setCompanyName(e.target.value)}
                              required
                              disabled={isRequestingRole}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="company-phone">Phone Number</Label>
                            <Input
                              id="company-phone"
                              type="tel"
                              placeholder="+254 700 000 000"
                              value={companyPhone}
                              onChange={e => setCompanyPhone(e.target.value)}
                              required
                              disabled={isRequestingRole}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="company-website">Website (Optional)</Label>
                            <Input
                              id="company-website"
                              type="url"
                              placeholder="https://example.com"
                              value={companyWebsite}
                              onChange={e => setCompanyWebsite(e.target.value)}
                              disabled={isRequestingRole}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="company-description">
                              Tell us about your business
                            </Label>
                            <Textarea
                              id="company-description"
                              placeholder="Describe your coffee business, products, and specialties..."
                              value={companyDescription}
                              onChange={e => setCompanyDescription(e.target.value)}
                              required
                              disabled={isRequestingRole}
                              className="min-h-24"
                            />
                            <p className="text-xs text-muted-foreground">
                              Minimum 20 characters
                            </p>
                          </div>

                          <Button
                            type="submit"
                            disabled={isRequestingRole}
                            className="w-full"
                          >
                            {isRequestingRole ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              'Submit Request'
                            )}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}
              {profileSuccess && (
                <Alert className="border-primary bg-primary/10">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-primary">{profileSuccess}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    disabled={isSavingProfile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    disabled={isSavingProfile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Your address"
                    value={editAddress}
                    onChange={e => setEditAddress(e.target.value)}
                    disabled={isSavingProfile}
                  />
                </div>
                <Button type="submit" disabled={isSavingProfile}>
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive order updates and notifications
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  {!isSupported ? (
                    <p className="text-muted-foreground text-sm">
                      Push notifications not supported on this device.
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {isSubscribed
                        ? "You're subscribed to push notifications."
                        : 'Get alerts for important updates.'}
                    </p>
                  )}
                </div>

                {isProcessingPush ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <Switch
                    id="push-notifications"
                    disabled={!isSupported}
                    checked={isSubscribed}
                    onCheckedChange={handleTogglePush}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Delete Account</p>
                  <p className="text-muted-foreground text-xs">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

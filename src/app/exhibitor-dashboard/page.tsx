'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Edit2, Plus, Loader2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  origin: string;
  price: number;
  quantityAvailable: number;
  imageUrl?: string;
  createdAt: string;
}

export default function ExhibitorDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Redirect non-exhibitors
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    } else if (status === 'authenticated' && !session?.user?.roles?.includes('EXHIBITOR')) {
      router.push('/');
    }
  }, [status, session, router]);

  // Load exhibitor's products
  useEffect(() => {
    if (session?.user?.id) {
      fetchProducts();
    }
  }, [session?.user?.id]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?exhibitorId=${session?.user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData(event.currentTarget);
      const payload = Object.fromEntries(formData.entries());

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage('✓ Coffee posted successfully!');
        (event.currentTarget as HTMLFormElement).reset();
        await fetchProducts();
      } else {
        const error = await res.json();
        setMessage(`✗ ${error.message || 'Failed to post coffee'}`);
      }
    } catch (error) {
      setMessage('✗ An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(product: Product) {
    setEditingId(product._id);
    setEditForm(product);
  }

  async function handleSaveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData(event.currentTarget);
      const payload = Object.fromEntries(formData.entries());

      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...payload }),
      });

      if (res.ok) {
        setMessage('✓ Product updated successfully!');
        setEditingId(null);
        setEditForm({});
        await fetchProducts();
      } else {
        const error = await res.json();
        setMessage(`✗ ${error.message || 'Failed to update product'}`);
      }
    } catch (error) {
      setMessage('✗ An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessage('✓ Product deleted successfully!');
        await fetchProducts();
      } else {
        const error = await res.json();
        setMessage(`✗ ${error.message || 'Failed to delete product'}`);
      }
    } catch (error) {
      setMessage('✗ An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  }

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Exhibitor Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your coffee products and share them with buyers across East Africa.
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <Card className={`mb-6 border-l-4 ${message.startsWith('✓') ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
            <CardContent className="pt-6">
              <p className={message.startsWith('✓') ? 'text-green-700' : 'text-red-700'}>{message}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Post Form Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Post New Coffee
                </CardTitle>
                <CardDescription>Add your coffee to the marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Coffee Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. Ethiopia Yirgacheffe"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your coffee..."
                      required
                      disabled={submitting}
                      className="h-24"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin *</Label>
                    <Input
                      id="origin"
                      name="origin"
                      placeholder="e.g. Sidamo, Ethiopia"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (USD) *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        name="quantityAvailable"
                        type="number"
                        min="1"
                        placeholder="0"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      placeholder="https://example.com/coffee.jpg"
                      disabled={submitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post Coffee'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Products List Section */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Your Products</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {products.length} coffee {products.length === 1 ? 'posted' : 'posted'}
                  </p>
                </div>
              </div>

              {loading ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </CardContent>
                </Card>
              ) : products.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No products posted yet. Create your first listing!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {products.map((product) => (
                    <Card key={product._id} className="overflow-hidden hover:border-primary/50 transition-colors">
                      {editingId === product._id ? (
                        <CardContent className="pt-6">
                          <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Coffee Name *</Label>
                              <Input
                                id="edit-name"
                                name="name"
                                value={editForm.name || ''}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                required
                                disabled={submitting}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-description">Description *</Label>
                              <Textarea
                                id="edit-description"
                                name="description"
                                value={editForm.description || ''}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                required
                                disabled={submitting}
                                className="h-20"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor="edit-origin">Origin *</Label>
                                <Input
                                  id="edit-origin"
                                  name="origin"
                                  value={editForm.origin || ''}
                                  onChange={(e) => setEditForm({ ...editForm, origin: e.target.value })}
                                  required
                                  disabled={submitting}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-price">Price (USD) *</Label>
                                <Input
                                  id="edit-price"
                                  name="price"
                                  type="number"
                                  step="0.01"
                                  value={editForm.price || ''}
                                  onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                  required
                                  disabled={submitting}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-quantity">Quantity *</Label>
                              <Input
                                id="edit-quantity"
                                name="quantityAvailable"
                                type="number"
                                value={editForm.quantityAvailable || ''}
                                onChange={(e) => setEditForm({ ...editForm, quantityAvailable: Number(e.target.value) })}
                                required
                                disabled={submitting}
                              />
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-primary hover:bg-primary/90"
                              >
                                {submitting ? 'Saving...' : 'Save Changes'}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditForm({});
                                }}
                                disabled={submitting}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      ) : (
                        <>
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{product.name}</CardTitle>
                                <CardDescription>{product.origin}</CardDescription>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {product.quantityAvailable} in stock
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                            {product.imageUrl && (
                              <p className="text-xs text-muted-foreground mb-4">Image: {product.imageUrl}</p>
                            )}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(product)}
                                className="flex-1 gap-2"
                                disabled={submitting || editingId !== null}
                              >
                                <Edit2 className="h-4 w-4" />
                                Edit
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="flex-1 gap-2"
                                    disabled={submitting || editingId !== null}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete &quot;{product.name}&quot;? This action cannot be undone.
                                  </AlertDialogDescription>
                                  <div className="flex gap-3 justify-end">
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(product._id)}
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </div>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardContent>
                        </>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

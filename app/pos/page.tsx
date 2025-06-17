"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus, Minus, Trash2, ShoppingCart, Calculator } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  type: "product" | "service" | "combo"
}

const products = [
  { id: "1", name: "Laptop", price: 15000, category: "Electronics", type: "product" as const },
  { id: "2", name: "T-Shirt", price: 250, category: "Clothing", type: "product" as const },
  { id: "3", name: "Coffee", price: 45, category: "Food & Beverage", type: "product" as const },
  { id: "4", name: "Consultation", price: 500, category: "Professional", type: "service" as const },
  { id: "5", name: "Laptop + Setup", price: 16000, category: "Electronics", type: "combo" as const },
]

const categories = ["All", "Electronics", "Clothing", "Food & Beverage", "Professional"]

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [discountType, setDiscountType] = useState<"percentage" | "amount">("percentage")
  const [discountValue, setDiscountValue] = useState(0)
  const [vatRate, setVatRate] = useState(15)
  const { toast } = useToast()

  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory)

  const addToCart = (product: (typeof products)[0]) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.id !== id))
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = discountType === "percentage" ? (subtotal * discountValue) / 100 : discountValue
  const afterDiscount = subtotal - discountAmount
  const vatAmount = (afterDiscount * vatRate) / 100
  const total = afterDiscount + vatAmount

  const processSale = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to cart before processing sale.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send the sale data to your Python backend
    toast({
      title: "Sale processed successfully",
      description: `Total: R ${total.toFixed(2)}`,
    })
    setCart([])
    setDiscountValue(0)
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-500">Process sales and manage transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Products & Services</CardTitle>
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => addToCart(product)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            product.type === "product"
                              ? "bg-green-100 text-green-800"
                              : product.type === "service"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {product.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                      <p className="text-lg font-bold text-green-600">R {product.price.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <ShoppingCart className="h-5 w-5" />
                Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">R {item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Discount Section */}
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium text-gray-700">Discount</Label>
                    <div className="flex gap-2 mt-2">
                      <Select
                        value={discountType}
                        onValueChange={(value: "percentage" | "amount") => setDiscountType(value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">%</SelectItem>
                          <SelectItem value="amount">R</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                        placeholder="0"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900">R {subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount:</span>
                        <span className="text-red-600">-R {discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">VAT ({vatRate}%):</span>
                      <span className="text-gray-900">R {vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-green-600">R {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button onClick={processSale} className="w-full bg-green-600 hover:bg-green-700">
                    <Calculator className="h-4 w-4 mr-2" />
                    Process Sale
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Trash2, ShoppingCart, Calculator, Search, CreditCard, Banknote, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  type: "product" | "service" | "combo"
}

interface Product {
  id: string
  name: string
  price: number
  category: string
  type: "product" | "service" | "combo"
  stock: number
  description?: string
}

const productsData: Product[] = [
  {
    id: "1",
    name: "Laptop Pro",
    price: 15000,
    category: "Electronics",
    type: "product",
    stock: 25,
    description: "High-performance laptop",
  },
  {
    id: "2",
    name: "Designer T-Shirt",
    price: 250,
    category: "Clothing",
    type: "product",
    stock: 150,
    description: "Premium cotton t-shirt",
  },
  {
    id: "3",
    name: "Premium Coffee",
    price: 45,
    category: "Food & Beverage",
    type: "product",
    stock: 200,
    description: "Artisan roasted coffee",
  },
  {
    id: "4",
    name: "Consultation",
    price: 500,
    category: "Professional",
    type: "service",
    stock: 0,
    description: "1-hour professional consultation",
  },
  {
    id: "5",
    name: "Laptop + Setup",
    price: 16000,
    category: "Electronics",
    type: "combo",
    stock: 15,
    description: "Laptop with complete setup service",
  },
  {
    id: "6",
    name: "Wireless Headphones",
    price: 2000,
    category: "Electronics",
    type: "product",
    stock: 45,
    description: "Noise-cancelling headphones",
  },
  {
    id: "7",
    name: "Smartphone",
    price: 8000,
    category: "Electronics",
    type: "product",
    stock: 30,
    description: "Latest smartphone model",
  },
  {
    id: "8",
    name: "Jeans",
    price: 800,
    category: "Clothing",
    type: "product",
    stock: 75,
    description: "Premium denim jeans",
  },
  {
    id: "9",
    name: "Energy Drink",
    price: 35,
    category: "Food & Beverage",
    type: "product",
    stock: 100,
    description: "Refreshing energy drink",
  },
  {
    id: "10",
    name: "Installation Service",
    price: 300,
    category: "Professional",
    type: "service",
    stock: 0,
    description: "Professional installation service",
  },
]

const categories = ["All", "Electronics", "Clothing", "Food & Beverage", "Professional"]
const paymentMethods = [
  { id: "cash", name: "Cash", icon: Banknote },
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
  { id: "mobile", name: "Mobile Payment", icon: Smartphone },
]

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [discountType, setDiscountType] = useState<"percentage" | "amount">("percentage")
  const [discountValue, setDiscountValue] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [vatRate, setVatRate] = useState(15)
  const { toast } = useToast()

  // Filter products based on category and search
  const filteredProducts = productsData.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          category: product.category,
          type: product.type,
        },
      ])
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

  const clearCart = () => {
    setCart([])
    setDiscountValue(0)
    setCustomerName("")
    setPaymentMethod("")
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = discountType === "percentage" ? (subtotal * discountValue) / 100 : discountValue
  const afterDiscount = subtotal - discountAmount
  const vatAmount = (afterDiscount * vatRate) / 100
  const total = afterDiscount + vatAmount

  const processSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to cart before processing sale.",
        variant: "destructive",
      })
      return
    }

    if (!paymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method.",
        variant: "destructive",
      })
      return
    }

    try {
      const saleData = {
        items: cart.map((item) => ({
          product_id: Number.parseInt(item.id),
          quantity: item.quantity,
          unit_price: item.price,
        })),
        discount_amount: discountAmount,
        customer_name: customerName || null,
        payment_method: paymentMethod,
        total_amount: total,
        vat_amount: vatAmount,
      }

      // Send to backend API
      const response = await fetch("http://localhost:8000/sales/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Sale processed successfully",
          description: `Transaction ID: ${result.id} - Total: R ${total.toFixed(2)}`,
        })
        clearCart()
      } else {
        throw new Error("Failed to process sale")
      }
    } catch (error) {
      console.error("Error processing sale:", error)
      toast({
        title: "Error processing sale",
        description: "Please check your connection and try again.",
        variant: "destructive",
      })
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "product":
        return "bg-green-100 text-green-800"
      case "service":
        return "bg-blue-100 text-blue-800"
      case "combo":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-200"
                    onClick={() => addToCart(product)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                        <Badge className={getTypeColor(product.type)}>{product.type}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-green-600">R {product.price.toFixed(2)}</p>
                        {product.type !== "service" && <p className="text-xs text-gray-500">Stock: {product.stock}</p>}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{product.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">No products found matching your criteria</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <ShoppingCart className="h-5 w-5" />
                Cart ({cart.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Cart is empty</p>
                  <p className="text-sm text-gray-400">Add products to get started</p>
                </div>
              ) : (
                <>
                  {/* Customer Info */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Customer Name (Optional)</Label>
                    <Input
                      placeholder="Enter customer name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <Separator />

                  {/* Cart Items */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-gray-500">R {item.price.toFixed(2)} each</p>
                          <Badge className={`${getTypeColor(item.type)} text-xs`}>{item.type}</Badge>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Discount Section */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Discount</Label>
                    <div className="flex gap-2 mt-2">
                      <Select
                        value={discountType}
                        onValueChange={(value: "percentage" | "amount") => setDiscountType(value)}
                      >
                        <SelectTrigger className="w-20">
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
                        min="0"
                        max={discountType === "percentage" ? "100" : subtotal.toString()}
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Payment Method *</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {paymentMethods.map((method) => (
                        <Button
                          key={method.id}
                          variant={paymentMethod === method.id ? "default" : "outline"}
                          onClick={() => setPaymentMethod(method.id)}
                          className="justify-start h-auto p-3"
                        >
                          <method.icon className="h-4 w-4 mr-2" />
                          {method.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900 font-medium">R {subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount:</span>
                        <span className="text-red-600 font-medium">-R {discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">VAT ({vatRate}%):</span>
                      <span className="text-gray-900 font-medium">R {vatAmount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-green-600">R {total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={processSale}
                      className="w-full bg-green-600 hover:bg-green-700 h-12"
                      disabled={!paymentMethod}
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Process Sale - R {total.toFixed(2)}
                    </Button>
                    <Button onClick={clearCart} variant="outline" className="w-full">
                      Clear Cart
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

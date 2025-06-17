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
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Calculator,
  CreditCard,
  Banknote,
  Smartphone,
  Edit,
  Check,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MobileOptimizations } from "./mobile-styles"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  type: "product" | "service" | "combo"
  isEditing?: boolean
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
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [discountType, setDiscountType] = useState<"percentage" | "amount">("percentage")
  const [discountValue, setDiscountValue] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [vatRate, setVatRate] = useState(15)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState(1)
  const { toast } = useToast()

  // Filter products based on category
  const filteredProducts = productsData.filter((product) => {
    return selectedCategory === "All" || product.category === selectedCategory
  })

  const addToCart = () => {
    if (!selectedProduct) {
      toast({
        title: "No product selected",
        description: "Please select a product to add to cart.",
        variant: "destructive",
      })
      return
    }

    const product = productsData.find((p) => p.id === selectedProduct)
    if (!product) return

    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(
        cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + selectedQuantity } : item)),
      )
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: selectedQuantity,
          category: product.category,
          type: product.type,
        },
      ])
    }

    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedQuantity}) has been added to your cart.`,
    })

    // Reset quantity but keep the product selected for convenience
    setSelectedQuantity(1)
  }

  const startEditing = (id: string) => {
    const item = cart.find((item) => item.id === id)
    if (item) {
      setEditingItem(id)
      setEditQuantity(item.quantity)
    }
  }

  const saveEdit = (id: string) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: editQuantity } : item)))
    setEditingItem(null)
  }

  const cancelEdit = () => {
    setEditingItem(null)
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

      // Try to send to backend API, but don't fail if it's not available
      try {
        const response = await fetch("http://localhost:8000/sales/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(saleData),
          signal: AbortSignal.timeout(5000), // 5 second timeout
        })

        if (response.ok) {
          const result = await response.json()
          toast({
            title: "Sale processed successfully",
            description: `Transaction ID: ${result.id} - Total: R ${total.toFixed(2)}`,
          })
        } else {
          throw new Error("Backend responded with error")
        }
      } catch (apiError) {
        console.log("Backend not available, processing sale locally:", apiError.message)
        // Process sale locally when backend is not available
        const transactionId = `TXN${Date.now().toString().slice(-6)}`
        toast({
          title: "Sale processed successfully (Demo Mode)",
          description: `Transaction ID: ${transactionId} - Total: R ${total.toFixed(2)}`,
        })
      }

      clearCart()
    } catch (error) {
      console.error("Error processing sale:", error)
      toast({
        title: "Error processing sale",
        description: "An unexpected error occurred. Please try again.",
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
    <div className="flex-1 p-3 md:p-6 pb-safe">
      <MobileOptimizations />
      <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-sm md:text-base text-gray-500">Process sales and manage transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Product Selection Section */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Add Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category Selection */}
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category
                </Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full h-12">
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

              {/* Product Selection */}
              <div>
                <Label htmlFor="product" className="text-sm font-medium text-gray-700">
                  Product
                </Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{product.name}</span>
                          <span className="text-green-600 font-medium">R {product.price.toFixed(2)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedProduct && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{productsData.find((p) => p.id === selectedProduct)?.name}</p>
                        <p className="text-sm text-gray-500">
                          {productsData.find((p) => p.id === selectedProduct)?.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          R {productsData.find((p) => p.id === selectedProduct)?.price.toFixed(2)}
                        </p>
                        <Badge
                          className={getTypeColor(
                            productsData.find((p) => p.id === selectedProduct)?.type || "product",
                          )}
                        >
                          {productsData.find((p) => p.id === selectedProduct)?.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Selection */}
              <div>
                <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="h-12 w-12"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="h-12 text-center"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    className="h-12 w-12"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={addToCart}
                className="w-full bg-green-600 hover:bg-green-700 h-12"
                disabled={!selectedProduct}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>

              {/* Current Cart Items */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Current Cart Items</h3>
                <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">No items in cart</div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-500">R {item.price.toFixed(2)} each</p>
                          </div>

                          {editingItem === item.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                                className="w-16 h-9 text-center"
                                min="1"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => saveEdit(item.id)}
                                className="h-9 w-9 p-0 text-green-600"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={cancelEdit}
                                className="h-9 w-9 p-0 text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-white rounded border border-gray-200 text-center min-w-[40px]">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditing(item.id)}
                                className="h-9 w-9 p-0 text-blue-600"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromCart(item.id)}
                                className="h-9 w-9 p-0 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                          <span>Subtotal:</span>
                          <span className="font-medium">R {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="xl:sticky xl:top-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
                <ShoppingCart className="h-5 w-5" />
                Cart Summary ({cart.length} items)
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

                  {/* Cart Summary */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Order Summary</h3>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span>R {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
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
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {paymentMethods.map((method) => (
                        <Button
                          key={method.id}
                          variant={paymentMethod === method.id ? "default" : "outline"}
                          onClick={() => setPaymentMethod(method.id)}
                          className="justify-start h-12 p-4 touch-manipulation text-left"
                        >
                          <method.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="text-sm md:text-base">{method.name}</span>
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
                      className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg font-semibold touch-manipulation"
                      disabled={!paymentMethod}
                    >
                      <Calculator className="h-5 w-5 mr-2" />
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

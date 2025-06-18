"use client"

import { useState, useEffect } from "react"
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
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MobileOptimizations } from "./mobile-styles"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

const categories = ["Electronics", "Clothing", "Food & Beverage", "Professional"]
const productTypes = ["product", "service", "combo"]
const paymentMethods = [
  { id: "cash", name: "Cash", icon: Banknote },
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
  { id: "mobile", name: "Mobile Payment", icon: Smartphone },
]

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([])

  // Product form fields
  const [selectedProduct, setSelectedProduct] = useState("")
  const [productName, setProductName] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [productCategory, setProductCategory] = useState("")
  const [productType, setProductType] = useState("")
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  const [discountType, setDiscountType] = useState<"percentage" | "amount">("percentage")
  const [discountValue, setDiscountValue] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [vatRate, setVatRate] = useState(15)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState(1)
  const { toast } = useToast()

  // Update form fields when product is selected
  useEffect(() => {
    if (selectedProduct) {
      const product = productsData.find((p) => p.id === selectedProduct)
      if (product) {
        setProductName(product.name)
        setProductPrice(product.price.toString())
        setProductCategory(product.category)
        setProductType(product.type)
      }
    } else {
      // Clear fields when no product selected
      setProductName("")
      setProductPrice("")
      setProductCategory("")
      setProductType("")
    }
  }, [selectedProduct])

  const addToCart = () => {
    if (!productName.trim()) {
      toast({
        title: "Product name required",
        description: "Please enter a product name.",
        variant: "destructive",
      })
      return
    }

    if (!productPrice || Number(productPrice) <= 0) {
      toast({
        title: "Valid price required",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive",
      })
      return
    }

    if (!productCategory) {
      toast({
        title: "Category required",
        description: "Please select a category.",
        variant: "destructive",
      })
      return
    }

    if (!productType) {
      toast({
        title: "Product type required",
        description: "Please select a product type.",
        variant: "destructive",
      })
      return
    }

    // Generate unique ID for custom items or use existing product ID
    const itemId = selectedProduct || `custom_${Date.now()}`

    const existingItem = cart.find(
      (item) => item.id === itemId && item.name === productName && item.price === Number(productPrice),
    )

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === itemId && item.name === productName && item.price === Number(productPrice)
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item,
        ),
      )
    } else {
      setCart([
        ...cart,
        {
          id: itemId,
          name: productName,
          price: Number(productPrice),
          quantity: selectedQuantity,
          category: productCategory,
          type: productType as "product" | "service" | "combo",
        },
      ])
    }

    toast({
      title: "Added to cart",
      description: `${productName} (${selectedQuantity}) has been added to your cart.`,
    })

    // Reset quantity but keep other fields for convenience
    setSelectedQuantity(1)
  }

  const clearProductForm = () => {
    setSelectedProduct("")
    setProductName("")
    setProductPrice("")
    setProductCategory("")
    setProductType("")
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
    if (editQuantity <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Quantity must be greater than 0.",
        variant: "destructive",
      })
      return
    }

    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: editQuantity } : item)))
    setEditingItem(null)

    toast({
      title: "Item updated",
      description: "Quantity has been updated successfully.",
    })
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditQuantity(1)
  }

  const confirmDelete = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))

    toast({
      title: "Item removed",
      description: "Item has been removed from cart.",
    })
  }

  const clearCart = () => {
    setCart([])
    setDiscountValue(0)
    setCustomerName("")
    setPaymentMethod("")
    setEditingItem(null)
    clearProductForm()
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
          product_id: selectedProduct ? Number.parseInt(item.id) : 0,
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
        return "bg-green-100 text-green-800 border-green-200"
      case "service":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "combo":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex-1 p-3 md:p-6 pb-safe bg-gray-50 min-h-screen">
      <MobileOptimizations />
      <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-sm md:text-base text-gray-600">Process sales and manage transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Product Selection & Cart Section */}
        <div className="space-y-6">
          {/* Product Selection */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
              <CardTitle className="text-white">Add Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {/* Quick Product Selection */}
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Quick Select Product (Optional)
                </Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-green-500 bg-white">
                    <SelectValue placeholder="Select existing product or create custom" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-gray-200 max-h-60">
                    <SelectItem value="" className="hover:bg-green-50 focus:bg-green-50 cursor-pointer py-3">
                      <span className="font-medium text-blue-600">Create Custom Item</span>
                    </SelectItem>
                    {productsData.map((product) => (
                      <SelectItem
                        key={product.id}
                        value={product.id}
                        className="hover:bg-green-50 focus:bg-green-50 cursor-pointer py-3"
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-green-600 font-bold ml-4">R {product.price.toFixed(2)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Editable Product Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Product Name *</Label>
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                    className="border-2 border-gray-200 focus:border-green-500 h-12"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Price (R) *</Label>
                  <Input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="border-2 border-gray-200 focus:border-green-500 h-12"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Category *</Label>
                  <Select value={productCategory} onValueChange={setProductCategory}>
                    <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-green-500 bg-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-gray-200">
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="hover:bg-green-50 focus:bg-green-50 cursor-pointer py-3"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Type *</Label>
                  <Select value={productType} onValueChange={setProductType}>
                    <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-green-500 bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-gray-200">
                      {productTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="hover:bg-green-50 focus:bg-green-50 cursor-pointer py-3"
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="h-12 w-12 border-2 border-gray-200 hover:border-green-500 hover:bg-green-50"
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <Input
                    type="number"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="h-12 text-center text-lg font-semibold border-2 border-gray-200 focus:border-green-500"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    className="h-12 w-12 border-2 border-gray-200 hover:border-green-500 hover:bg-green-50"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={addToCart}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-14 text-lg font-semibold shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={clearProductForm}
                  variant="outline"
                  className="h-14 px-6 border-2 border-gray-200 hover:border-gray-400"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Cart Items */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-white">
                <ShoppingCart className="h-5 w-5" />
                Cart Items ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="font-medium">No items in cart</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={`${item.id}-${item.name}-${item.price}`}
                      className="p-4 border-2 border-gray-200 rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <Badge className={`${getTypeColor(item.type)} border`}>{item.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            R {item.price.toFixed(2)} each • {item.category}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {editingItem === `${item.id}-${item.name}-${item.price}` ? (
                            <>
                              <Input
                                type="number"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                                className="w-20 h-10 text-center border-2 border-gray-200 focus:border-green-500"
                                min="1"
                              />
                              <Button
                                size="sm"
                                onClick={() => saveEdit(`${item.id}-${item.name}-${item.price}`)}
                                className="h-10 w-10 p-0 bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                                className="h-10 w-10 p-0 border-2 border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <span className="px-4 py-2 bg-gray-100 border-2 border-gray-200 rounded-lg text-center min-w-[50px] font-semibold">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditing(`${item.id}-${item.name}-${item.price}`)}
                                className="h-10 w-10 p-0 border-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-10 w-10 p-0 border-2 border-red-200 text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white border-2 border-gray-200">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                                      <AlertTriangle className="h-5 w-5" />
                                      Confirm Deletion
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-600">
                                      Are you sure you want to remove "{item.name}" from the cart? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="border-2 border-gray-200">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => confirmDelete(`${item.id}-${item.name}-${item.price}`)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold text-gray-900">R {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checkout Section */}
        <div className="lg:sticky lg:top-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-white">
                <Calculator className="h-5 w-5" />
                Checkout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Add items to checkout</p>
                </div>
              ) : (
                <>
                  {/* Customer Info */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Customer Name (Optional)</Label>
                    <Input
                      placeholder="Enter customer name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="border-2 border-gray-200 focus:border-purple-500 h-12"
                    />
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* Discount Section */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Discount</Label>
                    <div className="flex gap-2">
                      <Select
                        value={discountType}
                        onValueChange={(value: "percentage" | "amount") => setDiscountType(value)}
                      >
                        <SelectTrigger className="w-20 border-2 border-gray-200 focus:border-purple-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-gray-200">
                          <SelectItem value="percentage" className="hover:bg-purple-50 focus:bg-purple-50">
                            %
                          </SelectItem>
                          <SelectItem value="amount" className="hover:bg-purple-50 focus:bg-purple-50">
                            R
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                        placeholder="0"
                        className="flex-1 border-2 border-gray-200 focus:border-purple-500"
                        min="0"
                        max={discountType === "percentage" ? "100" : subtotal.toString()}
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Payment Method *</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {paymentMethods.map((method) => (
                        <Button
                          key={method.id}
                          variant={paymentMethod === method.id ? "default" : "outline"}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`justify-start h-12 p-4 text-left border-2 ${
                            paymentMethod === method.id
                              ? "bg-purple-600 hover:bg-purple-700 border-purple-600 text-white"
                              : "border-gray-200 hover:border-purple-500 hover:bg-purple-50 text-gray-700"
                          }`}
                        >
                          <method.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="font-medium">{method.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* Totals */}
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900 font-semibold">R {subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount:</span>
                        <span className="text-red-600 font-semibold">-R {discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">VAT ({vatRate}%):</span>
                      <span className="text-gray-900 font-semibold">R {vatAmount.toFixed(2)}</span>
                    </div>
                    <Separator className="bg-gray-300" />
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-green-600">R {total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={processSale}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-16 text-lg font-bold shadow-lg"
                      disabled={!paymentMethod}
                    >
                      <Calculator className="h-6 w-6 mr-2" />
                      Process Sale - R {total.toFixed(2)}
                    </Button>
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      className="w-full h-12 border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 text-gray-700 hover:text-red-600"
                    >
                      Clear All
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

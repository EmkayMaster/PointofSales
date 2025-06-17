"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  category: string
  type: "product" | "service" | "combo"
  stock: number
  sold: number
  lastSold: string
}

const productsData: Product[] = [
  {
    id: "1",
    name: "Laptop Pro",
    price: 15000,
    category: "Electronics",
    type: "product",
    stock: 25,
    sold: 45,
    lastSold: "2024-01-15",
  },
  {
    id: "2",
    name: "Designer T-Shirt",
    price: 250,
    category: "Clothing",
    type: "product",
    stock: 150,
    sold: 123,
    lastSold: "2024-01-15",
  },
  {
    id: "3",
    name: "Premium Coffee",
    price: 45,
    category: "Food & Beverage",
    type: "product",
    stock: 200,
    sold: 456,
    lastSold: "2024-01-14",
  },
  {
    id: "4",
    name: "Consultation",
    price: 500,
    category: "Professional",
    type: "service",
    stock: 0,
    sold: 89,
    lastSold: "2024-01-13",
  },
  {
    id: "5",
    name: "Laptop + Setup",
    price: 16000,
    category: "Electronics",
    type: "combo",
    stock: 15,
    sold: 23,
    lastSold: "2024-01-12",
  },
  {
    id: "6",
    name: "Wireless Headphones",
    price: 2000,
    category: "Electronics",
    type: "product",
    stock: 45,
    sold: 67,
    lastSold: "2024-01-11",
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(productsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const { toast } = useToast()

  const categories = ["All", "Electronics", "Clothing", "Food & Beverage", "Professional"]
  const types = ["All", "product", "service", "combo"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter
    const matchesType = typeFilter === "All" || product.type === typeFilter
    return matchesSearch && matchesCategory && matchesType
  })

  const viewProductDetails = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      toast({
        title: "Product Details",
        description: `Viewing details for ${product.name}`,
      })
    }
  }

  const editProduct = (productId: string) => {
    toast({
      title: "Edit Product",
      description: "Edit functionality would open here",
    })
  }

  const deleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
    toast({
      title: "Product deleted",
      description: "Product has been removed successfully",
    })
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

  const getStockStatus = (stock: number, type: string) => {
    if (type === "service") return { text: "N/A", color: "bg-gray-100 text-gray-800" }
    if (stock === 0) return { text: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (stock < 10) return { text: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    return { text: "In Stock", color: "bg-green-100 text-green-800" }
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500">Manage your product catalog and inventory</p>
          </div>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-gray-900">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
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
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "All" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Product Catalog</CardTitle>
          <CardDescription>
            Showing {filteredProducts.length} of {products.length} products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-3 text-left">Product Name</th>
                  <th className="border border-gray-300 p-3 text-left">Category</th>
                  <th className="border border-gray-300 p-3 text-left">Type</th>
                  <th className="border border-gray-300 p-3 text-right">Price (R)</th>
                  <th className="border border-gray-300 p-3 text-right">Stock</th>
                  <th className="border border-gray-300 p-3 text-left">Status</th>
                  <th className="border border-gray-300 p-3 text-right">Units Sold</th>
                  <th className="border border-gray-300 p-3 text-left">Last Sold</th>
                  <th className="border border-gray-300 p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock, product.type)
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3 font-medium">{product.name}</td>
                      <td className="border border-gray-300 p-3">{product.category}</td>
                      <td className="border border-gray-300 p-3">
                        <Badge className={getTypeColor(product.type)}>{product.type}</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-right">{product.price.toFixed(2)}</td>
                      <td className="border border-gray-300 p-3 text-right">
                        {product.type === "service" ? "N/A" : product.stock}
                      </td>
                      <td className="border border-gray-300 p-3">
                        <Badge className={stockStatus.color}>{stockStatus.text}</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-right">{product.sold}</td>
                      <td className="border border-gray-300 p-3">{product.lastSold}</td>
                      <td className="border border-gray-300 p-3">
                        <div className="flex gap-2 justify-center">
                          <Button size="sm" variant="outline" onClick={() => viewProductDetails(product.id)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => editProduct(product.id)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteProduct(product.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

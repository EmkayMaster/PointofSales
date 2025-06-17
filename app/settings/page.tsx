"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus, Trash2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  description: string
}

interface Service {
  id: string
  name: string
  cost: number
  description: string
}

export default function SettingsPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Electronics", description: "Electronic devices and accessories" },
    { id: "2", name: "Clothing", description: "Apparel and fashion items" },
    { id: "3", name: "Food & Beverage", description: "Food and drink items" },
  ])

  const [services, setServices] = useState<Service[]>([
    { id: "1", name: "Consultation", cost: 500, description: "Professional consultation service" },
    { id: "2", name: "Installation", cost: 300, description: "Product installation service" },
    { id: "3", name: "Maintenance", cost: 200, description: "Regular maintenance service" },
  ])

  const [vatRate, setVatRate] = useState(15)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [newService, setNewService] = useState({ name: "", cost: 0, description: "" })
  const { toast } = useToast()

  const addCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description,
    }

    setCategories([...categories, category])
    setNewCategory({ name: "", description: "" })
    toast({
      title: "Category added",
      description: `${category.name} has been added successfully.`,
    })
  }

  const removeCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id))
    toast({
      title: "Category removed",
      description: "Category has been removed successfully.",
    })
  }

  const addService = () => {
    if (!newService.name.trim() || newService.cost <= 0) {
      toast({
        title: "Error",
        description: "Service name and valid cost are required",
        variant: "destructive",
      })
      return
    }

    const service: Service = {
      id: Date.now().toString(),
      name: newService.name,
      cost: newService.cost,
      description: newService.description,
    }

    setServices([...services, service])
    setNewService({ name: "", cost: 0, description: "" })
    toast({
      title: "Service added",
      description: `${service.name} has been added successfully.`,
    })
  }

  const removeService = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
    toast({
      title: "Service removed",
      description: "Service has been removed successfully.",
    })
  }

  const updateVatRate = () => {
    toast({
      title: "VAT rate updated",
      description: `VAT rate has been set to ${vatRate}%.`,
    })
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your POS system configuration</p>
        </div>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Product Categories</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Add New Category</CardTitle>
                <CardDescription>Create a new product category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <Label htmlFor="categoryDescription">Description</Label>
                  <Input
                    id="categoryDescription"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Enter category description"
                  />
                </div>
                <Button onClick={addCategory} className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Existing Categories</CardTitle>
                <CardDescription>Manage your product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => removeCategory(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Add New Service</CardTitle>
                <CardDescription>Create a new service offering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="serviceName">Service Name</Label>
                  <Input
                    id="serviceName"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    placeholder="Enter service name"
                  />
                </div>
                <div>
                  <Label htmlFor="serviceCost">Cost (R)</Label>
                  <Input
                    id="serviceCost"
                    type="number"
                    value={newService.cost}
                    onChange={(e) => setNewService({ ...newService, cost: Number(e.target.value) })}
                    placeholder="Enter service cost"
                  />
                </div>
                <div>
                  <Label htmlFor="serviceDescription">Description</Label>
                  <Input
                    id="serviceDescription"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    placeholder="Enter service description"
                  />
                </div>
                <Button onClick={addService} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Existing Services</CardTitle>
                <CardDescription>Manage your service offerings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <p className="text-sm text-gray-500">{service.description}</p>
                        <p className="text-sm font-medium text-green-600">R {service.cost.toFixed(2)}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => removeService(service.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">General Settings</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="vatRate">VAT Rate (%)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="vatRate"
                      type="number"
                      value={vatRate}
                      onChange={(e) => setVatRate(Number(e.target.value))}
                      placeholder="Enter VAT rate"
                      min="0"
                      max="100"
                    />
                    <Button onClick={updateVatRate} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Current VAT rate: {vatRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

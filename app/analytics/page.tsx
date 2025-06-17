"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Package, ShoppingCart, DollarSign } from "lucide-react"
import { useState } from "react"

const weeklyData = [
  { week: "Week 1", sales: 12000, orders: 45 },
  { week: "Week 2", sales: 15000, orders: 52 },
  { week: "Week 3", sales: 18000, orders: 61 },
  { week: "Week 4", sales: 14000, orders: 48 },
]

const monthlyData = [
  { month: "Jan", sales: 45000, orders: 120 },
  { month: "Feb", sales: 52000, orders: 140 },
  { month: "Mar", sales: 48000, orders: 130 },
  { month: "Apr", sales: 61000, orders: 165 },
  { month: "May", sales: 55000, orders: 150 },
  { month: "Jun", sales: 67000, orders: 180 },
]

const yearlyData = [
  { year: "2021", sales: 450000, orders: 1200 },
  { year: "2022", sales: 520000, orders: 1400 },
  { year: "2023", sales: 680000, orders: 1800 },
  { year: "2024", sales: 750000, orders: 2100 },
]

const categoryData = [
  { name: "Electronics", value: 35, sales: 234000, products: 45, color: "#10B981" },
  { name: "Clothing", value: 25, sales: 167000, products: 78, color: "#3B82F6" },
  { name: "Food & Beverage", value: 20, sales: 134000, products: 123, color: "#8B5CF6" },
  { name: "Services", value: 20, sales: 134000, products: 12, color: "#F59E0B" },
]

const topProducts = [
  { name: "Laptop Pro", category: "Electronics", sold: 45, revenue: 675000 },
  { name: "Designer T-Shirt", category: "Clothing", sold: 123, revenue: 30750 },
  { name: "Premium Coffee", category: "Food & Beverage", sold: 456, revenue: 20520 },
  { name: "Consultation", category: "Services", sold: 89, revenue: 44500 },
  { name: "Wireless Headphones", category: "Electronics", sold: 67, revenue: 134000 },
]

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")

  const getDataByPeriod = () => {
    switch (selectedPeriod) {
      case "weekly":
        return weeklyData
      case "yearly":
        return yearlyData
      default:
        return monthlyData
    }
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales & Marketing Analytics</h1>
          <p className="text-gray-500">Comprehensive insights into your business performance</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">R 750,000</div>
                <p className="text-xs text-green-600">+15.2% from last period</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">2,100</div>
                <p className="text-xs text-blue-600">+8.7% from last period</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Products Sold</CardTitle>
                <Package className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">5,847</div>
                <p className="text-xs text-purple-600">+12.3% from last period</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Avg. Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">R 357</div>
                <p className="text-xs text-orange-600">+5.1% from last period</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900">Sales Performance</CardTitle>
                    <CardDescription>Revenue and order trends over time</CardDescription>
                  </div>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    sales: {
                      label: "Sales (R)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getDataByPeriod()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey={selectedPeriod === "weekly" ? "week" : selectedPeriod === "yearly" ? "year" : "month"}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="sales" fill="var(--color-sales)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Sales by Category</CardTitle>
                <CardDescription>Revenue distribution across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Percentage",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Category Performance</CardTitle>
                <CardDescription>Detailed breakdown of sales by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                        <div>
                          <h3 className="font-medium text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-500">{category.products} products</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">R {category.sales.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{category.value}% of total sales</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Top Performing Products</CardTitle>
              <CardDescription>Best selling products across all categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">R {product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{product.sold} units sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Sales Trends</CardTitle>
              <CardDescription>Year-over-year growth analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales (R)",
                    color: "hsl(var(--chart-1))",
                  },
                  orders: {
                    label: "Orders",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" name="Sales" />
                    <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" name="Orders" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

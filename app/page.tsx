"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DollarSign, Package, ShoppingCart, TrendingUp, Receipt } from "lucide-react"

const salesData = [
  { month: "Jan", sales: 45000, orders: 120 },
  { month: "Feb", sales: 52000, orders: 140 },
  { month: "Mar", sales: 48000, orders: 130 },
  { month: "Apr", sales: 61000, orders: 165 },
  { month: "May", sales: 55000, orders: 150 },
  { month: "Jun", sales: 67000, orders: 180 },
]

const categoryData = [
  { name: "Electronics", value: 35, color: "#10B981" },
  { name: "Clothing", value: 25, color: "#3B82F6" },
  { name: "Food & Beverage", value: 20, color: "#8B5CF6" },
  { name: "Services", value: 20, color: "#F59E0B" },
]

interface DashboardStats {
  total_sales: number
  total_orders: number
  products_sold: number
  avg_order_value: number
}

interface RecentSale {
  id: string
  customer: string
  amount: string
  time: string
  status: string
  payment_method: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_sales: 328000,
    total_orders: 1285,
    products_sold: 3847,
    avg_order_value: 255,
  })
  const [recentSales, setRecentSales] = useState<RecentSale[]>([
    {
      id: "TXN001",
      customer: "John Doe",
      amount: "R 245.50",
      time: "2 minutes ago",
      status: "Completed",
      payment_method: "card",
    },
    {
      id: "TXN002",
      customer: "Jane Smith",
      amount: "R 189.00",
      time: "15 minutes ago",
      status: "Completed",
      payment_method: "cash",
    },
    {
      id: "TXN003",
      customer: "Mike Johnson",
      amount: "R 567.25",
      time: "1 hour ago",
      status: "Completed",
      payment_method: "mobile",
    },
    {
      id: "TXN004",
      customer: "Sarah Wilson",
      amount: "R 123.75",
      time: "2 hours ago",
      status: "Completed",
      payment_method: "card",
    },
  ])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check if backend is available first
        const healthCheck = await fetch("http://localhost:8000/", {
          method: "GET",
          signal: AbortSignal.timeout(5000), // 5 second timeout
        })

        if (!healthCheck.ok) {
          throw new Error("Backend not available")
        }

        // Fetch stats
        const statsResponse = await fetch("http://localhost:8000/dashboard/stats", {
          signal: AbortSignal.timeout(5000),
        })
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        // Fetch recent sales
        const salesResponse = await fetch("http://localhost:8000/sales/recent?limit=5", {
          signal: AbortSignal.timeout(5000),
        })
        if (salesResponse.ok) {
          const salesData = await salesResponse.json()
          setRecentSales(salesData)
        }
      } catch (error) {
        console.log("Backend not available, using demo data:", error.message)
        // Keep using default demo data when backend is not available
        // This allows the frontend to work independently
      }
    }

    fetchDashboardData()

    // Only set up interval if we want real-time updates
    // Comment out the interval for demo mode
    // const interval = setInterval(fetchDashboardData, 30000)
    // return () => clearInterval(interval)
  }, [])

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "card":
        return "💳"
      case "mobile":
        return "📱"
      case "cash":
      default:
        return "💵"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome to your POS system overview</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">R {stats.total_sales.toLocaleString()}</div>
            <p className="text-xs text-green-600">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total_orders.toLocaleString()}</div>
            <p className="text-xs text-blue-600">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.products_sold.toLocaleString()}</div>
            <p className="text-xs text-purple-600">+15.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">R {stats.avg_order_value.toFixed(0)}</div>
            <p className="text-xs text-orange-600">+3.8% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Sales Overview</CardTitle>
            <CardDescription>Monthly sales and order trends</CardDescription>
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
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
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
            <CardDescription>Distribution of sales across product categories</CardDescription>
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Recent Sales</CardTitle>
          <CardDescription>Latest transactions in your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSales.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Receipt className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">{transaction.customer}</p>
                    <p className="text-sm text-gray-500">Transaction {transaction.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{transaction.amount}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{getPaymentIcon(transaction.payment_method)}</span>
                    <span>{transaction.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

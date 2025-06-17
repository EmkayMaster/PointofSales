"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Printer, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const salesReportData = [
  { date: "2024-01-15", transaction: "TXN001", customer: "John Doe", amount: 245.5, items: 3 },
  { date: "2024-01-15", transaction: "TXN002", customer: "Jane Smith", amount: 189.0, items: 2 },
  { date: "2024-01-14", transaction: "TXN003", customer: "Mike Johnson", amount: 567.25, items: 5 },
  { date: "2024-01-14", transaction: "TXN004", customer: "Sarah Wilson", amount: 123.75, items: 1 },
  { date: "2024-01-13", transaction: "TXN005", customer: "David Brown", amount: 890.0, items: 4 },
]

const productReportData = [
  { name: "Laptop Pro", category: "Electronics", stock: 25, sold: 45, revenue: 675000 },
  { name: "Designer T-Shirt", category: "Clothing", stock: 150, sold: 123, revenue: 30750 },
  { name: "Premium Coffee", category: "Food & Beverage", stock: 200, sold: 456, revenue: 20520 },
  { name: "Consultation", category: "Services", stock: 0, sold: 89, revenue: 44500 },
  { name: "Wireless Headphones", category: "Electronics", stock: 45, sold: 67, revenue: 134000 },
]

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [reportType, setReportType] = useState("sales")
  const { toast } = useToast()

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(",")
    const csvContent = [headers, ...data.map((row) => Object.values(row).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: `${filename}.csv has been downloaded.`,
    })
  }

  const exportToExcel = (filename: string) => {
    // In a real implementation, you would use a library like xlsx
    toast({
      title: "Export successful",
      description: `${filename}.xlsx has been downloaded.`,
    })
  }

  const exportToPDF = (filename: string) => {
    // In a real implementation, you would use a library like jsPDF
    toast({
      title: "Export successful",
      description: `${filename}.pdf has been downloaded.`,
    })
  }

  const printReport = () => {
    window.print()
    toast({
      title: "Print initiated",
      description: "Report has been sent to printer.",
    })
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">Generate and export detailed business reports</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Report Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Report Filters</CardTitle>
            <CardDescription>Configure your report parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="products">Product Report</SelectItem>
                    <SelectItem value="categories">Category Report</SelectItem>
                    <SelectItem value="customers">Customer Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateFrom">From Date</Label>
                <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="dateTo">To Date</Label>
                <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Export Options</CardTitle>
            <CardDescription>Download or print your reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  exportToCSV(reportType === "sales" ? salesReportData : productReportData, `${reportType}_report`)
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => exportToExcel(`${reportType}_report`)}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="outline" onClick={() => exportToPDF(`${reportType}_report`)}>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={printReport}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        <Tabs value={reportType} onValueChange={setReportType}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales">Sales Report</TabsTrigger>
            <TabsTrigger value="products">Product Report</TabsTrigger>
            <TabsTrigger value="categories">Category Report</TabsTrigger>
            <TabsTrigger value="customers">Customer Report</TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Sales Report</CardTitle>
                <CardDescription>Detailed sales transactions and revenue data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left">Date</th>
                        <th className="border border-gray-300 p-3 text-left">Transaction ID</th>
                        <th className="border border-gray-300 p-3 text-left">Customer</th>
                        <th className="border border-gray-300 p-3 text-right">Amount (R)</th>
                        <th className="border border-gray-300 p-3 text-right">Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesReportData.map((sale, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3">{sale.date}</td>
                          <td className="border border-gray-300 p-3">{sale.transaction}</td>
                          <td className="border border-gray-300 p-3">{sale.customer}</td>
                          <td className="border border-gray-300 p-3 text-right">{sale.amount.toFixed(2)}</td>
                          <td className="border border-gray-300 p-3 text-right">{sale.items}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-bold">
                        <td className="border border-gray-300 p-3" colSpan={3}>
                          Total
                        </td>
                        <td className="border border-gray-300 p-3 text-right">
                          R {salesReportData.reduce((sum, sale) => sum + sale.amount, 0).toFixed(2)}
                        </td>
                        <td className="border border-gray-300 p-3 text-right">
                          {salesReportData.reduce((sum, sale) => sum + sale.items, 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Product Report</CardTitle>
                <CardDescription>Product performance and inventory data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left">Product Name</th>
                        <th className="border border-gray-300 p-3 text-left">Category</th>
                        <th className="border border-gray-300 p-3 text-right">Stock</th>
                        <th className="border border-gray-300 p-3 text-right">Units Sold</th>
                        <th className="border border-gray-300 p-3 text-right">Revenue (R)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productReportData.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3">{product.name}</td>
                          <td className="border border-gray-300 p-3">{product.category}</td>
                          <td className="border border-gray-300 p-3 text-right">{product.stock}</td>
                          <td className="border border-gray-300 p-3 text-right">{product.sold}</td>
                          <td className="border border-gray-300 p-3 text-right">{product.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-bold">
                        <td className="border border-gray-300 p-3" colSpan={3}>
                          Total
                        </td>
                        <td className="border border-gray-300 p-3 text-right">
                          {productReportData.reduce((sum, product) => sum + product.sold, 0)}
                        </td>
                        <td className="border border-gray-300 p-3 text-right">
                          R {productReportData.reduce((sum, product) => sum + product.revenue, 0).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Category Report</CardTitle>
                <CardDescription>Sales performance by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Category report data will be displayed here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Customer Report</CardTitle>
                <CardDescription>Customer purchase history and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Customer report data will be displayed here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

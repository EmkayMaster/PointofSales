import Database from "better-sqlite3"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function initDatabase() {
  // Create database in the project root
  const dbPath = join(__dirname, "..", "pos_system.db")
  const db = new Database(dbPath)

  console.log("🗄️ Initializing POS database...")

  try {
    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT
      );
    `)

    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category_id INTEGER,
        product_type TEXT NOT NULL,
        stock INTEGER DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      );
    `)

    db.exec(`
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total_amount REAL NOT NULL,
        discount_amount REAL DEFAULT 0,
        vat_amount REAL NOT NULL,
        sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        customer_name TEXT,
        payment_method TEXT DEFAULT 'cash'
      );
    `)

    db.exec(`
      CREATE TABLE IF NOT EXISTS sale_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id INTEGER,
        product_id INTEGER,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        total_price REAL NOT NULL,
        FOREIGN KEY (sale_id) REFERENCES sales (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      );
    `)

    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL
      );
    `)

    console.log("✅ Database tables created successfully")

    // Insert sample categories
    const insertCategory = db.prepare("INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)")
    const categories = [
      ["Electronics", "Electronic devices and accessories"],
      ["Clothing", "Apparel and fashion items"],
      ["Food & Beverage", "Food and drink items"],
      ["Professional", "Professional services"],
    ]

    categories.forEach((category) => {
      insertCategory.run(category[0], category[1])
    })

    console.log("📂 Sample categories inserted")

    // Insert sample products
    const insertProduct = db.prepare(
      "INSERT OR IGNORE INTO products (name, price, category_id, product_type, stock) VALUES (?, ?, ?, ?, ?)",
    )
    const products = [
      ["Laptop Pro", 15000.0, 1, "product", 25],
      ["Designer T-Shirt", 250.0, 2, "product", 150],
      ["Premium Coffee", 45.0, 3, "product", 200],
      ["Consultation", 500.0, 4, "service", 0],
      ["Laptop + Setup", 16000.0, 1, "combo", 15],
      ["Wireless Headphones", 2000.0, 1, "product", 45],
      ["Smartphone", 8000.0, 1, "product", 30],
      ["Jeans", 800.0, 2, "product", 75],
      ["Energy Drink", 35.0, 3, "product", 100],
      ["Installation Service", 300.0, 4, "service", 0],
    ]

    products.forEach((product) => {
      insertProduct.run(product[0], product[1], product[2], product[3], product[4])
    })

    console.log("🛍️ Sample products inserted")

    // Insert sample sales data
    const insertSale = db.prepare(
      "INSERT INTO sales (total_amount, discount_amount, vat_amount, sale_date, customer_name, payment_method) VALUES (?, ?, ?, ?, ?, ?)",
    )
    const insertSaleItem = db.prepare(
      "INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)",
    )

    const customers = [
      "John Doe",
      "Jane Smith",
      "Mike Johnson",
      "Sarah Wilson",
      "David Brown",
      "Emma Davis",
      "Chris Wilson",
      "Lisa Anderson",
    ]
    const paymentMethods = ["cash", "card", "mobile"]

    console.log("💰 Generating sample sales data...")

    for (let i = 0; i < 50; i++) {
      // Generate random sale date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30)
      const hoursAgo = Math.floor(Math.random() * 24)
      const minutesAgo = Math.floor(Math.random() * 60)

      const saleDate = new Date()
      saleDate.setDate(saleDate.getDate() - daysAgo)
      saleDate.setHours(saleDate.getHours() - hoursAgo)
      saleDate.setMinutes(saleDate.getMinutes() - minutesAgo)

      const customer = customers[Math.floor(Math.random() * customers.length)]
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]

      // Create a sale with placeholder values
      const saleResult = insertSale.run(0, 0, 0, saleDate.toISOString(), customer, paymentMethod)
      const saleId = saleResult.lastInsertRowid

      // Add random items to the sale
      const numItems = Math.floor(Math.random() * 4) + 1 // 1-4 items
      let totalAmount = 0

      for (let j = 0; j < numItems; j++) {
        const productId = Math.floor(Math.random() * 10) + 1 // Products 1-10
        const quantity = Math.floor(Math.random() * 3) + 1 // 1-3 quantity

        // Get product price (using the products array for reference)
        const productPrices = [15000, 250, 45, 500, 16000, 2000, 8000, 800, 35, 300]
        const unitPrice = productPrices[productId - 1]

        const itemTotal = quantity * unitPrice
        totalAmount += itemTotal

        insertSaleItem.run(saleId, productId, quantity, unitPrice, itemTotal)
      }

      // Update sale totals
      const discount = Math.random() < 0.3 ? totalAmount * 0.05 : 0 // 30% chance of 5% discount
      const afterDiscount = totalAmount - discount
      const vat = afterDiscount * 0.15
      const finalTotal = afterDiscount + vat

      // Update the sale with calculated totals
      db.prepare("UPDATE sales SET total_amount = ?, discount_amount = ?, vat_amount = ? WHERE id = ?").run(
        finalTotal,
        discount,
        vat,
        saleId,
      )
    }

    console.log("📊 Sample sales data generated")

    // Insert default settings
    const insertSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)")
    const settings = [
      ["vat_rate", "15"],
      ["currency", "ZAR"],
      ["company_name", "POS System"],
      ["receipt_footer", "Thank you for your business!"],
    ]

    settings.forEach((setting) => {
      insertSetting.run(setting[0], setting[1])
    })

    console.log("⚙️ Default settings configured")

    // Display summary statistics
    const totalSales = db.prepare("SELECT COUNT(*) as count, SUM(total_amount) as total FROM sales").get()
    const totalProducts = db.prepare("SELECT COUNT(*) as count FROM products").get()
    const totalCategories = db.prepare("SELECT COUNT(*) as count FROM categories").get()

    console.log("\n🎉 Database initialization completed successfully!")
    console.log("📈 Summary:")
    console.log(`   • ${totalCategories.count} product categories`)
    console.log(`   • ${totalProducts.count} products`)
    console.log(`   • ${totalSales.count} sample sales transactions`)
    console.log(`   • R ${totalSales.total?.toFixed(2) || "0.00"} total sales value`)
    console.log("\n🚀 Your POS system is ready to use!")
  } catch (error) {
    console.error("❌ Error initializing database:", error)
    throw error
  } finally {
    db.close()
  }
}

// Run the initialization
initDatabase()

import sqlite3
from datetime import datetime, timedelta
import random

def init_database():
    conn = sqlite3.connect('pos_system.db')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            category_id INTEGER,
            product_type TEXT NOT NULL,
            stock INTEGER DEFAULT 0,
            FOREIGN KEY (category_id) REFERENCES categories (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total_amount REAL NOT NULL,
            discount_amount REAL DEFAULT 0,
            vat_amount REAL NOT NULL,
            sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            customer_name TEXT,
            payment_method TEXT DEFAULT 'cash'
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sale_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sale_id INTEGER,
            product_id INTEGER,
            quantity INTEGER NOT NULL,
            unit_price REAL NOT NULL,
            total_price REAL NOT NULL,
            FOREIGN KEY (sale_id) REFERENCES sales (id),
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            value TEXT NOT NULL
        )
    ''')
    
    # Insert sample categories
    categories = [
        ('Electronics', 'Electronic devices and accessories'),
        ('Clothing', 'Apparel and fashion items'),
        ('Food & Beverage', 'Food and drink items'),
        ('Professional', 'Professional services')
    ]
    
    cursor.executemany('INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)', categories)
    
    # Insert sample products
    products = [
        ('Laptop Pro', 15000.00, 1, 'product', 25),
        ('Designer T-Shirt', 250.00, 2, 'product', 150),
        ('Premium Coffee', 45.00, 3, 'product', 200),
        ('Consultation', 500.00, 4, 'service', 0),
        ('Laptop + Setup', 16000.00, 1, 'combo', 15),
        ('Wireless Headphones', 2000.00, 1, 'product', 45)
    ]
    
    cursor.executemany('INSERT OR IGNORE INTO products (name, price, category_id, product_type, stock) VALUES (?, ?, ?, ?, ?)', products)
    
    # Insert sample sales data
    customers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown']
    
    for i in range(50):
        sale_date = datetime.now() - timedelta(days=random.randint(0, 30))
        customer = random.choice(customers)
        
        # Create a sale
        cursor.execute('''
            INSERT INTO sales (total_amount, discount_amount, vat_amount, sale_date, customer_name)
            VALUES (?, ?, ?, ?, ?)
        ''', (0, 0, 0, sale_date, customer))
        
        sale_id = cursor.lastrowid
        
        # Add random items to the sale
        num_items = random.randint(1, 4)
        total_amount = 0
        
        for _ in range(num_items):
            product_id = random.randint(1, 6)
            quantity = random.randint(1, 3)
            
            # Get product price
            cursor.execute('SELECT price FROM products WHERE id = ?', (product_id,))
            unit_price = cursor.fetchone()[0]
            
            item_total = quantity * unit_price
            total_amount += item_total
            
            cursor.execute('''
                INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price)
                VALUES (?, ?, ?, ?, ?)
            ''', (sale_id, product_id, quantity, unit_price, item_total))
        
        # Update sale totals
        discount = total_amount * 0.05 if random.random() < 0.3 else 0  # 30% chance of 5% discount
        after_discount = total_amount - discount
        vat = after_discount * 0.15
        final_total = after_discount + vat
        
        cursor.execute('''
            UPDATE sales 
            SET total_amount = ?, discount_amount = ?, vat_amount = ?
            WHERE id = ?
        ''', (final_total, discount, vat, sale_id))
    
    # Insert default settings
    settings = [
        ('vat_rate', '15'),
        ('currency', 'ZAR'),
        ('company_name', 'POS System'),
    ]
    
    cursor.executemany('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', settings)
    
    conn.commit()
    conn.close()
    
    print("Database initialized successfully!")
    print("Sample data has been inserted.")

if __name__ == "__main__":
    init_database()

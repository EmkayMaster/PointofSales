from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import uvicorn

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./pos_system.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)
    category_id = Column(Integer, ForeignKey("categories.id"))
    product_type = Column(String)  # 'product', 'service', 'combo'
    
    category = relationship("Category", back_populates="products")
    sale_items = relationship("SaleItem", back_populates="product")

class Sale(Base):
    __tablename__ = "sales"
    
    id = Column(Integer, primary_key=True, index=True)
    total_amount = Column(Float)
    discount_amount = Column(Float, default=0)
    vat_amount = Column(Float)
    sale_date = Column(DateTime, default=datetime.utcnow)
    customer_name = Column(String, nullable=True)
    
    items = relationship("SaleItem", back_populates="sale")

class SaleItem(Base):
    __tablename__ = "sale_items"
    
    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    unit_price = Column(Float)
    total_price = Column(Float)
    
    sale = relationship("Sale", back_populates="items")
    product = relationship("Product", back_populates="sale_items")

class Settings(Base):
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(String)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class CategoryCreate(BaseModel):
    name: str
    description: str

class CategoryResponse(BaseModel):
    id: int
    name: str
    description: str
    
    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    name: str
    price: float
    category_id: int
    product_type: str

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    category_id: int
    product_type: str
    
    class Config:
        from_attributes = True

class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

class SaleCreate(BaseModel):
    items: List[SaleItemCreate]
    discount_amount: float = 0
    customer_name: Optional[str] = None

class SaleResponse(BaseModel):
    id: int
    total_amount: float
    discount_amount: float
    vat_amount: float
    sale_date: datetime
    customer_name: Optional[str]
    
    class Config:
        from_attributes = True

# FastAPI app
app = FastAPI(title="POS System API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API Routes
@app.get("/")
def read_root():
    return {"message": "POS System API"}

# Categories
@app.post("/categories/", response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(name=category.name, description=category.description)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.get("/categories/", response_model=List[CategoryResponse])
def read_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@app.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(category)
    db.commit()
    return {"message": "Category deleted"}

# Products
@app.post("/products/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/products/", response_model=List[ProductResponse])
def read_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

# Sales
@app.post("/sales/", response_model=SaleResponse)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    # Calculate totals
    subtotal = sum(item.quantity * item.unit_price for item in sale.items)
    after_discount = subtotal - sale.discount_amount
    vat_rate = 0.15  # 15% VAT
    vat_amount = after_discount * vat_rate
    total_amount = after_discount + vat_amount
    
    # Create sale
    db_sale = Sale(
        total_amount=total_amount,
        discount_amount=sale.discount_amount,
        vat_amount=vat_amount,
        customer_name=sale.customer_name
    )
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    
    # Create sale items
    for item in sale.items:
        db_item = SaleItem(
            sale_id=db_sale.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.quantity * item.unit_price
        )
        db.add(db_item)
    
    db.commit()
    return db_sale

@app.get("/sales/", response_model=List[SaleResponse])
def read_sales(db: Session = Depends(get_db)):
    return db.query(Sale).all()

# Analytics
@app.get("/analytics/sales-by-category")
def get_sales_by_category(db: Session = Depends(get_db)):
    # This would contain complex SQL queries for analytics
    return {
        "Electronics": 35,
        "Clothing": 25,
        "Food & Beverage": 20,
        "Services": 20
    }

@app.get("/analytics/monthly-sales")
def get_monthly_sales(db: Session = Depends(get_db)):
    return [
        {"month": "Jan", "sales": 45000, "orders": 120},
        {"month": "Feb", "sales": 52000, "orders": 140},
        {"month": "Mar", "sales": 48000, "orders": 130},
        {"month": "Apr", "sales": 61000, "orders": 165},
        {"month": "May", "sales": 55000, "orders": 150},
        {"month": "Jun", "sales": 67000, "orders": 180},
    ]

# Settings
@app.get("/settings/{key}")
def get_setting(key: str, db: Session = Depends(get_db)):
    setting = db.query(Settings).filter(Settings.key == key).first()
    if not setting:
        # Return default values
        defaults = {"vat_rate": "15"}
        return {"key": key, "value": defaults.get(key, "0")}
    return {"key": setting.key, "value": setting.value}

@app.post("/settings/")
def update_setting(key: str, value: str, db: Session = Depends(get_db)):
    setting = db.query(Settings).filter(Settings.key == key).first()
    if setting:
        setting.value = value
    else:
        setting = Settings(key=key, value=value)
        db.add(setting)
    db.commit()
    return {"message": "Setting updated"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

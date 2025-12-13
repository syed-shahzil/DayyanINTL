/*
  # DayyanINTL Surgical Instruments E-Commerce Platform

  ## Overview
  Complete schema for a surgical instruments e-commerce platform with:
  - Role-based access control (Customer, Management, Owner)
  - Product catalog with categories
  - Shopping cart and wishlist
  - Orders and order items
  - User profiles with roles

  ## New Tables

  ### users
  - id (uuid, primary key) - Supabase auth user ID
  - email (text, unique)
  - full_name (text)
  - role (text) - 'customer', 'management', 'owner'
  - is_owner (boolean) - True only for the owner super admin
  - phone (text)
  - address (text)
  - city (text)
  - country (text)
  - postal_code (text)
  - created_at (timestamp)
  - updated_at (timestamp)

  ### categories
  - id (uuid, primary key)
  - name (text, unique)
  - description (text)
  - icon (text) - Icon name from lucide-react
  - image_url (text)
  - display_order (integer)
  - created_at (timestamp)

  ### products
  - id (uuid, primary key)
  - name (text)
  - description (text)
  - detailed_description (text)
  - category_id (uuid, foreign key)
  - price (decimal)
  - stock_quantity (integer)
  - sku (text, unique)
  - image_url (text)
  - thumbnail_url (text)
  - specifications (jsonb)
  - is_active (boolean)
  - created_at (timestamp)
  - updated_at (timestamp)

  ### cart_items
  - id (uuid, primary key)
  - user_id (uuid, foreign key)
  - product_id (uuid, foreign key)
  - quantity (integer)
  - created_at (timestamp)
  - updated_at (timestamp)

  ### wishlist_items
  - id (uuid, primary key)
  - user_id (uuid, foreign key)
  - product_id (uuid, foreign key)
  - created_at (timestamp)

  ### orders
  - id (uuid, primary key)
  - user_id (uuid, foreign key)
  - status (text) - 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  - total_amount (decimal)
  - subtotal (decimal)
  - shipping_cost (decimal)
  - tax (decimal)
  - shipping_address (text)
  - delivery_notes (text)
  - created_at (timestamp)
  - updated_at (timestamp)

  ### order_items
  - id (uuid, primary key)
  - order_id (uuid, foreign key)
  - product_id (uuid, foreign key)
  - quantity (integer)
  - price_at_purchase (decimal)
  - created_at (timestamp)

  ## Security
  - RLS enabled on all user-sensitive tables
  - Customers can only access their own data
  - Management users can manage products and view orders
  - Owner has full access to all data
  - Appropriate policies for each table based on role
*/

-- Create users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'management', 'owner')),
  is_owner boolean DEFAULT false,
  phone text,
  address text,
  city text,
  country text,
  postal_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  icon text,
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  detailed_description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  price decimal(10, 2) NOT NULL,
  stock_quantity integer DEFAULT 0,
  sku text UNIQUE NOT NULL,
  image_url text,
  thumbnail_url text,
  specifications jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_amount decimal(10, 2) NOT NULL,
  subtotal decimal(10, 2) NOT NULL,
  shipping_cost decimal(10, 2) DEFAULT 0,
  tax decimal(10, 2) DEFAULT 0,
  shipping_address text,
  delivery_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_at_purchase decimal(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM users WHERE id = auth.uid()));

-- Categories table policies (publicly readable)
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only management/owner can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('management', 'owner')
    )
  );

CREATE POLICY "Only management/owner can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('management', 'owner')
    )
  );

CREATE POLICY "Only management/owner can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('management', 'owner')
    )
  );

-- Products table policies (publicly readable)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active);

CREATE POLICY "Only management/owner can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('management', 'owner')
    )
  );

CREATE POLICY "Only management/owner can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('management', 'owner')
    )
  );

CREATE POLICY "Only management/owner can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('management', 'owner')
    )
  );

-- Cart items policies
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add items to own cart"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can view own wishlist"
  ON wishlist_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add items to wishlist"
  ON wishlist_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from wishlist"
  ON wishlist_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role IN ('management', 'owner')
  ));

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Management/owner can update order status"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('management', 'owner')
    )
  );

-- Order items policies
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_id AND user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('management', 'owner')
    )
  );

CREATE POLICY "Users can create own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
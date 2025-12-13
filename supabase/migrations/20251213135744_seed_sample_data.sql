/*
  # Seed Sample Data

  Add sample categories and products to the database for testing.
*/

INSERT INTO categories (id, name, description, icon, display_order) VALUES
  (gen_random_uuid(), 'General Surgery', 'Essential surgical instruments for general procedures', 'stethoscope', 1),
  (gen_random_uuid(), 'Orthopedic', 'Specialized instruments for bone and joint surgery', 'bone', 2),
  (gen_random_uuid(), 'Dental', 'Precision dental instruments and tools', 'smile', 3),
  (gen_random_uuid(), 'ENT', 'Ear, Nose, and Throat specialized equipment', 'ear', 4),
  (gen_random_uuid(), 'Diagnostic', 'Diagnostic tools and examination instruments', 'activity', 5),
  (gen_random_uuid(), 'Disposable', 'Single-use sterile disposable instruments', 'droplet', 6)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, sku, price, stock_quantity, description, detailed_description, is_active, image_url) VALUES
  (gen_random_uuid(), 'Surgical Scissors - Curved', 'SKU-001', 45.99, 50, 'Premium curved surgical scissors', 'High-quality stainless steel curved scissors for precise cutting', true, 'https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?auto=compress&cs=tinysrgb&w=600'),
  (gen_random_uuid(), 'Forceps - Straight', 'SKU-002', 38.50, 75, 'Straight surgical forceps', 'Durable straight forceps for tissue manipulation', true, 'https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?auto=compress&cs=tinysrgb&w=600'),
  (gen_random_uuid(), 'Scalpel Handle', 'SKU-003', 22.00, 100, 'Precision scalpel handle', 'Ergonomic scalpel handle for surgical incisions', true, 'https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?auto=compress&cs=tinysrgb&w=600'),
  (gen_random_uuid(), 'Hemostatic Clamp', 'SKU-004', 28.75, 60, 'Stainless steel hemostatic clamp', 'Reliable clamp for blood vessel control', true, 'https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?auto=compress&cs=tinysrgb&w=600'),
  (gen_random_uuid(), 'Retractor - Self-Retaining', 'SKU-005', 95.00, 20, 'Self-retaining surgical retractor', 'Advanced retractor for improved visibility', true, 'https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?auto=compress&cs=tinysrgb&w=600'),
  (gen_random_uuid(), 'Bone Saw', 'SKU-006', 125.50, 15, 'Orthopedic bone saw', 'Precision bone cutting instrument', true, 'https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?auto=compress&cs=tinysrgb&w=600'),
  (gen_random_uuid(), 'Dental Mirror', 'SKU-007', 12.99, 200, 'Mouth mirror for dental inspection', 'Clear magnifying dental mirror', true, 'https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?auto=compress&cs=tinysrgb&w=600'),
  (gen_random_uuid(), 'Otoscope Speculum', 'SKU-008', 18.50, 150, 'Reusable otoscope speculum', 'Comfortable ear examination tool', true, 'https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?auto=compress&cs=tinysrgb&w=600'),
  (gen_random_uuid(), 'Stethoscope', 'SKU-009', 65.00, 40, 'Dual-head stethoscope', 'Professional diagnostic stethoscope', true, 'https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?auto=compress&cs=tinysrgb&w=600'),
  (gen_random_uuid(), 'Surgical Gloves Box', 'SKU-010', 24.99, 500, 'Box of 100 sterile surgical gloves', 'High-quality latex-free gloves', true, 'https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?auto=compress&cs=tinysrgb&w=600')
ON CONFLICT DO NOTHING;
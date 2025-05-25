-- Insert sample products
INSERT INTO products (name, category, price, stock, description, image) VALUES
('iPhone 16 Pro Max', 'Phones & Tablets', 1299.99, 50, 'Latest iPhone model with titanium frame', 'iphone-16-pro-max-titan.jpg'),
('Apple Watch Ultra 2', 'Smartwatches', 799.99, 30, 'Advanced smartwatch with comprehensive health features', 'apple-watch-ultra-2-lte-49mm-vien-titanium-day-milan-638641727211652156-750x500.jpg'),
('MacBook Pro 14" M4', 'Laptops', 1999.99, 25, 'Professional laptop with M4 chip', 'macbook-pro-14-inch-m4-16gb-512gb-tgdd-den-1-638660152965882579-750x500.jpg'),
('MSI Stealth 14 AI Studio', 'Laptops', 1799.99, 15, 'High-performance gaming laptop', 'msi-stealth-14-ai-studio-a1vfg-ultra-7-085vn.jpg'),
('Ferrari Watch', 'Accessories', 299.99, 10, 'Ferrari branded luxury watch', 'ferrari-0830772-nam1-700x467.jpg');

-- Insert sample reviews
INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Amazing phone, worth every penny!'),
(1, 2, 4, 'Great phone but a bit expensive'),
(2, 1, 5, 'Best smartwatch I''ve ever owned'),
(3, 3, 5, 'Incredible performance and battery life'),
(4, 2, 4, 'Excellent gaming laptop, runs everything smoothly');

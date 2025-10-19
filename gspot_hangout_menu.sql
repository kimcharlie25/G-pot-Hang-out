/*
  # G'$pot Hangout Menu Items
  
  This file contains all menu items for G'$pot Hangout restaurant
  Categories: G - Overload Rice, S - Single Order, P - Drinks, Dessert, A - Add Ons
  
  Features:
  - Auto-generated UUIDs for all items
  - Proper categorization
  - Pricing in PHP (₱)
  - Popular items marked
  - Inventory tracking where applicable
*/

-- First, insert/update categories for G'$pot Hangout
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('overload-rice', 'G - OVERLOAD RICE', '🍚', 1, true),
  ('single-order', 'S - SINGLE ORDER', '🍽️', 2, true),
  ('drinks', 'P - DRINKS', '🥤', 3, true),
  ('dessert', 'DESSERT', '🍦', 4, true),
  ('add-ons', 'A - ADD ONS', '➕', 5, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active,
  updated_at = now();

-- ========================================
-- G - OVERLOAD RICE CATEGORY
-- ========================================

INSERT INTO menu_items (name, description, base_price, category, popular, available, track_inventory, stock_quantity, low_stock_threshold) VALUES
  ('G1 - OVERLOAD', 'Rice with Porkchop Tocino Jolly Longanisa', 209.00, 'overload-rice', true, true, true, 50, 5),
  ('G2 - OVERLOAD', 'Rice with Chicken Popper Tocino Siomai', 199.00, 'overload-rice', true, true, true, 50, 5),
  ('G3 - OVERLOAD', 'Rice with Jolly Longanisa Tocino Bacon', 189.00, 'overload-rice', true, true, true, 50, 5),
  ('G4 - OVERLOAD', 'Rice with Sweet Ham Crispy Burger Patty Nuggets', 189.00, 'overload-rice', true, true, true, 50, 5),
  ('G5 - OVERLOAD', 'Rice with Crispy Wanton Jolly Longanisa Bacon', 189.00, 'overload-rice', true, true, true, 50, 5),
  ('G6 - OVERLOAD', 'Rice with Tocino Bacon Sweet Ham', 185.00, 'overload-rice', true, true, true, 50, 5),
  ('G7 - OVERLOAD', 'Rice with Baloni Hungarian Sausage Sweet Ham', 199.00, 'overload-rice', true, true, true, 50, 5),
  ('G8 - OVERLOAD', 'Rice with Chicken Popper Jolly Longanisa Bacon', 199.00, 'overload-rice', true, true, true, 50, 5),
  ('G9 - OVERLOAD', 'Rice with Spam Bacon Sweet Ham', 229.00, 'overload-rice', true, true, true, 50, 5),
  ('G10 - OVERLOAD', 'Rice with Crispy Burger Patty Crispy Wanton Baloni', 219.00, 'overload-rice', true, true, true, 50, 5),
  ('G11 - OVERLOAD', 'Rice with Tocino Sweet Ham Jolly Longanisa', 239.00, 'overload-rice', true, true, true, 50, 5),
  ('G12 - OVERLOAD', 'Rice with Hungarian Sausage Spam Tocino', 259.00, 'overload-rice', true, true, true, 50, 5),
  ('G13 - OVERLOAD', 'Rice with Salami Baloni Siomai Jolly Longanisa', 209.00, 'overload-rice', true, true, true, 50, 5),
  ('G14 - OVERLOAD', 'Rice with Siomai Beef Siomai Pork Crispy Wanton', 199.00, 'overload-rice', true, true, true, 50, 5);

-- ========================================
-- S - SINGLE ORDER CATEGORY (CHAOFAN)
-- ========================================

INSERT INTO menu_items (name, description, base_price, category, popular, available, track_inventory, stock_quantity, low_stock_threshold) VALUES
  ('S1 - CHAOFAN', 'Rice with Mix Veggie Only', 59.00, 'single-order', false, true, true, 100, 10),
  ('S2 - CHAOFAN', 'Rice with (Sunny Side Up or Scramble)', 79.00, 'single-order', false, true, true, 100, 10),
  ('S3 - CHAOFAN', 'Rice with Nuggets', 99.00, 'single-order', false, true, true, 100, 10),
  ('S4 - CHAOFAN', 'Rice with Tocino', 99.00, 'single-order', false, true, true, 100, 10),
  ('S5 - CHAOFAN', 'Rice with Bacon', 109.00, 'single-order', false, true, true, 100, 10),
  ('S6 - CHAOFAN', 'Rice with Jolly Longanisa', 99.00, 'single-order', false, true, true, 100, 10),
  ('S7 - CHAOFAN', 'Rice with Chicken Poppers', 99.00, 'single-order', false, true, true, 100, 10),
  ('S8 - CHAOFAN', 'Rice with Sweet Ham', 99.00, 'single-order', false, true, true, 100, 10),
  ('S9 - CHAOFAN', 'Rice with Original Spam', 129.00, 'single-order', false, true, true, 100, 10),
  ('S10 - CHAOFAN', 'Rice with Crispy Burger Patty', 99.00, 'single-order', false, true, true, 100, 10),
  ('S11 - CHAOFAN', 'Rice with Siomai Beef or Pork', 99.00, 'single-order', false, true, true, 100, 10),
  ('S12 - CHAOFAN', 'Rice with Crispy Wanton', 99.00, 'single-order', false, true, true, 100, 10),
  ('S13 - CHAOFAN', 'Rice with Porkchop', 129.00, 'single-order', false, true, true, 100, 10),
  ('S14 - CHAOFAN', 'Rice with Salami', 99.00, 'single-order', false, true, true, 100, 10);

-- ========================================
-- P - DRINKS CATEGORY
-- ========================================

-- Magic Water with two size options (variations)
INSERT INTO menu_items (name, description, base_price, category, popular, available, track_inventory, stock_quantity, low_stock_threshold) VALUES
  ('P1 - MAGIC WATER', 'Refreshing Magic Water', 10.00, 'drinks', false, true, true, 200, 20);

-- Insert variations for Magic Water
INSERT INTO variations (menu_item_id, name, price)
SELECT 
  id,
  'Small',
  10.00
FROM menu_items 
WHERE name = 'P1 - MAGIC WATER' AND category = 'drinks';

INSERT INTO variations (menu_item_id, name, price)
SELECT 
  id,
  'Large',
  20.00
FROM menu_items 
WHERE name = 'P1 - MAGIC WATER' AND category = 'drinks';

-- Other drinks
INSERT INTO menu_items (name, description, base_price, category, popular, available, track_inventory, stock_quantity, low_stock_threshold) VALUES
  ('P2 - HOT COFFEE', 'Freshly brewed hot coffee', 39.00, 'drinks', true, true, true, 100, 10),
  ('P3 - HOT CHOCOLATE', 'Rich and creamy hot chocolate', 39.00, 'drinks', true, true, true, 100, 10),
  ('P4 - ALL FLAVOR ICE / MILK TEA', 'Various flavors of iced milk tea', 49.00, 'drinks', true, true, true, 100, 10);

-- ========================================
-- DESSERT CATEGORY
-- ========================================

INSERT INTO menu_items (name, description, base_price, category, popular, available, track_inventory, stock_quantity, low_stock_threshold) VALUES
  ('PREMIUM AICE ICE CREAM', 'For the dessert we have premium Aice Ice Cream', 13.00, 'dessert', true, true, true, 50, 5);

-- Insert variations for AICE Ice Cream (price range P 13.00 - P 75.00)
INSERT INTO variations (menu_item_id, name, price)
SELECT 
  id,
  'Small',
  13.00
FROM menu_items 
WHERE name = 'PREMIUM AICE ICE CREAM' AND category = 'dessert';

INSERT INTO variations (menu_item_id, name, price)
SELECT 
  id,
  'Medium',
  25.00
FROM menu_items 
WHERE name = 'PREMIUM AICE ICE CREAM' AND category = 'dessert';

INSERT INTO variations (menu_item_id, name, price)
SELECT 
  id,
  'Large',
  45.00
FROM menu_items 
WHERE name = 'PREMIUM AICE ICE CREAM' AND category = 'dessert';

INSERT INTO variations (menu_item_id, name, price)
SELECT 
  id,
  'Premium',
  75.00
FROM menu_items 
WHERE name = 'PREMIUM AICE ICE CREAM' AND category = 'dessert';

-- ========================================
-- A - ADD ONS CATEGORY
-- ========================================

-- Group 1: P49.00
INSERT INTO menu_items (name, description, base_price, category, popular, available, track_inventory, stock_quantity, low_stock_threshold) VALUES
  ('A1 - BACON', 'Crispy bacon strips', 49.00, 'add-ons', false, true, true, 100, 10),
  ('A2 - TOCINO', 'Sweet cured meat', 49.00, 'add-ons', false, true, true, 100, 10),
  ('A3 - CHEESY FRANKS', 'Cheesy hotdog franks', 49.00, 'add-ons', false, true, true, 100, 10),
  ('A4 - HUNGARIAN SAUSAGE', 'Spicy Hungarian sausage', 49.00, 'add-ons', false, true, true, 100, 10);

-- Group 2: P39.00
INSERT INTO menu_items (name, description, base_price, category, popular, available, track_inventory, stock_quantity, low_stock_threshold) VALUES
  ('A5 - NUGGETS', 'Crispy chicken nuggets', 39.00, 'add-ons', false, true, true, 100, 10),
  ('A6 - SALAMI', 'Italian salami', 39.00, 'add-ons', false, true, true, 100, 10),
  ('A7 - BALONI', 'Baloni sausage', 39.00, 'add-ons', false, true, true, 100, 10),
  ('A8 - SWEET HAM', 'Sweet cured ham', 39.00, 'add-ons', false, true, true, 100, 10),
  ('A9 - SIOMAI BEEF/PORK', 'Beef or pork siomai', 39.00, 'add-ons', false, true, true, 100, 10),
  ('A10 - MORCON DAKS', 'Morcon daks', 39.00, 'add-ons', false, true, true, 100, 10),
  ('A11 - CRISPY WANTON', 'Crispy wanton', 39.00, 'add-ons', false, true, true, 100, 10),
  ('A12 - CHICKEN POPPERS', 'Chicken poppers', 39.00, 'add-ons', false, true, true, 100, 10),
  ('A13 - JOLLY LONGANISA', 'Jolly longanisa', 39.00, 'add-ons', false, true, true, 100, 10),
  ('A14 - CRISPY BURGER PATTY', 'Crispy burger patty', 39.00, 'add-ons', false, true, true, 100, 10),
  ('A15 - CHORIZO DE CEBU', 'Chorizo de Cebu', 39.00, 'add-ons', false, true, true, 100, 10);

-- Group 3: P69.00
INSERT INTO menu_items (name, description, base_price, category, popular, available, track_inventory, stock_quantity, low_stock_threshold) VALUES
  ('A16 - ORIGINAL SPAM', 'Original spam', 69.00, 'add-ons', false, true, true, 100, 10),
  ('A17 - CRISPY PORKCHOP', 'Crispy porkchop', 69.00, 'add-ons', false, true, true, 100, 10),
  ('A18 - REAL HAM PROMEAT', 'Real ham promeat', 69.00, 'add-ons', false, true, true, 100, 10),
  ('A19 - CRISPY TOFU', 'Crispy tofu', 69.00, 'add-ons', false, true, true, 100, 10);

-- Group 4: P79.00
INSERT INTO menu_items (name, description, base_price, category, popular, available, track_inventory, stock_quantity, low_stock_threshold) VALUES
  ('A20 - TONKATSU', 'Tonkatsu', 79.00, 'add-ons', false, true, true, 100, 10),
  ('A21 - MCDO CHICKEN FILLET', 'McDonald''s style chicken fillet', 79.00, 'add-ons', false, true, true, 100, 10),
  ('A22 - CORDON BLEU', 'Cordon bleu', 79.00, 'add-ons', false, true, true, 100, 10);

-- Group 5: P30.00
INSERT INTO menu_items (name, description, base_price, category, popular, available, track_inventory, stock_quantity, low_stock_threshold) VALUES
  ('A23 - HANG TOMAS', 'Hang Tomas cheese', 30.00, 'add-ons', false, true, true, 100, 10),
  ('A24 - CHEESE SAUCE', 'Cheese sauce', 30.00, 'add-ons', false, true, true, 100, 10),
  ('A25 - SPECIAL SAUCE', 'Special sauce', 30.00, 'add-ons', false, true, true, 100, 10);

-- Group 6: FREE
INSERT INTO menu_items (name, description, base_price, category, popular, available, track_inventory, stock_quantity, low_stock_threshold) VALUES
  ('A26 - MAYO/KETCHUP', 'Mayonnaise or ketchup', 0.00, 'add-ons', false, true, true, 1000, 50);

-- ========================================
-- UPDATE SITE SETTINGS
-- ========================================

-- Update site name to G'$pot Hangout
INSERT INTO site_settings (id, value, type, description) VALUES
  ('site_name', 'G''$pot Hangout', 'text', 'Restaurant name'),
  ('site_tagline', 'OVERLOAD MEAL - Taste worth repeating!', 'text', 'Restaurant tagline'),
  ('site_description', 'Authentic Filipino rice meals with overload combinations', 'text', 'Restaurant description')
ON CONFLICT (id) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

-- This will show a success message when the script completes
SELECT 'G''$pot Hangout menu items have been successfully inserted!' as message;

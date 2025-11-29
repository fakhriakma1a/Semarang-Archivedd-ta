-- ============================================
-- SEED DATA FOR SEMARANG ARCHIVED APP
-- Updated version with correct category names
-- ============================================
-- Author: Muhammad Fakhri Akmal Arief
-- NIM: 21120123140172
-- Group: 10 - Shift 2
-- ============================================
-- Categories: cafe, restaurant, mall, historical_place
-- ============================================

-- Clear existing data (optional, uncomment if needed)
-- DELETE FROM places;

-- Insert Cafe & Coffee Shops
INSERT INTO places (name, description, address, category, image, rating, visited, is_favorite) VALUES
(
  'Kopi Praja',
  'Coffee shop modern dengan suasana cozy di pusat kota Semarang. Menyediakan berbagai pilihan kopi specialty dan makanan ringan. Buka setiap hari 08:00-22:00. Harga: Rp 20.000 - 75.000.',
  'Jl. Pemuda No. 118, Semarang',
  'cafe',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
  4.5,
  false,
  false
),
(
  'Kedai Kopi Selaras',
  'Hidden gem coffee shop dengan interior minimalis dan kopi berkualitas tinggi. WiFi gratis, cozy seating. Buka 09:00-21:00. Harga: Rp 25.000 - 80.000.',
  'Jl. Pandanaran No. 45, Semarang',
  'cafe',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
  4.7,
  false,
  false
),
(
  'Warung Tingwe',
  'Cafe dengan konsep vintage dan menu fusion yang unik. Tempat favorit anak muda Semarang dengan live music. Buka 10:00-23:00. Harga: Rp 30.000 - 100.000.',
  'Jl. Taman Srigunting No. 5, Semarang',
  'cafe',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
  4.6,
  false,
  false
),

-- Insert Restaurants (changed from culinary to restaurant)
(
  'Lumpia Gang Lombok',
  'Warung lumpia legendaris di Semarang yang sudah berdiri sejak puluhan tahun lalu. Wajib dicoba! Buka 08:00-20:00. Harga: Rp 15.000 - 50.000.',
  'Gang Lombok, Pekojan, Semarang',
  'restaurant',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
  4.8,
  false,
  false
),
(
  'Tahu Gimbal Pak Jayen',
  'Kuliner khas Semarang dengan tahu goreng dan udang gimbal yang lezat. Cocok untuk sarapan atau makan siang. Buka 07:00-15:00. Harga: Rp 10.000 - 40.000.',
  'Jl. Brigjen Sudiarto No. 28, Semarang',
  'restaurant',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
  4.7,
  false,
  false
),
(
  'Nasi Ayam Bu Yati',
  'Nasi ayam dengan bumbu khas Semarang yang gurih dan lezat. Porsi besar dengan harga terjangkau. Buka 09:00-21:00. Harga: Rp 20.000 - 60.000.',
  'Jl. Gajah Mada No. 89, Semarang',
  'restaurant',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  4.5,
  false,
  false
),
(
  'Soto Bangkong Semarang',
  'Soto khas Semarang dengan kuah bening yang segar dan daging sapi empuk. Tempat favorit untuk makan siang. Buka 08:00-16:00. Harga: Rp 25.000 - 70.000.',
  'Jl. Veteran No. 52, Semarang',
  'restaurant',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
  4.6,
  false,
  false
),

-- Insert Shopping Malls
(
  'Paragon Mall Semarang',
  'Mall modern dengan berbagai tenant fashion, elektronik, dan food court yang lengkap. Fasilitas: Cinema, Food Court, Parking, ATM Center. Buka 10:00-22:00.',
  'Jl. Pemuda No. 118, Semarang',
  'mall',
  'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800',
  4.4,
  false,
  false
),
(
  'Ciputra Mall Semarang',
  'Pusat perbelanjaan premium dengan brand-brand ternama dan entertainment center. Fasilitas: Supermarket, Cinema XXI, Food Court. Buka 10:00-22:00.',
  'Jl. Simpang Lima No. 1, Semarang',
  'mall',
  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
  4.5,
  false,
  false
),
(
  'Java Mall Semarang',
  'Mall dengan konsep open space dan garden, cocok untuk shopping sambil menikmati udara segar. Fasilitas: Outdoor Mall, Garden, Free Parking. Buka 10:00-22:00.',
  'Jl. MT. Haryono No. 992-994, Semarang',
  'mall',
  'https://images.unsplash.com/photo-1567958451310-2f767f9796e9?w=800',
  4.3,
  false,
  false
),

-- Insert Historical Places
(
  'Lawang Sewu',
  'Bangunan bersejarah ikonik Semarang dengan arsitektur kolonial yang megah. Dulunya merupakan kantor kereta api Belanda. Fasilitas: Museum, Photo Spot, Guided Tour, Souvenir Shop. Buka 08:00-21:00. Tiket: Rp 10.000 - 20.000.',
  'Jl. Pemuda, Sekayu, Semarang',
  'historical_place',
  'https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?w=800',
  4.8,
  false,
  false
),
(
  'Kota Lama Semarang',
  'Area heritage dengan bangunan-bangunan bergaya Eropa yang instagramable. Pusat sejarah kota Semarang. Fasilitas: Photo Spot, Street Food, Museum, Art Gallery. Buka 24 jam. Gratis.',
  'Jl. Letjen Suprapto, Tanjung Mas, Semarang',
  'historical_place',
  'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800',
  4.7,
  false,
  false
),
(
  'Gereja Blenduk',
  'Gereja tertua di Jawa Tengah dengan arsitektur bergaya Baroque yang unik dan bersejarah. Buka 08:00-17:00. Gratis (Donasi sukarela).',
  'Jl. Letjen Suprapto No. 32, Semarang',
  'historical_place',
  'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800',
  4.6,
  false,
  false
),
(
  'Sam Poo Kong',
  'Kelenteng bersejarah yang megah dengan arsitektur Tiongkok yang memukau. Tempat wisata religi dan sejarah. Fasilitas: Temple, Museum, Photo Spot, Souvenir Shop. Buka 08:00-21:00. Tiket: Rp 15.000.',
  'Jl. Simongan No. 129, Bongsari, Semarang',
  'historical_place',
  'https://images.unsplash.com/photo-1591882575732-c369df370f8b?w=800',
  4.7,
  false,
  false
),
(
  'Tugu Muda Semarang',
  'Monumen ikonik Semarang yang mengenang peristiwa pertempuran 5 hari di Semarang. City landmark dengan pemandangan malam yang indah. Buka 24 jam. Gratis.',
  'Jl. Pemuda, Sekayu, Semarang',
  'historical_place',
  'https://images.unsplash.com/photo-1553531087-b3ca6702c8c5?w=800',
  4.5,
  false,
  false
);

-- Set some places as visited and favorite for demo
UPDATE places SET visited = true, visited_date = NOW() - INTERVAL '2 days', is_favorite = true WHERE name = 'Lawang Sewu';
UPDATE places SET visited = true, visited_date = NOW() - INTERVAL '5 days' WHERE name = 'Kopi Praja';
UPDATE places SET visited = true, visited_date = NOW() - INTERVAL '1 day', is_favorite = true WHERE name = 'Lumpia Gang Lombok';
UPDATE places SET is_favorite = true WHERE name = 'Kota Lama Semarang';
UPDATE places SET visited = true, visited_date = NOW() - INTERVAL '7 days' WHERE name = 'Paragon Mall Semarang';

-- Verify data by category
SELECT 
  category,
  COUNT(*) as total_places
FROM places 
GROUP BY category
ORDER BY category;

-- Show all places with details
SELECT 
  name,
  category,
  rating,
  visited,
  is_favorite
FROM places
ORDER BY category, rating DESC;

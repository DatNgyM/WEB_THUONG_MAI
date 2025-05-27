-- Add a new 'images' column to the products table to store a JSON array of image paths
-- This is in addition to the existing 'image' column which stores the primary image
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT;

-- Update the products with sample data to have multiple images
UPDATE products 
SET images = '["/images/iphone-16-pro-max-titan.jpg", "/images/iphone-16-pro-max-titan-sa-mac-2.jpg", "/images/iphone-16-pro-max-titan-sa-mac-3.jpg", "/images/iphone-16-pro-max-titan-sa-mac-4.jpg"]'
WHERE id = 1;

UPDATE products 
SET images = '["/images/apple-watch-ultra-2-lte-49mm-vien-titanium-day-milan-638641727211652156-750x500.jpg"]' 
WHERE id = 2;

UPDATE products 
SET images = '["/images/macbook-pro-14-inch-m4-16gb-512gb-tgdd-den-1-638660152965882579-750x500.jpg"]' 
WHERE id = 3;

UPDATE products 
SET images = '["/images/msi-stealth-14-ai-studio-a1vfg-ultra-7-085vn.jpg"]' 
WHERE id = 4;

UPDATE products 
SET images = '["/images/ferrari-0830772-nam1-700x467.jpg"]' 
WHERE id = 5;

-- Create a function to check if all images in the database exist
-- This can be used for diagnostics to identify missing images
CREATE OR REPLACE FUNCTION check_images_exist() RETURNS TABLE (
    product_id INT,
    image_path TEXT,
    exists BOOLEAN
) AS $$
DECLARE
    product_record RECORD;
    image_path TEXT;
    images_json JSON;
    image_exists BOOLEAN;
BEGIN
    FOR product_record IN SELECT id, image, images FROM products LOOP
        -- Check primary image
        image_path := product_record.image;
        -- Logic to check if file exists would need to be implemented in application code
        -- Here we're just returning the paths
        RETURN QUERY SELECT product_record.id, image_path, NULL::BOOLEAN;
        
        -- Check additional images if any
        IF product_record.images IS NOT NULL THEN
            BEGIN
                images_json := product_record.images::json;
                FOR i IN 0..json_array_length(images_json)-1 LOOP
                    image_path := json_array_element_text(images_json, i);
                    -- Logic to check if file exists would need to be implemented in application code
                    RETURN QUERY SELECT product_record.id, image_path, NULL::BOOLEAN;
                END LOOP;
            EXCEPTION WHEN OTHERS THEN
                -- In case of invalid JSON
                RETURN QUERY SELECT product_record.id, product_record.images, NULL::BOOLEAN;
            END;
        END IF;
    END LOOP;
    RETURN;
END;
$$ LANGUAGE plpgsql;

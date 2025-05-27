/**
 * Product Enhancer Middleware
 * This middleware enhances product data with better descriptions and metadata when needed
 */

// Map of product category descriptions
const categoryDescriptions = {
    'Điện thoại': 'Các loại điện thoại thông minh cao cấp với thiết kế hiện đại, hiệu năng vượt trội và tính năng đa dạng.',
    'Laptop': 'Các dòng máy tính xách tay mạnh mẽ, phù hợp cho công việc, giải trí và sáng tạo.',
    'Đồng hồ': 'Đồng hồ thông minh với nhiều tính năng theo dõi sức khỏe, kết nối và thông báo.',
    'Phụ kiện': 'Các phụ kiện công nghệ chất lượng cao, tăng cường trải nghiệm sử dụng thiết bị.'
};

// Brand descriptions
const brandDescriptions = {
    'Apple': 'Thương hiệu công nghệ hàng đầu thế giới với thiết kế sang trọng, hệ sinh thái khép kín và trải nghiệm người dùng xuất sắc.',
    'Samsung': 'Tập đoàn công nghệ đa quốc gia với các sản phẩm đa dạng, công nghệ tiên tiến và thiết kế hiện đại.',
    'Xiaomi': 'Thương hiệu công nghệ với định hướng cung cấp sản phẩm chất lượng cao với giá cả hợp lý.',
    'Asus': 'Chuyên về máy tính và phụ kiện với công nghệ tiên tiến và hiệu năng mạnh mẽ.',
    'MSI': 'Thương hiệu laptop và PC gaming cao cấp với hiệu năng vượt trội dành cho game thủ.',
    'Dell': 'Thương hiệu máy tính tin cậy với dòng sản phẩm từ phổ thông đến cao cấp, phục vụ đa dạng nhu cầu người dùng.',
    'HP': 'Nhà sản xuất máy tính và thiết bị văn phòng lâu đời với chất lượng tốt và độ tin cậy cao.'
};

// Detailed product type descriptions
const productTypeDescriptions = {
    'iPhone': 'iPhone là dòng điện thoại thông minh cao cấp của Apple, với thiết kế sang trọng, hiệu năng mạnh mẽ và hệ sinh thái iOS đa dạng. Sản phẩm nổi bật với camera chất lượng cao, màn hình Retina sắc nét và trải nghiệm người dùng liền mạch.',
    'MacBook': 'MacBook là dòng máy tính xách tay cao cấp của Apple, với thiết kế unibody tinh tế, hiệu suất ổn định và hệ điều hành macOS mượt mà. Phù hợp cho công việc sáng tạo, lập trình và các tác vụ chuyên nghiệp.',
    'Apple Watch': 'Apple Watch là đồng hồ thông minh hàng đầu với khả năng theo dõi sức khỏe toàn diện, tính năng thể thao đa dạng và kết nối liền mạch với các thiết bị Apple khác.',
    'iPad': 'iPad là máy tính bảng cao cấp của Apple, với màn hình Retina sắc nét, hiệu năng mạnh mẽ và hỗ trợ Apple Pencil. Lý tưởng cho công việc, giải trí và sáng tạo nội dung.',
    'Galaxy': 'Galaxy là dòng điện thoại thông minh cao cấp của Samsung, với màn hình AMOLED sắc nét, camera đa năng và tính năng thông minh. Đi đầu trong công nghệ màn hình gập và đổi mới thiết kế.',
    'Gaming Laptop': 'Laptop gaming với hiệu năng xử lý đồ họa mạnh mẽ, hệ thống tản nhiệt hiệu quả và màn hình tần số quét cao. Thiết kế để đáp ứng các game nặng và xử lý đồ họa chuyên nghiệp.'
};

/**
 * Enhance product descriptions if they are missing or inadequate
 * @param {Object} product - The product object to enhance
 * @returns {Object} - Enhanced product object
 */
function enhanceProduct(product) {
    // Clone the product to avoid modifying the original
    const enhancedProduct = { ...product };
    
    // Check if description needs enhancement
    if (!enhancedProduct.description || enhancedProduct.description.length < 50) {
        // Detect product type from name
        const name = enhancedProduct.name.toLowerCase();
        let enhancedDescription = '';
        
        // Try to match with known product types
        for (const [type, description] of Object.entries(productTypeDescriptions)) {
            if (name.includes(type.toLowerCase())) {
                enhancedDescription = description;
                break;
            }
        }
        
        // If no specific product type matched, use category description
        if (!enhancedDescription && enhancedProduct.category) {
            enhancedDescription = categoryDescriptions[enhancedProduct.category] || 
                'Sản phẩm công nghệ chất lượng cao với nhiều tính năng hữu ích.';
        }
        
        // If still no description, create a generic one
        if (!enhancedDescription) {
            enhancedDescription = `${enhancedProduct.name} là sản phẩm công nghệ chất lượng cao với thiết kế hiện đại và tính năng đáng chú ý. Phù hợp cho nhu cầu sử dụng hàng ngày với độ bền cao và hiệu suất ổn định.`;
        }
        
        enhancedProduct.description = enhancedDescription;
    }
    
    return enhancedProduct;
}

/**
 * Middleware function to enhance products
 * @param {Array|Object} data - The product data (single object or array)
 * @returns {Array|Object} - Enhanced product data
 */
function enhanceProductData(data) {
    if (Array.isArray(data)) {
        // Enhance each product in the array
        return data.map(product => enhanceProduct(product));
    } else {
        // Enhance single product
        return enhanceProduct(data);
    }
}

module.exports = {
    enhanceProductData
};

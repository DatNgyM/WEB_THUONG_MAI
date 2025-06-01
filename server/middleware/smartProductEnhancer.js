/**
 * Smart Product Enhancer - Tự động phát hiện loại sản phẩm và tạo nội dung phù hợp
 * Xử lý cả sản phẩm mới và tránh trùng lặp nội dung
 */

/**
 * Phát hiện loại sản phẩm thông minh
 */
function detectProductType(product) {
  const { name, category, brand } = product;
  const nameLC = (name || '').toLowerCase();
  const categoryLC = (category || '').toLowerCase();
  const brandLC = (brand || '').toLowerCase();
  
  // Phát hiện tai nghe
  if (categoryLC.includes('tai nghe') || 
      nameLC.includes('airpods') || nameLC.includes('headphone') || 
      nameLC.includes('earbuds') || nameLC.includes('buds') ||
      nameLC.includes('headset') || nameLC.includes('earpods')) {
    return 'headphones';
  }
  
  // Phát hiện điện thoại
  if (categoryLC.includes('điện thoại') || categoryLC.includes('smartphone') ||
      nameLC.includes('iphone') || nameLC.includes('galaxy') || 
      nameLC.includes('pixel') || nameLC.includes('xiaomi') ||
      nameLC.includes('oppo') || nameLC.includes('vivo')) {
    return 'smartphone';
  }
  
  // Phát hiện laptop
  if (categoryLC.includes('laptop') || categoryLC.includes('máy tính') ||
      nameLC.includes('macbook') || nameLC.includes('thinkpad') ||
      nameLC.includes('pavilion') || nameLC.includes('inspiron')) {
    return 'laptop';
  }
  
  // Phát hiện tablet
  if (categoryLC.includes('tablet') || categoryLC.includes('máy tính bảng') ||
      nameLC.includes('ipad') || nameLC.includes('galaxy tab')) {
    return 'tablet';
  }
  
  // Phát hiện đồng hồ
  if (categoryLC.includes('đồng hồ') || categoryLC.includes('watch') ||
      nameLC.includes('apple watch') || nameLC.includes('galaxy watch')) {
    return 'smartwatch';
  }
  
  // Phát hiện phụ kiện
  if (categoryLC.includes('phụ kiện') || categoryLC.includes('case') ||
      nameLC.includes('sạc') || nameLC.includes('cable') ||
      nameLC.includes('adapter') || nameLC.includes('stand')) {
    return 'accessory';
  }
  
  // Mặc định
  return 'general';
}

/**
 * Phát hiện cấp độ sản phẩm (entry, mid, premium)
 */
function detectProductTier(product) {
  const { name, price } = product;
  const nameLC = (name || '').toLowerCase();
  const priceNum = parseFloat(price) || 0;
  
  // Phát hiện premium keywords
  if (nameLC.includes('pro max') || nameLC.includes('ultra') || 
      nameLC.includes('studio') || nameLC.includes('premium') ||
      priceNum > 800) {
    return 'premium';
  }
  
  // Phát hiện pro keywords
  if (nameLC.includes('pro') || nameLC.includes('plus') || 
      nameLC.includes('max') || (priceNum > 300 && priceNum <= 800)) {
    return 'pro';
  }
  
  // Phát hiện entry keywords
  if (nameLC.includes('mini') || nameLC.includes('lite') || 
      nameLC.includes('se') || priceNum < 100) {
    return 'entry';
  }
  
  // Mid-range
  return 'mid';
}

/**
 * Tạo specifications thông minh theo loại sản phẩm
 */
function generateSmartSpecifications(productType, productTier, product) {
  const specs = {};
  
  switch (productType) {
    case 'headphones':
      specs['Kết nối'] = ['Bluetooth 5.0+', 'Wireless'];
      
      if (productTier === 'premium' || productTier === 'pro') {
        specs['Pin'] = ['8-12 hours', 'Case: 30+ hours', 'Fast charging'];
        specs['Âm thanh'] = ['Active Noise Cancellation', 'Hi-Res Audio', 'Spatial Audio'];
        specs['Tính năng'] = ['Touch controls', 'Voice assistant', 'Multi-device pairing'];
      } else {
        specs['Pin'] = ['5-8 hours', 'Case: 20+ hours', 'Standard charging'];
        specs['Âm thanh'] = ['High-quality drivers', 'Bass boost'];
        specs['Tính năng'] = ['Touch controls', 'Voice assistant'];
      }
      break;
      
    case 'smartphone':
      if (productTier === 'premium') {
        specs['Màn hình'] = ['6.7" OLED', '120Hz ProMotion', '2K+ resolution'];
        specs['Hiệu năng'] = ['Flagship processor', 'High-end GPU', '12GB+ RAM'];
        specs['Camera'] = ['Triple camera system', '48MP+ main', 'Telephoto lens', '8K video'];
      } else if (productTier === 'pro') {
        specs['Màn hình'] = ['6.1-6.5" OLED/AMOLED', '90-120Hz', 'FHD+ resolution'];
        specs['Hiệu năng'] = ['Mid-high processor', 'Good GPU', '8-12GB RAM'];
        specs['Camera'] = ['Dual/Triple camera', '48MP main', '4K video'];
      } else {
        specs['Màn hình'] = ['5.5-6.1" LCD/AMOLED', '60-90Hz', 'HD+/FHD resolution'];
        specs['Hiệu năng'] = ['Entry-mid processor', 'Basic GPU', '4-8GB RAM'];
        specs['Camera'] = ['Single/Dual camera', '12-48MP', '1080p video'];
      }
      specs['Bộ nhớ'] = productTier === 'premium' ? ['256GB-1TB'] : ['64GB-512GB'];
      break;
      
    case 'laptop':
      if (productTier === 'premium') {
        specs['Processor'] = ['Intel i7/i9 or M1 Pro/Max', '8+ cores', 'Up to 5GHz'];
        specs['Memory'] = ['16GB-64GB RAM', 'High-speed memory'];
        specs['Display'] = ['14-16" 4K/Retina', '120Hz+', 'HDR support'];
      } else if (productTier === 'pro') {
        specs['Processor'] = ['Intel i5/i7 or M1/M2', '4-8 cores', 'Up to 4GHz'];
        specs['Memory'] = ['8GB-32GB RAM', 'DDR4/DDR5'];
        specs['Display'] = ['13-15" FHD/2K', '60-120Hz'];
      } else {
        specs['Processor'] = ['Intel i3/i5 or AMD Ryzen 3/5', '2-6 cores'];
        specs['Memory'] = ['4GB-16GB RAM', 'Standard memory'];
        specs['Display'] = ['13-15" HD/FHD', '60Hz'];
      }
      specs['Storage'] = ['256GB-2TB SSD'];
      break;
      
    case 'tablet':
      specs['Display'] = productTier === 'premium' ? 
        ['11-13" Liquid Retina', '120Hz', '2K+ resolution'] :
        ['9-11" Retina/LCD', '60Hz', 'FHD resolution'];
      specs['Processor'] = productTier === 'premium' ? 
        ['M1/M2 chip', 'Desktop-class performance'] :
        ['A-series chip', 'Mobile performance'];
      specs['Storage'] = ['64GB-1TB'];
      break;
      
    case 'smartwatch':
      specs['Display'] = ['OLED/AMOLED', 'Always-On', 'Touch screen'];
      specs['Health'] = ['Heart rate', 'Sleep tracking', 'Activity monitoring'];
      specs['Battery'] = productTier === 'premium' ? 
        ['2-3 days', 'Fast charging'] : 
        ['1-2 days', 'Standard charging'];
      break;
      
    case 'accessory':
      specs['Tương thích'] = ['Wide device compatibility'];
      specs['Chất liệu'] = ['Premium materials', 'Durable build'];
      specs['Tính năng'] = ['Easy to use', 'Reliable performance'];
      break;
      
    default:
      specs['Thông số cơ bản'] = ['High quality', 'Modern design', 'Reliable performance'];
      specs['Tính năng'] = ['User-friendly', 'Efficient', 'Safe to use'];
  }
  
  return specs;
}

/**
 * Tạo features thông minh
 */
function generateSmartFeatures(productType, productTier, product) {
  const features = [];
  
  // Features chung
  features.push('Thiết kế cao cấp và bền bỉ');
  
  switch (productType) {
    case 'headphones':
      features.push('Âm thanh chất lượng cao');
      features.push('Kết nối ổn định');
      if (productTier === 'premium' || productTier === 'pro') {
        features.push('Chống ồn chủ động');
        features.push('Âm thanh không gian');
      }
      features.push('Pin lâu dài');
      break;
      
    case 'smartphone':
      features.push('Hiệu năng mượt mà');
      features.push('Camera chất lượng cao');
      features.push('Bảo mật tiên tiến');
      if (productTier === 'premium') {
        features.push('Màn hình chuyên nghiệp');
        features.push('Sạc nhanh siêu tốc');
      }
      break;
      
    case 'laptop':
      features.push('Hiệu năng xử lý mạnh mẽ');
      features.push('Bàn phím thoải mái');
      features.push('Thời lượng pin dài');
      if (productTier === 'premium' || productTier === 'pro') {
        features.push('Màn hình chuyên nghiệp');
        features.push('Hệ thống tản nhiệt hiệu quả');
      }
      break;
      
    default:
      features.push('Hiệu năng ổn định');
      features.push('Giao diện thân thiện');
      features.push('Dễ dàng sử dụng');
  }
  
  // Feature cuối cùng
  features.push('Bảo hành chính hãng');
  
  return features;
}

/**
 * Tạo highlights thông minh
 */
function generateSmartHighlights(productType, productTier, product) {
  const highlights = [];
  
  switch (productType) {
    case 'headphones':
      if (productTier === 'premium') {
        highlights.push('Công nghệ âm thanh tiên tiến nhất');
      } else if (productTier === 'pro') {
        highlights.push('Chất lượng âm thanh chuyên nghiệp');
      } else {
        highlights.push('Âm thanh chất lượng tốt');
      }
      highlights.push('Thiết kế ergonomic thoải mái');
      break;
      
    case 'smartphone':
      if (productTier === 'premium') {
        highlights.push('Hiệu năng flagship hàng đầu');
        highlights.push('Camera chuyên nghiệp đỉnh cao');
      } else if (productTier === 'pro') {
        highlights.push('Hiệu năng mạnh mẽ');
        highlights.push('Camera chất lượng cao');
      } else {
        highlights.push('Hiệu năng ổn định');
        highlights.push('Camera đáp ứng nhu cầu');
      }
      break;
      
    case 'laptop':
      if (productTier === 'premium') {
        highlights.push('Hiệu năng workstation chuyên nghiệp');
      } else if (productTier === 'pro') {
        highlights.push('Hiệu năng đa nhiệm mượt mà');
      } else {
        highlights.push('Hiệu năng học tập và làm việc');
      }
      highlights.push('Thiết kế di động tiện lợi');
      break;
      
    default:
      highlights.push('Chất lượng đáng tin cậy');
      highlights.push('Thiết kế hiện đại');
  }
  
  highlights.push('Giá trị tuyệt vời');
  
  return highlights;
}

/**
 * Tạo mô tả chi tiết thông minh và UNIQUE
 */
function generateSmartDescription(productType, productTier, product) {
  const { name, category, brand } = product;
  const productName = name || 'Sản phẩm';
  const productBrand = brand || '';
  
  let description = `${productName} `;
  
  // Thêm info về brand nếu có
  if (productBrand) {
    description += `từ ${productBrand} `;
  }
  
  // Mô tả theo tier
  switch (productTier) {
    case 'premium':
      description += 'là sản phẩm cao cấp hàng đầu ';
      break;
    case 'pro':
      description += 'là sản phẩm chuyên nghiệp ';
      break;
    case 'mid':
      description += 'là sản phẩm tầm trung chất lượng ';
      break;
    default:
      description += 'là sản phẩm ';
  }
  
  // Mô tả theo product type
  switch (productType) {
    case 'headphones':
      description += 'mang đến trải nghiệm âm thanh tuyệt vời với thiết kế thoải mái và công nghệ hiện đại. ';
      if (productTier === 'premium') {
        description += 'Được tích hợp các công nghệ âm thanh tiên tiến nhất, mang lại chất lượng nghe nhạc đỉnh cao. ';
      }
      break;
      
    case 'smartphone':
      description += 'kết hợp hoàn hảo giữa hiệu năng, camera và thiết kế sang trọng. ';
      if (productTier === 'premium') {
        description += 'Với chip xử lý hàng đầu và hệ thống camera chuyên nghiệp, đáp ứng mọi nhu cầu từ công việc đến giải trí. ';
      }
      break;
      
    case 'laptop':
      description += 'được thiết kế để đáp ứng nhu cầu làm việc và học tập hiệu quả. ';
      if (productTier === 'premium') {
        description += 'Với hiệu năng mạnh mẽ và màn hình chuyên nghiệp, phù hợp cho cả công việc sáng tạo và xử lý dữ liệu nặng. ';
      }
      break;
      
    case 'tablet':
      description += 'mang đến sự linh hoạt hoàn hảo giữa di động và hiệu năng. ';
      break;
      
    case 'smartwatch':
      description += 'theo dõi sức khỏe và hỗ trợ cuộc sống hàng ngày một cách thông minh. ';
      break;
      
    case 'accessory':
      description += 'bổ sung hoàn hảo cho thiết bị của bạn với chất lượng và độ bền cao. ';
      break;
      
    default:
      description += 'với chất lượng đáng tin cậy và thiết kế hiện đại. ';
  }
  
  // Kết thúc unique cho từng sản phẩm
  const uniqueEndings = [
    `${productName} là lựa chọn lý tưởng cho những ai đang tìm kiếm sự kết hợp hoàn hảo giữa chất lượng và giá trị.`,
    `Với ${productName}, bạn sẽ trải nghiệm được sự khác biệt trong từng chi tiết và tính năng.`,
    `${productName} đại diện cho sự đầu tư thông minh cho nhu cầu của bạn.`,
    `Hãy để ${productName} trở thành người bạn đồng hành đáng tin cậy trong cuộc sống hàng ngày.`
  ];
  
  // Chọn ending dựa trên ID hoặc hash của tên sản phẩm để tránh trùng lặp
  const hash = productName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const endingIndex = Math.abs(hash) % uniqueEndings.length;
  
  description += uniqueEndings[endingIndex];
  
  return description;
}

/**
 * HÀM CHÍNH: Smart Product Enhancer
 */
function enhanceProductIntelligently(product) {
  // Sao chép sản phẩm gốc
  const enhanced = { ...product };
  
  // Phát hiện loại và cấp độ sản phẩm
  const productType = detectProductType(product);
  const productTier = detectProductTier(product);
  
  console.log(`Enhancing product: ${product.name}`);
  console.log(`Detected type: ${productType}, tier: ${productTier}`);
  
  // Tạo nội dung thông minh
  enhanced.detailedDescription = generateSmartDescription(productType, productTier, product);
  enhanced.specifications = generateSmartSpecifications(productType, productTier, product);
  enhanced.features = generateSmartFeatures(productType, productTier, product);
  enhanced.highlights = generateSmartHighlights(productType, productTier, product);
  
  // Thêm metadata để debug
  enhanced._enhancer_info = {
    type: productType,
    tier: productTier,
    enhanced_at: new Date().toISOString()
  };
  
  // Đảm bảo có description cơ bản
  if (!enhanced.description || enhanced.description.length < 50) {
    enhanced.description = enhanced.detailedDescription.substring(0, 200) + '...';
  }
  
  return enhanced;
}

module.exports = { enhanceProductIntelligently };
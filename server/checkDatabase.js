const pool = require('./db');

async function checkDatabase() {
    try {
        // Kiểm tra kết nối
        console.log('Đang kiểm tra kết nối với PostgreSQL...');
        await pool.query('SELECT NOW()');
        console.log(' Kết nối thành công!');

        // Liệt kê tất cả các bảng trong cơ sở dữ liệu
        console.log('\n Danh sách các bảng:');
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        
        const tables = tablesResult.rows.map(row => row.table_name);
        console.table(tables);

        // Kiểm tra bảng users
        if (tables.includes('users')) {
            console.log('\n Dữ liệu trong bảng users:');
            const usersResult = await pool.query('SELECT * FROM users');
            console.table(usersResult.rows);
        } else {
            console.log('\n Không tìm thấy bảng users!');
        }

        // Kiểm tra bảng admins
        if (tables.includes('admins')) {
            console.log('\n Dữ liệu trong bảng admins:');
            const adminsResult = await pool.query('SELECT * FROM admins');
            console.table(adminsResult.rows);
        } else {
            console.log('\n Không tìm thấy bảng admins!');
        }

        // Kiểm tra bảng products nếu có
        if (tables.includes('products')) {
            console.log('\n Dữ liệu trong bảng products (tối đa 5 sản phẩm):');
            const productsResult = await pool.query('SELECT * FROM products LIMIT 5');
            console.table(productsResult.rows);
        }

    } catch (error) {
        console.error(' Lỗi khi kiểm tra cơ sở dữ liệu:', error);
    } finally {
        // Đóng kết nối pool
        await pool.end();
    }
}

// Chạy hàm kiểm tra
checkDatabase();

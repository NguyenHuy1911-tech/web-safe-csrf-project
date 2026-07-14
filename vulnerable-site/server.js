const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Giả lập database lưu thông tin user
let userDatabase = {
    username: "admin",
    email: "user_chinh_chu@gmail.com"
};

// Giao diện chính của Web Nạn Nhân (cổng 3000)
app.get('/', (req, res) => {
    if (req.cookies.logged_in === 'true') {
        res.send(`
            <h2>Chào mừng ${userDatabase.username}!</h2>
            <p>Email hiện tại của bạn: <b style="color: blue;">${userDatabase.email}</b></p>
            <hr>
            <h3>Chức năng: Đổi Email tài khoản</h3>
            <form action="/update-email" method="POST">
                <input type="email" name="new_email" placeholder="Nhập email mới" required>
                <button type="submit">Cập nhật</button>
            </form>
        `);
    } else {
        // Tự động set cookie đăng nhập chưa có SameSite (Bị lỗi CSRF)
        res.cookie('logged_in', 'true', { httpOnly: true }); 
        res.send('<h3>Bạn đã được tự động đăng nhập! Hãy F5 (Tải lại) trang để vào hệ thống.</h3>');
    }
});

// Đường dẫn nhận request đổi email
app.post('/update-email', (req, res) => {
    if (req.cookies.logged_in === 'true') {
        userDatabase.email = req.body.new_email;
        res.send(`<h3>Cập nhật email thành công thành: ${userDatabase.email}</h3><a href="/">Quay lại Trang chủ</a>`);
    } else {
        res.status(401).send('Chưa đăng nhập, không thể đổi email!');
    }
});

app.listen(3000, () => console.log('Web nạn nhân đang chạy tại http://localhost:3000'));
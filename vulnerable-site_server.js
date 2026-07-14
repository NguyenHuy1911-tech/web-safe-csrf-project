const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.urlencoded({ extended: true }));

// Cấu hình Session Cookie bảo mật bằng SameSite=Lax (hoặc Strict)
app.use(session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,       // Ngăn chặn XSS đọc Cookie
        secure: false,        // Đổi thành true nếu chạy trên HTTPS thực tế
        sameSite: 'lax'       // Đóng vai trò lá chắn chống CSRF chính
    }
}));

// Route đăng nhập giả lập
app.post('/login', (req, res) => {
    req.session.userId = 'user123';
    res.send('Đăng nhập thành công! Session Cookie an toàn đã được thiết lập.');
});

// Route thay đổi mật khẩu (Mục tiêu của tấn công CSRF)
app.post('/change-password', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Lỗi: Bạn chưa đăng nhập (Không tìm thấy session hợp lệ)!');
    }
    const { new_password } = req.body;
    res.send(`Thành công: Mật khẩu đã được đổi thành "${new_password}".`);
});

app.listen(3000, () => {
    console.log('Vulnerable-site (Đã fix SameSite) đang chạy tại http://localhost:3000');
});

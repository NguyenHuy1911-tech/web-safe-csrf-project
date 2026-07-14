const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true }
}));

// Cấu hình middleware bảo vệ chống CSRF
const csrfProtection = csrf({ cookie: false }); // sử dụng session để lưu trữ token

// Thiết lập template engine đơn giản (hoặc giả lập trả về HTML)
app.get('/change-password-form', csrfProtection, (req, res) => {
    // Sinh mã token và nhúng vào Form HTML gửi về cho Client
    const token = req.csrfToken();
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Đổi Mật Khẩu</title></head>
        <body>
            <h2>Thay đổi mật khẩu hệ thống</h2>
            <form action="/change-password" method="POST">
                <!-- Thẻ ẩn chứa token chống CSRF -->
                <input type="hidden" name="_csrf" value="${token}">
                
                <label>Mật khẩu mới:</label>
                <input type="password" name="new_password" required>
                <button type="submit">Xác nhận đổi</button>
            </form>
        </body>
        </html>
    `);
});

app.post('/change-password', csrfProtection, (req, res) => {
    res.send('Thành công: Yêu cầu thay đổi mật khẩu hợp lệ (Token chính xác).');
});

// Xử lý lỗi khi sai hoặc thiếu CSRF Token
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).send('Lỗi bảo mật (403 Forbidden): Sai hoặc thiếu CSRF Token!');
    } else {
        next(err);
    }
});

app.listen(3000, () => {
    console.log('Server (Đã bảo vệ bằng CSRF Token) đang chạy tại http://localhost:3000');
});

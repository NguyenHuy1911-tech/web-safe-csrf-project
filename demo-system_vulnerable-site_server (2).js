const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));

// Cấu hình Session Cookie mặc định (Chưa có SameSite -> Bị lỗi CSRF)
app.use(session({
    secret: 'vulnerable-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true // Trình duyệt tự động gửi cookie này trong mọi cross-site request
    }
}));

// Giả lập cơ sở dữ liệu người dùng
let userDatabase = {
    username: "admin",
    email: "user@example.com"
};

// Giao diện chính của trang nạn nhân
app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.send(`
            <h2>Website Nạn Nhân (Vulnerable)</h2>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="Username" required><br><br>
                <input type="password" name="password" placeholder="Password" required><br><br>
                <button type="submit">Đăng nhập</button>
            </form>
        `);
    }
    res.send(`
        <h2>Chào mừng, ${req.session.user.username}!</h2>
        <p>Email hiện tại: <strong>${req.session.user.email}</strong></p>
        <hr>
        <h3>Đổi địa chỉ Email</h3>
        <form action="/update-email" method="POST">
            <input type="email" name="email" placeholder="Email mới" required>
            <button type="submit">Cập nhật</button>
        </form>
        <br>
        <a href="/logout">Đăng xuất</a>
    `);
});

// Xử lý Đăng nhập
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin') {
        req.session.user = { username: "admin", email: userDatabase.email };
        return res.redirect('/');
    }
    res.send('Sai thông tin tài khoản!');
});

// API Đổi Email (Có lỗ hổng CSRF)
app.post('/update-email', (req, res) => {
    if (!req.session.user) {
        return res.status(401).send("Unauthorized: Vui lòng đăng nhập trước!");
    }
    const { email } = req.body;
    userDatabase.email = email; // Cập nhật database giả lập
    req.session.user.email = email; // Cập nhật session
    res.send(`Cập nhật email thành công! Email mới của bạn là: ${email}`);
});

// Đăng xuất
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Website nạn nhân đang chạy tại http://localhost:3000');
});

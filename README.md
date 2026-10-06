# NovaX Exchange — UI Demo

Ảnh demo giao diện sàn giao dịch crypto (web + mobile app). Dữ liệu hoàn toàn giả lập.

## Web

![Web trading](images/web-trading.png)

## Mobile app

![Mobile app](images/mobile-app.png)

## Source

- `demo/web.html` — giao diện giao dịch trên web (danh sách thị trường, biểu đồ nến, sổ lệnh, đặt lệnh, lệnh đang mở)
- `demo/app.html` — 3 màn hình app: Trang chủ, Giao dịch, Ví
- `demo/style.css`, `demo/data.js` — style và dữ liệu giả lập dùng chung

Mở trực tiếp các file HTML bằng trình duyệt, hoặc tạo lại ảnh bằng Playwright:

```bash
node demo/screenshot.js
```

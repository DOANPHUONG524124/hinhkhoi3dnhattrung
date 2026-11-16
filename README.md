<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/9aa52772-d405-49f4-b5fe-a698ecbb3a3e

## Chạy cục bộ (Run Locally)

**Yêu cầu:** Node.js

1. Cài đặt các gói phụ thuộc:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Cấu hình biến môi trường `GEMINI_API_KEY` trong file `.env` hoặc `.env.local`:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   ```
3. Khởi chạy ứng dụng:
   ```bash
   npm run dev
   ```

## Triển khai lên Vercel (Deploy to Vercel)

Ứng dụng sử dụng Vercel Serverless Function tại `api/chat.js` để kết nối với Google Gemini API an toàn:
1. Kết nối repository với Vercel.
2. Thêm biến môi trường trong **Vercel Project Settings > Environment Variables**:
   - `GEMINI_API_KEY`: Khóa API Gemini của bạn (lấy tại Google AI Studio).
3. Triển khai (Deploy). Vercel sẽ tự động build ứng dụng Vite và tạo serverless route `/api/chat`. Khóa API hoàn toàn được bảo mật ở phía server và không bao giờ bị lộ ra client.

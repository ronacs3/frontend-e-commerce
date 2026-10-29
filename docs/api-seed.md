# Dữ liệu mẫu cho TechShop API

Backend: https://ecommerce-backend-nestjs-liard.vercel.app/api

Đã đối chiếu schema Swagger tại `/api/docs-json`. Bộ dữ liệu gồm 4 danh mục,
12 sản phẩm, 3 mã giảm giá, 3 khách demo và 3 đơn COD. Giá và thông số là giả lập;
ảnh chỉ để minh họa. Một sản phẩm có tồn kho bằng 0 để kiểm tra trạng thái hết hàng.

File dữ liệu: [api-seed.json](../data/api-seed.json).
`products[].key`, `customers[].key`, `orders[].key` là khóa nội bộ của bộ seed;
script chỉ gửi `products[].body` và DTO tương ứng lên API. Không gửi cả file JSON
vào một endpoint vì API không có endpoint nhập hàng loạt.

## Nạp trực tiếp

Đặt JWT của tài khoản quản trị trong biến môi trường `SEED_ADMIN_TOKEN`, hoặc
đặt email/mật khẩu admin trong `SEED_ADMIN_EMAIL` và `SEED_ADMIN_PASSWORD`.
Không đặt token vào source code hoặc file JSON dữ liệu.

```powershell
# Chỉ xem kế hoạch, không ghi lên backend
node scripts/seed-api.mjs

# Sau khi cấu hình thông tin quản trị
node scripts/seed-api.mjs --apply
```

Có thể cấu hình bằng file `.env.seed.local` (đã được gitignore bởi `.env*`).
Script tự sinh mật khẩu khách demo và lưu vào file này nếu chưa cấu hình
`SEED_CUSTOMER_PASSWORD`. Script không ghi JWT quản trị hoặc token khách vào
checkpoint hay log. Tài khoản demo dùng email thuộc miền `example.test`.

Thứ tự: xác minh admin → danh mục → sản phẩm → mã giảm giá → khách hàng → đơn hàng.
Script dùng ID thật do server trả về và đối chiếu sản phẩm sau khi nhập.
Checkpoint ID nằm trong `.seed-api.local.json`, được bỏ qua bởi git.
Chạy lại sử dụng checkpoint, đối chiếu tên/mã hiện có và tìm đơn demo trùng trước
khi tạo thêm. Script không cập nhật hay xóa bản ghi đang có.

Đơn mẫu có địa chỉ `DỮ LIỆU MẪU - KHÔNG XỬ LÝ GIAO HÀNG`, số điện thoại giả lập,
phương thức COD; không đánh dấu đã thanh toán, đã giao hoặc gọi cổng thanh toán.
Việc tạo đơn có thể làm giảm tồn kho theo nghiệp vụ của backend.

## Postman và Swagger

Import [Postman collection](../data/techshop-seed.postman_collection.json), đặt
`adminToken` và `demoPassword` trong collection variables rồi chạy folder theo thứ
tự. Postman tự lưu ID và JWT khách từ các response để tạo đơn. Collection dùng để
chạy một lượt; nếu cần chạy lại, ưu tiên script có checkpoint để tránh trùng dữ liệu.

[Payload bổ sung](../data/api-request-examples.json) gồm mẫu đăng nhập, cập nhật hồ
sơ, kiểm tra coupon, đánh giá, so sánh AI và chat. Thay các biến ID bằng ID thật sau
khi nhập. Hai tác vụ AI và gửi đánh giá không được script tự động gọi. Review có
thể cần khách đã mua/nhận sản phẩm tùy điều kiện backend. Mẫu đăng nhập là chỗ
điền thông tin của bạn, không phải tài khoản admin đã được tạo sẵn.

Endpoint đọc như danh sách/chi tiết, danh mục của sản phẩm, thống kê và lịch sử đơn
trả dữ liệu từ các bản ghi đã tạo, không cần seed riêng. Upload ảnh nhận file qua
`multipart/form-data`. Endpoint quên mật khẩu, hủy đơn, xác nhận thanh toán/giao hàng
và xóa dữ liệu không được tự động gọi khi nạp dữ liệu mẫu.

Kiểm tra cục bộ: `node --test tests/api-seed.test.mjs`.

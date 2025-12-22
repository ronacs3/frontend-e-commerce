import { createSlice } from "@reduxjs/toolkit";

/* ================= HELPERS: TÍNH TOÁN & LƯU STORAGE ================= */
const updateCart = (state) => {
  // 1. Tính tổng tiền hàng (Items Price)
  // Lưu ý: Tính trên TOÀN BỘ sản phẩm trong giỏ (để hiển thị con số tổng).
  // Việc tính tiền để thanh toán (chỉ các món đã chọn) sẽ xử lý ở component PlaceOrder.
  state.itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // 2. Tính phí vận chuyển (Shipping Price)
  // Quy tắc: Đơn > 10 triệu miễn phí, ngược lại 30k
  state.shippingPrice = state.itemsPrice > 10000000 ? 0 : 30000;

  // 3. Tính thuế (Tax Price) - Ví dụ 10% VAT
  // Dùng toFixed(0) để làm tròn số nguyên, sau đó ép kiểu về Number
  state.taxPrice = Number((0.1 * state.itemsPrice).toFixed(0));

  // 4. Tính tổng cộng (Total Price)
  state.totalPrice = state.itemsPrice + state.shippingPrice + state.taxPrice;

  // 5. Lưu vào LocalStorage (Chỉ chạy ở Client)
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(state));
  }

  return state;
};

/* ================= INITIAL STATE ================= */
// Lấy dữ liệu từ LocalStorage khi khởi tạo (để F5 không mất giỏ hàng)
const initialState =
  typeof window !== "undefined" && localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {
        cartItems: [],
        shippingAddress: {},
        paymentMethod: "PayPal",
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
      };

/* ================= SLICE ================= */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 1. THÊM SẢN PHẨM VÀO GIỎ
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // Nếu sản phẩm đã có -> Cập nhật số lượng/thông tin
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...x, ...item } : x
        );
      } else {
        // Nếu chưa có -> Thêm mới và mặc định tick chọn (isSelected: true)
        state.cartItems = [...state.cartItems, { ...item, isSelected: true }];
      }

      return updateCart(state);
    },

    // 2. XÓA SẢN PHẨM KHỎI GIỎ
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },

    // 3. LƯU ĐỊA CHỈ GIAO HÀNG
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },

    // 4. LƯU PHƯƠNG THỨC THANH TOÁN
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },

    // 5. XÓA SẠCH GIỎ HÀNG (Thường dùng khi test)
    clearCartItems: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },

    // 6. ĐỒNG BỘ GIỎ HÀNG TỪ DATABASE (Khi đăng nhập)
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      return updateCart(state);
    },

    // 7. TICK CHỌN/BỎ CHỌN 1 SẢN PHẨM
    toggleItemCheck: (state, action) => {
      const itemId = action.payload;
      const item = state.cartItems.find((x) => x._id === itemId);
      if (item) {
        item.isSelected = !item.isSelected;
      }
      return updateCart(state);
    },

    // 8. TICK CHỌN/BỎ CHỌN TẤT CẢ
    toggleAllChecks: (state, action) => {
      const isChecked = action.payload; // true hoặc false
      state.cartItems = state.cartItems.map((item) => ({
        ...item,
        isSelected: isChecked,
      }));
      return updateCart(state);
    },

    // 9. CHỈ XÓA CÁC SẢN PHẨM ĐÃ MUA (Sau khi đặt hàng thành công)
    clearPurchasedItems: (state) => {
      // Giữ lại các món chưa được chọn (chưa mua)
      state.cartItems = state.cartItems.filter((item) => !item.isSelected);
      return updateCart(state);
    },

    // 10. RESET TOÀN BỘ KHI ĐĂNG XUẤT (Logout)
    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = "PayPal";
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;

      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  setCartItems, // Dùng để sync từ DB
  toggleItemCheck, // Dùng cho Checkbox từng món
  toggleAllChecks, // Dùng cho Checkbox "Chọn tất cả"
  clearPurchasedItems, // Dùng sau khi Place Order
  resetCart, // Dùng khi Logout
} = cartSlice.actions;

export default cartSlice.reducer;

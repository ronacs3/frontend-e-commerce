"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "antd";

const { Search } = Input;

export default function SearchBox() {
  const router = useRouter();

  const onSearch = (value) => {
    if (value.trim()) {
      // Chuyển hướng về trang chủ với tham số keyword
      router.push(`/?keyword=${value}`);
    } else {
      // Nếu ô tìm kiếm rỗng thì về trang chủ mặc định
      router.push("/");
    }
  };

  return (
    <div className="w-full max-w-md">
      <Search
        placeholder="Tìm kiếm sản phẩm..."
        onSearch={onSearch}
        enterButton
        size="large" // Kích thước lớn cho dễ nhìn
        allowClear // Cho phép bấm nút X để xóa nhanh
        className="custom-search" // Để style thêm nếu cần
      />
    </div>
  );
}

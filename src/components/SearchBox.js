"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function SearchBox() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (value) => {
    const trimmed = value.trim();
    if (trimmed) {
      router.push(`/?keyword=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-full max-w-xl">
      <Input
        placeholder="Tìm kiếm laptop, điện thoại, phụ kiện..."
        prefix={<SearchOutlined className="text-slate-400 text-lg mr-2" />}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onPressEnter={() => handleSearch(keyword)}
        allowClear
        size="large"
        className="rounded-full shadow-sm border-slate-200 hover:border-indigo-500 focus:border-indigo-500 transition-all text-sm bg-slate-50/80 focus:bg-white"
      />
    </div>
  );
}

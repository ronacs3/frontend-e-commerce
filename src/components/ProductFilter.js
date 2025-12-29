"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, Radio, Slider, Input, Button, Typography, Space } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;
const DEFAULT_MAX_PRICE = 50000000;

export default function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ================= STATE ================= */
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("min")) || 0,
    Number(searchParams.get("max")) || DEFAULT_MAX_PRICE,
  ]);

  /* ================= SYNC URL -> STATE ================= */
  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setKeyword(searchParams.get("keyword") || "");
    setPriceRange([
      Number(searchParams.get("min")) || 0,
      Number(searchParams.get("max")) || DEFAULT_MAX_PRICE,
    ]);
  }, [searchParams]);

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        cache: "no-store",
      });
      if (res.ok) {
        setCategories(await res.json());
      }
    };

    fetchCategories();
  }, []);

  /* ================= APPLY FILTER ================= */
  const handleFilter = () => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    if (keyword) params.set("keyword", keyword);

    if (priceRange[0] > 0) params.set("min", priceRange[0]);
    if (priceRange[1] < DEFAULT_MAX_PRICE) params.set("max", priceRange[1]);

    router.push(`/?${params.toString()}`);
  };

  /* ================= CLEAR ================= */
  const clearFilter = () => {
    setCategory("");
    setKeyword("");
    setPriceRange([0, DEFAULT_MAX_PRICE]);
    router.push("/");
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <div className="flex items-center gap-2 mb-4 text-blue-600">
        <FilterOutlined style={{ fontSize: 20 }} />
        <h2 className="text-lg font-bold m-0">Bộ lọc tìm kiếm</h2>
      </div>

      <Space orientation="vertical" size="large" className="w-full">
        {/* KEYWORD */}
        <div>
          <Title level={5}>Từ khóa</Title>
          <Input
            placeholder="Tìm sản phẩm..."
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleFilter}
          />
        </div>

        {/* CATEGORY (NAME) */}
        <div>
          <Title level={5}>Danh mục</Title>
          <Radio.Group
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex flex-col gap-2"
          >
            <Radio value="">Tất cả</Radio>
            {categories.map((cat) => (
              <Radio key={cat._id} value={cat.name}>
                {cat.name}
              </Radio>
            ))}
          </Radio.Group>
        </div>

        {/* PRICE */}
        <div>
          <Title level={5}>Khoảng giá</Title>
          <Slider
            range
            min={0}
            max={DEFAULT_MAX_PRICE}
            step={500000}
            value={priceRange}
            onChange={setPriceRange}
            tooltip={{
              formatter: (v) => `${(v / 1_000_000).toFixed(1)}Tr`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{priceRange[0].toLocaleString("vi-VN")}đ</span>
            <span>{priceRange[1].toLocaleString("vi-VN")}đ</span>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex gap-2">
          <Button type="primary" block onClick={handleFilter}>
            Áp dụng
          </Button>
          <Button block onClick={clearFilter}>
            Đặt lại
          </Button>
        </div>
      </Space>
    </Card>
  );
}

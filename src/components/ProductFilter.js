"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Radio, Slider } from "antd";
import {
  DollarOutlined,
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { formatCurrency } from "@/utils/formatters";

const DEFAULT_MAX_PRICE = 50000000;

export default function ProductFilter({
  initialCategory = "",
  initialKeyword = "",
  initialMin = 0,
  initialMax = DEFAULT_MAX_PRICE,
}) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [priceRange, setPriceRange] = useState([
    Number(initialMin) || 0,
    Number(initialMax) || DEFAULT_MAX_PRICE,
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            cache: "no-store",
          },
        );
        if (res.ok) setCategories(await res.json());
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (priceRange[0] > 0) params.set("min", priceRange[0]);
    if (priceRange[1] < DEFAULT_MAX_PRICE) params.set("max", priceRange[1]);
    router.push(`/?${params.toString()}`);
  };

  const clearFilter = () => {
    setCategory("");
    setKeyword("");
    setPriceRange([0, DEFAULT_MAX_PRICE]);
    router.push("/");
  };

  return (
    <section
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-4 sm:p-5"
      aria-label="Bộ lọc sản phẩm"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-800">
            <FilterOutlined />
          </span>
          Bộ lọc sản phẩm
        </h2>
        <button
          type="button"
          onClick={clearFilter}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-teal-800"
        >
          <ReloadOutlined /> Đặt lại
        </button>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="product-keyword"
          className="block text-xs font-semibold text-slate-600"
        >
          Từ khóa
        </label>
        <Input
          id="product-keyword"
          placeholder="Tên sản phẩm, thương hiệu..."
          prefix={<SearchOutlined className="text-slate-400" />}
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onPressEnter={handleFilter}
          allowClear
          className="h-10 rounded-lg border-slate-200"
        />
      </div>

      <div className="space-y-2.5">
        <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <TagsOutlined className="text-teal-700" /> Danh mục
        </h3>
        <Radio.Group
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="flex w-full flex-col gap-1"
        >
          <Radio
            value=""
            className="w-full rounded-md px-2 py-1 text-sm hover:bg-slate-50"
          >
            Tất cả danh mục
          </Radio>
          {categories.map((cat) => (
            <Radio
              key={cat._id}
              value={cat.name}
              className="w-full rounded-md px-2 py-1 text-sm hover:bg-slate-50"
            >
              {cat.name}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <DollarOutlined className="text-teal-700" /> Khoảng giá
        </h3>
        <Slider
          range
          min={0}
          max={DEFAULT_MAX_PRICE}
          step={500000}
          value={priceRange}
          onChange={setPriceRange}
          tooltip={{ formatter: (value) => formatCurrency(value) }}
        />
        <div className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
          <span>{formatCurrency(priceRange[0])}</span>
          <span className="text-slate-400">đến</span>
          <span>{formatCurrency(priceRange[1])}</span>
        </div>
      </div>

      <Button
        type="primary"
        block
        onClick={handleFilter}
        className="h-10 rounded-lg bg-teal-800 font-semibold hover:!bg-teal-900"
      >
        Áp dụng bộ lọc
      </Button>
    </section>
  );
}

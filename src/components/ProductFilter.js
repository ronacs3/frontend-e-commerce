"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Radio, Slider, Input, Button, Switch } from "antd";
import { FilterOutlined, SearchOutlined, ReloadOutlined, TagsOutlined, DollarOutlined } from "@ant-design/icons";
import { formatCurrency } from "@/utils/formatters";

const DEFAULT_MAX_PRICE = 50000000;

export default function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("min")) || 0,
    Number(searchParams.get("max")) || DEFAULT_MAX_PRICE,
  ]);

  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setKeyword(searchParams.get("keyword") || "");
    setPriceRange([
      Number(searchParams.get("min")) || 0,
      Number(searchParams.get("max")) || DEFAULT_MAX_PRICE,
    ]);
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleFilter = () => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    if (keyword) params.set("keyword", keyword);

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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <FilterOutlined />
          </div>
          <span>Bộ lọc tìm kiếm</span>
        </div>
        <button
          onClick={clearFilter}
          className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition"
        >
          <ReloadOutlined /> Đặt lại
        </button>
      </div>

      {/* SEARCH KEYWORD */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Từ khóa sản phẩm
        </label>
        <Input
          placeholder="Tên sản phẩm, thương hiệu..."
          prefix={<SearchOutlined className="text-slate-400" />}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleFilter}
          allowClear
          className="rounded-xl border-slate-200"
        />
      </div>

      {/* CATEGORY */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <TagsOutlined className="text-indigo-500" />
          <span>Danh mục sản phẩm</span>
        </div>
        <div className="pt-1">
          <Radio.Group
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex flex-col gap-2 w-full"
          >
            <Radio value="" className="w-full text-slate-700 font-medium py-1 px-2.5 rounded-lg hover:bg-slate-50">
              Tất cả danh mục
            </Radio>
            {categories.map((cat) => (
              <Radio
                key={cat._id}
                value={cat.name}
                className="w-full text-slate-700 font-medium py-1 px-2.5 rounded-lg hover:bg-slate-50"
              >
                {cat.name}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </div>

      {/* PRICE RANGE */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <DollarOutlined className="text-emerald-500" />
            <span>Khoảng giá</span>
          </div>
        </div>

        <Slider
          range
          min={0}
          max={DEFAULT_MAX_PRICE}
          step={500000}
          value={priceRange}
          onChange={setPriceRange}
          tooltip={{
            formatter: (v) => formatCurrency(v),
          }}
          trackStyle={[{ backgroundColor: "#4f46e5", height: 6 }]}
          handleStyle={[
            { borderColor: "#4f46e5", backgroundColor: "#ffffff" },
            { borderColor: "#4f46e5", backgroundColor: "#ffffff" },
          ]}
        />

        <div className="flex justify-between text-xs font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span>{formatCurrency(priceRange[0])}</span>
          <span className="text-slate-400">-</span>
          <span>{formatCurrency(priceRange[1])}</span>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="pt-2 flex flex-col gap-2">
        <Button
          type="primary"
          block
          size="large"
          onClick={handleFilter}
          className="bg-indigo-600 hover:!bg-indigo-700 font-bold rounded-xl shadow-md shadow-indigo-600/20"
        >
          Áp dụng bộ lọc
        </Button>
      </div>
    </div>
  );
}

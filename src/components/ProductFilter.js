"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Slider } from "antd";
import { ArrowRight, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

const DEFAULT_MAX_PRICE = 50000000;
export default function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [priceRange, setPriceRange] = useState([Number(searchParams.get("min")) || 0, Number(searchParams.get("max")) || DEFAULT_MAX_PRICE]);
  useEffect(() => {
    const controller = new AbortController();
    async function loadCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/categories`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch { /* Keep search usable when categories are unavailable. */ }
    }
    loadCategories();
    return () => controller.abort();
  }, []);
  const handleFilter = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (priceRange[0] > 0) params.set("min", priceRange[0]);
    if (priceRange[1] < DEFAULT_MAX_PRICE) params.set("max", priceRange[1]);
    router.push(`/?${params.toString()}#catalog`);
  };
  const clearFilter = () => { setCategory(""); setKeyword(""); setPriceRange([0, DEFAULT_MAX_PRICE]); router.push("/#catalog"); };
  return <form className="filter-panel" onSubmit={handleFilter}>
    <div className="filter-heading"><h3><SlidersHorizontal size={17} /> Bộ lọc</h3><button type="button" onClick={clearFilter} aria-label="Đặt lại bộ lọc" title="Đặt lại bộ lọc"><RotateCcw size={15} /></button></div>
    <div className="filter-group"><label htmlFor="catalog-search" className="filter-label">Tìm kiếm</label><div className="filter-search"><Search size={15} /><input id="catalog-search" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tên sản phẩm…" /></div></div>
    <fieldset className="filter-group"><legend className="filter-label">Danh mục sản phẩm</legend><label className={`category-option${category === "" ? " selected" : ""}`}><input type="radio" name="category" value="" checked={category === ""} onChange={() => setCategory("")} /><span>Tất cả sản phẩm</span><span className="category-mark" /></label>{categories.map((cat) => <label key={cat._id || cat.name} className={`category-option${category === cat.name ? " selected" : ""}`}><input type="radio" name="category" value={cat.name} checked={category === cat.name} onChange={() => setCategory(cat.name)} /><span>{cat.name}</span><span className="category-mark" /></label>)}</fieldset>
    <div className="filter-group"><span className="filter-label">Khoảng giá</span><Slider range min={0} max={DEFAULT_MAX_PRICE} step={500000} value={priceRange} onChange={setPriceRange} tooltip={{ formatter: (v) => `${(v / 1000000).toLocaleString("vi-VN")} triệu` }} /><div className="price-range-values"><span>{priceRange[0].toLocaleString("vi-VN")} ₫</span><span>{priceRange[1].toLocaleString("vi-VN")} ₫</span></div></div>
    <button type="submit" className="button-primary filter-submit">Áp dụng bộ lọc <ArrowRight size={16} /></button><button type="button" className="filter-reset" onClick={clearFilter}>Xóa tất cả bộ lọc</button>
  </form>;
}

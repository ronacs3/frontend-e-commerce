"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

export default function SearchBox({ onSearch }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const handleSearch = (event) => {
    event.preventDefault();
    router.push(keyword.trim() ? "/?keyword=" + encodeURIComponent(keyword.trim()) + "#catalog" : "/#catalog");
    onSearch?.();
  };
  return <form className="store-search" role="search" onSubmit={handleSearch}><Search size={18} aria-hidden="true" /><input aria-label="Tìm sản phẩm" placeholder="Bạn đang tìm thiết bị gì?" value={keyword} onChange={(event) => setKeyword(event.target.value)} /><button type="submit" aria-label="Tìm kiếm"><ArrowRight size={18} /></button></form>;
}

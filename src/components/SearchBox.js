"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowUpRight } from "lucide-react";

export default function SearchBox() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const onSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    router.push(params.size ? `/?${params.toString()}#catalog` : "/#catalog");
  };
  return <form className="store-search" role="search" onSubmit={onSearch}><Search size={19} aria-hidden="true" /><input aria-label="Tìm kiếm sản phẩm" placeholder="Bạn đang tìm gì hôm nay?" value={keyword} onChange={(event) => setKeyword(event.target.value)} /><button type="submit" aria-label="Tìm kiếm"><ArrowUpRight size={19} /></button></form>;
}

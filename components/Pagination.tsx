"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

type PaginationProps={
    currentPage:number
    totalPages:number
    basePath:string
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  const params = useSearchParams();
  const query = new URLSearchParams(params.toString());

  return (
    <div className="flex justify-center gap-2 mt-10">
      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        query.set("page", String(page));

        return (
          <Link
            key={page}
            href={`${basePath}?${query.toString()}`}
            className={`px-4 py-2 border rounded-[15px] font-semibold border-none shadow-xl ${
              page === currentPage ? "bg-black text-white" : ""
            }`}
          >
            {page}
          </Link>
        );
      })}
    </div>
  );
}

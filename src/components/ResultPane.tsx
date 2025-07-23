import React, { useState } from "react";
import type { RoleCost } from "./RoleInputTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ResultPaneProps {
  solutions: [number, number[]][];
  roles: readonly RoleCost[];
}

const PAGE_SIZE = 100;
const PAGE_WINDOW = 2;

export const ResultPane: React.FC<ResultPaneProps> = ({
  solutions: result,
  roles,
}) => {
  const [page, setPage] = useState(0);
  const [inputPage, setInputPage] = useState("");
  const totalPages = Math.ceil(result.length / PAGE_SIZE);
  const paged = result.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (!result || result.length === 0) {
    return (
      <div className="p-4 border rounded-md text-center text-red-500">
        解が見つかりません
      </div>
    );
  }

  // ページ番号リスト生成
  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(0, page - PAGE_WINDOW);
    const end = Math.min(totalPages - 1, page + PAGE_WINDOW);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (start > 0) pages.unshift(-1); // -1は先頭省略記号
    if (end < totalPages - 1) pages.push(-2); // -2は末尾省略記号
    return pages;
  };

  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(inputPage);
    if (!isNaN(num) && num >= 1 && num <= totalPages) {
      setPage(num - 1);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <div className="flex justify-between mb-2">
        <span className="font-bold">各職種の稼働日数</span>
        <span className="text-right">
          {result.length}件中 {page * PAGE_SIZE + 1}〜
          {Math.min((page + 1) * PAGE_SIZE, result.length)}件表示
        </span>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            {roles.map((r, i) => (
              <th key={i} className="border px-2 py-1">
                {r.role}
              </th>
            ))}
            <th className="border px-2 py-1">変動係数</th>
          </tr>
        </thead>
        <tbody>
          {paged.map(([variance, row], i) => (
            <tr key={i}>
              {row.map((val, j) => (
                <td key={j} className="border px-2 py-1 text-right">
                  {val}
                </td>
              ))}
              <td className="border px-2 py-1 text-right">
                {variance.toFixed(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="mt-4">
          <div className="flex flex-wrap justify-center gap-2 items-center relative">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              前へ
            </Button>
            {getPageNumbers().map((p) =>
              p === -1 ? (
                <span key={"start-ellipsis"} className="px-1">
                  …
                </span>
              ) : p === -2 ? (
                <span key={"end-ellipsis"} className="px-1">
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  size="sm"
                  variant={p === page ? "default" : "outline"}
                  onClick={() => setPage(p)}
                  className="min-w-[2.5rem]"
                >
                  {p + 1}
                </Button>
              ),
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
            >
              次へ
            </Button>
          </div>
          <div className="flex justify-center mt-2">
            <form
              onSubmit={handlePageJump}
              className="flex items-center gap-3 ml-2"
            >
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value)}
                className="w-20 h-8 text-center text-sm"
              />
              ページへ
              <Button size="sm" type="submit" variant="outline">
                移動
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

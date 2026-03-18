"use client";

import React from "react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2, Inbox } from "lucide-react";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/context/themeContext";

interface Column {
  key:     string;
  label:   string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  title?:           string;
  columns:          Column[];
  data:             any[];
  headerActions?:   React.ReactNode;
  className?:       string;
  loading?:         boolean;
  page:             number;
  pageSize:         number;
  total:            number;
  onPageChange:     (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRowClick?:      (row: any) => void;
}

const DynamicTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  headerActions,
  className = "",
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}) => {
  const { isDark }  = useTheme();
  const totalPages  = Math.ceil(total / pageSize);

  const getPageNumbers = () => {
    const nums: (number | string)[] = [];
    const maxVisible = 3;
    const start = Math.floor((page - 1) / maxVisible) * maxVisible + 1;
    const end   = Math.min(start + maxVisible - 1, totalPages);
    for (let i = start; i <= end; i++) nums.push(i);
    if (end < totalPages) nums.push("...");
    return nums;
  };

  // ── Shared styles ──────────────────────────────────────────────────────────
  const cardCls = cn(
    "rounded-2xl border transition-colors duration-300",
    isDark
      ? "bg-[#111113] border-white/[0.07]"
      : "bg-white border-teal-100",
    className,
  );

  const theadCls = isDark ? "text-[#444]" : "text-[#999]";

  const rowCls = (clickable: boolean) => cn(
    "border-b transition-colors duration-150",
    isDark ? "border-white/[0.04]" : "border-black/[0.04]",
    clickable && (isDark
      ? "cursor-pointer hover:bg-white/[0.03]"
      : "cursor-pointer hover:bg-teal-50/40"),
  );

  const cellCls = isDark ? "text-[#ccc]" : "text-[#444]";

  const paginBtnCls = (disabled: boolean) => cn(
    "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
    disabled
      ? isDark ? "text-[#333] cursor-not-allowed" : "text-[#ccc] cursor-not-allowed"
      : isDark
        ? "text-[#888] hover:text-white hover:bg-white/[0.05]"
        : "text-[#999] hover:text-black hover:bg-black/[0.05]",
  );

  return (
    <div
      className={cardCls}
      style={{
        boxShadow: isDark
          ? "0 2px 24px rgba(0,0,0,0.45)"
          : "0 2px 16px rgba(13,148,136,0.08)",
      }}
    >
      {/* ── Header ── */}
      {(title || headerActions) && (
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-white/[0.07]" : "border-teal-50"}`}>
          {title && (
            <h2
              className={`text-base font-extrabold tracking-tight ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {title}
            </h2>
          )}
          {headerActions && (
            <div className="flex items-center gap-2 flex-wrap ml-auto">
              {headerActions}
            </div>
          )}
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className={`border-b ${isDark ? "border-white/[0.07]" : "border-teal-50"}`}>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`text-[11px] font-semibold uppercase tracking-wider py-3 px-4 ${theadCls}`}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2
                      size={28}
                      className="animate-spin text-teal-500"
                    />
                    <span className={`text-xs ${isDark ? "text-[#555]" : "text-[#bbb]"}`}>
                      Loading...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((row, idx) => (
                <TableRow
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className={rowCls(!!onRowClick)}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={`py-3.5 px-4 text-sm ${cellCls}`}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : (() => {
                            const val        = row[col.key]?.toString() ?? "—";
                            const isTruncated = val.length > 20;
                            if (isTruncated) {
                              return (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="truncate max-w-[120px] block cursor-pointer">
                                        {val.slice(0, 20) + "..."}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      <span>{val}</span>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            }
                            return val;
                          })()}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Inbox size={32} className={isDark ? "text-[#333]" : "text-[#ddd]"} />
                    <span className={`text-sm ${isDark ? "text-[#444]" : "text-[#bbb]"}`}>
                      No data available
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      {total > 0 && (
        <div className={`flex items-center justify-between px-6 py-4 border-t flex-wrap gap-3 ${isDark ? "border-white/[0.07]" : "border-teal-50"}`}>

          {/* Left — showing + page size */}
          <div className={`flex items-center gap-2 text-xs ${isDark ? "text-[#555]" : "text-[#999]"}`}>
            <span>
              Showing{" "}
              <span className={isDark ? "text-[#f0f0f4]" : "text-[#111]"}>
                {(page - 1) * pageSize + 1}
              </span>
              {" "}–{" "}
              <span className={isDark ? "text-[#f0f0f4]" : "text-[#111]"}>
                {Math.min(page * pageSize, total)}
              </span>
              {" "}of{" "}
              <span className={isDark ? "text-[#f0f0f4]" : "text-[#111]"}>
                {total}
              </span>
            </span>

            <Select
              value={pageSize.toString()}
              onValueChange={(v) => {
                onPageSizeChange(v === "all" ? total : Number(v));
              }}
            >
              <SelectTrigger
                className={cn(
                  "h-8 w-[72px] text-xs rounded-lg border",
                  isDark
                    ? "bg-[#0c0c0e] border-white/[0.08] text-[#f0f0f4]"
                    : "bg-white border-black/[0.08] text-[#111]",
                )}
              >
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: Math.ceil(total / 10) }, (_, i) => (i + 1) * 10).map((n) => (
                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                ))}
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Right — page buttons */}
          <div className="flex items-center gap-1">
            <button
              className={paginBtnCls(page === 1)}
              onClick={() => onPageChange(Math.max(page - 1, 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={14} /> Prev
            </button>

            {getPageNumbers().map((p, idx) => (
              <button
                key={idx}
                onClick={() => typeof p === "number" && onPageChange(p)}
                disabled={p === "..."}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  p === page
                    ? "bg-teal-600 text-white"
                    : p === "..."
                      ? isDark ? "text-[#444] cursor-default" : "text-[#ccc] cursor-default"
                      : isDark
                        ? "text-[#888] hover:text-white hover:bg-white/[0.05]"
                        : "text-[#999] hover:text-black hover:bg-black/[0.05]",
                )}
              >
                {p}
              </button>
            ))}

            <button
              className={paginBtnCls(page === totalPages)}
              onClick={() => onPageChange(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default DynamicTable;
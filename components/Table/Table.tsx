"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  ArrowUp,
  ArrowDown,
  Pin,
  Filter,
  EyeOff,
  MoreVertical,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useState } from "react";

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  idKey?: string; // Key to use as unique identifier for rows (default: "id")
  pagination?: {
    currentPage: number;
    totalResults: number;
    resultsPerPage?: number;
    onPageChange: (page: number) => void;
  };
  rowActions?: (row: T) => React.ReactNode; // Optional custom row actions
  onRowSelect?: (selectedIds: string[]) => void; // Callback when rows are selected
  className?: string;
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  idKey = "id",
  pagination,
  rowActions,
  onRowSelect,
  className = "",
}: TableProps<T>) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected));
  };

  const toggleSelectAll = () => {
    let newSelected: Set<string>;
    if (selectedRows.size === data.length && data.length > 0) {
      newSelected = new Set();
    } else {
      newSelected = new Set(data.map((row) => String(row[idKey])));
    }
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected));
  };

  const getCellValue = (row: T, column: TableColumn<T>) => {
    if (column.render) {
      return column.render(row[column.key], row);
    }
    return row[column.key] ?? "";
  };

  const defaultRowActions = (row: T) => (
    <>
      <DropdownMenuItem>View Details</DropdownMenuItem>
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem className="text-red-500 focus:text-red-500">
        Delete
      </DropdownMenuItem>
    </>
  );

  const resultsPerPage = pagination?.resultsPerPage || 10;
  const currentPage = pagination?.currentPage || 1;
  const totalResults = pagination?.totalResults || data.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 3;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 1) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
      }
    }
    return pages;
  };

  return (
    <div className={`mt-5 bg-white rounded-lg overflow-hidden  ${className}`}>
      <div className="overflow-x-auto scrollbar-thumb-primary">
        <table className="w-full border-collapse " >
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left text-sm font-semibold text-mainText">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data.length && data.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-stroke text-primary focus:ring-2 focus:ring-primary"
                  />
                </div>
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-sm font-semibold text-mainText whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable !== false && (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-200">
                          <Menu className="h-4 w-4 text-body" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-52 rounded-xl p-2 shadow-lg"
                        >
                          <DropdownMenuItem className="gap-3">
                            <ArrowUp className="h-4 w-4 text-muted-foreground" />
                            Asc
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3">
                            <ArrowDown className="h-4 w-4 text-muted-foreground" />
                            Desc
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3">
                            <Pin className="h-4 w-4 text-muted-foreground" />
                            Pin column
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            Filter by
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3 text-red-500 focus:text-red-500">
                            <EyeOff className="h-4 w-4" />
                            Hide column
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-8 text-center text-sm text-body"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const rowId = String(row[idKey]);
                return (
                  <tr
                    key={rowId}
                    className="border-b border-stroke hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {rowActions && (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100">
                              <MoreVertical className="h-4 w-4 text-body" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="start"
                              className="w-52 rounded-xl p-2 shadow-lg"
                            >
                              {rowActions(row)}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowId)}
                          onChange={() => toggleRowSelection(rowId)}
                          className="w-4 h-4 rounded border-stroke text-primary focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </td>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-4 py-3 text-sm text-mainText whitespace-nowrap"
                      >
                        {getCellValue(row, column)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="border-t border-stroke px-4 py-4 flex items-center justify-between bg-white">
          <div className="text-sm text-body">
            Showing {startResult} to {endResult} of {totalResults} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded border border-stroke text-body hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => pagination.onPageChange(page)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "border border-stroke text-body hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                pagination.onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded border border-stroke text-body hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;

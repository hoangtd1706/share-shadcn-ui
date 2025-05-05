import React, { useEffect, useState } from "react";
import { RemoveTones } from "@canes/mfe-app-core";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { usePageSizeWithStorage } from "@/utils/usePageSizeWithStorage";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { LucideArrowDown, LucideArrowUp } from "lucide-react";
import PaginationTable from "./Pagination";
import { PageSizeSelector } from "./PageSizeSelector";

export type ColumnType<T> = ColumnDef<T>;

type Props<T> = {
  pageSizeStorageKey?: string;
  columns: ColumnDef<T>[];
  dataSource: T[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  searchable?: boolean;
  footer?: React.ReactNode;
};

export function DataTable<T>({
  pageSizeStorageKey = "canes.table.page.size",
  columns,
  dataSource,
  onRowClick,
  loading = false,
  searchable = false,
  footer,
}: Props<T>) {
  const [data, setData] = useState(dataSource);
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const [pageSize, setPageSize] = usePageSizeWithStorage(
    pageSizeStorageKey,
    10
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const handleSearch = (searchString: string | undefined) => {
    setData(
      dataSource.filter((item) => {
        if (!searchString) return true;
        const searchLower = RemoveTones(searchString).toLowerCase();
        return Object.values(item as never).some((value) => {
          return RemoveTones(String(`${value}`))
            .toLowerCase()
            .includes(searchLower);
        });
      })
    );
  };

  const table = useReactTable({
    data: data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: pagination,
    },
    onPaginationChange: setPagination,
    // onPaginationChange: () => {},
    manualPagination: false,
  });

  useEffect(() => {
    handleSearch(keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, keyword]);

  return (
    <div className="w-full z-0 select-none">
      {searchable && (
        <div className="flex items-center pb-1">
          <Input
            placeholder="Tìm kiếm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}
      <div className="rounded-md border">
        <Table className="z-0">
          <TableHeader className="z-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="z-0">
                {headerGroup.headers.map((header) => {
                  if (header.column.columnDef.enableSorting === true) {
                    return (
                      <TableHead key={header.id} className="z-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            header.column.toggleSorting(
                              header.column.getIsSorted() === "asc"
                            )
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {header.column.getIsSorted() === "asc" ? (
                            <LucideArrowUp color="#616161" />
                          ) : (
                            <LucideArrowDown color="#616161" />
                          )}
                        </Button>
                      </TableHead>
                    );
                  }

                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="z-0">
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow
                  key={index}
                  className="bg-white border-b animate-pulse"
                >
                  {table.getAllColumns().map((column) => (
                    <TableCell key={column.id} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="cursor-pointer hover:bg-accent hover:text-accent-foreground z-0"
                      onClick={() => onRowClick && onRowClick(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="z-0">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center z-0"
                    >
                      Không có dữ liệu.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
          {footer && <TableFooter>{footer}</TableFooter>}
        </Table>
      </div>
      <div className="flex items-center justify-end gap-1 mt-1">
        <PaginationTable table={table} />
        <PageSizeSelector table={table} setPageSize={setPageSize} />
      </div>
    </div>
  );
}

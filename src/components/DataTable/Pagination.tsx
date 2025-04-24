import { getPaginationRange } from "@/utils/pagination.helper";
import type { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";

type Props<T> = {
  table: Table<T>;
};

export default function PaginationTable<T>({ table }: Props<T>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  const paginationRange = getPaginationRange({
    current: pageIndex + 1,
    total: totalPages,
    option: {
      leadingCount: 3,
      trailingCount: 1,
      delta: 1,
    },
  });

  return (
    <div className="flex justify-end gap-2">
      <Button
        size="icon"
        variant="outline"
        className="select-none"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <LucideChevronLeft className="w-4 h-4" />
      </Button>

      {paginationRange.map((page, idx) =>
        typeof page === "number" ? (
          <Button
            key={idx}
            variant={pageIndex + 1 === page ? "default" : "outline"}
            className="w-9 h-9 p-0 select-none"
            onClick={() => table.setPageIndex(page - 1)}
          >
            {page}
          </Button>
        ) : (
          <span
            key={idx}
            className="w-9 h-9 flex items-center justify-center text-muted-foreground select-none"
          >
            ...
          </span>
        )
      )}

      <Button
        size="icon"
        variant="outline"
        className="select-none"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <LucideChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

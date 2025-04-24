import type { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type PageSizeSelectorProps<T> = {
  table: Table<T>;
  options?: number[];
  setPageSize?: (size: number) => void;
};

export function PageSizeSelector<T>({
  table,
  options = [10, 20, 30, 50, 100],
  setPageSize,
}: PageSizeSelectorProps<T>) {
  const currentPageSize = table.getState().pagination.pageSize;

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentPageSize.toString()}
        onValueChange={(value) => {
          const newSize = Number(value);
          if (setPageSize) setPageSize(newSize);
          table.setPageSize(newSize);
          table.setPageIndex(0);
        }}
      >
        <SelectTrigger className="w-fit h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option} dòng
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

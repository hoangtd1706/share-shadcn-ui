import { useState } from "react";

export function usePageSizeWithStorage(
  key = "table-page-size",
  defaultSize = 10
) {
  const [pageSize, setPageSizeState] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? Number(stored) : defaultSize;
  });

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    localStorage.setItem(key, size.toString());
  };

  return [pageSize, setPageSize] as const;
}

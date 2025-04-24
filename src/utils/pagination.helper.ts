type Props = {
  current: number;
  total: number;
  option?: {
    leadingCount: number;
    trailingCount: number;
    delta: number;
  };
};

export function getPaginationRange({
  current,
  total,
  option = {
    leadingCount: 5,
    trailingCount: 1,
    delta: 1,
  },
}: Props): (number | string)[] {
  const range: (number | string)[] = [];

  if (
    total <=
    option.leadingCount + option.trailingCount + option.delta * 2 + 2
  ) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const showLeftEllipsis = current > option.leadingCount;
  const showRightEllipsis =
    current < total - option.trailingCount - option.delta;

  if (!showLeftEllipsis) {
    for (let i = 1; i <= option.leadingCount; i++) {
      range.push(i);
    }
    range.push("...");
    for (let i = total - option.trailingCount + 1; i <= total; i++) {
      range.push(i);
    }
    return range;
  }

  if (!showRightEllipsis) {
    range.push(1);
    range.push("...");
    for (let i = total - option.leadingCount + 1; i <= total; i++) {
      range.push(i);
    }
    return range;
  }

  range.push(1);
  range.push("...");
  for (let i = current - option.delta; i <= current + option.delta; i++) {
    range.push(i);
  }
  range.push("...");
  range.push(total);

  return range;
}

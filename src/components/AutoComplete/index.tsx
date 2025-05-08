import * as React from "react";

import { useMemo, useState } from "react";
import { RemoveTones } from "@canes/mfe-app-core";
import { VList } from "virtua";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Input } from "../ui/input";

type Option = {
  label: string | number | React.ReactNode;
  value: string;
  description?: string;
};

type Props = {
  options: Option[];
  placeholder?: string;
  multiple?: boolean;
  onChange?: (value: string | string[] | undefined) => void;
  value?: string | string[] | undefined;
  clearable?: boolean;
  searchable?: boolean;
  filterFn?: (option: Option, search: string) => boolean;
  className?: string;
  renderLabel?: (option: Option) => React.ReactNode;
};

export function AutoComplete({
  options,
  placeholder = "Chọn...",
  multiple = false,
  onChange,
  value,
  clearable,
  searchable = false,
  filterFn,
  className,
  renderLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>("");

  const isMultiple = multiple;

  const values = useMemo(
    () => (Array.isArray(value) ? value : value ? [value] : []),
    [value]
  );

  const selectedOptions = useMemo(
    () => options.filter((opt) => values.includes(opt.value)),
    [values, options]
  );

  const toggleValue = (val: string) => {
    if (onChange)
      if (isMultiple) {
        if (values.includes(val)) {
          onChange(values.filter((v) => v !== val));
        } else {
          onChange([...values, val]);
        }
      } else {
        if (val === value) {
          onChange(undefined);
        } else {
          onChange(val);
          setOpen(false);
        }
      }
  };

  const clearSelection = () => {
    if (onChange) onChange(isMultiple ? [] : undefined);
    setSearch("");
  };

  const filteredOptions = useMemo(() => {
    const data = options.filter((option) => {
      if (!search.trim()) return true;
      const searchStr = RemoveTones(search).toLowerCase();
      const labelStr = RemoveTones(
        typeof option.label === "string" || typeof option.label === "number"
          ? option.label.toString()
          : ""
      ).toLowerCase();
      return filterFn ? filterFn(option, search) : labelStr.includes(searchStr);
    });
    return data;
  }, [search, options, filterFn]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "relative w-min-200",
          className ? className : "w-full",
          "overflow-x-hidden"
        )}
      >
        <PopoverTrigger asChild tabIndex={0}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
          >
            <div className="flex flex-wrap gap-1 max-w-[85%]">
              {selectedOptions.length > 0 ? (
                isMultiple ? (
                  <span>{`Đã chọn ${selectedOptions.length}`}</span>
                ) : (
                  <span>{selectedOptions[0].label}</span>
                )
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        {clearable && value !== undefined && value.length > 0 && (
          <X
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-6 w-6 rounded-lg text-muted-foreground cursor-pointer z-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              clearSelection();
            }}
          />
        )}
      </div>
      <PopoverContent
        className="w-full p-0"
        align="start"
        sideOffset={4}
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          {searchable && (
            <Input
              placeholder={placeholder}
              className="h-9 w-full"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          )}
          <CommandList>
            <CommandEmpty>Không tìm thấy.</CommandEmpty>
            <CommandGroup>
              {options.length > 100 ? (
                <VList style={{ height: 240 }}>
                  {filteredOptions.map((option) => {
                    const selected = values.includes(option.value);
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => toggleValue(option.value)}
                      >
                        {renderLabel !== undefined ? (
                          renderLabel(option)
                        ) : (
                          <div className="flex flex-col w-full">
                            <div className="flex items-center gap-2">
                              {option.label}
                              {selected && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </div>
                            {option.description && (
                              <span className="text-xs text-muted-foreground">
                                {option.description}
                              </span>
                            )}
                          </div>
                        )}
                      </CommandItem>
                    );
                  })}
                </VList>
              ) : (
                <>
                  {filteredOptions.map((option) => {
                    const selected = values.includes(option.value);
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => toggleValue(option.value)}
                      >
                        {renderLabel !== undefined ? (
                          renderLabel(option)
                        ) : (
                          <div className="flex flex-col w-full">
                            <div className="flex items-center gap-2">
                              {option.label}
                              {selected && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </div>
                            {option.description && (
                              <span className="text-xs text-muted-foreground">
                                {option.description}
                              </span>
                            )}
                          </div>
                        )}
                      </CommandItem>
                    );
                  })}
                </>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

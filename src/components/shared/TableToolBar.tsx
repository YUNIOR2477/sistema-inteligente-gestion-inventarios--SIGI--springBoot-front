import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {  Search } from "lucide-react";
import { Label } from "../ui/label";
import { InputWithClear } from "./InputWithClear";

export type ToolbarFilter = { value: string; label: string };

export interface TableToolbarProps {
  filter: string;
  onFilterChange: (val: string) => void;
  filterOptions: ToolbarFilter[];
  searchInput: string;
  onSearchInputChange: (v: string) => void;
  isPriceRange: boolean;
  searchMin: string;
  searchMax: string;
  onSearchMinChange: (v: string) => void;
  onSearchMaxChange: (v: string) => void;
  onSubmit: () => Promise<void> | void;
  size: number;
  onSizeChange: (n: number) => void;
  sizeOptions: number[];
  sortField: string;
  onSortFieldChange: (f: string) => void;
  sortFields: { value: string; label: string }[];
  sortDirection: string;
  onSortDirectionChange: (d: string) => void;
  sortDirections: { value: string; label: string }[];
  isLoading?: boolean;
  sizeHidden?: boolean;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  filter,
  onFilterChange,
  filterOptions,
  searchInput,
  onSearchInputChange,
  isPriceRange,
  searchMin,
  searchMax,
  onSearchMinChange,
  onSearchMaxChange,
  onSubmit,
  size,
  onSizeChange,
  sizeOptions,
  sortField,
  onSortFieldChange,
  sortFields,
  sortDirection,
  onSortDirectionChange,
  sortDirections,
  isLoading = false,
  sizeHidden = false,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit();
      }}
      className="w-full"
    >
      <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 w-full sm:w-2/3">
          <div className="w-auto">
            <Select value={filter} onValueChange={onFilterChange}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((f) => (
                  <SelectItem key={f.value} value={f.value} className="cursor-pointer">
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            {!isPriceRange ? (
              <div className="relative w-full">
                <InputWithClear
                  placeholder="Enter search value..."
                  className="w-full"
                  value={searchInput}
                  onChange={(e) => onSearchInputChange(e.target.value)}
                  onClear={() => onSearchInputChange("")}
                />
              </div>

            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  className="w-full sm:max-w-35 border-primary/30"
                  value={searchMin}
                  type="number"
                  onChange={(e) => onSearchMinChange(e.target.value)}
                />
                <Input
                  placeholder="Max"
                  className="w-full sm:max-w-35 border-primary/30"
                  value={searchMax}
                  type="number"
                  onChange={(e) => onSearchMaxChange(e.target.value)}
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="text-primary cursor-pointer font-bold border border-primary"
            variant={"ghost"}
            disabled={(searchInput === "" && !isPriceRange && filter !== "all") || isLoading}
            aria-label="Search"
          >
            <Search className="block sm:inline" />
            <span className="hidden sm:inline ml-2">Search</span>
          </Button>
        </div>

        <div className={`flex gap-2 items-center w-full flex-row sm:items-center sm:justify-end sm:w-2/3 ${sizeHidden ? "hidden" : ""}`}>
          <div className="flex items-center gap-2">
            <Label className="sm:whitespace-nowrap">Page size:</Label>
            <Select onValueChange={(val) => onSizeChange(Number(val))} value={String(size)} aria-label="Page size">
              <SelectTrigger className="w-full cursor-pointer text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizeOptions.map((s) => (
                  <SelectItem key={s} value={s.toString()} className="cursor-pointer">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="sm:whitespace-nowrap">Sort by:</Label>
            <Select onValueChange={onSortFieldChange} value={sortField} aria-label="Sort by">
              <SelectTrigger className="w-full cursor-pointer text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortFields.map((f) => (
                  <SelectItem key={f.value} value={f.value} className="cursor-pointer">
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select onValueChange={onSortDirectionChange} value={sortDirection} aria-label="Sort direction">
              <SelectTrigger className="w-full cursor-pointer text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortDirections.map((d) => (
                  <SelectItem key={d.value} value={d.value} className="cursor-pointer">
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </form>
  );
};
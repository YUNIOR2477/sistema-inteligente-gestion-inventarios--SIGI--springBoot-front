import React from "react";
import { Button } from "@/components/ui/button";
import { SquareArrowLeft, SquareArrowRight } from "lucide-react";

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalElements: number;
  onPrev: () => void;
  onNext: () => void;
  disablePagination?: boolean;
  sizeHidden?: boolean;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  totalPages,
  totalElements,
  onPrev,
  onNext,
  disablePagination = false,
  sizeHidden = false,
}) => {
  return (
    <div className={`flex items-center justify-center mt-4 gap-6 ${sizeHidden ? "hidden" : ""}`}>
      <div>
        <Button
          onClick={onPrev}
          disabled={page === 0 || disablePagination}
          variant="ghost"
          className="cursor-pointer font-bold sm:w-auto text-primary border border-primary"
          aria-label="Previous page"
        >
          <SquareArrowLeft />
          <span className="hidden sm:inline ml-2">Previous</span>
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-primary/80">Page {page + 1} / {totalPages || 1}</p>
        <p className="text-xs text-primary/60">Total elements: {totalElements || 0}</p>
      </div>

      <div>
        <Button
          onClick={onNext}
          disabled={disablePagination || page >= (totalPages || 1) - 1}
          variant="ghost"
          className="cursor-pointer font-bold sm:w-auto text-primary border border-primary"
          aria-label="Next page"
        >
          <span className="hidden sm:inline mr-2">Next</span>
          <SquareArrowRight />
        </Button>
      </div>
    </div>
  );
};
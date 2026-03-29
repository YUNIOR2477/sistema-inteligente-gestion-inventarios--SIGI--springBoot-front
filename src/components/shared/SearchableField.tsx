import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { InputWithClear } from "@/components/shared/InputWithClear";

interface Option {
  id: string;
  name: string;
}

interface SearchableFieldSingleProps {
  label: string;
  name: string;
  type?: string;
  value?: string;
  onChange: (name: string, value: string, display?: string) => void;
  searchFn: (query: string) => Promise<Option[]>;
  placeholder?: string;
  minChars?: number;
}

export const SearchableFieldSingle: React.FC<SearchableFieldSingleProps> = ({
  label,
  name,
  type = "name",
  onChange,
  searchFn,
  placeholder,
  minChars = 2,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    setResults([]);
    setOpen(false);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(async () => {
      const trimmed = q.trim();
      if (trimmed.length >= minChars) {
        setLoading(true);
        try {
          const res = await searchFn(trimmed);
          setResults(res ?? []);
          setOpen(true);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setOpen(false);
      }
    }, 250);
  };

  const handleSelect = (opt: Option) => {
    setQuery(opt.name);
    setResults([]);
    setOpen(false);
    onChange(name, opt.id, opt.name);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    onChange(name, "");
  };

  return (
    <div className="grid gap-2" ref={containerRef}>
      <Label className="text-[13px]">{label}</Label>

      <div>
        <InputWithClear
          placeholder={placeholder ?? `${label} by ${type}`}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onClear={handleClear}
          aria-label={label}
        />

        {loading && (
          <div className="text-sm text-primary/60 mt-2">Searching...</div>
        )}

        {open && results.length > 0 && (
          <ul className="border rounded mt-2 max-h-40 overflow-y-auto bg-background">
            {results.map((r) => (
              <li
                key={r.id}
                className="p-2 cursor-pointer text-xs hover:bg-primary/10 flex justify-between items-center"
                onClick={() => handleSelect(r)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleSelect(r);
                }}
              >
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-[11px] text-primary/60">ID: {r.id}</div>
                </div>
                <div className="text-[11px] text-primary/60">Select</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

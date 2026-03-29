import { Input } from "@/components/ui/input";
import { OctagonX } from "lucide-react";

interface InputWithClearProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  className?: string;
}

export const InputWithClear: React.FC<InputWithClearProps> = ({
  value,
  onChange,
  onClear,
  className = "",
  ...rest
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <Input
        {...rest}
        value={value}
        onChange={onChange}
        className="w-full pr-10"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            if (onClear) onClear();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500/80 hover:text-primary cursor-pointer"
          aria-label="Clear input"
        >
          <OctagonX size={18} />
        </button>
      )}
    </div>
  );
};

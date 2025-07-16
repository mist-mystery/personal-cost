import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SolveButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const SolveButton: React.FC<SolveButtonProps> = ({
  onClick,
  disabled,
  loading,
}) => {
  return (
    <Button onClick={onClick} disabled={disabled || loading}>
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin inline-block align-middle" />
      )}
      計算を開始する
    </Button>
  );
};

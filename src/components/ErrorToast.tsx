import React from "react";
// shadcn/uiのAlert, Button, Xアイコンを利用
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 w-[320px]">
      <Alert variant="destructive" className="flex items-start gap-2 shadow-lg">
        <div className="flex-1">
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose} className="mt-1">
          <X className="w-4 h-4" />
        </Button>
      </Alert>
    </div>
  );
};

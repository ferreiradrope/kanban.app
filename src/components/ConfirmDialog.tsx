
import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

const ConfirmDialog = ({
  onConfirm,
  onCancel,
  title = "Are you sure?",
  message = "Are you sure you want to delete this task?",
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus the cancel button by default (safer option)
    cancelButtonRef.current?.focus();

    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onCancel]);

  return (
    <div className="task-form-overlay">
      <div 
        ref={dialogRef}
        className="task-form-container max-w-sm"
      >
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-destructive bg-opacity-10 flex items-center justify-center mb-4">
            <AlertTriangle className="text-destructive" size={24} />
          </div>
          <h2 className="text-xl font-medium">{title}</h2>
          <p className="text-sm text-muted-foreground mt-2">{message}</p>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-input rounded-md hover:bg-muted transition-colors focus-ring"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:opacity-90 transition-opacity focus-ring"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

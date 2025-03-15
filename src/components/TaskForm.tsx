
import { Task, TaskStatus } from "@/types";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface TaskFormProps {
  onClose: () => void;
  onSubmit: (task: { title: string; description: string; status: TaskStatus }) => void;
  initialTask?: Task;
  initialStatus?: TaskStatus;
}

const TaskForm = ({
  onClose,
  onSubmit,
  initialTask,
  initialStatus = "todo",
}: TaskFormProps) => {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status || initialStatus);
  const [error, setError] = useState("");
  
  const formRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!initialTask;

  // Focus title input on mount
  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("O título é obrigatório");
      return;
    }

    onSubmit({ title: title.trim(), description, status });
    onClose();
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-container" ref={formRef}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">
            {isEditing ? "Editar Tarefa" : "Criar Nova Tarefa"}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted transition-colors focus-ring"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="title" 
              className="block text-sm font-medium mb-1"
            >
              Título <span className="text-destructive">*</span>
            </label>
            <input
              ref={titleInputRef}
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              placeholder="Título da tarefa"
              maxLength={100}
            />
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>

          <div className="mb-4">
            <label 
              htmlFor="description" 
              className="block text-sm font-medium mb-1"
            >
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 min-h-[100px]"
              placeholder="Adicione uma descrição (opcional)"
            />
          </div>

          {isEditing && (
            <div className="mb-4">
              <label 
                htmlFor="status" 
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                <option value="todo">A Fazer</option>
                <option value="inProgress">Em Progresso</option>
                <option value="done">Concluído</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-input rounded-md hover:bg-muted transition-colors focus-ring"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity focus-ring"
            >
              {isEditing ? "Salvar Alterações" : "Criar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

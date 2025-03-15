
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface NewTaskButtonProps {
  onClick: () => void;
}

const NewTaskButton = ({ onClick }: NewTaskButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only animate in after a small delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      className={`new-task-btn focus-ring ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease, translate 0.5s ease'
      }}
      aria-label="Adicionar nova tarefa"
    >
      <span className="flex items-center gap-2">
        <Plus size={20} />
        <span className="text-sm font-medium">Nova Tarefa</span>
      </span>
    </button>
  );
};

export default NewTaskButton;

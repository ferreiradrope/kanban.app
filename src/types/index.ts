
export type TaskStatus = 'todo' | 'inProgress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: number;
}

export interface Column {
  id: TaskStatus;
  title: string;
  taskIds: string[];
}

export interface KanbanData {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: TaskStatus[];
}

// Tradução dos títulos das colunas
export const columnTitles: Record<TaskStatus, string> = {
  todo: 'A Fazer',
  inProgress: 'Em Progresso',
  done: 'Concluído'
};

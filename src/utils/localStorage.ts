
import { KanbanData, Task, TaskStatus } from "@/types";

const STORAGE_KEY = 'kanban-board-data';

const defaultData: KanbanData = {
  tasks: {},
  columns: {
    todo: {
      id: 'todo',
      title: 'To Do',
      taskIds: [],
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      taskIds: [],
    },
    done: {
      id: 'done',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['todo', 'inProgress', 'done'],
};

export const getInitialData = (): KanbanData => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    return defaultData;
  }

  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Failed to parse stored kanban data:', error);
    return defaultData;
  }
};

export const saveData = (data: KanbanData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const addTask = (data: KanbanData, task: Omit<Task, 'id' | 'createdAt'>): KanbanData => {
  const id = `task-${Date.now()}`;
  const newTask: Task = {
    id,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: Date.now(),
  };

  const newData = {
    ...data,
    tasks: {
      ...data.tasks,
      [id]: newTask,
    },
    columns: {
      ...data.columns,
      [task.status]: {
        ...data.columns[task.status],
        taskIds: [id, ...data.columns[task.status].taskIds],
      },
    },
  };

  saveData(newData);
  return newData;
};

export const updateTask = (data: KanbanData, taskId: string, updates: Partial<Task>): KanbanData => {
  const task = data.tasks[taskId];
  if (!task) return data;

  // If status is changing, we need to update the columns as well
  if (updates.status && updates.status !== task.status) {
    const oldStatus = task.status;
    const newStatus = updates.status;

    const newData = {
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: {
          ...task,
          ...updates,
        },
      },
      columns: {
        ...data.columns,
        [oldStatus]: {
          ...data.columns[oldStatus],
          taskIds: data.columns[oldStatus].taskIds.filter(id => id !== taskId),
        },
        [newStatus]: {
          ...data.columns[newStatus],
          taskIds: [taskId, ...data.columns[newStatus].taskIds],
        },
      },
    };

    saveData(newData);
    return newData;
  }

  // Just update the task
  const newData = {
    ...data,
    tasks: {
      ...data.tasks,
      [taskId]: {
        ...task,
        ...updates,
      },
    },
  };

  saveData(newData);
  return newData;
};

export const deleteTask = (data: KanbanData, taskId: string): KanbanData => {
  const task = data.tasks[taskId];
  if (!task) return data;

  const { [taskId]: _, ...restTasks } = data.tasks;
  
  const newData = {
    ...data,
    tasks: restTasks,
    columns: {
      ...data.columns,
      [task.status]: {
        ...data.columns[task.status],
        taskIds: data.columns[task.status].taskIds.filter(id => id !== taskId),
      },
    },
  };

  saveData(newData);
  return newData;
};

export const moveTask = (
  data: KanbanData, 
  taskId: string, 
  source: { status: TaskStatus, index: number }, 
  destination: { status: TaskStatus, index: number }
): KanbanData => {
  if (source.status === destination.status && source.index === destination.index) {
    return data;
  }

  const sourceColumn = data.columns[source.status];
  const destColumn = data.columns[destination.status];
  
  const sourceTaskIds = Array.from(sourceColumn.taskIds);
  const destTaskIds = source.status === destination.status
    ? sourceTaskIds
    : Array.from(destColumn.taskIds);
  
  // Remove from source
  const [removedTask] = sourceTaskIds.splice(source.index, 1);
  
  // Insert into destination
  if (source.status === destination.status) {
    sourceTaskIds.splice(destination.index, 0, removedTask);
  } else {
    destTaskIds.splice(destination.index, 0, removedTask);
  }

  const newData = {
    ...data,
    tasks: {
      ...data.tasks,
      [taskId]: {
        ...data.tasks[taskId],
        status: destination.status,
      },
    },
    columns: {
      ...data.columns,
      [source.status]: {
        ...sourceColumn,
        taskIds: sourceTaskIds,
      },
      [destination.status]: {
        ...destColumn,
        taskIds: destTaskIds,
      },
    },
  };

  saveData(newData);
  return newData;
};


import KanbanBoard from "@/components/KanbanBoard";

const Index = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="py-6 flex justify-center items-center">
        <h1 className="text-3xl font-bold text-primary">KANBAN</h1>
      </div>
      <div className="flex-grow">
        <KanbanBoard />
      </div>
    </div>
  );
};

export default Index;

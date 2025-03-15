
import KanbanBoard from "@/components/KanbanBoard";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="py-6 flex justify-center items-center relative">
        <h1 className="text-3xl font-bold text-primary">KANBAN</h1>
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex-grow">
        <KanbanBoard />
      </div>
    </div>
  );
};

export default Index;

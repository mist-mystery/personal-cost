import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type RoleCost = {
  role: string;
  cost: number;
  count: number;
};

interface RoleInputTableProps {
  roles: RoleCost[];
  onChange: (roles: RoleCost[]) => void;
}

function DraggableRow({
  id,
  children,
  ...props
}: {
  id: string;
  children: React.ReactNode;
  [key: string]: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: isDragging ? "#f1f5f9" : undefined,
      }}
      {...props}
    >
      <td
        className="cursor-grab w-[28px] text-center align-middle"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground inline-block align-middle" />
      </td>
      {children}
    </tr>
  );
}

export const RoleInputTable: React.FC<RoleInputTableProps> = ({
  roles,
  onChange,
}) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = roles.findIndex((_, i) => `row-${i}` === active.id);
      const newIndex = roles.findIndex((_, i) => `row-${i}` === over.id);
      onChange(arrayMove(roles, oldIndex, newIndex));
    }
  };

  const handleChange = (idx: number, key: keyof RoleCost, value: string) => {
    const updated = roles.map((r, i) =>
      i === idx ? { ...r, [key]: key === "role" ? value : Number(value) } : r
    );
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...roles, { role: "", cost: 1, count: 1 }]);
  };

  const handleRemove = (idx: number) => {
    onChange(roles.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-4 border rounded-md bg-card max-w-md mx-auto">
      <div className="font-bold mb-3 text-lg flex items-center gap-2">
        役職・人件費・人数
      </div>
      <ScrollArea className="w-full overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={roles.map((_, i) => `row-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[28px] min-w-[28px]" />
                  <TableHead className="w-[90px] min-w-[70px]">
                    役職名
                  </TableHead>
                  <TableHead className="w-[80px] min-w-[60px]">
                    人件費
                  </TableHead>
                  <TableHead className="w-[60px] min-w-[40px]">人数</TableHead>
                  <TableHead className="w-[48px] min-w-[40px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((r, idx) => (
                  <DraggableRow id={`row-${idx}`} key={idx}>
                    <TableCell>
                      <label className="sr-only" htmlFor={`role-${idx}`}>
                        役職名
                      </label>
                      <Input
                        id={`role-${idx}`}
                        type="text"
                        value={r.role}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(idx, "role", e.target.value)
                        }
                        placeholder="例: 技師"
                        className="bg-background text-base px-2 py-1"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <label className="sr-only" htmlFor={`cost-${idx}`}>
                        人件費
                      </label>
                      <Input
                        id={`cost-${idx}`}
                        type="number"
                        min={1}
                        value={r.cost}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(idx, "cost", e.target.value)
                        }
                        placeholder="50000"
                        className="bg-background text-base px-2 py-1 text-right"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <label className="sr-only" htmlFor={`count-${idx}`}>
                        人数
                      </label>
                      <Input
                        id={`count-${idx}`}
                        type="number"
                        min={1}
                        value={r.count}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(idx, "count", e.target.value)
                        }
                        placeholder="2"
                        className="bg-background text-base px-2 py-1 text-right"
                        required
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(idx)}
                        disabled={roles.length === 1}
                        aria-label="削除"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </DraggableRow>
                ))}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </ScrollArea>
      <div className="mt-2 flex justify-center">
        <Button
          variant="outline"
          size="icon"
          onClick={handleAdd}
          aria-label="行追加"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

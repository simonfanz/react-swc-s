import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  code: z.string().min(1, { message: "Code is required." }),
  associatedUsers: z.string().optional(),
});

const mockCostCentres = [
  {
    id: "1",
    name: "Operations",
    code: "OPS",
    associatedUsers: "John Doe, Jane Smith",
  },
  { id: "2", name: "Warehouse", code: "WH", associatedUsers: "Mike Johnson" },
  {
    id: "3",
    name: "Transport",
    code: "TRN",
    associatedUsers: "Sarah Williams, Alex Brown",
  },
  { id: "4", name: "Administration", code: "ADM", associatedUsers: "" },
];

const CostCentres = () => {
  const [costCentres, setCostCentres] = useState(mockCostCentres);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCostCentre, setEditingCostCentre] = useState<
    (typeof mockCostCentres)[0] | null
  >(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      associatedUsers: "",
    },
  });

  const handleAddCostCentre = (data: z.infer<typeof formSchema>) => {
    if (editingCostCentre) {
      setCostCentres(
        costCentres.map((costCentre) =>
          costCentre.id === editingCostCentre.id
            ? { ...costCentre, ...data }
            : costCentre,
        ),
      );
    } else {
      setCostCentres([...costCentres, { id: Date.now().toString(), ...data }]);
    }
    setIsDialogOpen(false);
    form.reset();
    setEditingCostCentre(null);
  };

  const handleEditCostCentre = (costCentre: (typeof mockCostCentres)[0]) => {
    setEditingCostCentre(costCentre);
    form.reset({
      name: costCentre.name,
      code: costCentre.code,
      associatedUsers: costCentre.associatedUsers,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteCostCentre = (id: string) => {
    setCostCentres(costCentres.filter((costCentre) => costCentre.id !== id));
  };

  const filteredCostCentres = costCentres.filter(
    (costCentre) =>
      costCentre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      costCentre.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cost centres..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCostCentre(null);
                form.reset({
                  name: "",
                  code: "",
                  associatedUsers: "",
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Cost Centre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCostCentre ? "Edit Cost Centre" : "Add New Cost Centre"}
              </DialogTitle>
              <DialogDescription>
                {editingCostCentre
                  ? "Update cost centre details below."
                  : "Fill in the details to add a new cost centre."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddCostCentre)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Operations" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input placeholder="OPS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="associatedUsers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Associated Users (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe, Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingCostCentre ? "Update" : "Add"} Cost Centre
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Associated Users</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCostCentres.length > 0 ? (
              filteredCostCentres.map((costCentre) => (
                <TableRow key={costCentre.id}>
                  <TableCell>{costCentre.name}</TableCell>
                  <TableCell>{costCentre.code}</TableCell>
                  <TableCell>{costCentre.associatedUsers || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCostCentre(costCentre)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCostCentre(costCentre.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-4 text-muted-foreground"
                >
                  No cost centres found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CostCentres;

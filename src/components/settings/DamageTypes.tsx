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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters." }),
});

const mockDamageTypes = [
  {
    id: "1",
    name: "Crushed",
    description: "Item has been crushed during transport or handling",
  },
  {
    id: "2",
    name: "Water Damage",
    description: "Item has been damaged by water or moisture",
  },
  {
    id: "3",
    name: "Missing Parts",
    description: "Item is missing components or parts",
  },
  {
    id: "4",
    name: "Scratched",
    description: "Item has visible scratches on surface",
  },
];

const DamageTypes = () => {
  const [damageTypes, setDamageTypes] = useState(mockDamageTypes);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDamageType, setEditingDamageType] = useState<
    (typeof mockDamageTypes)[0] | null
  >(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleAddDamageType = (data: z.infer<typeof formSchema>) => {
    if (editingDamageType) {
      setDamageTypes(
        damageTypes.map((damageType) =>
          damageType.id === editingDamageType.id
            ? { ...damageType, ...data }
            : damageType,
        ),
      );
    } else {
      setDamageTypes([...damageTypes, { id: Date.now().toString(), ...data }]);
    }
    setIsDialogOpen(false);
    form.reset();
    setEditingDamageType(null);
  };

  const handleEditDamageType = (damageType: (typeof mockDamageTypes)[0]) => {
    setEditingDamageType(damageType);
    form.reset({
      name: damageType.name,
      description: damageType.description,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteDamageType = (id: string) => {
    setDamageTypes(damageTypes.filter((damageType) => damageType.id !== id));
  };

  const filteredDamageTypes = damageTypes.filter(
    (damageType) =>
      damageType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      damageType.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search damage types..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingDamageType(null);
                form.reset({
                  name: "",
                  description: "",
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Damage Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDamageType ? "Edit Damage Type" : "Add New Damage Type"}
              </DialogTitle>
              <DialogDescription>
                {editingDamageType
                  ? "Update damage type details below."
                  : "Fill in the details to add a new damage type."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddDamageType)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Crushed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Item has been crushed during transport or handling"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingDamageType ? "Update" : "Add"} Damage Type
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
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDamageTypes.length > 0 ? (
              filteredDamageTypes.map((damageType) => (
                <TableRow key={damageType.id}>
                  <TableCell>{damageType.name}</TableCell>
                  <TableCell>{damageType.description}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditDamageType(damageType)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDamageType(damageType.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-4 text-muted-foreground"
                >
                  No damage types found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DamageTypes;

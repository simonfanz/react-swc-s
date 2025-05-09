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
  validityPeriod: z
    .string()
    .min(1, { message: "Validity period is required." }),
});

const mockClaimTypes = [
  {
    id: "1",
    name: "Transport",
    description: "Claims related to transport and delivery issues",
    validityPeriod: 7,
  },
  {
    id: "2",
    name: "Warehouse",
    description: "Claims related to warehouse storage and handling",
    validityPeriod: 14,
  },
];

const ClaimTypes = () => {
  const [claimTypes, setClaimTypes] = useState(mockClaimTypes);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClaimType, setEditingClaimType] = useState<
    (typeof mockClaimTypes)[0] | null
  >(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      validityPeriod: "",
    },
  });

  const handleAddClaimType = (data: z.infer<typeof formSchema>) => {
    const validityPeriod = parseInt(data.validityPeriod);

    if (editingClaimType) {
      setClaimTypes(
        claimTypes.map((claimType) =>
          claimType.id === editingClaimType.id
            ? { ...claimType, ...data, validityPeriod }
            : claimType,
        ),
      );
    } else {
      setClaimTypes([
        ...claimTypes,
        { id: Date.now().toString(), ...data, validityPeriod },
      ]);
    }
    setIsDialogOpen(false);
    form.reset();
    setEditingClaimType(null);
  };

  const handleEditClaimType = (claimType: (typeof mockClaimTypes)[0]) => {
    setEditingClaimType(claimType);
    form.reset({
      name: claimType.name,
      description: claimType.description,
      validityPeriod: claimType.validityPeriod.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClaimType = (id: string) => {
    setClaimTypes(claimTypes.filter((claimType) => claimType.id !== id));
  };

  const filteredClaimTypes = claimTypes.filter(
    (claimType) =>
      claimType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claimType.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search claim types..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingClaimType(null);
                form.reset({
                  name: "",
                  description: "",
                  validityPeriod: "",
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Claim Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingClaimType ? "Edit Claim Type" : "Add New Claim Type"}
              </DialogTitle>
              <DialogDescription>
                {editingClaimType
                  ? "Update claim type details below."
                  : "Fill in the details to add a new claim type."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddClaimType)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Transport" {...field} />
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
                          placeholder="Claims related to transport and delivery issues"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validityPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validity Period (days)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="7" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingClaimType ? "Update" : "Add"} Claim Type
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
              <TableHead>Validity Period (days)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClaimTypes.length > 0 ? (
              filteredClaimTypes.map((claimType) => (
                <TableRow key={claimType.id}>
                  <TableCell>{claimType.name}</TableCell>
                  <TableCell>{claimType.description}</TableCell>
                  <TableCell>{claimType.validityPeriod}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClaimType(claimType)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClaimType(claimType.id)}
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
                  No claim types found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClaimTypes;

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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

const formSchema = z.object({
  rate: z.string().min(1, { message: "Rate is required." }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters." }),
  isDefault: z.boolean().default(false),
});

const mockGSTRates = [
  { id: "1", rate: 10, description: "Standard GST rate", isDefault: true },
  { id: "2", rate: 0, description: "GST-free", isDefault: false },
  {
    id: "3",
    rate: 15,
    description: "Special rate for luxury items",
    isDefault: false,
  },
];

const GSTRates = () => {
  const [gstRates, setGSTRates] = useState(mockGSTRates);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGSTRate, setEditingGSTRate] = useState<
    (typeof mockGSTRates)[0] | null
  >(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rate: "",
      description: "",
      isDefault: false,
    },
  });

  const handleAddGSTRate = (data: z.infer<typeof formSchema>) => {
    const rate = parseFloat(data.rate);

    // If this is set as default, remove default from others
    if (data.isDefault) {
      setGSTRates(
        gstRates.map((gstRate) => ({ ...gstRate, isDefault: false })),
      );
    }

    if (editingGSTRate) {
      setGSTRates(
        gstRates.map((gstRate) =>
          gstRate.id === editingGSTRate.id
            ? { ...gstRate, ...data, rate }
            : gstRate,
        ),
      );
    } else {
      setGSTRates([...gstRates, { id: Date.now().toString(), ...data, rate }]);
    }
    setIsDialogOpen(false);
    form.reset();
    setEditingGSTRate(null);
  };

  const handleEditGSTRate = (gstRate: (typeof mockGSTRates)[0]) => {
    setEditingGSTRate(gstRate);
    form.reset({
      rate: gstRate.rate.toString(),
      description: gstRate.description,
      isDefault: gstRate.isDefault,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteGSTRate = (id: string) => {
    const rateToDelete = gstRates.find((rate) => rate.id === id);

    // If deleting the default rate, show an error or set another as default
    if (rateToDelete?.isDefault && gstRates.length > 1) {
      // Find first non-default rate and make it default
      const newDefaultRate = gstRates.find((rate) => rate.id !== id);
      if (newDefaultRate) {
        setGSTRates(
          gstRates
            .filter((rate) => rate.id !== id)
            .map((rate) =>
              rate.id === newDefaultRate.id
                ? { ...rate, isDefault: true }
                : rate,
            ),
        );
        return;
      }
    }

    setGSTRates(gstRates.filter((rate) => rate.id !== id));
  };

  const filteredGSTRates = gstRates.filter(
    (gstRate) =>
      gstRate.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gstRate.rate.toString().includes(searchTerm),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search GST rates..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingGSTRate(null);
                form.reset({
                  rate: "",
                  description: "",
                  isDefault: false,
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add GST Rate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingGSTRate ? "Edit GST Rate" : "Add New GST Rate"}
              </DialogTitle>
              <DialogDescription>
                {editingGSTRate
                  ? "Update GST rate details below."
                  : "Fill in the details to add a new GST rate."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddGSTRate)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="10"
                          {...field}
                        />
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
                        <Input placeholder="Standard GST rate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Default Rate</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingGSTRate ? "Update" : "Add"} GST Rate
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
              <TableHead>Rate (%)</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Default</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGSTRates.length > 0 ? (
              filteredGSTRates.map((gstRate) => (
                <TableRow key={gstRate.id}>
                  <TableCell>{gstRate.rate}%</TableCell>
                  <TableCell>{gstRate.description}</TableCell>
                  <TableCell>{gstRate.isDefault ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditGSTRate(gstRate)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGSTRate(gstRate.id)}
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
                  No GST rates found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GSTRates;

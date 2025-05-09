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
  accountNumber: z.string().min(1, { message: "Account number is required." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  vendorNumber: z.string().optional(),
  emailAddresses: z
    .string()
    .min(1, { message: "At least one email address is required." }),
  rejectedDeliveryNotification: z.boolean().default(false),
});

const mockCustomers = [
  {
    id: "1",
    accountNumber: "ACC001",
    name: "ABC Logistics",
    vendorNumber: "V12345",
    emailAddresses: "contact@abclogistics.com,billing@abclogistics.com",
    rejectedDeliveryNotification: true,
  },
  {
    id: "2",
    accountNumber: "ACC002",
    name: "XYZ Transport",
    vendorNumber: "V67890",
    emailAddresses: "info@xyztransport.com",
    rejectedDeliveryNotification: false,
  },
  {
    id: "3",
    accountNumber: "ACC003",
    name: "Fast Freight Ltd",
    vendorNumber: "V24680",
    emailAddresses: "support@fastfreight.com",
    rejectedDeliveryNotification: true,
  },
];

const CustomerAccounts = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<
    (typeof mockCustomers)[0] | null
  >(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNumber: "",
      name: "",
      vendorNumber: "",
      emailAddresses: "",
      rejectedDeliveryNotification: false,
    },
  });

  const handleAddCustomer = (data: z.infer<typeof formSchema>) => {
    if (editingCustomer) {
      setCustomers(
        customers.map((customer) =>
          customer.id === editingCustomer.id
            ? { ...customer, ...data }
            : customer,
        ),
      );
    } else {
      setCustomers([...customers, { id: Date.now().toString(), ...data }]);
    }
    setIsDialogOpen(false);
    form.reset();
    setEditingCustomer(null);
  };

  const handleEditCustomer = (customer: (typeof mockCustomers)[0]) => {
    setEditingCustomer(customer);
    form.reset({
      accountNumber: customer.accountNumber,
      name: customer.name,
      vendorNumber: customer.vendorNumber,
      emailAddresses: customer.emailAddresses,
      rejectedDeliveryNotification: customer.rejectedDeliveryNotification,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.vendorNumber &&
        customer.vendorNumber.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCustomer(null);
                form.reset({
                  accountNumber: "",
                  name: "",
                  vendorNumber: "",
                  emailAddresses: "",
                  rejectedDeliveryNotification: false,
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Customer Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCustomer
                  ? "Edit Customer Account"
                  : "Add New Customer Account"}
              </DialogTitle>
              <DialogDescription>
                {editingCustomer
                  ? "Update customer account details below."
                  : "Fill in the details to add a new customer account."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddCustomer)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="ACC001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC Logistics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vendorNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="V12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emailAddresses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Addresses</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="contact@example.com,billing@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rejectedDeliveryNotification"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Rejected Delivery Notification</FormLabel>
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
                    {editingCustomer ? "Update" : "Add"} Customer
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
              <TableHead>Account Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Vendor Number</TableHead>
              <TableHead>Email Addresses</TableHead>
              <TableHead>Rejected Delivery Notification</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.accountNumber}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.vendorNumber || "-"}</TableCell>
                  <TableCell>{customer.emailAddresses}</TableCell>
                  <TableCell>
                    {customer.rejectedDeliveryNotification ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCustomer(customer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-4 text-muted-foreground"
                >
                  No customer accounts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomerAccounts;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClaimType } from "@/types/claims";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  accountNumber: z.string().min(1, "Account number is required"),
  consignmentNumber: z.string().optional(),
  warehouseReference: z.string().optional(),
  claimType: z.enum(["TRANSPORT", "WAREHOUSE"]),
  customerName: z.string().min(1, "Customer name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface ClaimPortalProps {
  onSubmit?: (data: FormValues) => void;
  isLoading?: boolean;
}

const ClaimPortal = ({
  onSubmit = () => {},
  isLoading = false,
}: ClaimPortalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNumber: "",
      consignmentNumber: "",
      warehouseReference: "",
      claimType: "TRANSPORT" as ClaimType,
      customerName: "",
      contactEmail: "",
      contactPhone: "",
      description: "",
    },
  });

  const claimType = form.watch("claimType");

  const handleSubmit = async (data: FormValues) => {
    try {
      setError(null);
      await onSubmit(data);
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError("Failed to submit claim. Please try again.");
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Lodge New Claim</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Claim Submitted</AlertTitle>
            <AlertDescription className="text-green-700">
              Your claim has been successfully submitted. You will receive a
              confirmation email shortly.
            </AlertDescription>
            <Button
              className="mt-4"
              onClick={() => setSubmitted(false)}
              variant="outline"
            >
              Submit Another Claim
            </Button>
          </Alert>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter account number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="claimType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Claim Type*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select claim type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TRANSPORT">Transport</SelectItem>
                          <SelectItem value="WAREHOUSE">Warehouse</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {claimType === "TRANSPORT" ? (
                  <FormField
                    control={form.control}
                    name="consignmentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consignment Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter consignment number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          For transport claims only
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="warehouseReference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warehouse Reference</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter warehouse reference"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          For warehouse claims only
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email*</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter contact email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter claim description"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Claim"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default ClaimPortal;

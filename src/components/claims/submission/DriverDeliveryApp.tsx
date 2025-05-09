import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { AlertCircle, Camera, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  consignmentNumber: z.string().min(1, "Consignment number is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  customerName: z.string().min(1, "Customer name is required"),
  rejectionReason: z.enum(["DAMAGED", "INCORRECT", "OTHER"]),
  notes: z.string().min(1, "Notes are required"),
});

type FormValues = z.infer<typeof formSchema>;

interface DriverDeliveryAppProps {
  consignmentNumber?: string;
  accountNumber?: string;
  customerName?: string;
  onSubmit?: (data: FormValues & { photos: File[] }) => void;
  isLoading?: boolean;
}

const DriverDeliveryApp = ({
  consignmentNumber = "",
  accountNumber = "",
  customerName = "",
  onSubmit = () => {},
  isLoading = false,
}: DriverDeliveryAppProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      consignmentNumber,
      accountNumber,
      customerName,
      rejectionReason: "DAMAGED",
      notes: "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      setError(null);
      await onSubmit({ ...data, photos });
      setSubmitted(true);
      form.reset();
      setPhotos([]);
    } catch (err) {
      setError("Failed to submit rejection. Please try again.");
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...newFiles]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Delivery Rejection - Intent to Claim
        </CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">
              Rejection Recorded
            </AlertTitle>
            <AlertDescription className="text-green-700">
              The delivery rejection has been recorded and a draft claim has
              been created. The customer will be notified.
            </AlertDescription>
            <Button
              className="mt-4"
              onClick={() => setSubmitted(false)}
              variant="outline"
            >
              Record Another Rejection
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
                  name="consignmentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consignment Number*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter consignment number"
                          {...field}
                          disabled={!!consignmentNumber}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter account number"
                          {...field}
                          disabled={!!accountNumber}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter customer name"
                        {...field}
                        disabled={!!customerName}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rejectionReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rejection Reason*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason for rejection" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DAMAGED">Damaged</SelectItem>
                        <SelectItem value="INCORRECT">
                          Incorrect Items
                        </SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed notes about the rejection"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Label htmlFor="photos">Damage Photos</Label>
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="photos"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <Camera className="h-4 w-4" />
                    Take Photos
                  </Label>
                  <Input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <span className="text-sm text-gray-500">
                    {photos.length} photo(s) taken
                  </span>
                </div>

                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative border rounded-md overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Damage photo ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removePhoto(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setPhotos([]);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Record Rejection"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverDeliveryApp;

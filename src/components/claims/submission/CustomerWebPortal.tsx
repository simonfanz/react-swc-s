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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  consignmentNumber: z.string().min(1, "Consignment number is required"),
  description: z.string().min(1, "Description is required"),
  damageDetails: z.string().min(1, "Damage details are required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CustomerWebPortalProps {
  consignmentNumber?: string;
  customerName?: string;
  onSubmit?: (data: FormValues & { photos: File[] }) => void;
  isLoading?: boolean;
}

const CustomerWebPortal = ({
  consignmentNumber = "",
  customerName = "Customer",
  onSubmit = () => {},
  isLoading = false,
}: CustomerWebPortalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      consignmentNumber: consignmentNumber,
      description: "",
      damageDetails: "",
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
      setError("Failed to submit claim. Please try again.");
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
          Lodge Claim for {customerName}
        </CardTitle>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Claim Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter claim description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="damageDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Damage Details*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the damage in detail"
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
                    <Upload className="h-4 w-4" />
                    Upload Photos
                  </Label>
                  <Input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <span className="text-sm text-gray-500">
                    {photos.length} photo(s) selected
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
                        <div className="p-2 text-xs truncate">{photo.name}</div>
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

export default CustomerWebPortal;

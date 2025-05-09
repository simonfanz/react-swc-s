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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClaimStatus, ClaimType } from "@/types/claims";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Search, FileSearch, Filter } from "lucide-react";

const formSchema = z.object({
  claimNumber: z.string().optional(),
  consignmentNumber: z.string().optional(),
  accountNumber: z.string().optional(),
  customerName: z.string().optional(),
  status: z.string().optional(),
  claimType: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Claim {
  id: string;
  claimNumber: string;
  accountNumber: string;
  customerName: string;
  consignmentNumber?: string;
  warehouseReference?: string;
  claimType: ClaimType;
  status: ClaimStatus;
  submittedDate: string;
  claimedAmount: number;
  assignedTo?: string;
}

interface ClaimsSearchProps {
  onSearch?: (filters: FormValues) => void;
  onViewClaim?: (claimId: string) => void;
  isLoading?: boolean;
  claims?: Claim[];
}

const ClaimsSearch = ({
  onSearch = () => {},
  onViewClaim = () => {},
  isLoading = false,
  claims = [],
}: ClaimsSearchProps) => {
  const [filtersVisible, setFiltersVisible] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      claimNumber: "",
      consignmentNumber: "",
      accountNumber: "",
      customerName: "",
      status: "",
      claimType: "",
      dateFrom: "",
      dateTo: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSearch(data);
  };

  const getStatusBadgeColor = (status: ClaimStatus) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-200 text-gray-800";
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800";
      case "REJECTED_DELIVERY":
        return "bg-orange-100 text-orange-800";
      case "UNDER_REVIEW":
        return "bg-purple-100 text-purple-800";
      case "INFORMATION_REQUESTED":
        return "bg-yellow-100 text-yellow-800";
      case "INFORMATION_PROVIDED":
        return "bg-indigo-100 text-indigo-800";
      case "ACCEPTANCE_PENDING":
        return "bg-cyan-100 text-cyan-800";
      case "ACCEPTED":
        return "bg-emerald-100 text-emerald-800";
      case "ACCEPTED_EXGRATIA":
        return "bg-teal-100 text-teal-800";
      case "APPROVAL_PENDING_L1":
      case "APPROVAL_PENDING_L2":
      case "APPROVAL_PENDING_L3":
        return "bg-amber-100 text-amber-800";
      case "APPROVED_L1":
      case "APPROVED_L2":
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PAID":
        return "bg-lime-100 text-lime-800";
      case "DECLINED":
        return "bg-red-100 text-red-800";
      case "WITHDRAWN":
        return "bg-slate-100 text-slate-800";
      case "SETTLED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: ClaimStatus) => {
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="claimNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input
                            placeholder="Search by claim number"
                            className="pl-9"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFiltersVisible(!filtersVisible)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {filtersVisible ? "Hide Filters" : "Show Filters"}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>

              {filtersVisible && (
                <div className="grid grid-cols-4 gap-4 pt-4">
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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter account number"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter customer name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">All Statuses</SelectItem>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="SUBMITTED">Submitted</SelectItem>
                            <SelectItem value="UNDER_REVIEW">
                              Under Review
                            </SelectItem>
                            <SelectItem value="ACCEPTED">Accepted</SelectItem>
                            <SelectItem value="DECLINED">Declined</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="PAID">Paid</SelectItem>
                            <SelectItem value="SETTLED">Settled</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="claimType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Claim Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select claim type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">All Types</SelectItem>
                            <SelectItem value="TRANSPORT">Transport</SelectItem>
                            <SelectItem value="WAREHOUSE">Warehouse</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date From</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date To</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {claims.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileSearch className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No claims found
              </h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search filters or create a new claim
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim #</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Consignment #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">
                        {claim.claimNumber}
                      </TableCell>
                      <TableCell>{claim.accountNumber}</TableCell>
                      <TableCell>{claim.customerName}</TableCell>
                      <TableCell>
                        {claim.consignmentNumber ||
                          claim.warehouseReference ||
                          "-"}
                      </TableCell>
                      <TableCell>
                        {claim.claimType === "TRANSPORT"
                          ? "Transport"
                          : "Warehouse"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusBadgeColor(claim.status)}
                          variant="outline"
                        >
                          {formatStatus(claim.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(claim.submittedDate), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        ${claim.claimedAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>{claim.assignedTo || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewClaim(claim.id)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimsSearch;

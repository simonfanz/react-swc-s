import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Claim, ClaimInvoice } from "@/types/claims";
import { format } from "date-fns";
import { Plus, FileText, Check, X, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ClaimInvoicesProps {
  claim: Claim;
  onAddInvoice: () => void;
}

const ClaimInvoices = ({ claim, onAddInvoice }: ClaimInvoicesProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<ClaimInvoice | null>(
    null,
  );
  const [viewInvoiceDialog, setViewInvoiceDialog] = useState(false);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-200 text-gray-800";
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800";
      case "APPROVED_L1":
        return "bg-amber-100 text-amber-800";
      case "APPROVED_L2":
        return "bg-emerald-100 text-emerald-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PAID":
        return "bg-lime-100 text-lime-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleViewInvoice = (invoice: ClaimInvoice) => {
    setSelectedInvoice(invoice);
    setViewInvoiceDialog(true);
  };

  const calculateTotals = () => {
    const totalAmount = claim.invoices.reduce(
      (sum, invoice) => sum + invoice.totalAmount,
      0,
    );
    const totalGst = claim.invoices.reduce(
      (sum, invoice) => sum + invoice.gstAmount,
      0,
    );
    const totalExGst = claim.invoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0,
    );

    return { totalAmount, totalGst, totalExGst };
  };

  const { totalAmount, totalGst, totalExGst } = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Invoices</h3>
        <Button
          onClick={onAddInvoice}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Invoice
        </Button>
      </div>

      {claim.invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-md border border-dashed border-gray-300">
          <FileText className="h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900">No invoices yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mt-1">
            Add invoices to this claim to track payments and allocate costs to
            cost centers.
          </p>
          <Button
            onClick={onAddInvoice}
            variant="outline"
            className="mt-4"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" /> Add First Invoice
          </Button>
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount (ex GST)</TableHead>
                    <TableHead>GST</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claim.invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        {format(new Date(invoice.invoiceDate), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>${invoice.gstAmount.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">
                        ${invoice.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusBadgeColor(
                            invoice.status,
                          )} px-2 py-0.5`}
                          variant="outline"
                        >
                          {formatStatus(invoice.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal (ex GST):</span>
                <span>${totalExGst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">GST:</span>
                <span>${totalGst.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </>
      )}

      <Dialog open={viewInvoiceDialog} onOpenChange={setViewInvoiceDialog}>
        {selectedInvoice && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Invoice #{selectedInvoice.invoiceNumber}
              </DialogTitle>
              <DialogDescription>
                Issued on{" "}
                {format(new Date(selectedInvoice.invoiceDate), "dd MMMM yyyy")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Invoice Status
                  </h4>
                  <Badge
                    className={`${getStatusBadgeColor(
                      selectedInvoice.status,
                    )} px-2 py-0.5 mt-1`}
                    variant="outline"
                  >
                    {formatStatus(selectedInvoice.status)}
                  </Badge>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-medium text-gray-500">
                    Total Amount
                  </h4>
                  <p className="text-xl font-semibold">
                    ${selectedInvoice.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">Invoice Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Related Claim Item</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item) => {
                      const relatedClaimItem = claim.items.find(
                        (claimItem) => claimItem.id === item.claimItemId,
                      );
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            {relatedClaimItem
                              ? relatedClaimItem.name
                              : "Not linked"}
                          </TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">
                            {item.quantity || 1}
                          </TableCell>
                          <TableCell className="text-right">
                            $
                            {item.unitPrice?.toFixed(2) ||
                              (item.amount / (item.quantity || 1)).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            ${item.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell className="font-medium">Subtotal</TableCell>
                      <TableCell className="text-right">
                        ${selectedInvoice.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GST ({selectedInvoice.gstRate}%)</TableCell>
                      <TableCell className="text-right">
                        ${selectedInvoice.gstAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total</TableCell>
                      <TableCell className="text-right font-medium">
                        ${selectedInvoice.totalAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setViewInvoiceDialog(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ClaimInvoices;

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Claim, ClaimStatus } from "@/types/claims";
import { format } from "date-fns";
import {
  MoreHorizontal,
  FileText,
  Image,
  MessageSquare,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClaimItems from "./ClaimItems";
import ClaimNotes from "./ClaimNotes";
import ClaimAttachments from "./ClaimAttachments";
import ClaimHistory from "./ClaimHistory";
import ClaimInvoices from "../invoice/ClaimInvoices";

interface ClaimDetailsProps {
  claim: Claim;
  onStatusChange?: (claimId: string, newStatus: ClaimStatus) => void;
  onAssign?: (claimId: string, userId: string) => void;
  onAddNote?: (claimId: string, note: string, attachment?: File) => void;
  onAddInvoice?: (claimId: string) => void;
  isLoading?: boolean;
}

const ClaimDetails = ({
  claim,
  onStatusChange = () => {},
  onAssign = () => {},
  onAddNote = () => {},
  onAddInvoice = () => {},
  isLoading = false,
}: ClaimDetailsProps) => {
  const [activeTab, setActiveTab] = useState("details");

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

  const getAvailableActions = () => {
    const actions = [];

    switch (claim.status) {
      case "DRAFT":
      case "SUBMITTED":
        actions.push(
          { label: "Start Review", status: "UNDER_REVIEW" },
          { label: "Assign", action: "assign" },
        );
        break;
      case "REJECTED_DELIVERY":
        actions.push(
          { label: "Start Review", status: "UNDER_REVIEW" },
          { label: "Assign", action: "assign" },
          { label: "Withdraw", status: "WITHDRAWN" },
        );
        break;
      case "UNDER_REVIEW":
        actions.push(
          { label: "Request Information", status: "INFORMATION_REQUESTED" },
          { label: "Request Acceptance", status: "ACCEPTANCE_PENDING" },
          { label: "Decline", status: "DECLINED" },
          { label: "Assign", action: "assign" },
        );
        break;
      case "INFORMATION_REQUESTED":
        actions.push(
          { label: "Information Provided", status: "INFORMATION_PROVIDED" },
          { label: "Assign", action: "assign" },
          { label: "Withdraw", status: "WITHDRAWN" },
        );
        break;
      case "INFORMATION_PROVIDED":
        actions.push(
          { label: "Continue Review", status: "UNDER_REVIEW" },
          { label: "Request Acceptance", status: "ACCEPTANCE_PENDING" },
          { label: "Decline", status: "DECLINED" },
          { label: "Assign", action: "assign" },
        );
        break;
      case "ACCEPTANCE_PENDING":
        actions.push(
          { label: "Accept", status: "ACCEPTED" },
          { label: "Accept Ex Gratia", status: "ACCEPTED_EXGRATIA" },
          { label: "Decline", status: "DECLINED" },
          { label: "Request Information", status: "INFORMATION_REQUESTED" },
          { label: "Assign", action: "assign" },
        );
        break;
      case "ACCEPTED":
      case "ACCEPTED_EXGRATIA":
        actions.push(
          { label: "Request Approval", status: "APPROVAL_PENDING_L1" },
          { label: "Add Invoice", action: "addInvoice" },
          { label: "Assign", action: "assign" },
        );
        break;
      // Add more cases for other statuses
      default:
        actions.push({ label: "Assign", action: "assign" });
    }

    return actions;
  };

  const handleAction = (action: {
    label: string;
    status?: ClaimStatus;
    action?: string;
  }) => {
    if (action.status) {
      onStatusChange(claim.id, action.status);
    } else if (action.action === "assign") {
      // In a real app, you would show a user selection dialog here
      onAssign(claim.id, "user123");
    } else if (action.action === "addInvoice") {
      onAddInvoice(claim.id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold">
                Claim #{claim.claimNumber}
              </CardTitle>
              <div className="text-sm text-gray-500 mt-1">
                {claim.claimType === "TRANSPORT"
                  ? "Transport Claim"
                  : "Warehouse Claim"}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                className={`${getStatusBadgeColor(claim.status)} px-3 py-1`}
                variant="outline"
              >
                {formatStatus(claim.status)}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {getAvailableActions().map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => handleAction(action)}
                      disabled={isLoading}
                    >
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Customer</h3>
              <p className="mt-1 text-base">{claim.customerName}</p>
              <p className="text-sm text-gray-500">
                Account: {claim.accountNumber}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Reference</h3>
              <p className="mt-1 text-base">
                {claim.claimType === "TRANSPORT"
                  ? `Consignment: ${claim.consignmentNumber}`
                  : `Warehouse Ref: ${claim.warehouseReference}`}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Submitted Date
              </h3>
              <p className="mt-1 text-base">
                {claim.submittedDate
                  ? format(new Date(claim.submittedDate), "dd MMM yyyy")
                  : "Not submitted"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Claimed Amount
              </h3>
              <p className="mt-1 text-base font-medium">
                ${claim.claimedAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
              <p className="mt-1 text-base">
                {claim.assignedTo || "Unassigned"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Last Updated
              </h3>
              <p className="mt-1 text-base">
                {format(new Date(claim.updatedAt), "dd MMM yyyy HH:mm")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Details
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Invoices
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Notes
          </TabsTrigger>
          <TabsTrigger value="attachments" className="flex items-center gap-2">
            <Image className="h-4 w-4" /> Attachments
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> History
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="details">
            <Card>
              <CardContent className="pt-6">
                <ClaimItems claim={claim} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardContent className="pt-6">
                <ClaimInvoices
                  claim={claim}
                  onAddInvoice={() => onAddInvoice(claim.id)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardContent className="pt-6">
                <ClaimNotes
                  claim={claim}
                  onAddNote={(note, attachment) =>
                    onAddNote(claim.id, note, attachment)
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attachments">
            <Card>
              <CardContent className="pt-6">
                <ClaimAttachments claim={claim} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardContent className="pt-6">
                <ClaimHistory claim={claim} />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ClaimDetails;

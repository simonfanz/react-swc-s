import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClaimsLayout from "@/components/claims/ClaimsLayout";
import ClaimDetails from "@/components/claims/review/ClaimDetails";
import { Claim, ClaimStatus } from "@/types/claims";
import { useToast } from "@/components/ui/use-toast";

// Mock claim data for demonstration
const mockClaim: Claim = {
  id: "claim-123",
  claimNumber: "CL-2023-0001",
  accountNumber: "ACC-12345",
  customerName: "Acme Corporation",
  consignmentNumber: "CON-98765",
  claimType: "TRANSPORT",
  status: "UNDER_REVIEW",
  submittedDate: "2023-06-15T10:30:00Z",
  deliveryDate: "2023-06-10T14:45:00Z",
  claimedAmount: 1250.75,
  assignedTo: "John Smith",
  items: [
    {
      id: "item-1",
      name: "Laptop Computer",
      description: "Dell XPS 15 Laptop",
      quantity: 1,
      value: 1200.0,
      serialNumber: "XPS-123456",
      damageType: "Physical Damage",
    },
    {
      id: "item-2",
      name: "Laptop Accessories",
      description: "Charger and case",
      quantity: 1,
      value: 50.75,
      damageType: "Missing Items",
    },
  ],
  invoices: [],
  notes: [
    {
      id: "note-1",
      content: "Customer reported damage upon delivery",
      createdAt: "2023-06-15T10:35:00Z",
      createdBy: "Jane Doe",
    },
  ],
  createdAt: "2023-06-15T10:30:00Z",
  updatedAt: "2023-06-16T09:15:00Z",
};

const ClaimDetailsPage: React.FC = () => {
  const { claimId } = useParams<{ claimId: string }>();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // In a real application, this would fetch data from an API
    const fetchClaimData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // For now, use mock data
        // In a real app, you would fetch based on claimId
        setClaim(mockClaim);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load claim details",
          variant: "destructive",
        });
        console.error("Error fetching claim:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaimData();
  }, [claimId, toast]);

  const handleStatusChange = (claimId: string, newStatus: ClaimStatus) => {
    // In a real app, this would call an API to update the status
    setClaim((prevClaim) => {
      if (!prevClaim) return null;

      const updatedClaim = { ...prevClaim, status: newStatus };
      toast({
        title: "Status Updated",
        description: `Claim status changed to ${newStatus.replace(/_/g, " ").toLowerCase()}`,
      });
      return updatedClaim;
    });
  };

  const handleAssign = (claimId: string, userId: string) => {
    // In a real app, this would call an API to assign the claim
    setClaim((prevClaim) => {
      if (!prevClaim) return null;

      const updatedClaim = { ...prevClaim, assignedTo: userId };
      toast({
        title: "Claim Assigned",
        description: `Claim assigned to ${userId}`,
      });
      return updatedClaim;
    });
  };

  const handleAddNote = (claimId: string, note: string, attachment?: File) => {
    // In a real app, this would call an API to add a note
    setClaim((prevClaim) => {
      if (!prevClaim) return null;

      const newNote = {
        id: `note-${Date.now()}`,
        content: note,
        createdAt: new Date().toISOString(),
        createdBy: "Current User",
        attachmentUrl: attachment ? URL.createObjectURL(attachment) : undefined,
      };

      const updatedClaim = {
        ...prevClaim,
        notes: [...prevClaim.notes, newNote],
      };

      toast({
        title: "Note Added",
        description: "Your note has been added to the claim",
      });

      return updatedClaim;
    });
  };

  const handleAddInvoice = (claimId: string) => {
    // In a real app, this would navigate to an invoice creation page or open a modal
    toast({
      title: "Add Invoice",
      description: "Invoice creation functionality would open here",
    });
  };

  return (
    <ClaimsLayout activeTab="my-claims">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : claim ? (
        <ClaimDetails
          claim={claim}
          onStatusChange={handleStatusChange}
          onAssign={handleAssign}
          onAddNote={handleAddNote}
          onAddInvoice={handleAddInvoice}
          isLoading={isLoading}
        />
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-700">
            Claim not found
          </h2>
          <p className="text-gray-500 mt-2">
            The requested claim could not be found or you don't have permission
            to view it.
          </p>
        </div>
      )}
    </ClaimsLayout>
  );
};

export default ClaimDetailsPage;

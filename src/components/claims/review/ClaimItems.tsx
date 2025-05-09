import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Claim } from "@/types/claims";
import { Plus } from "lucide-react";

interface ClaimItemsProps {
  claim: Claim;
  onAddItem?: () => void;
  onEditItem?: (itemId: string) => void;
  onDeleteItem?: (itemId: string) => void;
  onAllocateFault?: (itemId: string) => void;
}

const ClaimItems = ({
  claim,
  onAddItem = () => {},
  onEditItem = () => {},
  onDeleteItem = () => {},
  onAllocateFault = () => {},
}: ClaimItemsProps) => {
  const canEdit = [
    "DRAFT",
    "SUBMITTED",
    "UNDER_REVIEW",
    "INFORMATION_PROVIDED",
  ].includes(claim.status);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Claim Items</h3>
        {canEdit && (
          <Button
            onClick={onAddItem}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        )}
      </div>

      {claim.items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No items have been added to this claim yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Damage Type</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Fault Allocation</TableHead>
                {canEdit && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {claim.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.serialNumber || "-"}</TableCell>
                  <TableCell>{item.damageType}</TableCell>
                  <TableCell className="text-right">
                    ${item.value.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {item.faultAllocation && item.faultAllocation.length > 0 ? (
                      <div className="text-xs">
                        {item.faultAllocation.map((allocation, index) => (
                          <div key={index}>
                            {allocation.costCenterName}: {allocation.percentage}
                            %
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAllocateFault(item.id)}
                        disabled={!canEdit}
                      >
                        Allocate
                      </Button>
                    )}
                  </TableCell>
                  {canEdit && (
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditItem(item.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDeleteItem(item.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <div className="bg-gray-50 p-4 rounded-md w-64">
          <div className="flex justify-between text-sm">
            <span>Total Items:</span>
            <span>{claim.items.length}</span>
          </div>
          <div className="flex justify-between font-medium text-base mt-2">
            <span>Total Value:</span>
            <span>
              $
              {claim.items
                .reduce((sum, item) => sum + item.value, 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimItems;

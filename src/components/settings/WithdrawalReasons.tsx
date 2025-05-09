import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

interface WithdrawalReason {
  id: string;
  code: string;
  description: string;
  active: boolean;
}

const WithdrawalReasons = () => {
  const [reasons, setReasons] = useState<WithdrawalReason[]>([
    {
      id: "1",
      code: "WD-CUST",
      description: "Customer requested withdrawal",
      active: true,
    },
    {
      id: "2",
      code: "WD-DUPL",
      description: "Duplicate claim",
      active: true,
    },
    {
      id: "3",
      code: "WD-INFO",
      description: "Insufficient information provided",
      active: true,
    },
    {
      id: "4",
      code: "WD-OTHR",
      description: "Other reason",
      active: true,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentReason, setCurrentReason] = useState<WithdrawalReason | null>(
    null,
  );

  const [newReason, setNewReason] = useState<{
    code: string;
    description: string;
    active: boolean;
  }>({
    code: "",
    description: "",
    active: true,
  });

  const handleAddReason = () => {
    const id = (reasons.length + 1).toString();
    setReasons([...reasons, { id, ...newReason }]);
    setNewReason({ code: "", description: "", active: true });
    setIsAddDialogOpen(false);
  };

  const handleEditReason = () => {
    if (!currentReason) return;

    setReasons(
      reasons.map((reason) =>
        reason.id === currentReason.id ? currentReason : reason,
      ),
    );
    setIsEditDialogOpen(false);
    setCurrentReason(null);
  };

  const handleDeleteReason = (id: string) => {
    setReasons(reasons.filter((reason) => reason.id !== id));
  };

  const openEditDialog = (reason: WithdrawalReason) => {
    setCurrentReason(reason);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Withdrawal Reasons</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Reason
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Withdrawal Reason</DialogTitle>
              <DialogDescription>
                Create a new withdrawal reason code for claims.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Input
                  id="code"
                  value={newReason.code}
                  onChange={(e) =>
                    setNewReason({ ...newReason, code: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newReason.description}
                  onChange={(e) =>
                    setNewReason({ ...newReason, description: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">
                  Active
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newReason.active}
                    onCheckedChange={(checked) =>
                      setNewReason({ ...newReason, active: checked })
                    }
                  />
                  <Label htmlFor="active">
                    {newReason.active ? "Yes" : "No"}
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddReason}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reasons.map((reason) => (
            <TableRow key={reason.id}>
              <TableCell className="font-medium">{reason.code}</TableCell>
              <TableCell>{reason.description}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${reason.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {reason.active ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(reason)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteReason(reason.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Withdrawal Reason</DialogTitle>
            <DialogDescription>
              Modify the withdrawal reason details.
            </DialogDescription>
          </DialogHeader>
          {currentReason && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-code" className="text-right">
                  Code
                </Label>
                <Input
                  id="edit-code"
                  value={currentReason.code}
                  onChange={(e) =>
                    setCurrentReason({
                      ...currentReason,
                      code: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  value={currentReason.description}
                  onChange={(e) =>
                    setCurrentReason({
                      ...currentReason,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-active" className="text-right">
                  Active
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="edit-active"
                    checked={currentReason.active}
                    onCheckedChange={(checked) =>
                      setCurrentReason({
                        ...currentReason,
                        active: checked,
                      })
                    }
                  />
                  <Label htmlFor="edit-active">
                    {currentReason.active ? "Yes" : "No"}
                  </Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditReason}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WithdrawalReasons;

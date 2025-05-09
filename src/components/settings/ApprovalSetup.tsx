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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

interface ApprovalLevel {
  id: string;
  name: string;
  threshold: number;
  approvers: string[];
}

const ApprovalSetup = () => {
  const [approvalLevels, setApprovalLevels] = useState<ApprovalLevel[]>([
    {
      id: "1",
      name: "Level 1",
      threshold: 1000,
      approvers: ["Claims Supervisor"],
    },
    {
      id: "2",
      name: "Level 2",
      threshold: 5000,
      approvers: ["Regional Manager"],
    },
    {
      id: "3",
      name: "Level 3",
      threshold: 10000,
      approvers: ["National Claims Manager"],
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<ApprovalLevel | null>(null);

  const [newLevel, setNewLevel] = useState<{
    name: string;
    threshold: number;
    approvers: string[];
  }>({
    name: "",
    threshold: 0,
    approvers: [],
  });

  const handleAddLevel = () => {
    const id = (approvalLevels.length + 1).toString();
    setApprovalLevels([...approvalLevels, { id, ...newLevel }]);
    setNewLevel({ name: "", threshold: 0, approvers: [] });
    setIsAddDialogOpen(false);
  };

  const handleEditLevel = () => {
    if (!currentLevel) return;

    setApprovalLevels(
      approvalLevels.map((level) =>
        level.id === currentLevel.id ? currentLevel : level,
      ),
    );
    setIsEditDialogOpen(false);
    setCurrentLevel(null);
  };

  const handleDeleteLevel = (id: string) => {
    setApprovalLevels(approvalLevels.filter((level) => level.id !== id));
  };

  const openEditDialog = (level: ApprovalLevel) => {
    setCurrentLevel(level);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Approval Workflow Configuration</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Approval Level
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Approval Level</DialogTitle>
              <DialogDescription>
                Configure a new approval level for the claims workflow.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Level Name
                </Label>
                <Input
                  id="name"
                  value={newLevel.name}
                  onChange={(e) =>
                    setNewLevel({ ...newLevel, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="threshold" className="text-right">
                  Threshold ($)
                </Label>
                <Input
                  id="threshold"
                  type="number"
                  value={newLevel.threshold}
                  onChange={(e) =>
                    setNewLevel({
                      ...newLevel,
                      threshold: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="approvers" className="text-right">
                  Approvers
                </Label>
                <Select
                  onValueChange={(value) =>
                    setNewLevel({ ...newLevel, approvers: [value] })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select approver role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Claims Supervisor">
                      Claims Supervisor
                    </SelectItem>
                    <SelectItem value="Regional Manager">
                      Regional Manager
                    </SelectItem>
                    <SelectItem value="National Claims Manager">
                      National Claims Manager
                    </SelectItem>
                    <SelectItem value="Finance Director">
                      Finance Director
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddLevel}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Level Name</TableHead>
            <TableHead>Threshold ($)</TableHead>
            <TableHead>Approvers</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {approvalLevels.map((level) => (
            <TableRow key={level.id}>
              <TableCell className="font-medium">{level.name}</TableCell>
              <TableCell>${level.threshold.toLocaleString()}</TableCell>
              <TableCell>{level.approvers.join(", ")}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(level)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteLevel(level.id)}
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
            <DialogTitle>Edit Approval Level</DialogTitle>
            <DialogDescription>
              Modify the approval level configuration.
            </DialogDescription>
          </DialogHeader>
          {currentLevel && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Level Name
                </Label>
                <Input
                  id="edit-name"
                  value={currentLevel.name}
                  onChange={(e) =>
                    setCurrentLevel({
                      ...currentLevel,
                      name: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-threshold" className="text-right">
                  Threshold ($)
                </Label>
                <Input
                  id="edit-threshold"
                  type="number"
                  value={currentLevel.threshold}
                  onChange={(e) =>
                    setCurrentLevel({
                      ...currentLevel,
                      threshold: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-approvers" className="text-right">
                  Approvers
                </Label>
                <Select
                  value={currentLevel.approvers[0]}
                  onValueChange={(value) =>
                    setCurrentLevel({
                      ...currentLevel,
                      approvers: [value],
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Claims Supervisor">
                      Claims Supervisor
                    </SelectItem>
                    <SelectItem value="Regional Manager">
                      Regional Manager
                    </SelectItem>
                    <SelectItem value="National Claims Manager">
                      National Claims Manager
                    </SelectItem>
                    <SelectItem value="Finance Director">
                      Finance Director
                    </SelectItem>
                  </SelectContent>
                </Select>
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
            <Button onClick={handleEditLevel}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalSetup;

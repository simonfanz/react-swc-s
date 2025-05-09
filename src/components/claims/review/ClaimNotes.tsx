import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Claim } from "@/types/claims";
import { format } from "date-fns";
import { Paperclip, Send } from "lucide-react";

interface ClaimNotesProps {
  claim: Claim;
  onAddNote?: (note: string, attachment?: File) => void;
}

const ClaimNotes = ({ claim, onAddNote = () => {} }: ClaimNotesProps) => {
  const [newNote, setNewNote] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddNote(newNote, attachment || undefined);
      setNewNote("");
      setAttachment(null);
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Notes</h3>

      <div className="space-y-4">
        {claim.notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No notes have been added to this claim yet.
          </div>
        ) : (
          <div className="space-y-4">
            {claim.notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-50 p-4 rounded-md border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium">{note.createdBy}</div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(note.createdAt), "dd MMM yyyy HH:mm")}
                  </div>
                </div>
                <div className="mt-2 whitespace-pre-wrap">{note.content}</div>
                {note.attachmentUrl && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <a
                      href={note.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <Paperclip className="h-4 w-4" />
                      Attachment
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="new-note">Add Note</Label>
          <Textarea
            id="new-note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note here..."
            className="min-h-[100px] mt-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label
            htmlFor="attachment"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
          >
            <Paperclip className="h-4 w-4" />
            {attachment ? attachment.name : "Attach File"}
          </Label>
          <Input
            id="attachment"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          {attachment && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAttachment(null)}
            >
              Remove
            </Button>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!newNote.trim() || isSubmitting}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Sending..." : "Add Note"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClaimNotes;

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Paperclip,
  FileText,
  Image,
  File,
  Download,
  Trash2,
} from "lucide-react";

interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  uploadedBy: string;
  fileSize: string;
}

interface ClaimAttachmentsProps {
  claimId?: string;
  attachments?: Attachment[];
}

const defaultAttachments: Attachment[] = [
  {
    id: "1",
    fileName: "Damage_Photo_1.jpg",
    fileType: "image/jpeg",
    uploadDate: "2023-05-15",
    uploadedBy: "John Smith",
    fileSize: "2.4 MB",
  },
  {
    id: "2",
    fileName: "Delivery_Receipt.pdf",
    fileType: "application/pdf",
    uploadDate: "2023-05-14",
    uploadedBy: "Sarah Johnson",
    fileSize: "1.2 MB",
  },
  {
    id: "3",
    fileName: "Claim_Form.docx",
    fileType: "application/docx",
    uploadDate: "2023-05-14",
    uploadedBy: "Sarah Johnson",
    fileSize: "0.8 MB",
  },
];

const getFileIcon = (fileType: string) => {
  if (fileType.includes("image")) {
    return <Image className="h-5 w-5 text-blue-500" />;
  } else if (fileType.includes("pdf")) {
    return <FileText className="h-5 w-5 text-red-500" />;
  } else if (fileType.includes("doc")) {
    return <FileText className="h-5 w-5 text-blue-700" />;
  } else {
    return <File className="h-5 w-5 text-gray-500" />;
  }
};

export default function ClaimAttachments({
  claimId,
  attachments = defaultAttachments,
}: ClaimAttachmentsProps) {
  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Paperclip className="h-5 w-5" />
          Attachments
        </CardTitle>
        <CardDescription>
          Documents and images related to this claim
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Button variant="outline" className="text-sm">
            <Paperclip className="mr-2 h-4 w-4" />
            Add Attachment
          </Button>
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(attachment.fileType)}
                  <div>
                    <p className="font-medium text-sm">{attachment.fileName}</p>
                    <p className="text-xs text-gray-500">
                      {attachment.uploadDate} • {attachment.fileSize} •{" "}
                      {attachment.uploadedBy}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

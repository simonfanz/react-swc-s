import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  History,
  User,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface HistoryEvent {
  id: string;
  date: string;
  time: string;
  type: "status_change" | "note_added" | "document_added" | "assignment_change";
  description: string;
  user: string;
  details?: string;
}

interface ClaimHistoryProps {
  claimId?: string;
  events?: HistoryEvent[];
}

const defaultEvents: HistoryEvent[] = [
  {
    id: "1",
    date: "2023-05-15",
    time: "14:32",
    type: "status_change",
    description: 'Status changed from "Draft" to "Submitted"',
    user: "John Smith",
    details: "Claim submitted through Claims Portal",
  },
  {
    id: "2",
    date: "2023-05-16",
    time: "09:15",
    type: "assignment_change",
    description: "Assigned to Sarah Johnson",
    user: "System",
    details: "Auto-assigned based on claim type",
  },
  {
    id: "3",
    date: "2023-05-16",
    time: "10:22",
    type: "status_change",
    description: 'Status changed from "Submitted" to "Under Review"',
    user: "Sarah Johnson",
  },
  {
    id: "4",
    date: "2023-05-16",
    time: "11:45",
    type: "note_added",
    description: 'Added note: "Contacted customer for additional information"',
    user: "Sarah Johnson",
  },
  {
    id: "5",
    date: "2023-05-17",
    time: "13:20",
    type: "document_added",
    description: 'Added document: "Additional_Photos.zip"',
    user: "Michael Brown",
  },
];

const getEventIcon = (type: string) => {
  switch (type) {
    case "status_change":
      return <AlertCircle className="h-5 w-5 text-blue-500" />;
    case "note_added":
      return <MessageSquare className="h-5 w-5 text-green-500" />;
    case "document_added":
      return <CheckCircle className="h-5 w-5 text-purple-500" />;
    case "assignment_change":
      return <User className="h-5 w-5 text-orange-500" />;
    default:
      return <History className="h-5 w-5 text-gray-500" />;
  }
};

export default function ClaimHistory({
  claimId,
  events = defaultEvents,
}: ClaimHistoryProps) {
  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <History className="h-5 w-5" />
          Claim History
        </CardTitle>
        <CardDescription>
          Timeline of events and changes for this claim
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="relative pl-6 border-l border-gray-200">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`mb-6 relative ${index === events.length - 1 ? "" : ""}`}
              >
                <div className="absolute -left-[25px] mt-1.5 h-4 w-4 rounded-full bg-white flex items-center justify-center">
                  {getEventIcon(event.type)}
                </div>
                <div className="bg-gray-50 rounded-md p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{event.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {event.date} {event.time}
                    </div>
                  </div>
                  {event.details && (
                    <p className="text-xs text-gray-600">{event.details}</p>
                  )}
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <User className="h-3 w-3 mr-1" />
                    {event.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

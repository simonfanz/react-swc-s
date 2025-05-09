import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface ClaimsLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const ClaimsLayout = ({
  children,
  activeTab = "search",
  onTabChange = () => {},
}: ClaimsLayoutProps) => {
  return (
    <div className="container mx-auto p-6 space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Claims Management</h1>
      </div>

      <Tabs
        defaultValue={activeTab}
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="search">Claims Search</TabsTrigger>
          <TabsTrigger value="my-claims">My Claims</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <Card className="mt-6 border-gray-200">
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default ClaimsLayout;

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, Clock, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  buttonText: string;
}

interface DashboardGridProps {
  isLoading?: boolean;
}

const dashboardCards: DashboardCardProps[] = [
  {
    title: "New Claim",
    description: "Create and submit a new claim",
    icon: <FileText className="h-6 w-6 text-blue-500" />,
    href: "/claims/new",
    buttonText: "Create Claim",
  },
  {
    title: "Claims Search",
    description: "Search and view all claims",
    icon: <Search className="h-6 w-6 text-purple-500" />,
    href: "/claims/search",
    buttonText: "Search Claims",
  },
  {
    title: "My Claims",
    description: "View and manage your assigned claims",
    icon: <FileText className="h-6 w-6 text-green-500" />,
    href: "/claims/my-claims",
    buttonText: "View My Claims",
  },
  {
    title: "Reports",
    description: "Access claims reports and analytics",
    icon: <BarChart2 className="h-6 w-6 text-orange-500" />,
    href: "/reports",
    buttonText: "View Reports",
  },
];

const DashboardCard = ({
  title,
  description,
  icon,
  href,
  buttonText,
}: DashboardCardProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-start gap-4 pb-2">
        <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
        <div>
          <CardTitle className="text-lg font-medium text-gray-900">
            {title}
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </CardHeader>
      <CardContent>
        <Link to={href}>
          <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium">
            {buttonText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const RecentActivityCard = () => {
  const activities = [
    {
      id: 1,
      color: "bg-blue-500",
      text: "New claim submitted - CL2024000042 - Acme Corp",
      time: "2 hours ago",
    },
    {
      id: 2,
      color: "bg-green-500",
      text: "Claim approved - CL2024000040 - XYZ Industries",
      time: "4 hours ago",
    },
    {
      id: 3,
      color: "bg-orange-500",
      text: "Information requested - CL2024000038 - Global Tech",
      time: "Yesterday",
    },
  ];

  return (
    <Card className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">
          Recent Activity
        </CardTitle>
        <p className="text-sm text-gray-500">
          Your most recent claims activity
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div
              className={`h-2 w-2 rounded-full ${activity.color} mt-2`}
            ></div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">{activity.text}</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {activity.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const QuickStatsCard = () => {
  const stats = [
    { label: "Open Claims", value: 12 },
    { label: "Customer Information Request", value: 3 },
    { label: "Approved This Month", value: 8 },
    { label: "Open Events", value: 3 },
    { label: "Pending Acceptance", value: 5 },
    { label: "Pending Approval", value: 7 },
  ];

  return (
    <Card className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">
          Quick Stats
        </CardTitle>
        <p className="text-sm text-gray-500">Overview of your claims</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardGrid = ({ isLoading = false }: DashboardGridProps) => {
  if (isLoading) {
    return (
      <div className="p-6 h-full">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Claims Management
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome to the Claims Management System. Select an option below to get
          started.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {dashboardCards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivityCard />
        <QuickStatsCard />
      </div>
    </div>
  );
};

export default DashboardGrid;

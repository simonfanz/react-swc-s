import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TopNavigation from "../dashboard/layout/TopNavigation";
import UserManagement from "../settings/UserManagement";
import CustomerAccounts from "../settings/CustomerAccounts";
import CostCentres from "../settings/CostCentres";
import ClaimTypes from "../settings/ClaimTypes";
import DamageTypes from "../settings/DamageTypes";
import GSTRates from "../settings/GSTRates";
import ApprovalSetup from "../settings/ApprovalSetup";
import WithdrawalReasons from "../settings/WithdrawalReasons";
import DeclinedReasons from "../settings/DeclinedReasons";
import SystemSettings from "../settings/SystemSettings";
import { useLocation } from "react-router-dom";

const Settings = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("users");

  useEffect(() => {
    // Extract the section from the URL path
    const path = location.pathname.split("/");
    const section = path[path.length - 1];

    // Map URL paths to component sections
    const sectionMap: Record<string, string> = {
      users: "users",
      customers: "customers",
      "cost-centres": "costCentres",
      "claim-types": "claimTypes",
      "damage-types": "damageTypes",
      "gst-rates": "gstRates",
      approvals: "approvals",
      "withdrawal-reasons": "withdrawalReasons",
      "declined-reasons": "declinedReasons",
      system: "systemSettings",
      settings: "users", // Default to users if just /settings
    };

    setActiveSection(sectionMap[section] || "users");
  }, [location]);

  // Helper function to format section title
  const formatSectionTitle = (section: string) => {
    return (
      section.charAt(0).toUpperCase() +
      section.slice(1).replace(/([A-Z])/g, " $1")
    );
  };

  // Helper function to get section description
  const getSectionDescription = (section: string) => {
    switch (section) {
      case "users":
        return "Manage user accounts and permissions";
      case "customers":
        return "Manage customer account information";
      case "costCentres":
        return "Manage cost centre configurations";
      case "claimTypes":
        return "Manage claim type definitions";
      case "damageTypes":
        return "Manage damage type categories";
      case "gstRates":
        return "Manage GST rate configurations";
      case "approvals":
        return "Manage approval workflows and levels";
      case "withdrawalReasons":
        return "Manage withdrawal reason options";
      case "declinedReasons":
        return "Manage declined reason options";
      case "systemSettings":
        return "Manage system-wide settings and configurations";
      default:
        return "";
    }
  };

  // Render the active component based on the section
  const renderActiveComponent = () => {
    switch (activeSection) {
      case "users":
        return <UserManagement />;
      case "customers":
        return <CustomerAccounts />;
      case "costCentres":
        return <CostCentres />;
      case "claimTypes":
        return <ClaimTypes />;
      case "damageTypes":
        return <DamageTypes />;
      case "gstRates":
        return <GSTRates />;
      case "approvals":
        return <ApprovalSetup />;
      case "withdrawalReasons":
        return <WithdrawalReasons />;
      case "declinedReasons":
        return <DeclinedReasons />;
      case "systemSettings":
        return <SystemSettings />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="h-[calc(100vh-64px)] mt-16">
        <main className="overflow-auto p-6">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <Card>
              <CardHeader>
                <CardTitle>{formatSectionTitle(activeSection)}</CardTitle>
                <CardDescription>
                  {getSectionDescription(activeSection)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {renderActiveComponent()}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;

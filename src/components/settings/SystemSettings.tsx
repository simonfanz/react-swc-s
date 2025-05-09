import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState("general");

  // General settings
  const [companyName, setCompanyName] = useState("Transport Claims Ltd");
  const [emailDomain, setEmailDomain] = useState("claims.example.com");
  const [defaultCurrency, setDefaultCurrency] = useState("AUD");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [statusChangeNotifications, setStatusChangeNotifications] =
    useState(true);
  const [assignmentNotifications, setAssignmentNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(true);

  // Claim settings
  const [damagePeriod, setDamagePeriod] = useState(7);
  const [lossPeriod, setLossPeriod] = useState(14);
  const [extendedPeriod, setExtendedPeriod] = useState(45);
  const [autoAssign, setAutoAssign] = useState(true);

  // Security settings
  const [passwordExpiry, setPasswordExpiry] = useState(90);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  const handleSaveSettings = () => {
    // In a real app, this would save to the database
    console.log("Settings saved");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="claims">Claim Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic system settings and defaults.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company-name" className="text-right">
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email-domain" className="text-right">
                  Email Domain
                </Label>
                <Input
                  id="email-domain"
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currency" className="text-right">
                  Default Currency
                </Label>
                <Select
                  value={defaultCurrency}
                  onValueChange={setDefaultCurrency}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                    <SelectItem value="NZD">
                      New Zealand Dollar (NZD)
                    </SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email notifications and alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email-notifications" className="text-right">
                  Email Notifications
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                  <Label htmlFor="email-notifications">
                    {emailNotifications ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status-notifications" className="text-right">
                  Status Change Alerts
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="status-notifications"
                    checked={statusChangeNotifications}
                    onCheckedChange={setStatusChangeNotifications}
                  />
                  <Label htmlFor="status-notifications">
                    {statusChangeNotifications ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="assignment-notifications"
                  className="text-right"
                >
                  Assignment Notifications
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="assignment-notifications"
                    checked={assignmentNotifications}
                    onCheckedChange={setAssignmentNotifications}
                  />
                  <Label htmlFor="assignment-notifications">
                    {assignmentNotifications ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reminder-notifications" className="text-right">
                  Reminder Notifications
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="reminder-notifications"
                    checked={reminderNotifications}
                    onCheckedChange={setReminderNotifications}
                  />
                  <Label htmlFor="reminder-notifications">
                    {reminderNotifications ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle>Claim Settings</CardTitle>
              <CardDescription>
                Configure claim processing rules and timeframes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="damage-period" className="text-right">
                  Damage Claim Period (days)
                </Label>
                <Input
                  id="damage-period"
                  type="number"
                  value={damagePeriod}
                  onChange={(e) => setDamagePeriod(parseInt(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="loss-period" className="text-right">
                  Loss Claim Period (days)
                </Label>
                <Input
                  id="loss-period"
                  type="number"
                  value={lossPeriod}
                  onChange={(e) => setLossPeriod(parseInt(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="extended-period" className="text-right">
                  Extended Lodging Period (days)
                </Label>
                <Input
                  id="extended-period"
                  type="number"
                  value={extendedPeriod}
                  onChange={(e) => setExtendedPeriod(parseInt(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="auto-assign" className="text-right">
                  Auto-assign Claims
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="auto-assign"
                    checked={autoAssign}
                    onCheckedChange={setAutoAssign}
                  />
                  <Label htmlFor="auto-assign">
                    {autoAssign ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and access control settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password-expiry" className="text-right">
                  Password Expiry (days)
                </Label>
                <Input
                  id="password-expiry"
                  type="number"
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(parseInt(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mfa-required" className="text-right">
                  Require MFA
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="mfa-required"
                    checked={mfaRequired}
                    onCheckedChange={setMfaRequired}
                  />
                  <Label htmlFor="mfa-required">
                    {mfaRequired ? "Required" : "Optional"}
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="session-timeout" className="text-right">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  );
};

export default SystemSettings;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bell,
  Home,
  Search,
  Settings,
  User,
  FileText,
  Calendar,
  BarChart2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../supabase/auth";

interface TopNavigationProps {
  onSearch?: (query: string) => void;
  notifications?: Array<{ id: string; title: string }>;
}

const TopNavigation = ({
  onSearch = () => {},
  notifications = [
    { id: "1", title: "New claim submitted - CL2024000042" },
    { id: "2", title: "Claim approved - CL2024000040" },
  ],
}: TopNavigationProps) => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: "Home", href: "/" },
    {
      icon: <Search className="h-5 w-5" />,
      label: "Claims Search",
      href: "/claims/search",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "My Claims",
      href: "/claims/my-claims",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Events",
      href: "/events",
    },
    {
      icon: <BarChart2 className="h-5 w-5" />,
      label: "Reports",
      href: "/reports",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "/settings",
    },
  ];

  const settingsItems = [
    { label: "User Management", href: "/settings/users" },
    { label: "Customer Accounts", href: "/settings/customers" },
    { label: "Cost Centres", href: "/settings/cost-centres" },
    { label: "Claim Types", href: "/settings/claim-types" },
    { label: "Damage Types", href: "/settings/damage-types" },
    { label: "GST Rates", href: "/settings/gst-rates" },
    { label: "Approvals Setup", href: "/settings/approvals" },
    { label: "Withdrawal Reasons", href: "/settings/withdrawal-reasons" },
    { label: "Declined Reasons", href: "/settings/declined-reasons" },
    { label: "System Settings", href: "/settings/system" },
  ];

  return (
    <div className="w-full h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 fixed top-0 z-50 shadow-sm">
      <div className="flex items-center gap-8 flex-1">
        <Link to="/" className="text-gray-900 font-bold text-lg">
          Claims Management
        </Link>
        <div className="flex items-center space-x-6">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-gray-600 hover:text-gray-900 flex flex-col items-center text-xs font-medium"
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="text-gray-600 hover:text-gray-900 flex flex-col items-center text-xs font-medium cursor-pointer">
                {navItems[5].icon}
                <span className="mt-1">{navItems[5].label}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl overflow-hidden p-2 border border-gray-200 shadow-lg w-56"
            >
              <DropdownMenuLabel className="text-sm font-medium text-gray-900 px-2">
                Settings
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-gray-100" />
              {settingsItems.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  className="rounded-lg text-sm py-2 focus:bg-gray-100"
                  asChild
                >
                  <Link to={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full h-9 w-9 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Bell className="h-4 w-4 text-gray-700" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium border border-white">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-xl overflow-hidden p-2 border border-gray-200 shadow-lg"
                >
                  <DropdownMenuLabel className="text-sm font-medium text-gray-900 px-2">
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 bg-gray-100" />
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="rounded-lg text-sm py-2 focus:bg-gray-100"
                    >
                      {notification.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent className="rounded-lg bg-gray-900 text-white text-xs px-3 py-1.5">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 hover:cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.email || ""}
                />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">User Profile</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl border-none shadow-lg"
          >
            <DropdownMenuLabel className="text-xs text-gray-500">
              {user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => signOut()}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNavigation;

"use client";
import {
  Building2,
  ChartArea,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardCopy,
  ClipboardList,
  ClipboardPaste,
  LogOutIcon,
  Package,
  Settings,
  User2Icon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  getAvatar,
  getCurrentUser,
  isLoggedIn,
  isVerified,
  logout,
} from "@/lib/pocketbase";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { User } from "@/lib/types";

const items = [
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: ChartArea,
  },
  {
    title: "Businesses",
    url: "/app/businesses",
    icon: Building2,
  },
  {
    title: "Products",
    url: "/app/products",
    icon: Package,
  },
  {
    title: "Orders",
    url: "/app/orders",
    icon: ClipboardList,
    subs: [
      {
        title: "Purchase Orders",
        url: "/app/orders/purchase",
        icon: ClipboardCopy,
      },
      {
        title: "Sales Orders",
        url: "/app/orders/sales",
        icon: ClipboardPaste,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User>();
  const [avatar, setAvatar] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Function to close sidebar only on mobile
  const closeSidebarOnMobile = () => {
    // Check if we're on mobile (using window width)
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      (async () => {
        const verified = await isVerified();
        if (!verified) {
          window.location.href = "/auth/verify";
          setIsLoading(false);
        }
        const user = (await getCurrentUser()) as unknown as User;
        if (!user) {
          window.location.href = "/auth/login";
          setIsLoading(false);
          return;
        }
        setUser(user);
        const avatar = await getAvatar(user.id, user.avatar);
        setAvatar(avatar);
        setIsLoading(false);
      })();
    }
  }, []);

  return (
    <Sidebar className={isSidebarOpen ? "" : "hidden md:block"}>
      <SidebarHeader>
        <Image
          src={"/logo.png"}
          alt={"InviStar Logo"}
          className="px-8 h-auto w-auto dark:hidden"
          width={240}
          height={50}
        />
        <Image
          src={"/logodark.png"}
          alt={"InviStar Logo"}
          className="px-8 h-auto w-auto hidden dark:block"
          width={240}
          height={50}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={
                      pathname.includes(item.url)
                        ? "bg-primary/70 hover:bg-primary dark:bg-primary/70 dark:hover:bg-primary/50"
                        : ""
                    }
                  >
                    <Link href={item.url} onClick={closeSidebarOnMobile}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.subs
                    ? item.subs.map((sub) => {
                        return (
                          <SidebarMenuSub key={sub.title}>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                asChild
                                className={
                                  pathname.includes(sub.url)
                                    ? "bg-primary/70 hover:bg-primary dark:bg-primary/70 dark:hover:bg-primary/50"
                                    : ""
                                }
                              >
                                <Link
                                  href={sub.url}
                                  onClick={closeSidebarOnMobile}
                                >
                                  <sub.icon />
                                  <span>{sub.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        );
                      })
                    : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {isLoading ? (
                    ""
                  ) : user?.avatar ? (
                    <Image
                      src={avatar || ""}
                      alt="User Avatar"
                      className="rounded-full size-6 bg-foreground"
                      width={0} // Bypasses explicit width requirement
                      height={0} // Bypasses explicit height requirement
                      sizes="100vw" // Ensures responsive behavior
                    />
                  ) : (
                    <User2Icon className="size-6" />
                  )}
                  {isLoading ? "Loading..." : user?.name}
                  {isDropdownOpen ? (
                    <ChevronDownIcon className="motion-rotate-in-[-180deg] motion-ease-spring-smooth ml-auto" />
                  ) : (
                    <ChevronUpIcon className="motion-rotate-in-[180deg] motion-ease-spring-smooth ml-auto" />
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[250px] flex flex-col p-2 gap-2"
              >
                <DropdownMenuItem asChild>
                  <Button
                    asChild
                    className="flex w-full gap-2 items-center"
                    variant={"ghost"}
                  >
                    <Link href={"/app/settings"}>
                      <Settings />
                      Settings
                    </Link>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild variant="destructive">
                  <Button
                    onClick={() => {
                      toast.success(
                        "Logged out successfully. Redirecting to login page..."
                      );
                      if (localStorage.getItem("google")) {
                        localStorage.removeItem("google");
                      }
                      logout();
                      window.location.href = "/auth/login";
                    }}
                    className="flex w-full gap-2 items-center hover:bg-destructive"
                    variant="destructive"
                  >
                    <LogOutIcon className="text-destructive-foreground" />
                    Log Out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

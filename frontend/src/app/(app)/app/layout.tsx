"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";
import {
  CheckCircle2Icon,
  InfoIcon,
  TriangleAlertIcon,
  CircleXIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";
// import { getPageTitle } from '@/lib/utils';
import { getBreadcrumbs } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { isLoggedIn, isSetup } from "@/lib/pocketbase";
import LoadingSpinner from "@/components/loading-spinner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = "/auth/login";
      setIsLoading(false);
    }
    (async () => {
      const setup = await isSetup();
      if (!setup && pathname !== "/app/settings") {
        window.location.href = "/app/settings?setup=true";
        setIsLoading(false);
      }
      setIsLoading(false);
    })();
  }, [pathname]);
  const crumbs = getBreadcrumbs(pathname);
  return (
    <html suppressHydrationWarning={true} lang="en">
      <head>
      <meta name="apple-mobile-web-app-title" content="InviStar" />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <SidebarProvider>
              <AppSidebar />
              <main className="flex flex-col w-full h-screen">
                <div className="flex items-center p-4 border-b bg-secondary/70">
                  <SidebarTrigger />
                  <div
                    data-orientation="vertical"
                    role="none"
                    className="shrink-0 bg-border w-[1px] mr-2 h-4"
                  ></div>
                  {/* <p className='text-md font-bold'>
										{getPageTitle(pathname)}
									</p> */}
                  <Breadcrumb>
                    <BreadcrumbList>
                      {crumbs.map((crumb, idx) => {
                        return (
                          <div
                            className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5"
                            key={idx}
                          >
                            <BreadcrumbItem>
                              <BreadcrumbLink href={crumb?.path || ""}>
                                {crumb?.name}
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                            {crumbs.length !== idx + 1 && (
                              <BreadcrumbSeparator />
                            )}
                          </div>
                        );
                      })}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <div
                  className="relative flex flex-col flex-grow bg-background px-8 py-2 overflow-y-scroll overflow-x-hidden"
                  id="content-container"
                >
                  {children}
                </div>
                <footer className="p-4 text-center border-t bg-secondary/70 text-sm text-muted-foreground">
                  <p>
                    &copy; {new Date().getFullYear()}{" "}
                    <a
                      href="https://www.techlion.dev"
                      className="text-primary underline-offset-4 hover:underline cursor-pointer"
                    >
                      TechLion Dev
                    </a>{" "}
                    | All rights reserved
                  </p>
                </footer>
              </main>
              <Toaster
                closeButton={true}
                icons={{
                  success: <CheckCircle2Icon />,
                  info: <InfoIcon />,
                  warning: <TriangleAlertIcon />,
                  error: <CircleXIcon />,
                  loading: <LoaderCircleIcon />,
                }}
                position="top-right"
                richColors={true}
              />
            </SidebarProvider>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}

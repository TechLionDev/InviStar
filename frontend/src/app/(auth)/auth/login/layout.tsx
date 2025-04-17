import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In | InviStar",
};

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

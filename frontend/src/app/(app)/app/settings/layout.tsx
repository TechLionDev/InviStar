import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Settings | InviStar",
};

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

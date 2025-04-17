import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales Orders | InviStar",
};

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

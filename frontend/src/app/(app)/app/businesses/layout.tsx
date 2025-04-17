import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Businesses | InviStar",
};

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

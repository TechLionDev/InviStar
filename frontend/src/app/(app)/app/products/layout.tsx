import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | InviStar",
};

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

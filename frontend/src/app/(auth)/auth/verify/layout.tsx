import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | InviStar",
};

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | InviStar",
};

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

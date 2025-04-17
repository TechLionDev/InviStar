"use client";
import pocketbase, { getCurrentUser, isLoggedIn } from "@/lib/pocketbase";
import { User } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

function Verify() {
  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = "/auth/login";
    }
    (async () => {
      const user = (await getCurrentUser()) as unknown as User;
      if (user.verified) {
        window.location.href = "/app/dashboard";
      }
      pocketbase.collection("users").subscribe(user.id, (data) => {
        if (data.record && data.record.verified) {
          toast.success("Email verified successfully");
          pocketbase.collection("users").unsubscribe(user.id);
          window.location.href = "/app/dashboard";
        }
      });
      await pocketbase.collection("users").requestVerification(user.email);
    })();
  }, []);

  return (
    <div>
      <section className="flex flex-col w-screen h-screen items-center justify-center">
        <Link href="/">
          <Image
            src={"/logo.png"}
            alt={"InviStar Logo"}
            className="h-32 md:h-42 w-full dark:hidden"
            width={0} // Bypasses explicit width requirement
            height={0} // Bypasses explicit height requirement
            sizes="100vw" // Ensures responsive behavior
          />
          <Image
            src={"/logodark.png"}
            alt={"InviStar Logo"}
            className="h-32 md:h-42 w-full hidden dark:block"
            width={0} // Bypasses explicit width requirement
            height={0} // Bypasses explicit height requirement
            sizes="100vw" // Ensures responsive behavior
          />
        </Link>
        <div className="mx-auto w-full max-w-sm rounded-md p-6">
          <div className="mb-6 flex flex-col items-center">
            <p className="mb-2 text-2xl font-bold">Verify your email</p>
            <p className="text-muted-foreground">
              We have sent you an email with a verification link. Please click
              on the link to verify your email.
            </p>
            <p className="text-primary text-lg text-center pt-8">
              This page will auto-refresh when you click on the link in the
              email.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Verify;

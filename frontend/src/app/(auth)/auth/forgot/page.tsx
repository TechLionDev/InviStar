"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import pocketbase from "@/lib/pocketbase";
import Link from "next/link";
import Image from "next/image";

const formSchema = z.object({
  email: z.string(),
});

function Forgot() {
  const [requested, setRequested] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await pocketbase.collection("users").requestPasswordReset(values.email);
      setRequested(true);
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 10000);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

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
        <div className="flex flex-col p-8 items-center justify-center">
          <p className="mb-2 text-2xl font-bold">Reset Your Password</p>
        </div>
        {requested ? (
          <div className="flex flex-col gap-4 md:w-1/2">
            <div className="mx-auto w-full max-w-sm rounded-md p-6">
              <div className="mb-6 flex flex-col items-center">
                <p className="text-muted-foreground">
                  We have sent you an email with a link to reset your password.
                  Please click on the link to reset your password.
                </p>
                <p className="text-primary text-lg text-center pt-8">
                  This page will return to login in 10 seconds.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 space-y-8"
            >
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="johndoe@mail.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="mt-2 w-full">
                  Reset My Password!
                </Button>
              </div>
            </form>
          </Form>
        )}
      </section>
    </div>
  );
}

export default Forgot;

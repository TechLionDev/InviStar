"use client";

import { PasswordInput } from "@/components/password-input";
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
import pocketbase, { isLoggedIn, isVerified } from "@/lib/pocketbase";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
});

function LogIn() {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isLoggedIn()) {
      (async () => {
        const verified = await isVerified();
        if (!verified) {
          window.location.href = "/auth/verify";
        } else {
          window.location.href = "/app/dashboard";
        }
      })();
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await pocketbase
        .collection("users")
        .authWithPassword(values.email, values.password);
      const verified = await isVerified();
      toast.success("Log in successful!");
      if (!verified) {
        window.location.href = "/auth/verify";
      }
      window.location.href = "/app/dashboard";
      setIsLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("Failed to authenticate.")) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error("Failed to submit the form. Please try again.", {
            description() {
              return (
                <div className="flex flex-col gap-2">
                  <code className="p-2 bg-muted/50 rounded text-sm overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(error, null, 2)}
                  </code>
                </div>
              );
            },
          });
        }
      }
      setIsLoading(false);
    }
  }

  return (
    <div>
      <section className="flex flex-col items-center justify-center pt-32 w-full">
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
        <div className="mx-auto w-full max-w-lg rounded-md p-6">
          <div className="mb-6 flex flex-col items-center">
            <p className="mb-2 text-2xl font-bold">Welcome Back!</p>
            <p className="text-muted-foreground">Please log in to continue.</p>
          </div>
          <div>
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
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <div className="flex justify-between items-center">
                          <FormLabel htmlFor="password">Password</FormLabel>
                        </div>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="******"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <Link
                      href={"/auth/forgot"}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="mt-2 w-full disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={async () => {
                      try {
                        localStorage.setItem("google", "true");
                        await pocketbase.collection("users").authWithOAuth2({
                          provider: "google",
                        });
                      } catch (e: unknown) {
                        if (e instanceof Error) {
                          console.log(e);
                        }
                        localStorage.removeItem("google");
                        toast.error(
                          "Failed to authenticate with Google. Please try again."
                        );
                      }
                    }}
                  >
                    <FcGoogle className="mr-2 size-5" />
                    Login with Google
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
              <p>Don&apos;t have an account?</p>
              <Link href={"/auth/signup"} className="font-medium text-primary">
                Sign up!
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LogIn;

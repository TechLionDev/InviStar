"use client";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { PhoneInput } from "@/components/phone-input";
import pocketbase, { isLoggedIn, isVerified } from "@/lib/pocketbase";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
const pb = pocketbase;
const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, { message: "Phone number must be valid" }),
    addressStreet: z.string().min(5, { message: "Address must be valid" }),
    addressCity: z.string().min(2, { message: "City must be valid" }),
    addressState: z.enum(
      [
        "AL",
        "AK",
        "AS",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "DC",
        "FM",
        "FL",
        "GA",
        "GU",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MH",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "MP",
        "OH",
        "OK",
        "OR",
        "PW",
        "PA",
        "PR",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VI",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY",
      ],
      { message: "State must be valid" }
    ),
    addressZip: z
      .string()
      .min(5, { message: "Zip code must be valid" })
      .max(5, { message: "Zip code must be valid" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
function SignUp() {
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
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      addressStreet: "",
      addressCity: "",
      addressZip: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      // Assuming an async registration function
      const data = {
        password: values.password,
        passwordConfirm: values.confirmPassword,
        email: values.email,
        emailVisibility: true,
        verified: false,
        name: values.name,
        phone: values.phone,
        addressStreet: values.addressStreet,
        addressCity: values.addressCity,
        addressState: values.addressState,
        addressZip: values.addressZip,
      };
      await pb.collection("users").create(data);
      await pb.collection("users").authWithPassword(data.email, data.password);
      toast.success("Sign up successful!");
      window.location.href = "/auth/verify";
      setIsLoading(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to sign up. Please try again.");
      setIsLoading(false);
    }
  }
  return (
    <div>
      <section className="flex flex-col items-center justify-center pt-2 md:pt-16">
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
            <p className="mb-2 text-2xl font-bold">Welcome!</p>
            <p className="text-muted-foreground">Please sign up to continue.</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="name">Full Name</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
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

                {/* Phone Field */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="phone">Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          {...field}
                          international={true}
                          defaultCountry="US"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 w-full justify-between">
                  {/* Address Street Field */}
                  <FormField
                    control={form.control}
                    name="addressStreet"
                    render={({ field }) => (
                      <FormItem className="grid gap-2 grow">
                        <FormLabel htmlFor="addressStreet">
                          Street Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="addressStreet"
                            placeholder="1234 Main St"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address City Field */}
                  <FormField
                    control={form.control}
                    name="addressCity"
                    render={({ field }) => (
                      <FormItem className="grid gap-2 grow">
                        <FormLabel htmlFor="addressCity">City</FormLabel>
                        <FormControl>
                          <Input
                            id="addressCity"
                            placeholder="City"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4 w-full justify-between">
                  {/* Address State Field */}
                  <FormField
                    control={form.control}
                    name="addressState"
                    render={({ field }) => (
                      <FormItem className="grid gap-2 grow">
                        <FormLabel>State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a US State" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AL">Alabama</SelectItem>
                            <SelectItem value="AK">Alaska</SelectItem>
                            <SelectItem value="AS">American Samoa</SelectItem>
                            <SelectItem value="AZ">Arizona</SelectItem>
                            <SelectItem value="AR">Arkansas</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="CO">Colorado</SelectItem>
                            <SelectItem value="CT">Connecticut</SelectItem>
                            <SelectItem value="DE">Delaware</SelectItem>
                            <SelectItem value="DC">
                              District of Columbia
                            </SelectItem>
                            <SelectItem value="FM">
                              Federated States of Micronesia
                            </SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="GA">Georgia</SelectItem>
                            <SelectItem value="GU">Guam</SelectItem>
                            <SelectItem value="HI">Hawaii</SelectItem>
                            <SelectItem value="ID">Idaho</SelectItem>
                            <SelectItem value="IL">Illinois</SelectItem>
                            <SelectItem value="IN">Indiana</SelectItem>
                            <SelectItem value="IA">Iowa</SelectItem>
                            <SelectItem value="KS">Kansas</SelectItem>
                            <SelectItem value="KY">Kentucky</SelectItem>
                            <SelectItem value="LA">Louisiana</SelectItem>
                            <SelectItem value="ME">Maine</SelectItem>
                            <SelectItem value="MH">Marshall Islands</SelectItem>
                            <SelectItem value="MD">Maryland</SelectItem>
                            <SelectItem value="MA">Massachusetts</SelectItem>
                            <SelectItem value="MI">Michigan</SelectItem>
                            <SelectItem value="MN">Minnesota</SelectItem>
                            <SelectItem value="MS">Mississippi</SelectItem>
                            <SelectItem value="MO">Missouri</SelectItem>
                            <SelectItem value="MT">Montana</SelectItem>
                            <SelectItem value="NE">Nebraska</SelectItem>
                            <SelectItem value="NV">Nevada</SelectItem>
                            <SelectItem value="NH">New Hampshire</SelectItem>
                            <SelectItem value="NJ">New Jersey</SelectItem>
                            <SelectItem value="NM">New Mexico</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="NC">North Carolina</SelectItem>
                            <SelectItem value="ND">North Dakota</SelectItem>
                            <SelectItem value="MP">
                              Northern Mariana Islands
                            </SelectItem>
                            <SelectItem value="OH">Ohio</SelectItem>
                            <SelectItem value="OK">Oklahoma</SelectItem>
                            <SelectItem value="OR">Oregon</SelectItem>
                            <SelectItem value="PW">Palau</SelectItem>
                            <SelectItem value="PA">Pennsylvania</SelectItem>
                            <SelectItem value="PR">Puerto Rico</SelectItem>
                            <SelectItem value="RI">Rhode Island</SelectItem>
                            <SelectItem value="SC">South Carolina</SelectItem>
                            <SelectItem value="SD">South Dakota</SelectItem>
                            <SelectItem value="TN">Tennessee</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="UT">Utah</SelectItem>
                            <SelectItem value="VT">Vermont</SelectItem>
                            <SelectItem value="VI">Virgin Islands</SelectItem>
                            <SelectItem value="VA">Virginia</SelectItem>
                            <SelectItem value="WA">Washington</SelectItem>
                            <SelectItem value="WV">West Virginia</SelectItem>
                            <SelectItem value="WI">Wisconsin</SelectItem>
                            <SelectItem value="WY">Wyoming</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address Zip Code Field */}
                  <FormField
                    control={form.control}
                    name="addressZip"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="addressZip">Zip Code</FormLabel>
                        <FormControl>
                          <Input
                            id="addressZip"
                            placeholder="12345"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-4 w-full justify-between">
                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="******"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password Field */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="confirmPassword">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="confirmPassword"
                            placeholder="******"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Sign Up"}
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
                    } catch (error: unknown) {
                      console.error("Google OAuth error", error);
                      localStorage.removeItem("google");
                      toast.error(
                        "Failed to sign up with Google. Please try again."
                      );
                    }
                  }}
                >
                  <FcGoogle className="mr-2 size-5" />
                  Sign Up with Google
                </Button>
              </div>
            </form>
          </Form>
          <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
            <p>Already have an account?</p>
            <Link href={"/auth/login"} className="font-medium text-primary">
              Log In!
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignUp;

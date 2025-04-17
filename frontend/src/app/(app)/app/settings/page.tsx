"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/phone-input";
import pocketbase, {
  getCurrentUser,
  isLoggedIn,
  isVerified,
  logout,
} from "@/lib/pocketbase";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecordModel } from "pocketbase";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoadingSpinner from "@/components/loading-spinner";
import { LockIcon, MailIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
const pb = pocketbase;
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  phone: z.string().min(10, { message: "Phone number must be valid" }),
  addressStreet: z.string().min(5, { message: "Address must be valid" }),
  addressCity: z.string().min(2, { message: "City must be valid" }),
  addressState: z
    .string()
    .min(2, { message: "State must be valid" })
    .max(2, { message: "State must be valid" }),
  addressZip: z
    .string()
    .min(5, { message: "Zip code must be valid" })
    .max(5, { message: "Zip code must be valid" }),
});
const emailSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email.")
    .min(1, { message: "Please enter an email." }),
});
function Settings() {
  const [user, setUser] = useState<RecordModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailCredenzaOpen, setEmailCredenzaOpen] = useState(false);
  const [passwordCredenzaOpen, setPasswordCredenzaOpen] = useState(false);
  const searchParams = useSearchParams();
  const isSetup = searchParams.get("setup");
  if (isSetup) {
    toast.warning("Please complete your profile to continue.", {
      id: "setup-warning",
      dismissible: false,
      description:
        "You must add your phone number and address details to your profile to continue using InviStar.",
      closeButton: false,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
      },
      duration: 10000,
    });
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
      phone: user?.phone,
      addressStreet: user?.addressStreet,
      addressCity: user?.addressCity,
      addressState: user?.addressState,
      addressZip: user?.addressZip,
    },
  });
  useEffect(() => {
    if (isLoggedIn()) {
      (async () => {
        const verified = await isVerified();
        if (!verified) {
          window.location.href = "/auth/verify";
          setIsLoading(false);
        } else {
          const user = await getCurrentUser();
          setUser(user);
          form.setValue("name", user?.name);
          form.setValue("phone", user?.phone);
          form.setValue("addressStreet", user?.addressStreet);
          form.setValue("addressCity", user?.addressCity);
          form.setValue("addressState", user?.addressState);
          form.setValue("addressZip", user?.addressZip);
          setIsLoading(false);
        }
      })();
    }
  }, [form]);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const nameChanged = user?.name !== values.name;
      const phoneChanged = user?.phone !== values.phone;
      const addressStreetChanged = user?.addressStreet !== values.addressStreet;
      const addressCityChanged = user?.addressCity !== values.addressCity;
      const addressStateChanged = user?.addressState !== values.addressState;
      const addressZipChanged = user?.addressZip !== values.addressZip;
      if (user) {
        const batch = await pb.createBatch();
        if (nameChanged) {
          await batch
            .collection("users")
            .update(user.id, { name: values.name });
        }
        if (phoneChanged) {
          await batch
            .collection("users")
            .update(user.id, { phone: values.phone });
        }
        if (addressStreetChanged) {
          await batch.collection("users").update(user.id, {
            addressStreet: values.addressStreet,
          });
        }
        if (addressCityChanged) {
          await batch
            .collection("users")
            .update(user.id, { addressCity: values.addressCity });
        }
        if (addressStateChanged) {
          await batch
            .collection("users")
            .update(user.id, { addressState: values.addressState });
        }
        if (addressZipChanged) {
          await batch
            .collection("users")
            .update(user.id, { addressZip: values.addressZip });
        }
        await batch.send();
      }
      toast.success("Saved Successfully!");
      toast.dismiss("setup-warning");

      // Redirect to dashboard if in setup mode
      if (isSetup) {
        window.location.href = "/app/dashboard";
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to save changes. Please try again.");
      setIsLoading(false);
    }
  }

  async function onEmailChangeSubmit(values: z.infer<typeof emailSchema>) {
    try {
      setIsLoading(true);
      if (user) {
        await pb.collection("users").requestEmailChange(values.email);
      }
      toast.success("Changed Successfully!");
      await logout();
      window.location.href = "/auth/login";
      setIsLoading(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to save changes. Please try again.");
      setIsLoading(false);
    }
  }

  async function resetPassword() {
    try {
      setIsLoading(true);
      if (user) {
        await pb.collection("users").requestPasswordReset(user.email);
      }
      toast.success("Password reset email sent!");
      await logout();
      window.location.href = "/auth/login";
      setIsLoading(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to send password reset email. Please try again.");
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="w-[100%] h-[100%] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Card className="flex items-center justify-center py-2 md:py-16">
        <CardHeader className="text-2xl font-bold pt-6 text-center">
          Settings
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="mx-auto w-full rounded-md p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-4">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="name">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            defaultValue={user?.name}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {localStorage.getItem("google") ? (
                    <p className="text-muted-foreground">
                      Whoops! It looks like you signed up with Google. You
                      can&apos;t change your email or password.
                    </p>
                  ) : (
                    <div className="flex gap-4">
                      <Button
                        variant={"secondary"}
                        className="w-full"
                        type="button"
                        onClick={() => {
                          setEmailCredenzaOpen(true);
                        }}
                      >
                        <MailIcon className="w-6 h-6" />
                        Change Email
                      </Button>
                      <Credenza
                        open={emailCredenzaOpen}
                        onOpenChange={setEmailCredenzaOpen}
                      >
                        <CredenzaContent>
                          <CredenzaHeader>
                            <CredenzaTitle>Change Email</CredenzaTitle>
                            <CredenzaDescription>
                              Change the email associated with tour InviStar
                              account.
                            </CredenzaDescription>
                          </CredenzaHeader>
                          <CredenzaBody>
                            <Form {...emailForm}>
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  emailForm.handleSubmit(onEmailChangeSubmit)(
                                    e
                                  );
                                }}
                                className="space-y-8"
                              >
                                <FormField
                                  control={emailForm.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>New Email:</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="jdoe@mail.com"
                                          type="email"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        REMINDER: You will have to verify the
                                        new email.
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button type="submit" className="w-full">
                                  Change
                                </Button>
                              </form>
                            </Form>
                          </CredenzaBody>
                          <CredenzaFooter>
                            <CredenzaClose asChild>
                              <Button className="w-full" variant={"secondary"}>
                                Cancel
                              </Button>
                            </CredenzaClose>
                          </CredenzaFooter>
                        </CredenzaContent>
                      </Credenza>
                      <Button
                        variant={"secondary"}
                        className="w-full"
                        type="button"
                        onClick={() => {
                          setPasswordCredenzaOpen(true);
                        }}
                      >
                        <LockIcon className="w-6 h-6" />
                        Change Password
                      </Button>
                      <Credenza
                        open={passwordCredenzaOpen}
                        onOpenChange={setPasswordCredenzaOpen}
                      >
                        <CredenzaContent>
                          <CredenzaHeader>
                            <CredenzaTitle>Change Password</CredenzaTitle>
                            <CredenzaDescription>
                              Change the password associated with tour InviStar
                              account. You will recieve an email with a link to
                              reset your password.
                            </CredenzaDescription>
                          </CredenzaHeader>
                          <CredenzaBody>
                            <Button onClick={resetPassword} className="w-full">
                              Confirm
                            </Button>
                          </CredenzaBody>
                          <CredenzaFooter>
                            <CredenzaClose asChild>
                              <Button className="w-full" variant={"secondary"}>
                                Cancel
                              </Button>
                            </CredenzaClose>
                          </CredenzaFooter>
                        </CredenzaContent>
                      </Credenza>
                    </div>
                  )}

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
                            defaultValue={user?.phone}
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
                              defaultValue={user?.addressStreet}
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
                              defaultValue={user?.addressCity}
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
                            onValueChange={(value) => {
                              form.setValue("addressState", value);
                            }}
                            defaultValue={user?.addressState}
                            {...field}
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
                              <SelectItem value="MH">
                                Marshall Islands
                              </SelectItem>
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
                              defaultValue={user?.addressZip}
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
                    {isLoading ? "Loading..." : "Save"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default Settings;

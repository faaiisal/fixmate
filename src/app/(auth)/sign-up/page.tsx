"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/validations/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { CardContainer } from "@/components/ui/card-container";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wand2, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword?: string;
  terms: boolean;
};

function generateStrongPassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let pwd = "Aa1!";
  for (let i = 0; i < 8; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  return pwd.split("").sort(() => 0.5 - Math.random()).join("").slice(0, 12);
}

export default function SignUpPage() {
  const [role, setRole] = useState<"customer" | "technician" | "admin">("customer");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "", terms: false },
  });

  const passwordValue = useWatch({ control: form.control, name: "password" }) || "";

  const getStrength = (pwd: string) => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };
  const strength = getStrength(passwordValue as string);

  const handleGenerate = () => {
    const newPwd = generateStrongPassword();
    form.setValue("password", newPwd, { shouldValidate: true });
    form.setValue("confirmPassword", newPwd, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const res = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role,
        callbackURL: "/",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      if (res.error) {
        toast.error(res.error.message || "Sign up failed");
        return;
      }

      toast.success("Account created! Redirecting...");
      if (role === "technician") router.push("/dashboard/technician");
      else if (role === "admin") router.push("/dashboard/admin");
      else router.push("/dashboard/customer");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocial = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social({ provider, callbackURL: "/" });
    } catch {
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  return (
    <CardContainer className="w-full max-w-[560px] p-0 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-[#F26A36] to-[#E05824]" />
      <div className="p-8">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-xl">Create FixMate Identity</h1>
          <p className="text-xs font-mono text-[#8C9098]">VERIFIED IDENTITY // ESCROW NODE</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => handleSocial("google")} disabled={isLoading}>
            Continue with Google
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSocial("github")} disabled={isLoading}>
            Continue with Github
          </Button>
        </div>

        <div className="my-4 relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E0DF]" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-2 text-[10px] font-mono text-[#8C9098]">ROLE SELECTOR</span></div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { id: "customer", label: "Customer", desc: "Request repairs" },
            { id: "technician", label: "Technician", desc: "Provide service" },
            { id: "admin", label: "Admin", desc: "Manage platform" },
          ].map((r) => (
            <button key={r.id} type="button" onClick={() => setRole(r.id as typeof role)} className={`p-3 rounded-xl border text-left ${role === r.id ? "bg-[#FFF1EC] border-[#FFD6C2] text-[#F26A36]" : "bg-white border-[#E5E0DF]"}`}>
              <div className="text-sm font-medium">{r.label}</div>
              <div className="text-[11px] text-[#8C9098]">{r.desc}</div>
            </button>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-mono">LEGAL IDENTITY // FULL NAME</FormLabel>
                <FormControl><Input placeholder="Alex Chen" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-mono">CONTACT NODE // EMAIL • OTP SECURED</FormLabel>
                <FormControl><Input placeholder="alex@fixmate.io" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-mono">DISPATCH CHANNEL // PHONE • SMS ALERTS</FormLabel>
                <FormControl><Input placeholder="+1 (555) 000-0000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-[11px] font-mono">SECURITY KEY // PASSWORD</FormLabel>
                  <button type="button" onClick={handleGenerate} className="text-[10px] font-mono text-[#F26A36] hover:underline flex items-center gap-1">
                    <Wand2 className="w-3 h-3" /> Generate
                  </button>
                </div>
                <FormControl><PasswordInput placeholder="At least 8 characters" {...field} /></FormControl>
                <div className="mt-2 grid grid-cols-4 gap-1">
                  <div className={`h-1 rounded-full ${strength >= 1 ? "bg-[#F26A36]" : "bg-[#E5E0DF]"}`} />
                  <div className={`h-1 rounded-full ${strength >= 2 ? "bg-[#F26A36]" : "bg-[#E5E0DF]"}`} />
                  <div className={`h-1 rounded-full ${strength >= 3 ? "bg-[#F26A36]" : "bg-[#E5E0DF]"}`} />
                  <div className={`h-1 rounded-full ${strength >= 4 ? "bg-[#10B981]" : "bg-[#E5E0DF]"}`} />
                </div>
                <p className="text-[10px] font-mono text-[#8C9098] mt-1">
                  {strength === 0 && "Enter password"}
                  {strength === 1 && "Weak • Add uppercase & number"}
                  {strength === 2 && "Fair • Add symbol"}
                  {strength === 3 && "Good • Add special char"}
                  {strength === 4 && "Strong • 12 chars with symbol"}
                </p>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-mono">CONFIRM KEY // RE-ENTER</FormLabel>
                <FormControl><PasswordInput placeholder="Re-enter at least 8 characters" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="terms" render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-2">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} id="terms" /></FormControl>
                  <FormLabel htmlFor="terms" className="text-xs text-[#55595F] font-normal">I agree to <Link href="#" className="underline">Escrow Terms</Link>, <Link href="#" className="underline">ISO-9001</Link>, <Link href="#" className="underline">Privacy</Link></FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" disabled={isLoading} className="w-full bg-[#F26A36] hover:bg-[#E05824] h-11">
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : "Create Identity & Secure Escrow →"}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-xs text-[#8C9098]">
          Already have node? <Link href="/sign-in" className="text-[#F26A36]">Authenticate</Link>
        </p>
      </div>
    </CardContainer>
  );
}

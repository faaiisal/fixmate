"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/validations/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wand2, Loader2, Badge as BadgeIcon, Mail, Phone, ShieldCheck } from "lucide-react";
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

type Role = "customer" | "technician" | "admin";

const roleOptions: { id: Role; label: string; desc: string; icon: string }[] = [
  { id: "customer", label: "Customer", desc: "Book diagnostics, monitor live precision dispatches, and enjoy automated escrow protection.", icon: "👤" },
  { id: "technician", label: "Technician", desc: "Receive field dispatches, benchmark diagnostics equipment, and withdraw weekly guaranteed earnings.", icon: "🔧" },
  { id: "admin", label: "Admin", desc: "Manage platform, SLA governance, centralized billing, and enterprise security.", icon: "🏢" },
];

function generateStrongPassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let pwd = "Aa1!";
  for (let i = 0; i < 8; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  return pwd.split("").sort(() => 0.5 - Math.random()).join("").slice(0, 12);
}

export default function SignUpPage() {
  const [role, setRole] = useState<Role>("customer");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "", terms: false },
  });

  const passwordValue = useWatch({ control: form.control, name: "password" }) || "";

  // Strength logic matching reference: Min 6 chars, upper, lower, number/symbol
  const hasLength = passwordValue.length >= 6;
  const hasUpper = /[A-Z]/.test(passwordValue);
  const hasLower = /[a-z]/.test(passwordValue);
  const hasSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(passwordValue);
  const score = [hasLength, hasUpper, hasLower, hasSymbol].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!passwordValue) return "STRENGTH: NONE";
    if (score <= 2) return "STRENGTH: LOW";
    if (score === 3) return "STRENGTH: MEDIUM";
    return "STRENGTH: EXCELLENT";
  };

  const getRailWidth = () => {
    if (score === 0) return "0%";
    if (score <= 2) return "35%";
    if (score === 3) return "70%";
    return "100%";
  };

  const getRailColor = () => {
    if (score <= 2) return "bg-[#ba1a1a]";
    if (score === 3) return "bg-[#f59e0b]";
    return "bg-[#00BA7C]";
  };

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
      toast.error(err instanceof Error ? err.message : "Something went wrong");
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

  const selectedRoleDesc = roleOptions.find((r) => r.id === role)?.desc || "";

  return (
    <div className="w-full max-w-[560px] mx-auto">
      <div className="relative bg-white rounded-2xl p-6 sm:p-9 border border-[#E7E7E9] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCF9F8] border border-[#E7E7E9] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00BA7C] animate-pulse" />
            <span className="font-mono text-[11px] tracking-wide text-[#6c6764] uppercase font-medium">Verified Identity Access // v2.0</span>
          </div>
          <h1 className="font-heading text-[28px] sm:text-[32px] tracking-tight font-bold">Create Your Account</h1>
          <p className="text-[14px] text-[#6c6764] max-w-sm">Join the verified platform for precision appliance & device engineering.</p>
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="outline" size="lg" className="h-11 rounded-xl border-[#E7E7E9] bg-white hover:bg-[#F9F7F6] text-[13px] font-medium" onClick={() => handleSocial("google")} disabled={isLoading}>
            <span className="mr-2">G</span> Google
          </Button>
          <Button variant="outline" size="lg" className="h-11 rounded-xl border-[#E7E7E9] bg-white hover:bg-[#F9F7F6] text-[13px] font-medium" onClick={() => handleSocial("github")} disabled={isLoading}>
            Github
          </Button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="w-full h-px bg-[#E7E7E9]" />
          <span className="absolute px-3 bg-white font-mono text-[10px] tracking-wider text-[#6c6764] uppercase">or continue with email</span>
        </div>

        {/* Role Selector */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="font-mono text-[11px] font-semibold text-[#6c6764] uppercase tracking-wider">Account Role</label>
            <span className="font-mono text-[11px] text-[#00BA7C] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> ESCROW ACTIVE
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F4F2F1] rounded-xl border border-[#E7E7E9]">
            {roleOptions.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  role === r.id
                    ? "bg-white text-[#1c1b1b] border border-[#E7E7E9] shadow-xs"
                    : "text-[#6c6764] hover:text-[#1c1b1b] border border-transparent"
                }`}
              >
                <span className={role === r.id ? "text-[#F26A36]" : ""}>{r.icon}</span>
                {r.label}
              </button>
            ))}
          </div>
          <p className="text-[12px] text-[#6c6764] mt-2 px-1">{selectedRoleDesc}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold flex items-center justify-between">
                    <span>Full Name</span>
                    <span className="font-mono text-[11px] text-[#6c6764] font-normal">Legal identity</span>
                  </FormLabel>
                  <div className="relative">
                    <BadgeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#6c6764]" />
                    <FormControl>
                      <Input className="pl-10 h-11 rounded-xl border-[#E2E0E6] focus:border-[#F26A36] focus:ring-2 focus:ring-[#F26A36]/15" placeholder="Alex Vance" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold flex items-center justify-between">
                    <span>Work or Personal Email</span>
                    <span className="font-mono text-[11px] text-[#00BA7C] font-medium">OTP SECURED</span>
                  </FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#6c6764]" />
                    <FormControl>
                      <Input className="pl-10 h-11 rounded-xl border-[#E2E0E6] focus:border-[#F26A36] focus:ring-2 focus:ring-[#F26A36]/15" placeholder="alex.vance@precision.io" type="email" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold flex items-center justify-between">
                    <span>Mobile Phone Number</span>
                    <span className="font-mono text-[11px] text-[#6c6764] font-normal">Dispatch SMS updates</span>
                  </FormLabel>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#6c6764]" />
                    <FormControl>
                      <Input className="pl-10 h-11 rounded-xl border-[#E2E0E6]" placeholder="+1 (555) 349-2810" type="tel" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-[13px] font-semibold">Security Password</FormLabel>
                    <span className="font-mono text-[11px] font-medium" style={{ color: score === 0 ? "#6c6764" : score <= 2 ? "#ba1a1a" : score === 3 ? "#d97706" : "#00BA7C" }}>{getStrengthLabel()}</span>
                  </div>
                  <div className="relative">
                    <FormControl>
                      <PasswordInput placeholder="••••••••••••" {...field} />
                    </FormControl>
                    <button type="button" onClick={handleGenerate} className="absolute -top-8 right-0 text-[10px] font-mono text-[#F26A36] hover:underline flex items-center gap-1">
                      <Wand2 className="w-3 h-3" /> Generate
                    </button>
                  </div>
                  <div className="w-full h-1 bg-[#E7E7E9] rounded-full overflow-hidden mt-1 flex">
                    <div className={`h-full ${getRailColor()} transition-all duration-300`} style={{ width: getRailWidth() }} />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-1.5 p-2.5 bg-[#F9F7F6] border border-[#E7E7E9] rounded-lg">
                    {[
                      { valid: hasLength, label: "Min 6 characters" },
                      { valid: hasUpper, label: "One uppercase letter" },
                      { valid: hasLower, label: "One lowercase letter" },
                      { valid: hasSymbol, label: "Number or symbol" },
                    ].map((req) => (
                      <div key={req.label} className={`flex items-center gap-1.5 font-mono text-[11px] ${req.valid ? "text-[#00BA7C]" : "text-[#6c6764]"}`}>
                        <span className="text-[13px]">{req.valid ? "✅" : "○"}</span>
                        {req.label}
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold">Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Re-enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-2.5 mt-1">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} id="terms" className="mt-0.5" />
                    </FormControl>
                    <FormLabel htmlFor="terms" className="text-[12px] text-[#6c6764] leading-relaxed font-normal">
                      I agree to FixMate <Link href="#" className="font-medium underline text-[#1c1b1b] hover:text-[#F26A36]">Escrow Terms</Link>, <Link href="#" className="font-medium underline text-[#1c1b1b] hover:text-[#F26A36]">ISO-9001 Protocol</Link>, and <Link href="#" className="font-medium underline text-[#1c1b1b] hover:text-[#F26A36]">Privacy Policy</Link>.
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="mt-2 w-full h-12 rounded-xl bg-[#F26A36] hover:bg-[#e05824] text-white font-semibold text-[15px] tracking-tight flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(242,106,54,0.35)]">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  Create Account & Activate Node <span>→</span>
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="flex items-center justify-center gap-1.5 text-center mt-6 pt-5 border-t border-[#E7E7E9]">
          <span className="text-[13px] text-[#6c6764]">Already have a verified account?</span>
          <Link href="/sign-in" className="text-[13px] font-semibold text-[#F26A36] hover:text-[#e05824] inline-flex items-center gap-0.5">
            Sign In <span>›</span>
          </Link>
        </div>
      </div>

      <div className="mt-5 p-3 rounded-xl bg-white/70 backdrop-blur-md border border-[#E7E7E9] flex flex-wrap items-center justify-around gap-2 shadow-xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E6F9F2] text-[#00BA7C]">🛡️</span> Escrow Protected
        </div>
        <div className="w-1 h-1 rounded-full bg-[#D5D1CC] hidden sm:block" />
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E6F9F2] text-[#00BA7C]">✅</span> ISO-9001 Certified
        </div>
        <div className="w-1 h-1 rounded-full bg-[#D5D1CC] hidden sm:block" />
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E6F9F2] text-[#00BA7C]">🔒</span> SOC-2 Type II Verified
        </div>
      </div>
    </div>
  );
}

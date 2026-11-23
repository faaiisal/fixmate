"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { CardContainer } from "@/components/ui/card-container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, ShieldCheck, ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "Password must contain letter and number"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Read token from URL according to BetterAuth actual redirect behavior
  // BetterAuth redirects /reset-password/:token?callbackURL=/reset-password -> /reset-password?token=VALID_TOKEN
  // Or /reset-password?error=INVALID_TOKEN if invalid/expired
  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  // Handle invalid or expired token states
  const isInvalidToken = errorParam === "INVALID_TOKEN";
  const isMissingToken = !token && !errorParam && !isSuccess;

  useEffect(() => {
    if (isInvalidToken) {
      toast.error("Invalid or expired reset link");
    }
  }, [isInvalidToken]);

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      toast.error("Invalid reset token. Please request a new link.");
      return;
    }

    setIsLoading(true);
    try {
      // Use Better Auth official client method - exact name verified against installed version
      // Endpoint: POST /reset-password with newPassword and token (from query or body)
      const res = await authClient.resetPassword({
        newPassword: data.newPassword,
        token: token,
      });

      if ((res as any)?.error) {
        const errMsg = (res as any).error.message || "Failed to reset password";
        // Handle expired, invalid, reused tokens - Better Auth rejects them
        if (errMsg.toLowerCase().includes("invalid") || errMsg.toLowerCase().includes("expired")) {
          toast.error("Invalid or expired reset link. Please request a new one.");
        } else {
          toast.error(errMsg);
        }
        return;
      }

      setIsSuccess(true);
      toast.success("Password reset successful! You can now sign in with your new password.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      // Check for token-related errors
      if (message.toLowerCase().includes("invalid") || message.toLowerCase().includes("expired")) {
        toast.error("Invalid or expired reset link. Please request a new one.");
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] mx-auto">
      <CardContainer className="p-0 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#F26A36] to-[#E05824]" />
        <div className="p-8">
          <Link href="/sign-in" className="inline-flex items-center gap-1 text-xs text-[#6c6764] hover:text-[#F26A36] mb-6">
            <ArrowLeft className="w-3 h-3" />
            Back to Sign In
          </Link>

          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#F6F3F2] border border-[#E5E0DF] flex items-center justify-center">
              🔧
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg">Reset Password Protocol</h1>
              <p className="text-[10px] font-mono text-[#8C9098]">SECURE NODE RECOVERY // TLS 1.3</p>
            </div>
          </div>

          {isInvalidToken ? (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center mx-auto text-xl">
                <AlertTriangle className="w-6 h-6 text-[#DC2626]" />
              </div>
              <div className="text-center">
                <h3 className="font-heading font-bold text-lg">Invalid or expired link</h3>
                <p className="text-[13px] text-[#6c6764] mt-2">
                  This password reset link is invalid, expired, or has already been used. Reset tokens expire in 1 hour and can only be used once.
                </p>
              </div>
              <div className="space-y-2">
                <Button className="w-full bg-[#F26A36] hover:bg-[#E05824] h-11" asChild>
                  <Link href="/forgot-password">Request New Reset Link →</Link>
                </Button>
                <Button variant="outline" className="w-full h-11 border-[#E7E7E9]" asChild>
                  <Link href="/sign-in">Back to Sign In</Link>
                </Button>
              </div>
            </div>
          ) : isMissingToken ? (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center mx-auto text-xl">
                <AlertTriangle className="w-6 h-6 text-[#DC2626]" />
              </div>
              <div className="text-center">
                <h3 className="font-heading font-bold text-lg">Missing reset token</h3>
                <p className="text-[13px] text-[#6c6764] mt-2">
                  No reset token found in URL. Please use the link from your email or request a new reset link.
                </p>
              </div>
              <Button className="w-full bg-[#F26A36] hover:bg-[#E05824] h-11" asChild>
                <Link href="/forgot-password">Request Reset Link</Link>
              </Button>
            </div>
          ) : isSuccess ? (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#E6F9F2] border border-[#A7F3D0] flex items-center justify-center mx-auto text-xl">
                <CheckCircle className="w-6 h-6 text-[#00BA7C]" />
              </div>
              <div className="text-center">
                <h3 className="font-heading font-bold text-lg">Password reset successful</h3>
                <p className="text-[13px] text-[#6c6764] mt-2">
                  Your password has been reset. You can now sign in with your new password. Your role remains unchanged.
                </p>
                <p className="text-[11px] font-mono text-[#8C9098] mt-3 bg-[#F9F7F6] border border-[#E7E7E9] rounded-lg p-3 text-left">
                  • Old password no longer works
                  <br />• Existing Admin account preserved
                  <br />• Sessions remain valid per BetterAuth
                </p>
              </div>
              <Button className="w-full bg-[#F26A36] hover:bg-[#E05824] h-11" asChild>
                <Link href="/sign-in">Sign In with New Password →</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="font-heading text-[20px] font-bold tracking-tight">Set new password</h2>
                <p className="text-[13px] text-[#6c6764] mt-1">Enter your new password. Must be at least 8 characters with letter and number.</p>
                <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-[#6c6764] bg-[#F9F7F6] border border-[#E7E7E9] rounded-lg p-3">
                  <ShieldCheck className="w-4 h-4 text-[#00BA7C] flex-shrink-0" />
                  <span>Token expires in 1 hour and can only be used once. Existing role preserved.</span>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-mono">NEW ACCESS_KEY // PASSWORD</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="At least 8 chars, letter + number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-mono">CONFIRM ACCESS_KEY</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="Re-enter new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} className="w-full bg-[#F26A36] hover:bg-[#E05824] h-11">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resetting...
                      </>
                    ) : (
                      "Reset Password →"
                    )}
                  </Button>
                </form>
              </Form>
            </>
          )}

          <div className="mt-6 flex justify-center gap-2">
            <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]">Escrow Secured</span>
            <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]">FixMate v2.0</span>
          </div>
        </div>
      </CardContainer>
    </div>
  );
}

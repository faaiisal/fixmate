"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContainer } from "@/components/ui/card-container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      // Use Better Auth official method - verify exact name against installed version
      // Endpoint: POST /request-password-reset with email and redirectTo
      const res = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: "/reset-password",
      });

      // Better Auth returns generic success even if email not found to avoid revealing existence
      if ((res as any)?.error) {
        // Do not reveal whether email exists - still show generic success
        // But log error for debugging without exposing sensitive info
        console.error("Password reset request error (non-sensitive)");
      }

      setIsSuccess(true);
      toast.success("If an account exists, reset link sent");
    } catch (err: unknown) {
      // Generic success message even on error to avoid revealing email existence
      // Log non-sensitive error
      console.error("Forgot password error");
      setIsSuccess(true);
      toast.success("If an account exists, reset link sent");
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

          {!isSuccess ? (
            <>
              <div className="mb-6">
                <h2 className="font-heading text-[20px] font-bold tracking-tight">Forgot password?</h2>
                <p className="text-[13px] text-[#6c6764] mt-1">
                  Enter your email and we will send you a secure reset link.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-mono">NODE_ID // EMAIL</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#6c6764]" />
                            <Input className="pl-10 h-11 rounded-xl border-[#E2E0E6]" placeholder="alex.chen@fixmate.io" type="email" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} className="w-full bg-[#F26A36] hover:bg-[#E05824] h-11">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending reset link...
                      </>
                    ) : (
                      "Send Reset Link →"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-[#6c6764] bg-[#F9F7F6] border border-[#E7E7E9] rounded-lg p-3">
                <ShieldCheck className="w-4 h-4 text-[#00BA7C] flex-shrink-0" />
                <span>For security, we use generic response. If account exists, you will receive email shortly.</span>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#E6F9F2] border border-[#A7F3D0] flex items-center justify-center mx-auto text-xl">
                ✉️
              </div>
              <div className="text-center">
                <h3 className="font-heading font-bold text-lg">Check your email</h3>
                <p className="text-[13px] text-[#6c6764] mt-2 leading-relaxed">
                  If an account exists with this email address, you will receive a password reset link shortly.
                </p>
                <p className="text-[11px] font-mono text-[#8C9098] mt-3 bg-[#F9F7F6] border border-[#E7E7E9] rounded-lg p-3 text-left">
                  • Link expires in 1 hour
                  <br />• If you did not request a reset, you can safely ignore this email
                  <br />• Check spam folder if not received
                </p>
              </div>
              <Button variant="outline" className="w-full rounded-xl h-11 border-[#E7E7E9]" asChild>
                <Link href="/sign-in">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Link>
              </Button>
            </div>
          )}

          <div className="mt-6 flex justify-center gap-2">
            <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]">
              Escrow Secured
            </span>
            <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]">
              FixMate v2.0
            </span>
          </div>
        </div>
      </CardContainer>
    </div>
  );
}

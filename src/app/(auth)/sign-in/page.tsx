"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInInput } from "@/lib/validations/auth.schema";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true);
    try {
      const res = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.remember,
        callbackURL: "/",
      });

      if (res.error) {
        toast.error(res.error.message || "Sign in failed");
        return;
      }

      toast.success("Authenticated! Redirecting...");
      router.push("/dashboard/customer");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
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
    <CardContainer className="w-full max-w-[460px] p-0 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-[#F26A36] to-[#E05824]" />
      <div className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#F6F3F2] border border-[#E5E0DF] flex items-center justify-center">
            🔧
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg">Access Protocol</h1>
            <p className="text-[10px] font-mono text-[#8C9098]">
              SECURE NODE AUTH // TLS 1.3
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-mono">
                    NODE_ID // EMAIL
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="alex.chen@fixmate.io" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-mono">
                    ACCESS_KEY // PASSWORD
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="At least 8 characters"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="remember"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="remember"
                      className="text-xs font-normal"
                    >
                      Remember node
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Link href="#" className="text-xs text-[#F26A36]">
                Forgot key?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F26A36] hover:bg-[#E05824] h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Authenticating...
                </>
              ) : (
                "Authenticate →"
              )}
            </Button>
          </form>
        </Form>

        <div className="my-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E0DF]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-[10px] font-mono text-[#8C9098]">
              OR HARDWARE & SSO
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => handleSocial("google")}
            disabled={isLoading}
          >
            Google
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => handleSocial("github")}
            disabled={isLoading}
          >
            Github
          </Button>
          <Button variant="outline" size="sm" className="rounded-full" disabled>
            Passkey
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-[#8C9098]">
          No node?{" "}
          <Link href="/sign-up" className="text-[#F26A36] font-medium">
            Create identity
          </Link>
        </p>

        <div className="mt-6 flex justify-center gap-2">
          <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]">
            Escrow Secured
          </span>
          <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]">
            ISO-9001
          </span>
          <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]">
            SOC-2
          </span>
        </div>
      </div>
    </CardContainer>
  );
}

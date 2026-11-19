"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/validations/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContainer } from "@/components/ui/card-container";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState } from "react";

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  terms: boolean;
};

export default function SignUpPage() {
  const [role, setRole] = useState<"customer" | "technician" | "corporate">("customer");

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(signUpSchema as any) as any,
    defaultValues: { name: "", email: "", phone: "", password: "", terms: false },
  });

  const onSubmit = (data: FormValues) => {
    console.log({ ...data, role });
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
          <Button variant="outline" size="sm">Continue with Google</Button>
          <Button variant="outline" size="sm">Continue with Apple</Button>
        </div>

        <div className="my-4 relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E0DF]" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-2 text-[10px] font-mono text-[#8C9098]">ROLE SELECTOR</span></div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { id: "customer", label: "Customer", desc: "Request repairs" },
            { id: "technician", label: "Technician", desc: "Provide service" },
            { id: "corporate", label: "Corporate", desc: "Fleet mgmt" },
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
                <FormLabel className="text-[11px] font-mono">SECURITY KEY // PASSWORD</FormLabel>
                <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                <div className="mt-2 grid grid-cols-4 gap-1">
                  <div className="h-1 rounded-full bg-[#F26A36]" />
                  <div className="h-1 rounded-full bg-[#E5E0DF]" />
                  <div className="h-1 rounded-full bg-[#E5E0DF]" />
                  <div className="h-1 rounded-full bg-[#E5E0DF]" />
                </div>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="terms" render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="terms" />
                  </FormControl>
                  <FormLabel htmlFor="terms" className="text-xs text-[#55595F] font-normal">I agree to <Link href="#" className="underline">Escrow Terms</Link>, <Link href="#" className="underline">ISO-9001</Link>, <Link href="#" className="underline">Privacy</Link></FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" className="w-full bg-[#F26A36] hover:bg-[#E05824] h-11">Create Identity & Secure Escrow →</Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-xs text-[#8C9098]">
          Already have node? <Link href="/sign-in" className="text-[#F26A36]">Authenticate</Link>
        </p>
      </div>
    </CardContainer>
  );
}

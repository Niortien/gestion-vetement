"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { apiPost } from "@/lib/api";
import { loginSchema, type LoginInput } from "@/lib/validators/auth.schema";
import { useAuthStore } from "@/stores/authStore";
import type { AppError } from "@/types";
import { Role } from "@/types";

export function LoginView() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  const token = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (token) router.replace("/stock");
  }, [token, router]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);

    try {
      const response = await apiPost<{ accessToken: string; refreshToken: string; user: { id: string; email: string; role: string } }, LoginInput>(
        "/auth/login",
        values
      );

      const { accessToken, refreshToken, user } = response.data;
      const role = user.role as Role;

      setTokens(accessToken, refreshToken);
      setUser({ id: user.id, email: user.email, role });
      toast.success("Connexion réussie");
      router.push("/stock");
    } catch (error) {
      const message = (error as AppError)?.message ?? "Connexion impossible";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <section className="mx-auto mt-16 max-w-md rounded-lg border border-border bg-surface p-6">
      <h1 className="mb-4 font-[var(--font-display)] text-3xl">Connexion</h1>
      <div className="space-y-3">
        <Input
          type="email"
          label="Email"
          variant="bordered"
          isInvalid={Boolean(errors.email)}
          errorMessage={errors.email?.message}
          {...register("email")}
        />
        <Input
          type="password"
          label="Mot de passe"
          variant="bordered"
          isInvalid={Boolean(errors.password)}
          errorMessage={errors.password?.message}
          {...register("password")}
        />
        <Button className="w-full bg-accent text-black" onPress={() => void onSubmit()} isLoading={isSubmitting}>
          Se connecter
        </Button>
      </div>
    </section>
  );
}

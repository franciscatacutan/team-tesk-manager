import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ShieldAlert } from "lucide-react";

import type { User } from "../types/userType";

import { useAdminResetUserPassword } from "../hooks/useAdminResetUserPassword";

import { Button } from "../../../components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Separator } from "../../../components/ui/separator";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(100),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export default function ResetUserPasswordDialog({
  open,
  onOpenChange,
  user,
}: Props) {
  const resetPassword = useAdminResetUserPassword(user?.id ?? "");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      password: "",
      confirmPassword: "",
    },

    mode: "onChange",
  });

  if (!user) return null;

  const onSubmit = async (values: FormValues) => {
    await resetPassword.mutateAsync(values.password);

    form.reset();

    onOpenChange(false);
  };

  const isSubmitting = resetPassword.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-3xl border-border/60 p-0 shadow-xl sm:max-w-lg">
        <DialogHeader className="space-y-3 border-b border-border/60 bg-muted/20 px-6 py-5 text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-200 bg-red-100 text-red-700">
              <ShieldAlert className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-base font-semibold">
                Reset password
              </DialogTitle>

              <DialogDescription className="text-sm leading-relaxed">
                Set a temporary password for{" "}
                <span className="font-medium text-foreground">
                  {user.firstName} {user.lastName}
                </span>
                .
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 px-6 py-5"
        >
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>

            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              className="h-11 rounded-xl"
              {...form.register("password")}
            />

            {form.formState.errors.password && (
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>

            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="h-11 rounded-xl"
              {...form.register("confirmPassword")}
            />

            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              The user will be able to sign in immediately using the new
              password. Consider informing them securely after resetting their
              credentials.
            </p>
          </div>

          <Separator />

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="destructive"
              className="rounded-xl"
              disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting ? "Resetting..." : "Reset password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Shield, UserRound } from "lucide-react";

import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import { useUpdateUserProfile } from "../features/users/hooks/useUpdateUserProfile";
import { useUpdateUserRole } from "../features/users/hooks/useUpdateUserRole";

import type { UserRole } from "../features/users/types/userRole";

import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

// import { Separator } from "../components/ui/separator";
import { useUser } from "@/features/users/hooks/useUser";
import { useTeams } from "@/features/teams/hooks/useTeams";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Enter a valid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ROLE_LABELS: Record<UserRole, string> = {
  USER: "User",
  ADMIN: "Global Admin",
  SUPER_ADMIN: "Super Admin",
};

const ROLE_STYLES: Record<UserRole, string> = {
  USER: "border-border bg-muted/30 text-muted-foreground",
  ADMIN: "border-blue-200 bg-blue-100 text-blue-700",
  SUPER_ADMIN: "border-emerald-200 bg-emerald-100 text-emerald-700",
};

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();

  const { data } = useTeams({
    size: 1000,
    deletedFilter: "ACTIVE",
  });

  const teams = data?.content ?? [];

  const profileUserId = userId ?? currentUser?.id ?? "";

  const { data: profileUser, isLoading: profileUserLoading } =
    useUser(profileUserId);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!profileUser) return;

    form.reset({
      firstName: profileUser.firstName,
      lastName: profileUser.lastName,
      email: profileUser.email,
    });
  }, [form, profileUser]);

  const isSelf = currentUser?.id === profileUser?.id;

  const canManageGlobalRole = currentUser?.role === "SUPER_ADMIN";

  const canEditRole = canManageGlobalRole && !isSelf;

  const canEditProfile = isSelf || canManageGlobalRole;

  const updateProfile = useUpdateUserProfile(profileUser?.id ?? "");

  const updateRole = useUpdateUserRole(profileUser?.id ?? "");

  const isLoading = currentUserLoading || profileUserLoading;

  if (isLoading || !currentUser || !profileUser) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  const onSubmit = (values: ProfileFormValues) => {
    if (!canEditProfile) return;

    updateProfile.mutate(values);
  };

  return (
    <div className="min-h-full bg-muted/10 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* HERO */}
        <section className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-muted/20 shadow-sm">
          <div className="relative p-6 sm:p-8">
            {/* BACKGROUND ACCENT */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.10),transparent_35%)]" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* PROFILE */}
              <div className="flex min-w-0 items-center gap-5">
                <Avatar className="h-20 w-20 border-4 border-background shadow-md ring-1 ring-border/60">
                  <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                    {profileUser.firstName?.[0]}
                    {profileUser.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
                    <UserRound className="h-3.5 w-3.5" />
                    {isSelf ? "My Account" : "User Profile"}
                  </div>

                  <div className="space-y-1">
                    <h1 className="truncate text-3xl font-semibold tracking-tight text-foreground">
                      {profileUser.firstName} {profileUser.lastName}
                    </h1>

                    <p className="truncate text-sm text-muted-foreground">
                      {profileUser.email}
                    </p>
                  </div>

                  {/* META */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge
                      variant="outline"
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${ROLE_STYLES[profileUser.role as UserRole]}`}
                    >
                      {ROLE_LABELS[profileUser.role as UserRole]}
                    </Badge>

                    <div className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs text-muted-foreground">
                      {teams?.length ?? 0} Teams
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION */}
              {canEditProfile && (
                <Button
                  type="submit"
                  form="profile-form"
                  className="rounded-xl px-5 shadow-sm"
                  disabled={updateProfile.isPending || !form.formState.isDirty}
                >
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="space-y-6">
          {/* TOP GRID */}
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
            {/* PERSONAL DETAILS */}
            <Card className="overflow-hidden rounded-3xl border border-border/60 bg-background/95 shadow-sm">
              <CardHeader className="border-b border-border/60 bg-muted/20">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Personal Details</CardTitle>

                  <p className="text-sm text-muted-foreground">
                    Manage personal account information.
                  </p>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <form
                  id="profile-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* NAME */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        First name
                      </label>

                      <Input
                        {...form.register("firstName")}
                        disabled={!canEditProfile}
                        className="h-11 rounded-xl border-border/70 bg-background shadow-none"
                      />

                      {form.formState.errors.firstName && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Last name
                      </label>

                      <Input
                        {...form.register("lastName")}
                        disabled={!canEditProfile}
                        className="h-11 rounded-xl border-border/70 bg-background shadow-none"
                      />

                      {form.formState.errors.lastName && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email address
                    </label>

                    <Input
                      {...form.register("email")}
                      disabled={!canEditProfile}
                      className="h-11 rounded-xl border-border/70 bg-background shadow-none"
                    />

                    {form.formState.errors.email && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* GLOBAL ROLE */}
            <Card className="overflow-hidden rounded-3xl border border-border/60 bg-background/95 shadow-sm">
              <CardHeader className="border-b border-border/60 bg-muted/20">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Global Role</CardTitle>

                  <p className="text-sm text-muted-foreground">
                    Platform-level permissions and access.
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 p-6">
                {/* CURRENT ROLE */}
                <div className="rounded-2xl border border-border/60 bg-muted/15 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Shield className="h-5 w-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium text-foreground">
                        Current Role
                      </div>

                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${ROLE_STYLES[profileUser.role as UserRole]}`}
                      >
                        {ROLE_LABELS[profileUser.role as UserRole]}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* ROLE MANAGEMENT */}
                {canManageGlobalRole ? (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      Change role
                    </label>

                    <Select
                      value={profileUser.role}
                      disabled={!canEditRole || updateRole.isPending}
                      onValueChange={(value) =>
                        updateRole.mutate(value as UserRole)
                      }
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>

                        <SelectItem value="ADMIN">Global Admin</SelectItem>

                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    <p className="text-xs leading-5 text-muted-foreground">
                      {isSelf
                        ? "You cannot change your own global role."
                        : "SUPER_ADMIN accounts can manage global permissions."}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/70 bg-muted/10 px-4 py-5 text-sm text-muted-foreground">
                    Only SUPER_ADMIN can manage global roles.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* TEAMS */}
          <Card className="overflow-hidden rounded-3xl border border-border/60 bg-background/95 shadow-sm">
            <CardHeader className="border-b border-border/60 bg-muted/20">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Teams</CardTitle>

                  <p className="text-sm text-muted-foreground">
                    Current workspaces this user belongs to.
                  </p>
                </div>

                <div className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs text-muted-foreground">
                  {teams?.length ?? 0} Teams
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {teams && teams.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => navigate(`/teams/${team.id}`)}
                      className="group rounded-2xl border border-border/60 bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-muted/30 hover:shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="truncate font-medium text-foreground group-hover:text-primary transition-colors">
                            {team.name}
                          </div>

                          {/* <Badge variant="secondary" className="rounded-full">
                            {team.role}
                          </Badge> */}
                        </div>

                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {team.description || "No team description provided."}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/70 bg-muted/10 px-6 py-10 text-center">
                  <h3 className="font-medium text-foreground">No teams yet</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    This user is not part of any workspace.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

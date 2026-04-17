import { Button } from "../../../components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import MultiUserSelector from "../../../common/components/MultiUserSelector";
import { Separator } from "../../../components/ui/separator";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useAddMembers } from "../hooks/useAddMembers";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User } from "../../users/types/userType";
import { cn } from "../../../lib/utils";
import {
  TEAM_ROLE_LABEL,
  TEAM_ROLE_STYLES,
} from "../../../common/constants/team.constants";

const schema = z.object({
  userIds: z.array(z.string()).min(1, "Select at least one user."),
  role: z.enum(["ADMIN", "MEMBER"]),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  teamId: string;
  users: User[];
  onOpenChange: (open: boolean) => void;
}

export function AddMemberForm({ teamId, users, onOpenChange }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      userIds: [],
      role: "MEMBER",
    },
  });

  const role = useWatch({
    control: form.control,
    name: "role",
  });
  const selectedUserIds = useWatch({
    control: form.control,
    name: "userIds",
  });
  const selectedCount = selectedUserIds.length;

  const addMember = useAddMembers(teamId);

  const onSubmit = (data: FormValues) => {
    addMember.mutate(
      {
        members: data.userIds.map((userId) => ({
          userId,
          role: data.role,
        })),
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="px-6 py-5 space-y-6"
    >
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Users
        </label>

        <Controller
          control={form.control}
          name="userIds"
          render={({ field }) => (
            <MultiUserSelector
              users={users}
              value={field.value}
              placeholder="Search and select users..."
              onChange={field.onChange}
            />
          )}
        />

        {form.formState.errors.userIds && (
          <p className="text-xs text-destructive">
            {form.formState.errors.userIds.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Role
        </label>

        <Select
          value={role}
          onValueChange={(value) =>
            form.setValue("role", value as "ADMIN" | "MEMBER")
          }
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="MEMBER">
              <span
                className={cn(
                  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                  TEAM_ROLE_STYLES.MEMBER,
                )}
              >
                {TEAM_ROLE_LABEL.MEMBER}
              </span>{" "}
            </SelectItem>

            <SelectItem value="ADMIN">
              <span
                className={cn(
                  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                  TEAM_ROLE_STYLES.ADMIN,
                )}
              >
                {TEAM_ROLE_LABEL.ADMIN}
              </span>{" "}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onOpenChange(false)}
          className="h-9"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={selectedCount === 0 || addMember.isPending}
          className="h-9 px-4"
        >
          {addMember.isPending
            ? "Adding..."
            : selectedCount > 0
              ? `Add ${selectedCount} member${selectedCount === 1 ? "" : "s"}`
              : "Add members"}
        </Button>
      </div>
    </form>
  );
}

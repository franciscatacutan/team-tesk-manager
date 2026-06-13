import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import AutoResizeTextareaBase from "../../../common/components/AutoResizeTextareaBase";
import { useCreateTeam } from "../hooks/useCreateTeam";
import {
  createTeamSchema,
  type CreateTeamInput,
} from "../types/createTeamSchema.types";
import FormField from "../../../common/components/FormFieldWrapper";
import { Separator } from "../../../components/ui/separator";
import type { Team } from "../types/team.type";

interface Props {
  onSuccess?: (team: Team) => void;
  onCancel?: () => void;
}

export function CreateTeamForm({ onSuccess, onCancel }: Props) {
  const createTeamMutation = useCreateTeam();

  const form = useForm<CreateTeamInput>({
    resolver: zodResolver(createTeamSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const MAX_NAME = 100;
  const MAX_DESC = 2000;

  const name = useWatch({
    control: form.control,
    name: "name",
  });

  const onSubmit = (data: CreateTeamInput) => {
    createTeamMutation.mutate(data, {
      onSuccess: (team) => {
        form.reset();
        onSuccess?.(team);
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <FormField
          label="Name"
          error={form.formState.errors.name?.message}
          length={name.length}
          maxLength={MAX_NAME}
        >
          <Input
            {...form.register("name")}
            maxLength={MAX_NAME}
            placeholder="Enter team name..."
            className="
            border-none px-0 py-0
            focus-visible:ring-0
            shadow-none
            text-sm
          "
          />
        </FormField>
      </div>

      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <FormField
            label="Description"
            error={fieldState.error?.message}
            length={field.value?.length}
            maxLength={MAX_DESC}
          >
            <AutoResizeTextareaBase
              value={field.value || ""}
              onChange={field.onChange}
              placeholder="Add more details about this team..."
              maxLength={2000}
              className="text-sm"
            />
          </FormField>
        )}
      />
      <Separator />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          type="submit"
          variant="default"
          disabled={createTeamMutation.isPending || !form.formState.isValid}
        >
          {createTeamMutation.isPending ? "Creating..." : "Create Team"}
        </Button>
      </div>
    </form>
  );
}

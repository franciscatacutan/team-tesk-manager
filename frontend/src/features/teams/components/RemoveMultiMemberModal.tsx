import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../components/ui/dialog";

import { Button } from "../../../components/ui/button";
import MultiUserSelector from "../../../common/components/MultiUserSelector";
import { useState } from "react";
import { useRemoveMembers } from "../hooks/useRemoveMembers";
import { useDebounce } from "@/common/hooks/useDebounce";
import { useTeamMembers } from "../hooks/useTeamMembers";

interface Props {
  teamId: string;
  open: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RemoveMultiMembersModal({
  teamId,
  open,
  isLoading,
  onOpenChange,
}: Props) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const { data: membersData } = useTeamMembers(teamId || "", {
    page: 0,
    size: 1000,
    search: debouncedSearch,
    sort: undefined,
  });

  const members = membersData?.content ?? [];

  const removeMembers = useRemoveMembers(teamId);

  const handleRemove = () => {
    if (selectedUserIds.length === 0) return;

    removeMembers.mutate(
      { userIds: selectedUserIds },
      {
        onSuccess: () => {
          setSelectedUserIds([]);
          onOpenChange(false);
        },
      },
    );
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm p-0 rounded-xl">
        <div className="px-6 pt-6 pb-3 border-b">
          <DialogTitle className="text-base font-semibold">
            Remove members
          </DialogTitle>

          <p className="text-sm text-muted-foreground mt-1">
            Select users to remove from the team
          </p>
        </div>

        <div className="px-6 py-5 space-y-6">
          <MultiUserSelector
            search={search}
            onSearchChange={setSearch}
            users={members}
            value={selectedUserIds}
            placeholder="Search and select users..."
            onChange={setSelectedUserIds}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-9"
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={selectedUserIds.length === 0 || removeMembers.isPending}
              className="h-9 px-4"
            >
              {removeMembers.isPending
                ? "Removing..."
                : `Remove ${selectedUserIds.length} member${
                    selectedUserIds.length === 1 ? "" : "s"
                  }`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

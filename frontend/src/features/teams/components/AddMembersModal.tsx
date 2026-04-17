import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../components/ui/dialog";

import type { User } from "../../users/types/userType";
import { AddMemberForm } from "./AddMemberForm";

interface Props {
  teamId: string;
  open: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  users: User[];
}

export default function AddMembersModal({
  teamId,
  open,
  isLoading,
  onOpenChange,
  users,
}: Props) {
  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm p-0 rounded-xl" aria-describedby={undefined}>
        <div className="px-6 pt-6 pb-3 border-b">
          <DialogTitle className="text-base font-semibold">
            Add members
          </DialogTitle>

          <p className="text-sm text-muted-foreground mt-1">
            Invite a user and assign their role
          </p>
        </div>

        <AddMemberForm
          teamId={teamId}
          users={users}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}

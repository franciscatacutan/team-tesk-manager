import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import type { Team } from "../types/team.type";
import { CreateTeamForm } from "./CreateTeamForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (team: Team) => void;
}

export function CreateTeamModal({ open, onOpenChange, onSuccess }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
        </DialogHeader>
        <CreateTeamForm
          onSuccess={(team) => {
            onOpenChange(false);
            onSuccess?.(team);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

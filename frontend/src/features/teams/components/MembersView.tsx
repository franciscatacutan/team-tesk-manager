import { useParams } from "react-router-dom";
import { useState } from "react";

import { useTeamMembers } from "../hooks/useTeamMembers";
import { useDebounce } from "../../../common/hooks/useDebounce";
import MembersHeader from "./MembersHeader";
import MembersToolbar from "./MembersToolbar";
import MembersList from "./MembersList";
import { useAvailableUsers } from "../hooks/useAvailableUsers";
import AddMemberModal from "./AddMemberModal";
import TransferOwnershipModal from "./TransferOwnershipModal";
import { getTeamPermissions } from "../utils/teamPermissions";
import { getUserFromToken } from "../../users/api/userApi";
import { useTeamMe } from "../hooks/useTeamMe";

export default function MembersPage() {
  const { teamId } = useParams<{ teamId: string }>();

  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("ALL");
  const [sort, setSort] = useState("joinedAt,desc");

  const debouncedSearch = useDebounce(search, 400);

  const { data: membersData, isLoading: membersLoading } = useTeamMembers(
    teamId || "",
    {
      page,
      size: 10,
      search: debouncedSearch,
      sort,
    },
  );
  const { data: teamMe } = useTeamMe(teamId || "");

  const members = membersData?.content ?? [];
  const totalPages = membersData?.totalPages ?? 0;
  const totalElements = membersData?.totalElements ?? 0;

  const { data: availableUsersData } = useAvailableUsers(teamId || "", {
    search: debouncedSearch,
  });

  const user = getUserFromToken();
  if (!user?.role) return;

  const permissions = getTeamPermissions({
    globalRole: user.role,
    teamRole: teamMe?.role,
  });

  const availableUsers = availableUsersData?.content ?? [];

  if (!teamId) return <div className="p-6">Invalid team</div>;

  return (
    <section className="flex flex-col h-full min-h-0 gap-6">
      <MembersHeader
        setAddMemberOpen={() => setAddMemberOpen(true)}
        setTransferOpen={() => setTransferOpen(true)}
        permissions={permissions}
      />

      <MembersToolbar
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
      />

      <MembersList
        permissions={permissions}
        teamId={teamId}
        members={members}
        isLoading={membersLoading}
        search={debouncedSearch}
        role={role}
        pagination={{
          page,
          size,
          totalPages,
          totalElements,
          onPageChange: setPage,
          onSizeChange: (size) => {
            setPage(0);
            setSize(size);
          },
        }}
        sort={sort}
        onSortChange={setSort}
      />

      <AddMemberModal
        users={availableUsers}
        teamId={teamId}
        open={addMemberOpen}
        isLoading={false}
        onOpenChange={setAddMemberOpen}
      />

      <TransferOwnershipModal
        teamId={teamId}
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        members={members}
      />
    </section>
  );
}

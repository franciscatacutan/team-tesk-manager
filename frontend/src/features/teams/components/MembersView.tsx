import { useParams } from "react-router-dom";
import { useState } from "react";

import { useTeamMembers } from "../hooks/useTeamMembers";
import { useDebounce } from "../../../common/hooks/useDebounce";
import MembersHeader from "./MembersHeader";
import MembersToolbar from "./MembersToolbar";
import MembersList from "./MembersList";
import AddMembersModal from "./AddMembersModal";
import TransferOwnershipModal from "./TransferOwnershipModal";
import { getTeamPermissions } from "../utils/teamPermissions";
import { getUserFromToken } from "../../users/api/userApi";
import { useTeamMe } from "../hooks/useTeamMe";
import RemoveMultiMembersModal from "./RemoveMultiMemberModal";
import type { TeamRole } from "../types/team.type";

export default function MembersPage() {
  const { teamId } = useParams<{ teamId: string }>();

  const [addMembersOpen, setAddMembersOpen] = useState(false);
  const [removeMembersOpen, setRemoveMembersOpen] = useState(false);

  const [transferOpen, setTransferOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("joinedAt,desc");
  const [roleFilter, setRoleFilter] = useState<TeamRole[]>([]);

  const debouncedSearch = useDebounce(search, 400);

  const { data: membersData, isLoading: membersLoading } = useTeamMembers(
    teamId || "",
    {
      page,
      size: 10,
      search: debouncedSearch,
      sort,
      roles: roleFilter,
    },
  );
  const { data: teamMe } = useTeamMe(teamId || "");
  if (!teamMe?.role) return;

  const members = membersData?.content ?? [];
  const totalPages = membersData?.totalPages ?? 0;
  const totalElements = membersData?.totalElements ?? 0;

  const user = getUserFromToken();
  if (!user?.role) return;

  const permissions = getTeamPermissions({
    globalRole: user.role,
    teamRole: teamMe?.role,
  });

  function handleFilterChange(key: string, value: string | string[]) {
    setPage(0);

    if (key === "roles") {
      setRoleFilter(Array.isArray(value) ? (value as TeamRole[]) : []);
    }
  }

  if (!teamId) return <div className="p-6">Invalid team</div>;

  return (
    <section className="flex flex-col h-full min-h-0 gap-6">
      <MembersHeader
        setAddMembersOpen={() => setAddMembersOpen(true)}
        setRemoveMembersOpen={() => setRemoveMembersOpen(true)}
        setTransferOpen={() => setTransferOpen(true)}
        permissions={permissions}
      />

      <MembersToolbar
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        handleFilterChange={handleFilterChange}
      />

      <MembersList
        permissions={permissions}
        teamId={teamId}
        members={members}
        isLoading={membersLoading}
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

      <RemoveMultiMembersModal
        userTeamRole={teamMe.role}
        teamId={teamId}
        open={removeMembersOpen}
        isLoading={false}
        onOpenChange={setRemoveMembersOpen}
      />

      <AddMembersModal
        userTeamRole={teamMe.role}
        teamId={teamId}
        open={addMembersOpen}
        isLoading={false}
        onOpenChange={setAddMembersOpen}
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

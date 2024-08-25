"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useActiveWallet } from "thirdweb/react";
import {
  type TeamHeaderCompProps,
  TeamHeaderDesktopUI,
  TeamHeaderMobileUI,
} from "./TeamHeaderUI";

export function TeamHeader(props: {
  currentTeam: Team;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  currentProject: Project | undefined;
}) {
  const { user } = useLoggedInUser();
  const activeWallet = useActiveWallet();

  const headerProps: TeamHeaderCompProps = {
    address: user?.address,
    currentProject: props.currentProject,
    currentTeam: props.currentTeam,
    teamsAndProjects: props.teamsAndProjects,
    walletId: activeWallet?.id,
  };

  return (
    <div>
      <TeamHeaderDesktopUI {...headerProps} className="max-lg:hidden" />
      <TeamHeaderMobileUI {...headerProps} className="lg:hidden" />
    </div>
  );
}

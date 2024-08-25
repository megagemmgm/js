import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { ColorModeToggle } from "@/components/color-mode-toggle";
import { Badge } from "@/components/ui/badge";
import { thirdwebClient } from "@/constants/client";
import Link from "next/link";
import type { WalletId } from "thirdweb/wallets";
import { AccountButton } from "../../../team/[team_slug]/components/account-button.client";
import { ThirdwebMiniLogo } from "../../ThirdwebMiniLogo";
import { TeamAndProjectSelectorButton } from "./TeamAndProjectSelector";
import { getValidTeamPlan } from "./getValidTeamPlan";

export function TeamHeaderUI(props: {
  currentTeam: Team;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  address: string | undefined;
  walletId: WalletId | undefined;
  currentProject: Project | undefined;
}) {
  const { currentTeam } = props;
  const teamPlan = getValidTeamPlan(currentTeam);

  return (
    <header className="flex flex-row gap-2 items-center bg-background text-foreground justify-between px-6 py-4">
      <div className="flex items-center gap-2">
        <ThirdwebMiniLogo className="h-5" />

        <SlashSeparator />

        <div className="flex items-center gap-1">
          <Link
            href={`/team/${currentTeam.slug}`}
            className="font-normal text-sm flex flex-row gap-2 items-center text-foreground"
          >
            <span className="font-semibold"> {currentTeam.name} </span>
            <Badge
              variant={
                teamPlan === "free"
                  ? "secondary"
                  : teamPlan === "growth"
                    ? "success"
                    : "default"
              }
              className="capitalize"
            >
              {teamPlan}
            </Badge>
          </Link>

          <TeamAndProjectSelectorButton
            currentProject={props.currentProject}
            currentTeam={props.currentTeam}
            teamsAndProjects={props.teamsAndProjects}
            focus="team-selection"
          />
        </div>

        {props.currentProject && (
          <>
            <SlashSeparator />
            <Link
              href={`/team/${props.currentTeam.slug}/${props.currentProject.slug}`}
              className="font-semibold text-sm flex flex-row gap-1 items-center"
            >
              {props.currentProject.name}
            </Link>

            <TeamAndProjectSelectorButton
              currentProject={props.currentProject}
              currentTeam={props.currentTeam}
              teamsAndProjects={props.teamsAndProjects}
              focus="project-selection"
            />
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ColorModeToggle />
        <AccountButton
          client={thirdwebClient}
          address={props.address}
          walletId={props.walletId}
        />
      </div>
    </header>
  );
}

function SlashSeparator() {
  return (
    <div className="h-5 w-[1px] bg-muted-foreground/80 rotate-[25deg] mx-2" />
  );
}

"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  CirclePlusIcon,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DynamicHeight } from "../../../../@/components/ui/DynamicHeight";
import { ScrollShadow } from "../../../../@/components/ui/ScrollShadow/ScrollShadow";
import { getValidTeamPlan } from "./getValidTeamPlan";

type TeamSwitcherProps = {
  currentTeam: Team;
  currentProject: Project | undefined;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  focus: "project-selection" | "team-selection";
};

export function TeamAndProjectSelectorButton(props: TeamSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { currentTeam, teamsAndProjects } = props;
  const [hoveredTeam, setHoveredTeam] = useState<Team>();
  const projectsToShowOfTeam = hoveredTeam || currentTeam;

  const projectsToShow = teamsAndProjects.find(
    (x) => x.team.slug === projectsToShowOfTeam.slug,
  )?.projects;

  return (
    <Popover
      open={open}
      onOpenChange={(_open) => {
        setOpen(_open);
        if (!_open) {
          setHoveredTeam(undefined);
        }
      }}
    >
      {/* Trigger */}
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="px-1 w-auto !h-auto py-2 rounded-xl"
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label={`Select a ${props.focus === "project-selection" ? "project" : "team"}`}
        >
          <ChevronsUpDownIcon className="shrink-0 text-muted-foreground/50 hover:text-foreground size-5" />
        </Button>
      </PopoverTrigger>

      {/* Dropdown */}
      <PopoverContent
        sideOffset={5}
        className="p-0 w-auto rounded-xl "
        align={props.focus === "project-selection" ? "center" : "start"}
      >
        <DynamicHeight>
          <div className="flex [&>div]:w-[280px] no-scrollbar">
            {/* Left */}
            <LeftSection
              currentTeam={currentTeam}
              hoveredTeam={hoveredTeam}
              setHoveredTeam={setHoveredTeam}
              teamsAndProjects={teamsAndProjects}
            />

            {/* Right */}
            {projectsToShow && (
              <RightSection
                currentProject={props.currentProject}
                projects={projectsToShow}
                team={projectsToShowOfTeam}
              />
            )}
          </div>
        </DynamicHeight>
      </PopoverContent>
    </Popover>
  );
}

function LeftSection(props: {
  setHoveredTeam: (team: Team | undefined) => void;
  hoveredTeam: Team | undefined;
  currentTeam: Team;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
}) {
  const { setHoveredTeam, currentTeam, hoveredTeam, teamsAndProjects } = props;
  const teamPlan = getValidTeamPlan(currentTeam);
  const teams = teamsAndProjects.map((x) => x.team);
  const [searchTeamTerm, setSearchTeamTerm] = useState("");
  const filteredTeams = searchTeamTerm
    ? teams.filter((team) => team.name.includes(searchTeamTerm))
    : teams;

  return (
    <div className="flex flex-col">
      <SearchInput
        placeholder="Search Teams"
        value={searchTeamTerm}
        onValueChange={setSearchTeamTerm}
      />

      <ScrollShadow scrollableClassName="max-h-[600px]" className="grow">
        <div className="p-2 flex flex-col">
          {/* TODO - onclick */}
          <Button
            className={cn("w-full justify-between !opacity-100 px-2")}
            variant="ghost"
            onMouseEnter={() => setHoveredTeam(undefined)}
          >
            My Account
          </Button>

          <h2 className="text-muted-foreground text-xs mx-2 mb-2 mt-4 font-medium">
            Teams
          </h2>

          <ul>
            {filteredTeams.map((team) => {
              const isSelected = team.slug === currentTeam.slug;
              return (
                // biome-ignore lint/a11y/useKeyWithMouseEvents: <explanation>
                <li
                  key={team.slug}
                  className="py-0.5"
                  onMouseOver={() => {
                    setHoveredTeam(team);
                  }}
                >
                  <Button
                    className={cn(
                      "gap-2 pl-2 w-full justify-between !opacity-100",
                      isSelected && "bg-accent",
                      !isSelected && hoveredTeam === team && "bg-accent/50",
                    )}
                    variant="ghost"
                    asChild
                  >
                    <Link href={`/team/${team.slug}`}>
                      <span className="truncate"> {team.name} </span>
                      {isSelected && (
                        <CheckIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </Link>
                  </Button>
                </li>
              );
            })}

            <li className="py-0.5">
              <Button
                className="px-2 w-full gap-2 justify-start disabled:opacity-100 disabled:pointer-events-auto disabled:cursor-not-allowed"
                variant="ghost"
                disabled
              >
                <CirclePlusIcon className="size-4 text-link-foreground" />
                Create Team
                <Badge className="ml-auto" variant="secondary">
                  Soon{"™️"}
                </Badge>
              </Button>
            </li>
          </ul>
        </div>
      </ScrollShadow>

      {/* TODO - what do we do on this button click? */}
      {/* Bottom */}
      {teamPlan !== "pro" && (
        <div className="p-2 border-t">
          <Button
            variant="primary"
            className="w-full"
            onMouseEnter={() => setHoveredTeam(undefined)}
          >
            Upgrade Team
          </Button>
        </div>
      )}
    </div>
  );
}

function RightSection(props: {
  projects: Project[];
  currentProject: Project | undefined;
  team: Team;
}) {
  const { projects, currentProject, team } = props;
  const [searchProjectTerm, setSearchProjectTerm] = useState("");
  const filteredProjects = searchProjectTerm
    ? projects.filter((project) => project.name.includes(searchProjectTerm))
    : projects;

  return (
    <div className="flex flex-col border-l fade-in-0 animate-in duration-300">
      <SearchInput
        placeholder="Search Projects"
        value={searchProjectTerm}
        onValueChange={setSearchProjectTerm}
      />

      <ScrollShadow scrollableClassName="max-h-[600px]" className="grow">
        <div className="flex flex-col p-2">
          <h2 className="text-muted-foreground text-xs mx-2 mb-2 mt-2 font-medium">
            Projects
          </h2>

          <ul className="flex flex-col gap-1">
            {filteredProjects.map((project) => {
              const isSelected = project.slug === currentProject?.slug;
              return (
                <li key={project.slug}>
                  <Button
                    className={cn(
                      "gap-2 pl-2 w-full justify-between !opacity-100 disabled:opacity-100 disabled:pointer-events-auto disabled:cursor-not-allowed",
                      isSelected && "bg-accent",
                    )}
                    variant="ghost"
                    asChild
                  >
                    <Link href={`/team/${team.slug}/${project.slug}`}>
                      <span className="truncate"> {project.name} </span>
                      {isSelected && (
                        <CheckIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </ScrollShadow>

      <div className="p-2 border-t">
        <Button
          className="px-2 w-full gap-2 justify-start disabled:opacity-100 disabled:pointer-events-auto disabled:cursor-not-allowed"
          variant="ghost"
          disabled
        >
          <CirclePlusIcon className="size-4 text-link-foreground" />
          Create Project
          <Badge className="ml-auto" variant="secondary">
            Soon{"™️"}
          </Badge>
        </Button>
      </div>
    </div>
  );
}

function SearchInput(props: {
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Input
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onValueChange(e.target.value)}
        className="pl-9 py-6 focus-visible:ring-0 rounded-none border-0 bg-transparent focus:shadow-none focus-visible:ring-transparent !ring-offset-transparent"
      />
      <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Separator />
    </div>
  );
}

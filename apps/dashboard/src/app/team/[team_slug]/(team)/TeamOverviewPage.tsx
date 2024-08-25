"use client";

import type { Project } from "@/api/projects";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function TeamOverviewPage(props: {
  projects: Project[];
  team_slug: string;
}) {
  const { projects } = props;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = !searchTerm
    ? projects
    : projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.publishableKey
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );

  return (
    <div className="container ">
      <div className="h-12" />

      {/* Filters + Add New */}
      <div className="flex items-center gap-4">
        <SearchInput value={searchTerm} onValueChange={setSearchTerm} />
        <Button variant="primary" className="gap-2">
          Add New
          <ChevronDownIcon className="size-4" />
        </Button>
      </div>

      <div className="h-8" />

      {/* Projects */}
      {filteredProjects.length === 0 ? (
        <div className="border rounded-lg h-[450px] flex items-center justify-center ">
          No projects found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {filteredProjects.map((project) => {
            return (
              <ProjectCard
                key={project.id}
                project={project}
                team_slug={props.team_slug}
              />
            );
          })}
        </div>
      )}

      <div className="h-10" />
    </div>
  );
}

function ProjectCard(props: {
  project: Project;
  team_slug: string;
}) {
  const { project, team_slug } = props;
  return (
    <div
      key={project.id}
      className="border rounded-lg p-4 relative hover:bg-muted/70 flex items-center gap-4 bg-muted/20 transition-colors"
    >
      {/* TODO - replace with project image */}
      <div className="size-10 rounded-full bg-border shrink-0" />

      <div>
        <Link
          className="static group before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:z-0"
          // remove /connect when we have overview page
          href={`/team/${team_slug}/${project.slug}/connect`}
        >
          <h2 className="text-base">{project.name}</h2>
        </Link>

        <CopyTextButton
          copyIconPosition="right"
          textToCopy={project.publishableKey}
          textToShow={truncate(project.publishableKey, 32)}
          tooltip="Copy Client ID"
          variant="ghost"
          className="px-2 -translate-x-2 text-muted-foreground text-xs"
        />

        <p className="text-xs text-muted-foreground mt-2">
          Created on {format(new Date(project.createdAt), "MMM dd, yyyy")}
        </p>
      </div>
    </div>
  );
}

function truncate(str: string, stringLimit: number) {
  return str.length > stringLimit ? `${str.slice(0, stringLimit)}...` : str;
}

function SearchInput(props: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="relative grow">
      <Input
        placeholder="Search Projects by name or Client ID"
        value={props.value}
        onChange={(e) => props.onValueChange(e.target.value)}
        className="pl-9"
      />
      <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

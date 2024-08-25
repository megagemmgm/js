import type { Meta, StoryObj } from "@storybook/react";
import { useLayoutEffect } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import type { Project } from "../@/api/projects";
import type { Team } from "../@/api/team";
import { TeamHeaderUI } from "../app/components/Header/TeamHeader/TeamHeaderUI";

const meta = {
  title: "Shadcn/Header",
  component: Story,
  parameters: {},
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  args: {
    theme: "dark",
  },
};

export const Light: Story = {
  args: {
    theme: "light",
  },
};

function createFakeProject(id: string, teamId: string) {
  const project: Project = {
    bundleIds: [] as string[],
    createdAt: new Date(),
    domains: [] as string[],
    id: id,
    updatedAt: new Date(),
    teamId: teamId,
    redirectUrls: [] as string[],
    slug: `project-${id}`,
    name: `Project ${id}`,
    publishableKey: "pb-key",
    lastAccessedAt: null,
    deletedAt: null,
    bannedAt: null,
  };

  return project;
}

const teamsAndProjects: Array<{ team: Team; projects: Project[] }> = [
  {
    team: {
      billingPlan: "free",
      billingStatus: "",
      name: "Team 1",
      slug: "team-1",
    },
    projects: [
      createFakeProject("t1p1", "team-1"),
      createFakeProject("t1p2", "team-1"),
      createFakeProject("t1p3", "team-1"),
      createFakeProject("t1p4", "team-1"),
    ],
  },
  {
    team: {
      billingPlan: "pro",
      billingStatus: "validPayment",
      name: "Team 3",
      slug: "team-3",
    },
    projects: [
      createFakeProject("t2p1", "team-2"),
      createFakeProject("t2p2", "team-2"),
    ],
  },
  {
    team: {
      billingPlan: "growth",
      billingStatus: "validPayment",
      name: "Team 2",
      slug: "team-2",
    },
    projects: [createFakeProject("t3p1", "team-3")],
  },
];

function Story(props: {
  theme: "light" | "dark";
}) {
  return (
    <ThirdwebProvider>
      <ApplyTheme theme={props.theme} />
      <div className="bg-zinc-700 p-4 h-screen">
        <div className="flex flex-col gap-6">
          <span className="text-white font-bold">
            Connected, No Current Project, Free
          </span>
          <TeamHeaderUI
            teamsAndProjects={teamsAndProjects}
            currentTeam={teamsAndProjects[0].team}
            address={"0xd8da6bf26964af9d7eed9e03e53415d37aa96045"} // vitalik.eth
            walletId="io.metamask"
            currentProject={undefined}
          />

          <span className="text-white font-bold">
            Not yet Connected, No Current Project, Growth
          </span>

          <TeamHeaderUI
            teamsAndProjects={teamsAndProjects}
            currentTeam={teamsAndProjects[1].team}
            address={undefined}
            walletId={undefined}
            currentProject={undefined}
          />

          <span className="text-white font-bold">
            Not yet Connected, No Current Project, Pro
          </span>
          <TeamHeaderUI
            teamsAndProjects={teamsAndProjects}
            currentTeam={teamsAndProjects[2].team}
            address={undefined}
            walletId={undefined}
            currentProject={undefined}
          />

          <span className="text-white font-bold">
            Not yet Connected, Current Project, Pro
          </span>
          <TeamHeaderUI
            teamsAndProjects={teamsAndProjects}
            currentTeam={teamsAndProjects[2].team}
            address={undefined}
            walletId={undefined}
            currentProject={teamsAndProjects[2].projects[0]}
          />
        </div>
      </div>
    </ThirdwebProvider>
  );
}

function ApplyTheme(props: { theme: "light" | "dark" }) {
  const { theme } = props;
  useLayoutEffect(() => {
    if (theme === "light" || theme === "dark") {
      document.body.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return null;
}

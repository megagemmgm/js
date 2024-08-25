import { getProjects } from "@/api/projects";
import { TeamOverviewPage } from "./OverviewPageContent";

export default async function Page(props: {
  params: { team_slug: string };
}) {
  const projects = await getProjects(props.params.team_slug);

  return (
    <TeamOverviewPage projects={projects} team_slug={props.params.team_slug} />
  );
}

import { TWAutoConnect } from "./components/autoconnect";

export default async function RootTeamLayout(props: {
  children: React.ReactNode;
  params: { team_slug: string };
}) {
  return (
    <>
      {props.children}
      <TWAutoConnect />
    </>
  );
}

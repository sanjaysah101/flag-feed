import { auth } from "@/auth";

import { getVariableValue } from "../lib/devcycle/config";

const NewComponent = async () => {
  const session = await auth();
  return (
    <div>
      <h1>New Component</h1>
      {JSON.stringify(session)}
    </div>
  );
};

const OldComponent = () => {
  return <div>Old components</div>;
};

export default async function Home() {
  const myVariable = await getVariableValue("gamification-leaderboard", false);
  return myVariable ? <NewComponent /> : <OldComponent />;
}

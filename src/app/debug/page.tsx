import { FeatureFlags } from "../../components/debug/FeatureFlags";

export default async function DebugPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold">Debug Tools</h1>
      <FeatureFlags />
    </div>
  );
}

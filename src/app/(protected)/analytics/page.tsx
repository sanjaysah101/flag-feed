import { Typography } from "@/components/ui";

const page = () => {
  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h2">Analytics</Typography>
      <Typography variant="p">This page is for viewing and managing analytics data.</Typography>
      <div className="max-full flex flex-col items-center justify-center gap-2">
        <Typography variant="h4">Coming Soon...</Typography>
      </div>
    </div>
  );
};

export default page;

import { Typography } from "../../../../components/ui";

const page = () => {
  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h2">Discover Content</Typography>
      <Typography variant="p">This page is for finding new feeds and content sources.</Typography>
      <div className="max-full flex flex-col items-center justify-center gap-2">
        <Typography variant="h4">Coming Soon...</Typography>
      </div>
    </div>
  );
};

export default page;

import ThemeToggle from "../components/theme/ThemeToggle";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      Home <ThemeToggle />
    </div>
  );
}

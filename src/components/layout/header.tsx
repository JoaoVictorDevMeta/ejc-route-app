import { MobileSidebar } from "./mobile-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "./user-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-2">
        <MobileSidebar />
        <h1 className="text-sm font-medium text-muted-foreground md:hidden">
          EJC · Externa
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
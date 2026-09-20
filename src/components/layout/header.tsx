import { MobileSidebar } from "./mobile-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "./user-nav";
import type { UserInfo } from "./user-nav";

export function Header({ user }: { user: UserInfo }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-primary/10 bg-background/90 px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-2">
        <MobileSidebar />
        <h1 className="text-base font-semibold text-foreground md:hidden">
          EJC · Externa
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserNav user={user} />
      </div>
    </header>
  );
}
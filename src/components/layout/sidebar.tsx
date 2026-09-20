"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Church } from "lucide-react";
import { cn } from "@/lib/utils";
import { navPrincipal, navSecundaria, type NavItem } from "@/lib/nav";

function NavLink({ item, ativo }: { item: NavItem; ativo: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        ativo
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{item.title}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/painel" className="flex items-center gap-2 font-semibold">
          <Church className="h-5 w-5 text-primary" />
          <span>EJC · Externa</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navPrincipal.map((item) => (
          <NavLink key={item.href} item={item} ativo={pathname === item.href} />
        ))}
      </nav>

      <div className="space-y-1 border-t p-4">
        {navSecundaria.map((item) => (
          <NavLink key={item.href} item={item} ativo={pathname === item.href} />
        ))}
      </div>
    </aside>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { navPrincipal, navSecundaria, type NavItem } from "@/lib/nav";

function NavLink({ item, ativo }: { item: NavItem; ativo: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[0.95rem] font-medium transition-all duration-200",
        ativo
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
          : "text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-0.5"
      )}
    >
      <Icon className={cn("h-[18px] w-[18px] transition-transform", !ativo && "group-hover:scale-110")} />
      <span>{item.title}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col border-r border-primary/10 bg-sidebar md:flex md:min-h-screen">
      <div className="flex h-20 items-center border-b border-primary/10 px-7">
        <Link href="/painel" className="flex items-center gap-3 font-semibold">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg shadow-primary/20">
            <Image src="/logo.jpeg" alt="Logo do EJC" width={40} height={40} className="object-contain" />
          </span>
          <span className="text-base tracking-tight">EJC <span className="font-normal text-muted-foreground">· Externa</span></span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-5">
        {navPrincipal.map((item) => (
          <NavLink key={item.href} item={item} ativo={pathname === item.href} />
        ))}
      </nav>

      <div className="space-y-2 border-t border-primary/10 p-5">
        {navSecundaria.map((item) => (
          <NavLink key={item.href} item={item} ativo={pathname === item.href} />
        ))}
      </div>
    </aside>
  );
}
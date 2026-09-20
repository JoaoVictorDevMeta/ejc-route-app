"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { navPrincipal, navSecundaria } from "@/lib/nav";

export function MobileSidebar() {
  const [aberto, setAberto] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={aberto} onOpenChange={setAberto}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" />}
      >
          <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-16 items-center border-b px-6">
          <Link
            href="/painel"
            className="flex items-center gap-2 font-semibold"
            onClick={() => setAberto(false)}
          >
            <Image src="/logo.jpeg" alt="Logo do EJC" width={28} height={28} className="rounded-md object-contain" />
            <span>EJC · Externa</span>
          </Link>
        </div>

        <nav className="space-y-1 p-4">
          {[...navPrincipal, ...navSecundaria].map((item) => {
            const Icon = item.icon;
            const ativo = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAberto(false)}
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
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
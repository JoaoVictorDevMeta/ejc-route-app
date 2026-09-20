import {
  LayoutDashboard,
  Users,
  Car,
  Map,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export const navPrincipal: NavItem[] = [
  { title: "Painel", href: "/painel", icon: LayoutDashboard },
  { title: "Encontristas", href: "/painel/encontristas", icon: Users },
  { title: "Grupos", href: "/painel/grupos", icon: Car },
  { title: "Mapa", href: "/painel/mapa", icon: Map },
];

export const navSecundaria: NavItem[] = [
  { title: "Configurações", href: "/painel/config", icon: Settings },
];
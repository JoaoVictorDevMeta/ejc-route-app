import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await prisma.orm.public.Profile.first({ userId: user.id });
  const userInfo = {
    id: user.id,
    email: profile?.email ?? user.email ?? "",
    nome: profile?.nome ?? user.user_metadata?.nome ?? "Equipe EJC",
    role: profile?.role ?? "equipe",
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header user={userInfo} />
        <main className="flex-1 p-4 md:p-8 lg:px-10 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
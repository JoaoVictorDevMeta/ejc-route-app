import Link from "next/link";
import { Heart } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  );
}

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/10 bg-background/60 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
        <p className="text-center sm:text-left">
          <span className="font-medium text-foreground">
            EJC · Paróquia Menino Jesus de Praga
          </span>
          {" · "}
          <span>© {ano} Todos os direitos reservados.</span>
        </p>

        <p className="flex items-center gap-1.5 text-center sm:text-right">
          <span>Desenvolvido com</span>
          <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
          <span>por</span>
          <Link
            href="https://github.com/JoaoVictorDevMeta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            <GithubIcon className="h-3 w-3" />
            João Victor
          </Link>
        </p>
      </div>
    </footer>
  );
}
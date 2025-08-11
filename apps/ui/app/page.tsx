import Particles from "@/components/ui/particles";
import { auth } from "@clerk/nextjs/server";
// import Particles from "@/components/ui/particles";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId, orgSlug } = await auth();

  if (userId && !orgSlug) {
    redirect("/create-org");
  }

  return (
    <div className="flex flex-col bg-black items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <nav className="my-16 animate-fade-in z-2">
        <ul className="flex items-center justify-center gap-4">
          {userId && orgSlug && (
            <Link
              href={`/team/${orgSlug}`}
              className="text-sm duration-500 text-zinc-400 hover:text-zinc-200"
              prefetch={true}
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/sign-in"
            className="text-sm duration-500 text-zinc-400 hover:text-zinc-200"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="text-sm duration-500 text-zinc-400 hover:text-zinc-200"
          >
            Sign up
          </Link>
          <Link
            href="https://github.com/MrUprizing/docxity"
            className="text-sm duration-500 text-zinc-400 hover:text-zinc-200"
          >
            GitHub
          </Link>
        </ul>
      </nav>
      <div className="bg-background z-2  flex items-center rounded-full border p-1 shadow-sm animate-fade-in">
        <div className="flex -space-x-1.5">
          <img
            className="ring-background rounded-full ring-1"
            src="/avatar.jpeg"
            width={20}
            height={20}
            alt="Avatar 04"
          />
        </div>
        <p className="text-muted-foreground px-2 text-xs">
          Built by{" "}
          <Link
            href="https://github.com/MrUprizing"
            className="text-foreground font-medium"
          >
            MrUprizing
          </Link>{" "}
          developer.
        </p>
      </div>
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <Particles
        className="absolute inset-0 z-1 animate-fade-in"
        quantity={100}
      />
      <h1 className="py-3.5 px-0.5 z-2 text-4xl font-mono font-medium text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text ">
        Docxity
      </h1>

      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="my-16 text-center animate-fade-in z-2">
        <h2 className="text-sm text-zinc-400">
          This app is deploy on{" "}
          <Link
            target="_blank"
            href="https://railway.com"
            className="underline duration-500 hover:text-zinc-200"
          >
            Railway
          </Link>{" "}
          hackathon x Midudev
        </h2>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/lib/config";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import {CursorClickIcon} from "@/components/ui/cursor-click"
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { HelpCircle, LifeBuoy } from "lucide-react"
import { FileCheckIcon } from "@/components/ui/file-check";
import { ArrowUpIcon}  from "@/components/ui/arrow-up"
import { CircleHelpIcon } from "@/components/ui/circle-help";
import { SunDimIcon } from "@/components/ui/sun-dim"
/* ================= TYPES ================= */

type SearchResponse = {
  answer: string;
  sources: string[];
};

type CurrentChatTurn =
  | {
    role: "user";
    content: string;
  }
  | {
    role: "assistant";
    content: string;
    sources: string[];
    time: number;
    error?: string;
  };

/* ================= MAIN PAGE ================= */

export default function Page() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<CurrentChatTurn[]>([]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat]);

  async function runSearch(prompt: string) {
    setLoading(true);
    setChat((old) => [...old, { role: "user", content: prompt }]);
    const start = performance.now();

    try {
      const res = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: prompt }),
      });

      const json = await res.json();
      const time = Math.round(performance.now() - start);

      if (!res.ok) throw new Error("Request failed");

      const data = json as SearchResponse;

      setChat((old) => [
        ...old,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
          time,
        },
      ]);
    } catch {
      const time = Math.round(performance.now() - start);
      setChat((old) => [
        ...old,
        {
          role: "assistant",
          content:
            "I tried to answer, but something went wrong. Please try again.",
          sources: [],
          time,
          error: "Request failed",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleChatSubmit(e: FormEvent) {
    e.preventDefault();
    const prompt = query.trim();
    if (!prompt || loading) return;
    setQuery("");
    await runSearch(prompt);
  }

  return (
    <SidebarProvider>
      {/* ===== LEFT SIDEBAR (ChatGPT-like) ===== */}
      <AppSidebar />

      {/* ===== MAIN CONTENT ===== */}
      <SidebarInset className="flex h-dvh flex-col">

        {/* ===== HEADER ===== */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                Rznish V1 (Web Agent)
              </span>
              <span className="text-[11px] text-muted-foreground">
                Answer with sources
              </span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
            <a
              href="https://rznish-demo.vercel.app/rznishrag/docs"
              target="_blank"
              className="flex items-center gap-2 text-sm font-medium leading-none hover:underline"
            >
              <FileCheckIcon className="h-4 w-4" />
              <span></span>
            </a>

            <a
              href="https://rznish-demo.vercel.app/rznishrag/support"
              className="flex items-center gap-2 text-sm font-medium leading-none hover:underline"
            >
              <CircleHelpIcon className="h-4 w-4" />
              <span></span>
            </a>
          </div>



        </header>


        {/* ===== CHAT BODY ===== */}
        <main
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-muted/40 px-4 py-6"
        >
          <div className="mx-auto max-w-2xl space-y-6">
            {chat.length === 0 && (
              <div className="text-center text-xl text-muted-foreground">
                <div className="text-base font-bold mb-1">
                  ⚡ What’s on your mind today?
                </div>
                <code className="block mt-2 rounded bg-background px-2 py-1 text-xs">
                  🤖 Smart AI agent that searches 🔥 trends, 🆕 latest news, 🎵 viral audios,
                  🎬 reels, ⚖️ comparisons, and 💰 pricing — with sources.
                </code>
              </div>
            )}

            {chat.map((turn, idx) =>
              turn.role === "user" ? (
                <div
                  key={idx}
                  className="flex justify-end"
                >
                  <div className="rounded-2xl bg-gray-200 px-4 py-3 text-m  text-black/120 max-w-full">
                    {turn.content}
                  </div>
                </div>
              ) : (
                <div
                  key={idx}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                    <SunDimIcon className="h-7 w-7 -px-4 text-white" />
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="rounded-2xl bg-background px-4 py-3 text-sm ring-1 ring-border">
                      {turn.content}
                    </div>

                    <div className="text-[11px] text-muted-foreground">
                      answered in {turn.time} ms
                      {turn.error && ` • ${turn.error}`}
                    </div>

                    {turn.sources.length > 0 && (
                      <ul className="text-xs space-y-1">
                        {turn.sources.map((s, i) => (
                          <li key={i}>
                            <Link
                              href={s}
                              target="_blank"
                              className="text-blue-500 underline break-all"
                            >
                              {s}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )
            )}

            {loading && (
              <div className="text-sm text-muted-foreground">
                Thinking…
              </div>
            )}
          </div>
        </main>

        {/* ===== INPUT ===== */}
        <footer className="border-t bg-background px-4 py-6">
          <form
            onSubmit={handleChatSubmit}
            className="mx-auto flex max-w-2xl items-center  bg-white gap-2 rounded-full border px-4 py-2 shadow-m"
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              placeholder="Ask anything"
              className="border-0 focus-visible:ring-0"
            />

            <Button
              type="submit"
              size="icon"
              disabled={loading || query.trim().length < 2}
              className="rounded-full"
               
            >
              < ArrowUpIcon className=" h-4 w-4" />
            </Button>
          </form>
        </footer>

      </SidebarInset>
    </SidebarProvider>
  );
}

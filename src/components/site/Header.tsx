import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LogIn,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

import { getAuthUser } from "@/services/auth";

const nav = [
  { to: "/", label: "خانه" },
  { to: "/charter", label: "اساسنامه" },
  { to: "/beliefs", label: "عقاید" },
  { to: "/news", label: "اخبار" },
  { to: "/membership", label: "عضویت" },
  { to: "/contact", label: "ارتباط با ما" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  const [loggedIn, setLoggedIn] =
    useState(false);

  useEffect(() => {
    let active = true;
    
    async function checkAuth() {
      const user = await getAuthUser();
    
      if (active) {
        setLoggedIn(Boolean(user));
      }
    }
  
    void checkAuth();
  
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setLoggedIn(Boolean(session?.user));
      }
    });
  
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <img
            src="/main logo.jpg"
            alt="حزب ناسیونالیست بزرگ ایران"
            className="h-9 w-auto shrink-0 rounded"
          />

          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-bold text-ink">
              حزب ناسیونالیست بزرگ ایران
            </div>

            <div className="truncate text-[10px] text-muted-foreground">
              NIGP
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-brand"
              activeProps={{
                className:
                  "text-brand bg-accent",
              }}
              activeOptions={{
                exact: item.to === "/",
              }}
            >
              {item.label}
            </Link>
          ))}

          {loggedIn ? (
            <Link
              to="/dashboard"
              className="mr-2 inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-bold text-brand-foreground shadow-soft transition-colors hover:bg-brand/90"
            >
              <UserRound className="h-4 w-4" />
              پنل کاربری
            </Link>
          ) : (
            <Link
              to="/login"
              className="mr-2 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-bold transition-colors hover:bg-accent"
            >
              <LogIn className="h-4 w-4" />
              ورود
            </Link>
          )}
        </nav>

        <button
          type="button"
          aria-label="منو"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border lg:hidden"
          onClick={() =>
            setOpen((value) => !value)
          }
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col p-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                activeProps={{
                  className:
                    "text-brand bg-accent",
                }}
                activeOptions={{
                  exact: item.to === "/",
                }}
              >
                {item.label}
              </Link>
            ))}

            {loggedIn ? (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-bold text-brand-foreground"
              >
                <UserRound className="h-4 w-4" />
                پنل کاربری
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm font-bold"
              >
                <LogIn className="h-4 w-4" />
                ورود
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
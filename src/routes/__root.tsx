import { Outlet, createRootRouteWithContext, useRouter } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-brand">۴۰۴</h1>
        <h2 className="mt-4 text-xl font-bold">صفحه یافت نشد</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابجا شده است.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-bold text-brand-foreground hover:bg-brand/90"
        >
          بازگشت به خانه
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold">خطایی رخ داد</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          بارگذاری این صفحه با مشکل مواجه شد. لطفاً دوباره تلاش کنید.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-brand px-4 py-2 text-sm font-bold text-brand-foreground hover:bg-brand/90"
          >
            تلاش دوباره
          </button>
          <a
            href="/"
            className="rounded-md border border-border px-4 py-2 text-sm font-bold hover:bg-accent"
          >
            بازگشت به خانه
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "حزب ناسیونالیست بزرگ ایران (NIGP)" },
      {
        name: "description",
        content:
          "پایگاه رسمی حزب ناسیونالیست بزرگ ایران — مطالب، اطلاعیه‌ها، دبیرخانه‌ها و عضویت.",
      },
      { property: "og:title", content: "حزب ناسیونالیست بزرگ ایران (NIGP)" },
      {
        property: "og:description",
        content:
          "پایگاه رسمی حزب ناسیونالیست بزرگ ایران — مطالب، اطلاعیه‌ها، دبیرخانه‌ها و عضویت.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

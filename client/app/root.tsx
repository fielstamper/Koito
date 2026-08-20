import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";

import type { Route } from "./+types/root";
import "./themes.css";
import "./app.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./providers/ThemeProvider";
import Sidebar from "./components/sidebar/Sidebar";
import Footer from "./components/Footer";
import { AppProvider } from "./providers/AppProvider";
import { initTimezoneCookie } from "./tz";

initTimezoneCookie();

// Create a client
const queryClient = new QueryClient();

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
     <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function loadtheme() {
                try {
                  var bg = localStorage.getItem("bgcolor");
                  document.documentElement.style.backgroundColor = bg;
                } catch (e) {
                  console.log(e);
                }
              })();
            `,
          }}
        />
       
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link
          rel="icon"
          type="image/png"
          href="https://raw.githubusercontent.com/fielstamper/caitlyn.moe/main/src/assets/cherryblossom.png"
        />
       
        <title>my music</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="My Music" />
        <meta property="og:description" content="check out the stuff i listen to" />
        <meta
          property="og:image"
          content="https://github.com/fielstamper/caitlyn.moe/blob/main/src/assets/lbcaitlynmoe.jpg?raw=true"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="theme-color" content="#1a1a1a" />

        <meta name="apple-mobile-web-app-title" content="Koito" />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen">
        {children}
            <a
          href="https://caitlyn.moe"
          aria-label="Visit caitlyn.moe"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-(--color-primary) px-4 py-2 font-medium text-(--color-bg) shadow-lg transition-opacity hover:opacity-90"
        >
          caitlyn.moe
        </a>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <AppProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <div className="flex-col flex sm:flex-row">
              <Sidebar />
              <div className="flex flex-col items-center mx-auto w-full ml-0 sm:ml-[58px]">
                <Outlet />
                <Footer />
              </div>
            </div>
          </QueryClientProvider>
        </ThemeProvider>
      </AppProvider>
    </>
  );
}

export function HydrateFallback() {
  return null;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  const title = `${message} - Koito`;

  return (
    <AppProvider>
      <ThemeProvider>
        <title>{title}</title>
        <Sidebar />
        <div className="flex">
          <div className="w-full flex flex-col">
            <main className="pt-16 p-4 w-4/5 min-w-[350px] mx-auto flex-grow">
              <div className="md:flex gap-4">
                <img className="w-[200px] rounded mb-3" src="../yuu.jpg" />
                <div>
                  <h1>{message}</h1>
                  <p>{details}</p>
                </div>
              </div>
              {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                  <code>{stack}</code>
                </pre>
              )}
            </main>
            <Footer />
          </div>
        </div>
      </ThemeProvider>
    </AppProvider>
  );
}

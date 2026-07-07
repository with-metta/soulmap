import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protect AI routes so only authenticated users can trigger Anthropic calls.
const isProtectedRoute = createRouteMatcher([
  "/api/reflect(.*)",
  "/api/values(.*)",
  "/api/entries(.*)",
  "/api/user-values(.*)",
  "/api/letters(.*)",
  "/api/ikigai(.*)",
]);

export const proxy = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

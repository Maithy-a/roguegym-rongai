import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
    "/overview(.*)",
    "/members(.*)",
    "/employees(.*)",
    "/billing-plans(.*)",
    "/payments(.*)",
]);

const isPublicRoute = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    if (isPublicRoute(req)) return;
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
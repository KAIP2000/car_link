import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: [
    "/",
    "/rent-your-car",
    "/how-car-link-works",
    "/become-driver",
    // Add a matcher for /cars but exclude /cars/* to protect individual car pages
    // This regex means: match /cars exactly, or /cars/ followed by anything *not* containing another slash (i.e., not a sub-sub-path)
    // and also ensure it doesn't match /cars/ F সরাসরি /cars/anything (protects /cars/some-id)
    // However, Clerk's publicRoutes might not support complex regex directly in this array.
    // A simpler approach is to list known public prefixes and let dynamic routes be protected by default.
    // If /cars itself should be public (e.g. a listing page), it would be added.
    // If all /cars/* should be private, we don't need to add /cars/* here.
    // The default behavior of Clerk middleware is to protect all routes not listed.
    // So, by *not* adding "/cars/(.*)" or similar, all /cars/* routes become protected.
  ]
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
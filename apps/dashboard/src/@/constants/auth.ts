const LOGGED_IN_ONLY_PATHS = [
  // anything that _starts_ with /dashboard is logged in only
  "/dashboard",
  // anything that _starts_ with /cli is logged in only
  "/cli",
  "/support",
  // TODO: add any other logged in only paths here
];

export function isLoginRequired(pathname: string) {
  // exceptions from LOGGED_IN_ONLY_PATHS
  if (pathname.startsWith("/dashboard/connect/playground")) {
    return false;
  }

  return LOGGED_IN_ONLY_PATHS.some((path) => pathname.startsWith(path));
}

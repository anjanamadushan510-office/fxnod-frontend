/** Only these fields from a server-resolved Deriv signup link may enter OAuth. */
export function derivReferralParams(signupUrl: string): URLSearchParams {
  const params = new URLSearchParams();
  let url: URL;
  try {
    url = new URL(signupUrl);
  } catch {
    return params;
  }
  const host = url.hostname.toLowerCase();
  if (url.protocol !== "https:" || url.username || url.password || !["deriv.com", "deriv.me", "deriv.link"].some((domain) => host === domain || host.endsWith(`.${domain}`))) {
    return params;
  }

  // Deriv accepts four equivalent OAuth tracking aliases. Keep the name used
  // by the partner's own link, as Deriv recommends.
  const aliases = ["t", "affiliate_token", "sidi", "ca"] as const;
  const alias = aliases.find((key) => url.searchParams.get(key));
  if (alias) params.set(alias, url.searchParams.get(alias)!);
  else if (url.searchParams.get("sidc")) params.set("t", url.searchParams.get("sidc")!);
  else if (host === "track.deriv.com") {
    const token = url.pathname.split("/").filter(Boolean)[0]?.replace(/^_+|_+$/g, "");
    if (token) params.set("t", token);
  }
  for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) {
    const value = url.searchParams.get(key);
    if (value) params.set(key, value);
  }
  return params;
}

// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { deleteCookie } from "../deps.ts";
import {
  getCookieName,
  getSuccessUrl,
  isSecure,
  redirect,
  SITE_COOKIE_NAME,
} from "./_core.ts";
import { getSessionId } from "./get_session_id.ts";

/**
 * Handles the sign-out process, and then redirects the client to the given
 * success URL.
 *
 * It does this by:
 * 1. Getting the OAuth session ID from the cookie in the given request. If no
 * OAuth session cookie is found, a response that redirects the client to the
 * given redirect URL is returned.
 * 2. Returning a response that invalidates the client's session cookie and
 * redirects the client to the given success URL.
 *
 * See "Redirect URL after Sign-In or Sign-Out" section in the README for more
 * information on the success URL.
 *
 * @example
 * ```ts
 * import { signOut } from "https://deno.land/x/deno_kv_oauth@$VERSION/mod.ts";
 *
 * export async function signOutHandler(request: Request) {
 *   return signOut(request);
 * }
 * ```
 */
export function signOut(request: Request) {
  const sessionId = getSessionId(request);
  const successUrl = getSuccessUrl(request);
  if (sessionId === undefined) return redirect(successUrl);

  const response = redirect(successUrl);
  const cookieName = getCookieName(SITE_COOKIE_NAME, isSecure(request.url));
  deleteCookie(response.headers, cookieName, { path: "/" });
  return response;
}
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { VISITOR_COOKIE, VISITOR_HEADER } from "@/lib/flags";

export function proxy(request: NextRequest) {
  const existing = request.cookies.get(VISITOR_COOKIE)?.value;
  const visitorId = existing ?? crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(VISITOR_HEADER, visitorId);
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  if (!existing) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 180,
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|icon.svg).*)"],
};

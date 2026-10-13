import { headers } from "next/headers";
import { VISITOR_HEADER } from "./flags";

export async function getVisitorId(): Promise<string> {
  const headerStore = await headers();
  return headerStore.get(VISITOR_HEADER) ?? "anonymous";
}

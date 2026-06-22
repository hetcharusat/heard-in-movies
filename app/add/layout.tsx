import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AddLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin_auth");

  if (authCookie?.value !== "authenticated") {
    redirect("/login?from=/add");
  }

  return <>{children}</>;
}

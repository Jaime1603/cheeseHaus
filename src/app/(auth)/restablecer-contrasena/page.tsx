import RestablecerContrasenaForm from "@/components/auth/restablecerContrasenaForm";
import "../auth.css";

export default async function RestablecerContrasenaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return <RestablecerContrasenaForm token={token ?? ""} />;
}


import { GoogleAuthProvider } from "../../lib/providers/GoogleAuthProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleAuthProvider>
      <div className="min-h-screen bg-linear-to-br from-yellow-50 to-blue-50">
        {children}
      </div>
    </GoogleAuthProvider>
  );
}
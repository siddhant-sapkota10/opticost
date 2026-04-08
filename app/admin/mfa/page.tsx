import MfaClient from "./MfaClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMfaPage() {
  return <MfaClient />;
}

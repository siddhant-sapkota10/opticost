import MfaClient from "./MfaClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Login | OptiCost",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMfaPage() {
  return <MfaClient />;
}

import MfaClient from "./MfaClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Portal Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalMfaPage() {
  return <MfaClient />;
}

import type { Metadata } from "next";
import CareersPageClient from "./CareersPageClient";

export const metadata: Metadata = {
  title: "Careers | OptiCost Consulting",
  description:
    "Explore consulting careers at OptiCost Consulting and join a team delivering cost optimisation, financial governance, and Defence advisory outcomes.",
};

export default function CareersPage() {
  return <CareersPageClient />;
}

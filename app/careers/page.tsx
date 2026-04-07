import type { Metadata } from "next";
import CareersPageClient from "./CareersPageClient";

export const metadata: Metadata = {
  title: "Careers",
};

export default function CareersPage() {
  return <CareersPageClient />;
}

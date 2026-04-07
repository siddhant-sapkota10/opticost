import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact | OptiCost Consulting",
  description:
    "Contact OptiCost Consulting to discuss cost optimisation, financial management, Defence program costing, and governance-aligned advisory support.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}

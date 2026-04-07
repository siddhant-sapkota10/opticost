import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: {
    absolute: "OptiCost Consulting",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}

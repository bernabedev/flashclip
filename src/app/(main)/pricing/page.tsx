import PricingSection from "./page.client";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Pricing page for Flashclip",
};

export default function PricingPage() {
  return <PricingSection />;
}

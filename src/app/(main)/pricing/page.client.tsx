"use client";

import PricingCard from "@/components/princing/pricing-card";
import { cn } from "@/lib/utils";
import { CrownIcon, RocketIcon, TargetIcon } from "lucide-react";
import { useState } from "react";

const pricingPlans = [
  {
    name: "Free Plan",
    emoji: <RocketIcon className="size-6" />,
    description: "Start Shining Without Spending a Dime",
    price: 0,
    features: [
      "Up to 3 clips per week",
      "Flashclip watermark",
      "Access to basic templates",
      "Standard quality export",
    ],
    ctaText: "Get Started",
    popular: false,
  },
  {
    name: "Creator Plan",
    emoji: <TargetIcon className="size-6" />,
    description: "Perfect for Growing Streamers",
    price: 12,
    features: [
      "Up to 30 clips per month",
      "No watermark",
      "Access to all templates",
      "HD export",
      "Priority email support",
    ],
    ctaText: "Start Creating",
    popular: true,
  },
  {
    name: "Pro Plan",
    emoji: <CrownIcon className="size-6" />,
    description: "For Full-Time Content Creators",
    price: 29,
    features: [
      "Unlimited clips",
      "Advanced template customization",
      "Full HD / 4K export",
      "Direct upload to TikTok & Instagram",
      "24/7 premium support",
      "Early access to new features",
    ],
    ctaText: "Go Pro",
    popular: false,
  },
];

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  return (
    <section className="pb-2 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className={cn("text-4xl md:text-5xl font-bold mb-2")}>
          Choose Your Plan
        </h1>
        <p className={cn("text-muted-foreground text-lg max-w-2xl mx-auto")}>
          Select the perfect plan to enhance your content creation journey
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div
          className={cn(
            "bg-primary/10 rounded-full p-1 inline-flex scale-90",
            "animate-[fade-in-scale_0.3s_ease-out_0.3s_forwards]"
          )}
        >
          <button
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all",
              billingCycle === "monthly"
                ? "bg-primary text-primary-foreground"
                : "text-foreground cursor-pointer"
            )}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all",
              billingCycle === "yearly"
                ? "bg-primary text-primary-foreground"
                : "text-foreground cursor-pointer"
            )}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly
            <span className="ml-1 text-xs px-2 py-0.5 bg-secondary text-primary-foreground rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <div
            key={plan.name}
            className={cn(
              "translate-y-4 animate-[fade-in-up_0.5s_ease-out_forwards]"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <PricingCard
              plan={plan}
              billingCycle={billingCycle}
              index={index}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

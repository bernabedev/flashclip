"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "../ui/button";

interface PricingPlan {
  name: string;
  emoji: string;
  description: string;
  price: number;
  features: string[];
  ctaText: string;
  popular: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  billingCycle: "monthly" | "yearly";
  index: number;
}

export default function PricingCard({ plan, billingCycle }: PricingCardProps) {
  const yearlyPrice = Math.round(plan.price * 0.8 * 12);

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 h-full",
        plan.popular
          ? "border-2 border-primary scale-105 z-10"
          : "border border-border"
      )}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-medium uppercase tracking-wider rounded-b-xl">
          Most Popular
        </div>
      )}

      <div className="bg-card text-card-foreground h-full flex flex-col">
        <div className="p-6 pb-4">
          <div className="text-4xl mb-2">{plan.emoji}</div>
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {plan.description}
          </p>

          <div className="mt-2 mb-6">
            <span className="text-4xl font-bold">
              ${billingCycle === "monthly" ? plan.price : yearlyPrice}
            </span>
            <span className="text-muted-foreground ml-1">
              /{billingCycle === "monthly" ? "month" : "year"}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 flex-grow">
          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </span>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 pb-6 mt-auto">
          <Button
            className={cn(
              "w-full py-3 px-4 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2",
              plan.popular
                ? "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary"
                : "bg-secondary hover:bg-secondary/80 focus:ring-secondary"
            )}
          >
            {plan.ctaText}
          </Button>
        </div>
      </div>
    </div>
  );
}

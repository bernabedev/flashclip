"use client";

import {
  CheckCircle2,
  Circle,
  Download,
  Film,
  Layers,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Step = {
  id: number;
  name: string;
  icon: React.ReactNode;
  status: "pending" | "processing" | "completed";
};

type LoadingScreenProps = {
  isLoading?: boolean;
  onComplete?: () => void;
};

export default function ClipLoadingScreen({
  isLoading = true,
  onComplete,
}: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingText, setLoadingText] = useState("Preparando tu contenido");
  const [isMounted, setIsMounted] = useState(false);

  const [steps, setSteps] = useState<Step[]>([
    {
      id: 0,
      name: "Inicializando recursos",
      icon: <Layers className="h-5 w-5" />,
      status: "processing",
    },
    {
      id: 1,
      name: "Procesando contenido",
      icon: <Film className="h-5 w-5" />,
      status: "pending",
    },
    {
      id: 2,
      name: "Aplicando efectos visuales",
      icon: <Wand2 className="h-5 w-5" />,
      status: "pending",
    },
    {
      id: 3,
      name: "Optimizando calidad",
      icon: <Sparkles className="h-5 w-5" />,
      status: "pending",
    },
    {
      id: 4,
      name: "Finalizando tu clip",
      icon: <Download className="h-5 w-5" />,
      status: "pending",
    },
  ]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isLoading || currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === currentStep ? { ...step, status: "completed" } : step
        )
      );

      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        setSteps((prevSteps) =>
          prevSteps.map((step) =>
            step.id === nextStep ? { ...step, status: "processing" } : step
          )
        );

        setLoadingText(steps[nextStep].name);
      } else {
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 1000);
        }
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [currentStep, steps, isLoading, onComplete]);

  const renderStepIcon = (step: Step) => {
    if (step.status === "completed") {
      return <CheckCircle2 className="h-5 w-5 text-primary" />;
    } else if (step.status === "processing") {
      return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
    } else {
      return <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600" />;
    }
  };

  const loadingContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="max-w-md w-full mx-auto m-4 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-2">
            {loadingText}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Estamos trabajando en tu clip. Esto solo tomará unos momentos.
          </p>
        </div>

        <div className="relative mb-8">
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center p-4 rounded-lg transition-all duration-500 ease-in-out transform
                ${
                  step.status === "processing"
                    ? "bg-primary/10 dark:bg-primary/10 scale-105"
                    : "bg-white dark:bg-gray-900"
                }
                ${step.status === "completed" ? "opacity-70" : "opacity-100"}
                border ${
                  step.status === "processing"
                    ? "border-primary/40 dark:border-primary/40"
                    : "border-gray-100 dark:border-gray-800"
                }`}
            >
              <div className="mr-4">{renderStepIcon(step)}</div>

              <div
                className={`mr-3 ${
                  step.status === "pending"
                    ? "text-gray-400 dark:text-gray-600"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {step.icon}
              </div>

              <span
                className={`text-sm font-medium ${
                  step.status === "pending"
                    ? "text-gray-500 dark:text-gray-500"
                    : step.status === "processing"
                    ? "text-gray-900 dark:text-gray-100"
                    : "text-gray-700 dark:text-gray-400"
                }`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!isMounted || !isLoading) return null;

  return createPortal(loadingContent, document.body);
}

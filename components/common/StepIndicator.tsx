// components/StepIndicator.tsx
"use client";
import { CheckCircle } from "lucide-react";
import { useTheme } from "@/context/themeContext";

interface StepIndicatorProps {
  currentStep: number;
  steps:       { label: string }[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={`w-full flex items-center p-5 rounded-2xl border mb-10 ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-teal-100"}`}
      style={{ boxShadow: isDark ? "0 2px 24px rgba(0,0,0,0.45)" : "0 2px 16px rgba(13,148,136,0.08)" }}
    >
      {steps.map((step, i) => {
        const s          = i + 1;
        const isComplete = currentStep > s;
        const isActive   = currentStep === s;
        const isLast     = i === steps.length - 1;

        return (
          <>
            {/* Step bubble + label — no flex-1, just shrink-0 */}
            <div key={step.label} className="flex items-center gap-3 flex-shrink-0">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                isComplete ? "bg-teal-600 text-white"
                : isActive  ? "bg-teal-600 text-white ring-4 ring-teal-500/20"
                : isDark    ? "bg-white/[0.05] text-[#444]"
                :             "bg-black/[0.05] text-[#ccc]"
              }`}>
                {isComplete ? <CheckCircle size={14} /> : s}
              </div>

              <span className={`text-xs font-medium hidden sm:block ${
                currentStep >= s
                  ? isDark ? "text-[#f0f0f4]" : "text-[#111]"
                  : isDark ? "text-[#444]"    : "text-[#ccc]"
              }`}>
                {step.label}
              </span>
            </div>

            {/* Connector line — flex-1 sits between steps, not inside them */}
            {!isLast && (
              <div className={`flex-1 h-px mx-4 transition-colors duration-300 ${
                isComplete
                  ? "bg-teal-600"
                  : isDark ? "bg-white/[0.07]" : "bg-black/[0.07]"
              }`} />
            )}
          </>
        );
      })}
    </div>
  );
}
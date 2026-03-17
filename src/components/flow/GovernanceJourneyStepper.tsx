import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { GOV_JOURNEY_STEPS, getGovJourneyIndex } from "@/lib/governance-flow";

interface GovernanceJourneyStepperProps {
  currentFlowStepId: string;
}

export function GovernanceJourneyStepper({ currentFlowStepId }: GovernanceJourneyStepperProps) {
  const currentIndex = getGovJourneyIndex(currentFlowStepId);

  return (
    <div className="w-full py-6 mb-8">
      <div className="relative flex items-center justify-between max-w-3xl mx-auto px-4">
        {/* Connection Line */}
        <div className="absolute left-6 right-6 top-5 h-1 bg-secondary -z-10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${(currentIndex / (GOV_JOURNEY_STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {GOV_JOURNEY_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.id} className="relative flex flex-col items-center group">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : isCurrent
                    ? "bg-background border-primary text-primary shadow-xl shadow-primary/20 scale-110"
                    : "bg-background border-secondary text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>

              <div
                className={cn(
                  "absolute top-12 w-32 text-center transition-all duration-500",
                  isCurrent
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                )}
              >
                <span
                  className={cn(
                    "text-xs font-bold block mb-1",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>
              {isCurrent && (
                <div className="absolute top-12 w-32 text-center">
                  <span className="text-xs font-bold block text-primary">{step.title}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

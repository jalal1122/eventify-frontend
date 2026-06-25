"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema, type EventFormValues } from "./schema";
import { eventsApi } from "@/lib/api";

// We will build these step components next
import StepBasics from "./components/StepBasics";
import StepRegistration from "./components/StepRegistration";
import StepTickets from "./components/StepTickets";
import StepPublish from "./components/StepPublish";
import SuccessScreen from "./components/SuccessScreen";
import { Check, Loader2 } from "lucide-react";
import ProfileDropdown from "@/components/layout/ProfileDropdown";
import { useAuth } from "@/hooks/useAuth";

const STEPS = [
  { id: "basics", title: "Basic Info" },
  { id: "registration", title: "Registration" },
  { id: "tickets", title: "Tickets" },
  { id: "publish", title: "Publish" },
];

export default function CreateEventPage() {
  const { user, isAuthenticated, isLoading, upgradeToOrganizer } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema) as any,
    defaultValues: {
      title: "",
      categoryId: "",
      locationType: "VENUE",
      venueName: "",
      city: "",
      address: "",
      platform: "",
      virtualLink: "",
      overview: "",
      registrationMethod: "INTERNAL",
      visibility: "PUBLIC",
      customQuestions: [],
      tickets: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (isAuthenticated && user?.role === "attendee") {
      setIsUpgrading(true);
      upgradeToOrganizer()
        .then(() => setIsUpgrading(false))
        .catch((err) => {
          console.error("Failed to upgrade role:", err);
          setIsUpgrading(false);
        });
    }
  }, [isAuthenticated, user?.role, upgradeToOrganizer]);

  const { watch, trigger } = methods;
  const registrationMethod = watch("registrationMethod");

  // Determine active steps dynamically based on registration method
  const activeSteps = STEPS.filter((step) => {
    if (registrationMethod === "EXTERNAL" && step.id === "tickets") {
      return false; // Skip tickets step if external link
    }
    return true;
  });

  const handleNext = async () => {
    // Validate current step fields before proceeding
    let fieldsToValidate: any = [];
    const stepId = activeSteps[currentStep].id;
    
    if (stepId === "basics") {
      fieldsToValidate = ["title", "categoryId", "locationType", "venueName", "city", "address", "platform", "virtualLink", "startDate", "overview"];
    } else if (stepId === "registration") {
      fieldsToValidate = ["registrationMethod", "externalUrl", "customQuestions"];
    } else if (stepId === "tickets") {
      fieldsToValidate = ["tickets"];
    }

    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      if (currentStep < activeSteps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // Final submit
        submitEvent();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const submitEvent = async () => {
    try {
      const data = methods.getValues();
      
      // Combine date and time
      let dateTime = new Date().toISOString();
      if (data.startDate) {
        const date = new Date(data.startDate);
        if (data.startTime) {
          const [hours, minutes] = data.startTime.split(":");
          date.setHours(Number(hours), Number(minutes));
        }
        dateTime = date.toISOString();
      }

      const payload = {
        title: data.title,
        description: data.overview,
        category: data.categoryId,
        locationType: data.locationType,
        venueName: data.venueName,
        city: data.city,
        platform: data.platform,
        virtualLink: data.virtualLink,
        dateTime,
        registrationMethod: data.registrationMethod === "EXTERNAL" ? "external" : "native",
        externalUrl: data.externalUrl,
        customFormSchema: data.customQuestions,
        tickets: data.tickets.map(t => ({
           id: t.id,
           type: t.type,
           name: t.name,
           quantity: t.quantity,
           price: t.price || 0,
           paymentAccountType: t.paymentAccountType,
           paymentAccountNumber: t.paymentAccountNumber,
        })),
        organizerProfileId: data.organizerProfileId,
        submitForReview: true,
      };

      const res = await eventsApi.create(payload);
      if (res.data.success) {
        setIsSuccess(true);
      }
    } catch (error: any) {
      console.error("Failed to create event:", error);
      alert(error.response?.data?.message || "Failed to create event. Please try again.");
    }
  };

  if (isSuccess) {
    return <SuccessScreen title={methods.getValues("title")} />;
  }

  if (isLoading || isUpgrading || (isAuthenticated && user?.role === "attendee")) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#006782] animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-[#001F29]">Setting up your organizer profile...</h2>
        <p className="text-gray-500 mt-2">Just a moment while we get things ready.</p>
      </div>
    );
  }

  const currentStepId = activeSteps[currentStep].id;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation Bar */}
      <header className="h-[83px] bg-white border-b border-[#F3F4F6] flex items-center justify-between px-8">
        <div className="font-bold text-xl text-[#006782]">Eventify</div>
        <div className="flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </header>

      <main className="max-w-[1152px] mx-auto pt-16 px-16 pb-32">
        <h1 className="text-4xl font-bold text-[#001F29] mb-12">Create an event</h1>

        {/* Stepper */}
        <div className="flex items-center w-full max-w-3xl mb-16">
          {activeSteps.map((step, index) => {
            const isCompleted = currentStep > index;
            const isActive = currentStep === index;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                      isCompleted || isActive
                        ? "bg-[#006782] border-[#006782] text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <span
                    className={`absolute top-12 text-xs font-medium whitespace-nowrap ${
                      isCompleted || isActive ? "text-[#006782]" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < activeSteps.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mx-4 ${
                      isCompleted ? "bg-[#006782]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <FormProvider {...methods}>
          <form className="bg-transparent" onSubmit={(e) => e.preventDefault()}>
            {currentStepId === "basics" && <StepBasics />}
            {currentStepId === "registration" && <StepRegistration />}
            {currentStepId === "tickets" && <StepTickets />}
            {currentStepId === "publish" && <StepPublish />}
          </form>
        </FormProvider>
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 flex justify-center z-50">
        <div className="w-full max-w-[1152px] flex justify-between items-center px-16">
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="text-[#006782] font-medium hover:underline flex items-center gap-2"
            >
              &larr; Back to Step {currentStep}
            </button>
          ) : (
            <div></div> // empty placeholder for alignment
          )}
          
          <div className="flex items-center gap-6">
            <button className="text-[#006782] font-medium hover:underline">
              Save Draft
            </button>
            <button
              onClick={handleNext}
              className="bg-[#006782] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#004E63] transition-colors"
            >
              {currentStep === activeSteps.length - 1 ? "🚀 Publish Event" : `Continue to Step ${currentStep + 2}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



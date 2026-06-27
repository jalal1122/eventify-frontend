"use client";

import { useState, useEffect, useRef, useCallback, Suspense, use } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema, type EventFormValues } from "../../create/schema";
import { eventsApi } from "@/lib/api";

import StepBasics from "../../create/components/StepBasics";
import StepRegistration from "../../create/components/StepRegistration";
import StepTickets from "../../create/components/StepTickets";
import StepPublish from "../../create/components/StepPublish";
import SuccessScreen from "../../create/components/SuccessScreen";
import { Check, Loader2 } from "lucide-react";
import ProfileDropdown from "@/components/layout/ProfileDropdown";
import { useAuth } from "@/hooks/useAuth";

const STEPS = [
  { id: "basics", title: "Basic Info" },
  { id: "registration", title: "Registration" },
  { id: "tickets", title: "Tickets" },
  { id: "publish", title: "Publish" },
];

const uploadImageIfNeeded = async (urlOrData: string | undefined): Promise<string | undefined> => {
  if (!urlOrData || (!urlOrData.startsWith("blob:") && !urlOrData.startsWith("data:"))) {
    return urlOrData;
  }
  try {
    const response = await fetch(urlOrData);
    const blob = await response.blob();
    const file = new File([blob], "image.jpg", { type: "image/jpeg" });
    const res = await eventsApi.uploadImage(file);
    return res.data.url;
  } catch (error) {
    console.error("Failed to upload image:", error);
    return urlOrData;
  }
};

function EditEventForm({ eventId: draftId }: { eventId: string }) {
  const { user, isAuthenticated, isLoading, upgradeToOrganizer } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [eventId, setEventId] = useState<string | null>(draftId || null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  
  const eventIdRef = useRef<string | null>(draftId || null);
  const isSavingRef = useRef(false);

  useEffect(() => {
    eventIdRef.current = eventId;
  }, [eventId]);

  const isInitialLoad = useRef(true);

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

  // Load existing event data
  useEffect(() => {
    if (draftId && isAuthenticated) {
      setIsLoadingEvent(true);
      eventsApi.getById(draftId).then((res) => {
        if (res.data.success && res.data.event) {
          const ev = res.data.event;
          
          // organizerProfileId may be a populated object or a string
          const orgProfileId = typeof ev.organizerProfileId === "object" && ev.organizerProfileId !== null
            ? (ev.organizerProfileId._id || ev.organizerProfileId.id || "")
            : (ev.organizerProfileId || "");

          methods.reset({
            title: ev.title || "",
            categoryId: ev.category || "",
            locationType: ev.locationType || "VENUE",
            venueName: ev.venueName || "",
            city: ev.city || "",
            address: "",
            platform: ev.platform || "",
            virtualLink: ev.virtualLink || "",
            overview: ev.description || "",
            registrationMethod: ev.registrationMethod === "external" ? "EXTERNAL" : "INTERNAL",
            visibility: "PUBLIC",
            externalUrl: ev.externalUrl || "",
            customQuestions: ev.customFormSchema || [],
            tickets: (ev.tickets || []).map((t: any) => ({
              id: t.id,
              type: t.type,
              name: t.name,
              quantity: t.quantity,
              price: t.price,
              paymentAccountType: t.paymentAccountType,
              paymentAccountNumber: t.paymentAccountNumber,
            })),
            organizerProfileId: orgProfileId,
            startDate: ev.dateTime ? new Date(ev.dateTime) : undefined,
            startTime: ev.dateTime ? new Date(ev.dateTime).toISOString().split('T')[1].slice(0,5) : "",
            bannerUrl: ev.bannerUrl || "",
            cardImageUrl: ev.cardImageUrl || "",
          });
        }
      }).catch(err => {
        console.error("Failed to load event:", err);
      }).finally(() => {
        // Small delay so the form has time to populate before auto-save kicks in
        setTimeout(() => {
          isInitialLoad.current = false;
          setIsLoadingEvent(false);
        }, 500);
      });
    } else {
      isInitialLoad.current = false;
      setIsLoadingEvent(false);
    }
  }, [draftId, isAuthenticated, methods]);

  // Auto-save logic
  const saveDraft = useCallback(async (isManual = false) => {
    if (isSavingRef.current && !isManual) return;
    const data = methods.getValues();
    if (!data.organizerProfileId) return;

    try {
      isSavingRef.current = true;
      if (isManual) setIsSaving(true);
      
      let dateTime = undefined;
      if (data.startDate) {
        const date = new Date(data.startDate);
        if (data.startTime) {
          const [hours, minutes] = data.startTime.split(":");
          date.setHours(Number(hours), Number(minutes));
        }
        dateTime = date.toISOString();
      }

      const uploadedBannerUrl = await uploadImageIfNeeded(data.bannerUrl);
      const uploadedCardImageUrl = await uploadImageIfNeeded(data.cardImageUrl);

      const payload = {
        title: data.title,
        description: data.overview,
        bannerUrl: uploadedBannerUrl,
        cardImageUrl: uploadedCardImageUrl,
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
        submitForReview: false,
      };

      const currentEventId = eventIdRef.current;
      if (currentEventId) {
        await eventsApi.update(currentEventId, payload);
      } else {
        const res = await eventsApi.create(payload);
        if (res.data.success && res.data.event?._id) {
          eventIdRef.current = res.data.event._id;
          setEventId(res.data.event._id);
        }
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      isSavingRef.current = false;
      if (isManual) setIsSaving(false);
    }
  }, [methods]);

  useEffect(() => {
    const subscription = methods.watch((value, { name, type }) => {
      if (isInitialLoad.current) return;
      
      const { organizerProfileId } = methods.getValues();
      if (!organizerProfileId) return;
      
      const handler = setTimeout(() => {
        saveDraft();
      }, 5000);
      
      return () => clearTimeout(handler);
    });
    return () => subscription.unsubscribe();
  }, [methods, saveDraft]);

  const { watch, trigger } = methods;
  const registrationMethod = watch("registrationMethod");

  const activeSteps = STEPS.filter((step) => {
    if (registrationMethod === "EXTERNAL" && step.id === "tickets") {
      return false;
    }
    return true;
  });

  const handleNext = async () => {
    let fieldsToValidate: any = [];
    const stepId = activeSteps[currentStep].id;
    
    if (stepId === "basics") {
      fieldsToValidate = ["title", "categoryId", "locationType", "venueName", "city", "address", "platform", "virtualLink", "startDate", "overview"];
    } else if (stepId === "registration") {
      fieldsToValidate = ["registrationMethod", "externalUrl", "customQuestions"];
    } else if (stepId === "tickets") {
      fieldsToValidate = ["tickets"];
    }
    
    const isValid = await trigger(fieldsToValidate);
    
    if (currentStep < activeSteps.length - 1) {
      await saveDraft(true);
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - publish
      try {
        setIsSaving(true);
        const data = methods.getValues();
        
        let dateTime = undefined;
        if (data.startDate) {
          const date = new Date(data.startDate);
          if (data.startTime) {
            const [hours, minutes] = data.startTime.split(":");
            date.setHours(Number(hours), Number(minutes));
          }
          dateTime = date.toISOString();
        }

        const uploadedBannerUrl = await uploadImageIfNeeded(data.bannerUrl);
        const uploadedCardImageUrl = await uploadImageIfNeeded(data.cardImageUrl);

        const payload = {
          title: data.title,
          description: data.overview,
          bannerUrl: uploadedBannerUrl,
          cardImageUrl: uploadedCardImageUrl,
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

        const currentEventId = eventIdRef.current;
        if (currentEventId) {
          await eventsApi.update(currentEventId, payload);
        } else {
          const res = await eventsApi.create(payload);
          if (res.data.success && res.data.event?._id) {
            eventIdRef.current = res.data.event._id;
            setEventId(res.data.event._id);
          }
        }
        setIsSuccess(true);
      } catch (error) {
        console.error("Failed to publish event:", error);
        alert("Failed to publish event. Please try again.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (isSuccess) {
    return <SuccessScreen eventId={eventId} />;
  }

  if (isLoading || isLoadingEvent) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#006782] animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-[#001F29]">Loading event data...</h2>
        <p className="text-gray-500 mt-2">Please wait while we fetch your event.</p>
      </div>
    );
  }

  if (isUpgrading) {
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
        <h1 className="text-4xl font-bold text-[#001F29] mb-12">Edit event</h1>

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
            <div></div>
          )}
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => saveDraft(true)}
              disabled={isSaving}
              className="text-[#006782] font-medium hover:underline flex items-center gap-2"
            >
              {isSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : lastSaved ? (
                <><Check className="w-4 h-4" /> Saved at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              onClick={handleNext}
              className="bg-[#006782] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#004E63] transition-colors"
            >
              {currentStep === activeSteps.length - 1 ? "🚀 Update Event" : `Continue to Step ${currentStep + 2}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#006782] animate-spin mb-4" />
      </div>
    }>
      <EditEventForm eventId={resolvedParams.id} />
    </Suspense>
  );
}

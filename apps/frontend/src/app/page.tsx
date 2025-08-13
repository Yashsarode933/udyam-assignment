"use client";

import { useEffect, useMemo, useState } from "react";

type Field = {
  name: string;
  label: string;
  type: string;
  required: boolean;
  pattern?: string;
  options?: string[];
};

type Step = {
  step: number;
  title: string;
  fields: Field[];
};

export default function Home() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoadingSchema, setIsLoadingSchema] = useState(true);

  useEffect(() => {
    fetch("/api/schema")
      .then((res) => res.json())
      .then((data) => {
        setSteps(data.steps || []);
        setIsLoadingSchema(false);
      })
      .catch(() => {
        setSteps([]);
        setIsLoadingSchema(false);
      });
  }, []);

  const currentStep = useMemo(
    () => steps.find((s) => s.step === activeStep),
    [steps, activeStep]
  );

  function validateField(field: Field, value: string): string | null {
    if (field.required && !value) return `${field.label} is required`;
    if (value && field.pattern) {
      const re = new RegExp(field.pattern);
      if (!re.test(value)) return `${field.label} format is invalid`;
    }
    return null;
  }

  function onChange(field: Field, value: string) {
    setFormData((prev) => ({ ...prev, [field.name]: value }));
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field.name]: err || "" }));
  }

  // Bonus: Auto-fill city/state by PIN using PostPin API
  useEffect(() => {
    const pin = formData["pincode"] || "";
    if (/^[1-9][0-9]{5}$/.test(pin)) {
      (async () => {
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
          const data = await res.json();
          const post = data?.[0];
          const office = post?.PostOffice?.[0];
          if (office) {
            setFormData((prev) => ({
              ...prev,
              state: office.State || prev.state || "",
              city: office.Block || office.District || prev.city || "",
            }));
          }
        } catch {}
      })();
    }
  }, [formData["pincode"]]);

  function canContinue(): boolean {
    if (!currentStep) return false;
    return currentStep.fields.every((f) => !validateField(f, formData[f.name] || ""));
  }

  function onNext() {
    if (!currentStep) return;
    if (!canContinue()) return;
    if (activeStep < (steps[steps.length - 1]?.step || 2)) {
      setActiveStep(activeStep + 1);
    }
  }

  async function submit() {
    setIsLoading(true);
    try {
      const payload = { step: activeStep, data: formData };
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4001/api/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      // You could add a toast notification here
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Udyam Registration
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Steps {activeStep} of {steps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {Math.round((activeStep / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(activeStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  activeStep >= step.step
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.step}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${
                    activeStep > step.step ? "bg-purple-600" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {isSubmitted ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
            <p className="text-gray-600 mb-6">Your Udyam registration has been successfully submitted.</p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({});
                setActiveStep(1);
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
            >
              Start New Registration
            </button>
          </div>
        ) : isLoadingSchema ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Form</h2>
            <p className="text-gray-600">Please wait while we prepare your registration form...</p>
          </div>
        ) : currentStep ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {currentStep.title}
              </h2>
              <p className="text-gray-600">
                Please provide the required information to continue
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {currentStep.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {field.options ? (
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white text-gray-900"
                      value={formData[field.name] || ""}
                      onChange={(e) => onChange(field, e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                      type={
                        field.type === "tel"
                          ? "tel"
                          : field.type === "number"
                          ? "number"
                          : "text"
                      }
                      value={formData[field.name] || ""}
                      onChange={(e) => onChange(field, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                  {!!errors[field.name] && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{errors[field.name]}</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    activeStep > 1
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                  disabled={activeStep === 1}
                >
                  ← Back
                </button>

                {activeStep < (steps[steps.length - 1]?.step || 2) ? (
                  <button
                    type="button"
                    disabled={!canContinue()}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                      canContinue()
                        ? "bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={onNext}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!canContinue() || isLoading}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                      canContinue() && !isLoading
                        ? "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={submit}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : null}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Secure registration powered by Udyam Portal</p>
        </div>
    </div>
    </main>
  );
}

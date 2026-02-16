import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { User, Zap, Heart, Target, Check, ChevronLeft } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import * as api from "../services/api";

const steps = [
  { icon: User, label: "Name" },
  { icon: Zap, label: "Experience" },
  { icon: Heart, label: "Interests" },
  { icon: Target, label: "Goal" },
];

const experiences = [
  { emoji: "🌱", label: "Never Tried SQL" },
  { emoji: "🌿", label: "Beginner" },
  { emoji: "🌳", label: "Intermediate" },
  { emoji: "🏔️", label: "Advanced" },
];

const interests = [
  { 
    emoji: "⚽", 
    label: "Sports",
    image: "https://images.unsplash.com/photo-1758227231013-8cff978f1dae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwZ2FtZXxlbnwxfHx8fDE3NzExNjI1MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    emoji: "🎬", 
    label: "Cinema",
    image: "https://images.unsplash.com/photo-1739433437912-cca661ba902f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzcxMTU1NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    emoji: "🛒", 
    label: "E-Commerce",
    image: "https://images.unsplash.com/photo-1658297063569-162817482fb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBzaG9wcGluZyUyMG9ubGluZXxlbnwxfHx8fDE3NzExOTA2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    emoji: "🏥", 
    label: "Healthcare",
    image: "https://images.unsplash.com/photo-1769147555720-71fc71bfc216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMGhvc3BpdGFsfGVufDF8fHx8MTc3MTE4NjU4NXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    emoji: "📱", 
    label: "Social",
    image: "https://images.unsplash.com/photo-1670761301226-675b7cebd5b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG5ldHdvcmt8ZW58MXx8fHwxNzcxMjQ0ODUyfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    emoji: "🎮", 
    label: "Gaming",
    image: "https://images.unsplash.com/photo-1635372708431-64774de60e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBlc3BvcnRzJTIwY29udHJvbGxlcnxlbnwxfHx8fDE3NzEyNDQ4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    emoji: "🎵", 
    label: "Music",
    image: "https://images.unsplash.com/photo-1557750674-2472a8fe08fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc3MTI0NDg1Mnww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    emoji: "📚", 
    label: "Education",
    image: "https://images.unsplash.com/photo-1542725752-e9f7259b3881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsZWFybmluZyUyMGJvb2tzfGVufDF8fHx8MTc3MTE0MTA1Mnww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    emoji: "✈️", 
    label: "Travel",
    image: "https://images.unsplash.com/photo-1698047637205-6bc3317765b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhaXJwbGFuZSUyMGRlc3RpbmF0aW9ufGVufDF8fHx8MTc3MTI0NDg1M3ww&ixlib=rb-4.1.0&q=80&w=1080"
  },
];

const goals = [
  { emoji: "🎓", label: "College/Academic" },
  { emoji: "💼", label: "Job Interview Prep" },
  { emoji: "🚀", label: "Career Switch" },
  { emoji: "🤔", label: "Just Curious" },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedExperience, setSelectedExperience] = useState(-1);
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const [selectedGoal, setSelectedGoal] = useState(-1);

  const canProceed = () => {
    if (currentStep === 0) return name.trim().length > 0;
    if (currentStep === 1) return selectedExperience >= 0;
    if (currentStep === 2) return selectedInterests.length >= 2 && selectedInterests.length <= 3;
    if (currentStep === 3) return selectedGoal >= 0;
    return false;
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Mark onboarding as completed in the backend
        await api.updateProfile({ onboardingCompleted: true });
        
        // Also save to localStorage as fallback
        localStorage.setItem('hasCompletedOnboarding', 'true');
        
        navigate("/app");
      } catch (error) {
        console.error("Error updating onboarding status:", error);
        // Still navigate even if the update fails
        navigate("/app");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleInterest = (index: number) => {
    if (selectedInterests.includes(index)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== index));
    } else if (selectedInterests.length < 3) {
      setSelectedInterests([...selectedInterests, index]);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col px-6 py-8"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* Progress Header */}
      <div className="mb-12">
        <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
          Step {currentStep + 1} of 4
        </p>

        {/* Progress Bar */}
        <div className="h-2 rounded-full mb-6" style={{ backgroundColor: "var(--bg-elevated)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / 4) * 100}%`,
              background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
            }}
          />
        </div>

        {/* Step Icons */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isCurrent ? "scale-110" : ""
                  }`}
                  style={{
                    backgroundColor: isCompleted ? "var(--color-primary)" : "transparent",
                    border: isCompleted
                      ? "none"
                      : isCurrent
                      ? "2px solid var(--color-primary)"
                      : "2px solid var(--text-muted)",
                    color: isCompleted
                      ? "var(--bg-base)"
                      : isCurrent
                      ? "var(--color-primary)"
                      : "var(--text-muted)",
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1"
      >
        {currentStep === 0 && (
          <div>
            <h2 className="text-3xl mb-8" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
              What's your name?
            </h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-6 py-4 rounded-2xl text-lg outline-none"
              style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--color-border)",
                color: "var(--text-primary)",
              }}
              autoFocus
            />
            {name && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl mt-6"
                style={{ color: "var(--text-primary)" }}
              >
                Hey {name}! 👋
              </motion.p>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h2 className="text-3xl mb-8" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
              Your SQL Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedExperience(index)}
                  className="w-full px-6 py-5 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: selectedExperience === index ? "rgba(0, 212, 170, 0.1)" : "var(--bg-card)",
                    border: selectedExperience === index
                      ? "2px solid var(--color-primary)"
                      : "1px solid var(--color-border)",
                  }}
                >
                  <span className="text-3xl">{exp.emoji}</span>
                  <span className="flex-1 text-left text-lg" style={{ color: "var(--text-primary)" }}>
                    {exp.label}
                  </span>
                  {selectedExperience === index && (
                    <Check className="w-6 h-6" style={{ color: "var(--color-primary)" }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-3xl mb-8" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
              Pick Your Interests
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {interests.map((interest, index) => {
                const isSelected = selectedInterests.includes(index);
                return (
                  <button
                    key={index}
                    onClick={() => toggleInterest(index)}
                    className={`aspect-square rounded-2xl overflow-hidden relative transition-all ${
                      isSelected ? "scale-105" : ""
                    }`}
                    style={{
                      border: isSelected
                        ? "3px solid var(--color-primary)"
                        : "1px solid var(--color-border)",
                    }}
                  >
                    <ImageWithFallback
                      src={interest.image}
                      alt={interest.label}
                      className="w-full h-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 flex items-end justify-center pb-3"
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
                      }}
                    >
                      <span className="text-sm font-semibold px-2" style={{ color: "#ffffff" }}>
                        {interest.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div 
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        <Check className="w-4 h-4" style={{ color: "var(--bg-base)" }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-center" style={{ color: "var(--text-secondary)" }}>
              {selectedInterests.length}/3 selected
            </p>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-3xl mb-8" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
              What's Your Goal?
            </h2>
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedGoal(index)}
                  className="w-full px-6 py-5 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: selectedGoal === index ? "rgba(0, 212, 170, 0.1)" : "var(--bg-card)",
                    border: selectedGoal === index
                      ? "2px solid var(--color-primary)"
                      : "1px solid var(--color-border)",
                  }}
                >
                  <span className="text-3xl">{goal.emoji}</span>
                  <span className="flex-1 text-left text-lg" style={{ color: "var(--text-primary)" }}>
                    {goal.label}
                  </span>
                  {selectedGoal === index && (
                    <Check className="w-6 h-6" style={{ color: "var(--color-primary)" }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-12">
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="px-6 py-4 rounded-2xl flex items-center gap-2 transition-all active:scale-[0.98]"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--color-border)",
              color: "var(--text-primary)",
            }}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1 px-6 py-4 rounded-2xl font-semibold transition-all disabled:opacity-50 active:scale-[0.98]"
          style={{
            backgroundColor: canProceed() ? "var(--color-primary)" : "var(--bg-elevated)",
            color: canProceed() ? "var(--bg-base)" : "var(--text-muted)",
          }}
        >
          {currentStep === 3 ? "Get Started" : "Continue"}
        </button>
      </div>
    </div>
  );
}
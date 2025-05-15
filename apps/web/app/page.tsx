"use client";
import { FaGithub } from "react-icons/fa";
import { useForm, type SubmitHandler } from "react-hook-form";
import styles from "./page.module.css";
import Input from "./components/Input/Input";
import Button from "./components/Button/Button";
import InputTextarea from "./components/InputTextarea/InputTextarea";
import InputCheckbox from "./components/InputCheckbox/InputCheckbox";
import { useEffect, useState } from "react";

// Types for form steps
type InitialData = {
  name: string;
  dateOfBirth: string;
  hometown: string;
  occupation: string;
};
type FeedbackData = {
  runId: string;
  stepId: string;
  feedback: string;
  isSatisfied: boolean;
};

export default function Home() {
  const [runId, setRunId] = useState<string>();
  const [isGeneratingHistory, setIsGeneratingHistory] =
    useState<boolean>(false);
  const [historyPreview, setHistoryPreview] = useState<string>();
  const [storyPreview, setStoryPreview] = useState<string>();
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);

  // Input Form
  const {
    register: registerInitialStep,
    handleSubmit: handleInitialStepSubmit,
    formState: {
      errors: initialInputErrors,
      isSubmitting: isInitialInputSubmitting,
    },
  } = useForm<InitialData>();
  const onSubmitInitialStep: SubmitHandler<InitialData> = async (data) => {
    try {
      setIsGeneratingHistory(true);

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Step 1 error ${res.status}`);

      const result: any = await res.json(); // Something might be wrong here so setting any

      setRunId(result.runId);
      setHistoryPreview(
        result.data.steps["provide-more-context"].payload.history
      );

      setIsGeneratingHistory(false);
    } catch (err) {
      setIsGeneratingHistory(false);
      console.error(err);
    }
  };

  // History Feedback Form
  const {
    register: registerHistoryFeedbackStep,
    handleSubmit: handleHistoryFeedbackSubmit,
    setValue: setHistoryFeedbackValue,
    formState: {
      errors: historyFeedbackErrors,
      isSubmitting: isHistoryFeedbackSubmitting,
    },
  } = useForm<FeedbackData>();

  const onHistoryFeedbackSubmit: SubmitHandler<FeedbackData> = async (data) => {
    try {
      setIsGeneratingStory(true);

      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Step 2 error ${res.status}`);

      const result: any = await res.json();

      setStoryPreview(
        result.data.steps["provide-story-feedback"].payload.story
      );

      setIsGeneratingStory(false);
    } catch (err) {
      setIsGeneratingStory(false);
      console.error(err);
    }
  };

  // Story  Feedback Form
  const {
    register: registerStoryFeedbackStep,
    handleSubmit: handleStoryFeedbackSubmit,
    setValue: setStoryFeedbackValue,
    formState: {
      errors: storyFeedbackErrors,
      isSubmitting: isSubmittingStoryFeedback,
    },
  } = useForm<FeedbackData>();

  const onStoryFeedbackSubmit: SubmitHandler<FeedbackData> = async (data) => {
    try {
      setIsGeneratingStory(true);

      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Step 2 error ${res.status}`);

      const result: any = await res.json();

      setStoryPreview(
        result.data.steps["provide-story-feedback"].payload.story
      );

      setIsGeneratingStory(false);
    } catch (err) {
      setIsGeneratingStory(false);
      console.error(err);
    }
  };

  // Sets run id on hidden step values when present or changes
  useEffect(() => {
    if (!runId) return;
    setHistoryFeedbackValue("runId", runId);
    setStoryFeedbackValue("runId", runId);
  }, [runId]);

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <span className="h2">Family Storybooks</span>
        <a
          href="https://github.com/justono1/family-history-storybook"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub size={"32"} />
        </a>
      </nav>
      <main className={styles.main}>
        {/* ← Left sidebar */}
        <aside className={styles.sidebar}>
          <form onSubmit={handleInitialStepSubmit(onSubmitInitialStep)}>
            {/* initial input form */}
            <Input
              label="Name"
              {...registerInitialStep("name", { required: "Name is required" })}
              error={initialInputErrors.name?.message}
            />
            <Input
              label="Date of Birth"
              {...registerInitialStep("dateOfBirth", {
                required: "Date of birth is required",
              })}
              error={initialInputErrors.dateOfBirth?.message}
            />
            <Input
              label="Hometown"
              {...registerInitialStep("hometown", {
                required: "Hometown is required",
              })}
              error={initialInputErrors.hometown?.message}
            />
            <Input
              label="Occupation"
              {...registerInitialStep("occupation", {
                required: "Occupation is required",
              })}
              error={initialInputErrors.occupation?.message}
            />
            <Button type="submit" loading={isInitialInputSubmitting}>
              Start
            </Button>
          </form>

          {/* history feedback form */}
          <form onSubmit={handleHistoryFeedbackSubmit(onHistoryFeedbackSubmit)}>
            <Input
              label="Run Id"
              type="hidden"
              {...registerHistoryFeedbackStep("runId", {
                required: "runId is required",
              })}
              error={historyFeedbackErrors.runId?.message}
            />
            <Input
              label="Step Id"
              type="hidden"
              value={"provide-more-context"}
              {...registerHistoryFeedbackStep("stepId", {
                required: "stepId is required",
              })}
              error={historyFeedbackErrors.stepId?.message}
            />
            <InputTextarea
              label="Provide additional context"
              {...registerHistoryFeedbackStep("feedback", {})}
              error={historyFeedbackErrors.feedback?.message}
            />
            <InputCheckbox
              label="I have no more context to provide"
              {...registerHistoryFeedbackStep("isSatisfied")}
            />
            <Button type="submit" loading={isHistoryFeedbackSubmitting}>
              Next
            </Button>
          </form>

          {/* story feedback form */}
          <form onSubmit={handleStoryFeedbackSubmit(onStoryFeedbackSubmit)}>
            <Input
              label="Run Id"
              type="hidden"
              {...registerStoryFeedbackStep("runId", {
                required: "runId is required",
              })}
              error={storyFeedbackErrors.runId?.message}
            />
            <Input
              label="Step Id"
              type="hidden"
              value={"provide-story-feedback"}
              {...registerStoryFeedbackStep("stepId", {
                required: "stepId is required",
              })}
              error={storyFeedbackErrors.stepId?.message}
            />
            <InputTextarea
              label="Provide feedback on story"
              {...registerStoryFeedbackStep("feedback", {})}
              error={storyFeedbackErrors.feedback?.message}
            />
            <InputCheckbox
              label="I am happy with the story"
              {...registerStoryFeedbackStep("isSatisfied")}
            />
            <Button type="submit" loading={isSubmittingStoryFeedback}>
              Complete
            </Button>
          </form>
        </aside>

        {/* → Right content area */}
        <section className={styles.content}>
          {(historyPreview || storyPreview) && (
            <>
              {/* Render HTML from historyPreview */}
              <div dangerouslySetInnerHTML={{ __html: historyPreview! }} />

              {storyPreview && (
                <>
                  <hr className={styles.divider} />
                  {/* Render HTML from storyPreview */}
                  <div dangerouslySetInnerHTML={{ __html: storyPreview! }} />
                </>
              )}
            </>
          )}
          {(isGeneratingHistory || isGeneratingStory) && (
            <p>Generating preview...</p>
          )}
        </section>
      </main>
    </div>
  );
}

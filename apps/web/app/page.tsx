"use client";
import { FaGithub } from "react-icons/fa";
import { useForm, type SubmitHandler } from "react-hook-form";
import styles from "./page.module.css";
import Input from "./components/Input/Input";
import Button from "./components/Button/Button";
import InputTextarea from "./components/InputTextarea/InputTextarea";
import InputCheckbox from "./components/InputCheckbox/InputCheckbox";
import { useEffect, useState } from "react";
import { VNextWorkflowRunResult } from "@mastra/client-js";

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

const workFlowStepIds: string[] = [
  "provide-more-context",
  "generate-story-and-ask-for-feedback",
  "provide-story-feedback",
  "create-family-story",
  "provide-story-feedback",
];

export default function Home() {
  const [runId, setRunId] = useState<string>();
  const [isGeneratingHistory, setIsGeneratingHistory] =
    useState<boolean>(false);
  const [historyPreview, setHistoryPreview] = useState<string>();
  const [storyPreview, setStoryPreview] = useState<string>();
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);

  // Step 1 form
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1, isSubmitting: isSubmitting1 },
  } = useForm<InitialData>();
  const onSubmitStep1: SubmitHandler<InitialData> = async (data) => {
    try {
      setIsGeneratingHistory(true);
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Step 1 error ${res.status}`);
      const result: any = await res.json(); // Something might be wrong here so setting any
      console.log("Step1 success:", result);
      console.log(
        "result.data.steps['provide-more-context'].payload.history:",
        result.data.steps["provide-more-context"].payload.history
      );
      setRunId(result.runId);
      setHistoryPreview(
        result.data.steps["provide-more-context"].payload.history
      );
      setIsGeneratingHistory(false);
      console.log(result);
    } catch (err) {
      setIsGeneratingHistory(false);
      console.error(err);
    }
  };

  // Step 2 form
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    formState: { errors: errors2, isSubmitting: isSubmitting2 },
  } = useForm<FeedbackData>();

  useEffect(() => {
    if (!runId) return;
    setValue2("runId", runId);
    setValue2("stepId", workFlowStepIds[0]!);
  }, [runId]);

  const onSubmitStep2: SubmitHandler<FeedbackData> = async (data) => {
    try {
      console.log("data resume: ", data);
      setIsGeneratingStory(true);
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Step 2 error ${res.status}`);
      const result: any = await res.json();
      console.log("Step2 success:", result);
      setStoryPreview(
        result.data.steps["provide-story-feedback"].payload.story
      );
      setIsGeneratingStory(false);
      console.log(result);
    } catch (err) {
      setIsGeneratingStory(false);
      console.error(err);
    }
  };

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
          <form onSubmit={handleSubmit1(onSubmitStep1)}>
            <Input
              label="Name"
              {...register1("name", { required: "Name is required" })}
              error={errors1.name?.message}
            />
            <Input
              label="Date of Birth"
              {...register1("dateOfBirth", {
                required: "Date of birth is required",
              })}
              error={errors1.dateOfBirth?.message}
            />
            <Input
              label="Hometown"
              {...register1("hometown", { required: "Hometown is required" })}
              error={errors1.hometown?.message}
            />
            <Input
              label="Occupation"
              {...register1("occupation", {
                required: "Occupation is required",
              })}
              error={errors1.occupation?.message}
            />
            <Button type="submit" loading={isSubmitting1}>
              Next
            </Button>
          </form>

          <form onSubmit={handleSubmit2(onSubmitStep2)}>
            <Input
              label="Run Id"
              type="hidden"
              {...register2("runId", { required: "runId is required" })}
              error={errors1.name?.message}
            />
            <Input
              label="Step Id"
              type="hidden"
              {...register2("stepId", { required: "stepId is required" })}
              error={errors1.name?.message}
            />
            <InputTextarea
              label="Provide additional context"
              {...register2("feedback", {
                required: "Feedback is required",
                minLength: { value: 5, message: "Minimum 5 characters" },
              })}
              error={errors2.feedback?.message}
            />
            <InputCheckbox
              label="Progress to next step"
              {...register2("isSatisfied")}
            />
            <Button type="submit" loading={isSubmitting2}>
              Next
            </Button>
          </form>
        </aside>

        {/* → Right content area */}
        <section className={styles.content}>
          {(historyPreview || storyPreview) && (
            <>
              {/* Render HTML from historyPreview */}
              <div
                dangerouslySetInnerHTML={{ __html: historyPreview! }}
              />

              {storyPreview && (
                <>
                  <hr className={styles.divider} />
                  {/* Render HTML from storyPreview */}
                  <div
                    dangerouslySetInnerHTML={{ __html: storyPreview! }}
                  />
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

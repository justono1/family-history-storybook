"use client";
import { FaGithub, FaSpinner } from "react-icons/fa";
import { useEffect, useState, useCallback } from "react";
import styles from "./page.module.css";
import InitialForm, {
  InitialFormInputs,
} from "./components/Forms/InitialForm/InitialForm";
import HistoryFeedbackForm, {
  HistoryFeedbackFormInputs,
} from "./components/Forms/HistoryFeedbackForm/HistoryFeedbackForm";
import StoryFeedbackForm, {
  StoryFeedbackFormInputs,
} from "./components/Forms/StoryFeedbackForm/StoryFeedbackForm";
import Button from "./components/Button/Button";

// Form types handled in child components

export default function Home() {
  const [runId, setRunId] = useState<string>();
  // 0=initial, 1=history feedback, 2=story feedback, 3=done
  const [step, setStep] = useState<number>(0);
  const [isGeneratingHistory, setIsGeneratingHistory] =
    useState<boolean>(false);
  const [historyPreview, setHistoryPreview] = useState<string>();
  const [storyPreview, setStoryPreview] = useState<string>();
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);

  // Handler for initial data submission
  const onSubmitInitialStep = async (data: InitialFormInputs) => {
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
      // move to history feedback step
      setStep(1);
      setIsGeneratingHistory(false);
    } catch (err) {
      setIsGeneratingHistory(false);
      console.error(err);
    }
  };

  // Handler for history feedback submission
  const onHistoryFeedbackSubmit = async (data: HistoryFeedbackFormInputs) => {
    try {
      setIsGeneratingHistory(true);

      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Step 2 error ${res.status}`);

      const result: any = await res.json();

      // Initial preview set
      if (result?.data?.steps["provide-more-context"]?.payload?.history) {
        setHistoryPreview(
          result.data.steps["provide-more-context"].payload.history
        );
      }

      if (result?.data?.steps["provide-more-context"]?.output?.history) {
        setHistoryPreview(
          result.data.steps["provide-more-context"].output.history
        );
      }

      // Initial Story set
      if (result?.data?.steps["provide-story-feedback"]?.payload?.story) {
        setStoryPreview(
          result.data.steps["provide-story-feedback"].payload.story
        );
      }
      // if user accepted history, move to story feedback step
      if (data.isSatisfied) {
        setStep(2);
      }

      setIsGeneratingHistory(false);
    } catch (err) {
      setIsGeneratingHistory(false);
      console.error(err);
    }
  };

  // Handler for story feedback submission
  const onStoryFeedbackSubmit = async (data: StoryFeedbackFormInputs) => {
    try {
      setIsGeneratingStory(true);

      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Step 2 error ${res.status}`);

      const result: any = await res.json();

      // Initial preview set
      if (result?.data?.steps["provide-story-feedback"]?.payload?.story)
        setStoryPreview(
          result.data.steps["provide-story-feedback"].payload.story
        );

      // If Step is completed set the output
      if (result?.data?.steps["provide-story-feedback"]?.output?.story) {
        setStoryPreview(
          result?.data?.steps["provide-story-feedback"]?.output?.story
        );
      }
      // if user is satisfied with story, finish
      if (data.isSatisfied) {
        setStep(3);
      }

      setIsGeneratingStory(false);
    } catch (err) {
      setIsGeneratingStory(false);
      console.error(err);
    }
  };

  useEffect(() => {
    if (storyPreview) {
      // Scroll to top of <div dangerouslySetInnerHTML={{ __html: storyPreview! }} />
      const storyPreviewDiv = document.querySelector(".story-preview");
      if (storyPreviewDiv) {
        storyPreviewDiv.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [storyPreview])

  // Handler to download story preview as PDF
  const handleDownload = useCallback(async () => {
    if (!storyPreview) return;

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const element = document.querySelector(".story-preview") as HTMLElement | null;
    if (element) {
      await doc.html(element, {
        callback: (pdf) => {
          pdf.save("story.pdf");
        },
        x: 10,
        y: 10,
      });
    } else {
      // Fallback to plain text if element not found
      const text = storyPreview.replace(/<[^>]+>/g, "");
      doc.text(text, 10, 10);
      doc.save("story.pdf");
    }
  }, [storyPreview]);

  // Child forms set their own hidden values via useEffect internally

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
          <div
            className={`${styles.stepContainer} ${step === 0 ? styles.visibleStep : ""}`}
          >
            <InitialForm onSubmit={onSubmitInitialStep} />
          </div>
          <div
            className={`${styles.stepContainer} ${step === 1 ? styles.visibleStep : ""}`}
          >
            <HistoryFeedbackForm
              runId={runId}
              onSubmit={onHistoryFeedbackSubmit}
              previousResponse={historyPreview}
            />
          </div>
          <div
            className={`${styles.stepContainer} ${step === 2 ? styles.visibleStep : ""}`}
          >
            <StoryFeedbackForm
              runId={runId}
              onSubmit={onStoryFeedbackSubmit}
              previousResponse={storyPreview}
            />
          </div>
          <div
            className={`${styles.stepContainer} ${step === 3 ? styles.visibleStep : ""}`}
          >
            <h4>All Done!</h4>
            <p>You completed story is here ready for you to download.</p>
            <Button onClick={handleDownload}>Download Story PDF</Button>
          </div>
        </aside>

        {/* → Right content area */}
        <section className={styles.content}>
          {(historyPreview || storyPreview) && (
            <div className={styles.innerContainer}>
              {/* Render HTML from historyPreview */}
              {/* Hackathon deserves some danger */}
              <div dangerouslySetInnerHTML={{ __html: historyPreview! }} />

              {storyPreview && (
                <>
                  <hr className={styles.divider} />
                  {/* Render HTML from storyPreview */}
                  {/* Hackathon deserves some danger */}
                  <div className={["story-preview", styles.storyPreview].join(" ")} dangerouslySetInnerHTML={{ __html: storyPreview! }} />
                </>
              )}
            </div>
          )}
          {(isGeneratingHistory || isGeneratingStory) && (
            <div className={styles.spinner}>
              <FaSpinner className={styles.spinnerIcon} />
              <span>Generating preview...</span>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

"use client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import Input from "../../Input/Input";
import InputTextarea from "../../InputTextarea/InputTextarea";
import InputCheckbox from "../../InputCheckbox/InputCheckbox";
import Button from "../../Button/Button";

export type HistoryFeedbackFormInputs = {
  runId: string;
  stepId: string;
  feedback: string;
  isSatisfied: boolean;
  previousResponse: string;
};

interface HistoryFeedbackFormProps {
  runId?: string;
  previousResponse?: string;
  onSubmit: SubmitHandler<HistoryFeedbackFormInputs>;
}

export default function HistoryFeedbackForm({
  runId,
  onSubmit,
  previousResponse,
}: HistoryFeedbackFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<HistoryFeedbackFormInputs>();

  // subscribe to changes on isSatisfied
  const isSatisfied = watch("isSatisfied");

  // wrap submit handler to clear feedback textarea after successful submit
  const onFormSubmit: SubmitHandler<HistoryFeedbackFormInputs> = async (data) => {
    await onSubmit(data);
    // clear textarea for next input
    setValue("feedback", "");
  };

  useEffect(() => {
    if (runId) {
      setValue("runId", runId);
    }
    if (previousResponse) {
      setValue("previousResponse", previousResponse);
    }
    setValue("stepId", "provide-more-context");
  }, [runId, previousResponse, setValue]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <h4>History Feedback</h4>
      <p>
        Review the text on the right. We have more questions and ideas that you
        can provide more context on below.
      </p>
      <Input
        label="Run Id"
        type="hidden"
        {...register("runId", { required: "runId is required" })}
        error={errors.runId?.message}
      />
      <Input
        label="Step Id"
        type="hidden"
        {...register("stepId", { required: "stepId is required" })}
        error={errors.stepId?.message}
      />
      <Input
        label="Previous Response"
        type="hidden"
        {...register("previousResponse", {})}
        error={errors.stepId?.message}
      />
      <InputTextarea
        label="Provide additional context"
        {...register("feedback")}
        error={errors.feedback?.message}
      />
      <InputCheckbox
        label="I have no more context to provide"
        {...register("isSatisfied")}
      />
      <Button type="submit" loading={isSubmitting}>
        {isSatisfied ? "Next" : "Provide Feedback"}
      </Button>
    </form>
  );
}

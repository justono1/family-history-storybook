"use client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import Input from "../../Input/Input";
import InputTextarea from "../../InputTextarea/InputTextarea";
import InputCheckbox from "../../InputCheckbox/InputCheckbox";
import Button from "../../Button/Button";

export type StoryFeedbackFormInputs = {
  runId: string;
  stepId: string;
  feedback: string;
  isSatisfied: boolean;
};

interface StoryFeedbackFormProps {
  runId?: string;
  onSubmit: SubmitHandler<StoryFeedbackFormInputs>;
}

export default function StoryFeedbackForm({
  runId,
  onSubmit,
}: StoryFeedbackFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StoryFeedbackFormInputs>();

  // subscribe to changes on isSatisfied
  const isSatisfied = watch("isSatisfied");

  useEffect(() => {
    if (runId) {
      setValue("runId", runId);
    }
    setValue("stepId", "provide-story-feedback");
  }, [runId, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <InputTextarea
        label="Provide feedback on story"
        {...register("feedback")}
        error={errors.feedback?.message}
      />
      <InputCheckbox
        label="I am happy with the story"
        {...register("isSatisfied")}
      />
      <Button type="submit" loading={isSubmitting}>
        {isSatisfied ? "Complete" : "Provide Feedback"}
      </Button>
    </form>
  );
}

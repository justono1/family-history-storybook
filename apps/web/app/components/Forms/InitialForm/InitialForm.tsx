"use client";
import { useForm, type SubmitHandler } from "react-hook-form";
import Input from "../../Input/Input";
import Button from "../../Button/Button";

export type InitialFormInputs = {
  name: string;
  dateOfBirth: string;
  hometown: string;
  occupation: string;
};

interface InitialFormProps {
  onSubmit: SubmitHandler<InitialFormInputs>;
}

export default function InitialForm({ onSubmit }: InitialFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InitialFormInputs>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p>
        Fill out the form below and click get start to start uncovering the
        history of your loved one.
      </p>
      <Input
        label="Name"
        {...register("name", { required: "Name is required" })}
        error={errors.name?.message}
      />
      <Input
        label="Date of Birth"
        {...register("dateOfBirth", {
          required: "Date of birth is required",
        })}
        error={errors.dateOfBirth?.message}
      />
      <Input
        label="Hometown"
        {...register("hometown", { required: "Hometown is required" })}
        error={errors.hometown?.message}
      />
      <Input
        label="Occupation"
        {...register("occupation", { required: "Occupation is required" })}
        error={errors.occupation?.message}
      />
      <Button type="submit" loading={isSubmitting}>
        Start
      </Button>
    </form>
  );
}

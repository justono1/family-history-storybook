"use client";
import { FaGithub } from "react-icons/fa";
import { useForm, type SubmitHandler } from "react-hook-form";
import styles from "./page.module.css";
import Input from "./components/Input/Input";
import Button from "./components/Button/Button";
import InputTextarea from "./components/InputTextarea/InputTextarea";
import InputCheckbox from "./components/InputCheckbox/InputCheckbox";

// Types for form steps
type InitialData = {
  name: string;
  dateOfBirth: string;
  hometown: string;
  occupation: string;
};
type FeedbackData = {
  feedback: string;
  isSatisfied: boolean;
};

export default function Home() {
  // Step 1 form
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1, isSubmitting: isSubmitting1 },
  } = useForm<InitialData>();
  const onSubmitStep1: SubmitHandler<InitialData> = async (data) => {
    try {
      // const res = await fetch("/api/step1", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });
      // if (!res.ok) throw new Error(`Step 1 error ${res.status}`);
      // console.log("Step1 success:", await res.json());
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Step 2 form
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2, isSubmitting: isSubmitting2 },
  } = useForm<FeedbackData>();
  const onSubmitStep2: SubmitHandler<FeedbackData> = async (data) => {
    try {
      // const res = await fetch("/api/step2", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });
      // if (!res.ok) throw new Error(`Step 2 error ${res.status}`);
      // console.log("Step2 success:", await res.json());
      console.log(data);
    } catch (err) {
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
              {...register2("isSatisfied", { required: "Agreement required" })}
              error={
                errors2.isSatisfied ? "You must agree to continue" : undefined
              }
            />
            <Button type="submit" loading={isSubmitting2}>
              Next
            </Button>
          </form>
        </aside>

        {/* → Right content area */}
        <section className={styles.content}>
          <h1>Welcome!</h1>
          <p>This is your main content area.</p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vero nemo
          laudantium beatae officiis sed corporis, placeat sequi aliquid quod
          repellat ratione commodi ab repellendus, iste ex accusamus! Animi,
          enim quasi. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Vero nemo laudantium beatae officiis sed corporis, placeat sequi
          aliquid quod repellat ratione commodi ab repellendus, iste ex
          accusamus! Animi, enim quasi. Lorem ipsum dolor, sit amet consectetur
          adipisicing elit. Vero nemo laudantium beatae officiis sed corporis,
          placeat sequi aliquid quod repellat ratione commodi ab repellendus,
          iste ex accusamus! Animi, enim quasi. Lorem ipsum dolor, sit amet
          consectetur adipisicing elit.
        </section>
      </main>
    </div>
  );
}

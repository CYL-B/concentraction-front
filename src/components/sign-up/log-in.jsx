import Checkbox from "../input/checkbox.jsx";
import { Input } from "../input/input.jsx";
import { Button } from "../button.jsx";
import { Link } from "../links.jsx";
import { Heading1 } from "../typography.jsx";

import { useForm } from "react-hook-form";

//redirecting from react router
import { useNavigate } from "react-router-dom";

//Apollo client import
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../services/queries.jsx";

//zod validation import
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function LogInForm({ signUp }) {
  const schema = z.object({
    email: z.string().min(1, { message: "Required" }).email({message: "Invalid email"}),
    password: z.string().min(10, {message: "Too short"}).max(20, {message: "Too long"}),
    terms: z.boolean().refine(value => value === true, { message: "You must accept the terms and conditions" })
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const navigate = useNavigate();

  const [login, { data, loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      if (data.login.success == true && data.login.token != null) {
        const tokenFromBack = data.login.token;
        const token = sessionStorage.setItem("token", tokenFromBack);
        console.log(token);
        //redirection
        navigate("/dashboard");
      }
    },
  });

  const onSubmit = (loginData) => {
    try {
      login({
        variables: {
          content: { email: loginData.email, password: loginData.password },
        },
      });
    } catch (res) {
      const errors = res.graphQLErrors.map((error) => {
        return error.message;
      });
    }
  };
  return (
    <>
      <Heading1>Log in</Heading1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          name="email"
          register={register}
          ariaInvalid={errors.email ? "true" : "false"}
          required
          errors={errors.email}
        />
        <Input
          name="password"
          register={register}
          ariaInvalid={errors.password ? "true" : "false"}
          required
          type="password"
          errors={errors.password}
          
        />
        <Checkbox name="terms" register={register} required errors={errors.terms}/>
        <Button role="submit" type="submit">
          {" "}
          Log-in{" "}
        </Button>
        <Link variant="fineprint" onClick={signUp}>
          Don't have an account? Sign up !{" "}
        </Link>
      </form>
    </>
  );
}

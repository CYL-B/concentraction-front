/** Organism in charge of the sign-up and log-in logic. It includes several inputs registered with react hook form  */
import { useEffect } from "react";
import Checkbox from "../input/checkbox.jsx";
import { Input } from "../input/input.jsx";
import { Button } from "../button.jsx";
import { Link } from "../links.jsx";
import { Heading1 } from "../typography.jsx";
import { useForm } from "react-hook-form";

//redirecting from react router
import { useNavigate } from "react-router-dom";

//sessionStorage
import { useSessionStorage } from "../../utils/hooks/sessionStorage.jsx";
//Apollo client import
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../../services/queries.jsx";

//zod validation import
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function SignUpForm({ logIn }) {
  const schema = z.object({
    name: z.string().min(1, { message: "Required" }).max(20, {message: "Too long"}),
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

  const [addUser, { data, loading, error }] = useMutation(ADD_USER, {
    onCompleted: (data) => {
      const dataFromBack = data.addUser;
      if (dataFromBack.success == true && dataFromBack.token != null) {
       console.log(dataFromBack.token);
        const token = sessionStorage.setItem("token", dataFromBack.token);        
        navigate("/dashboard");
      }
    },
  });
  const onSubmit = (data) => {
    console.log(data);
    try {
      addUser({
        variables: {
          name: data.name,
          content: { email: data.email, password: data.password }
        },
      });
    } catch (res) {
      const errors = res.graphQLErrors.map((error) => {
        return error.message;
      });
      console.log(errors);
    }
    
  };
  return (
    <>
      <Heading1>Sign Up</Heading1>
      <form
        className="flex flex-col gap-1 lg:gap-8 items-center justify-between w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          placeholder="Nom"
          name="name"
          register={register}
          required
          type="text"
          aria-invalid={errors.name ? "true" : "false"}
          errors={errors.name}
        />
        {/* <Input
          placeholder="Prénom"
          name="Prénom"
          register={register}
          required={true}
          type="text"
        /> */}
        <Input
          placeholder="Email"
          name="email"
          register={register}
          required
          type="email"
          aria-invalid={errors.email ? "true" : "false"}
          errors={errors.email}
        />
        <Input
          placeholder="Password"
          name="password"
          register={register}
          required
          type="password"
          aria-invalid={errors.password ? "true" : "false"}
          errors={errors.password}
        />

        <Checkbox name="terms" register={register} errors={errors.terms}/>
        <Button role="submit" type="submit">
          Sign up
        </Button>
        <Link variant="fineprint" onClick={logIn}>
          Already have an account? Log in
        </Link>
      </form>
    </>
  );
}

import { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";


import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { loginScheme, LoginFormData } from "../../schemas/login.schemas";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./Passworinput";



export default function Login() {

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginScheme),
    mode: "onSubmit",
  });

  const onSubmit =  async (data: LoginFormData) => {
    console.log("Form Data:", data);
  };

  // await new Promise((resolve) => setTimeout(resolve, 1000));

  

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
      <div className="grid place-items-center h-screen">
      <Card>
        <h2 className="text-3xl font-bold mb-2">Login</h2>
        <EmailInput/>
        <PasswordInput/>

        <Button text="Login" type="submit" />
        <div className="flex justify-center gap-1">
        <span>create an account</span>
        <Link to="/register" className="link link-primary">click here</Link>
        </div>
      </Card>
   </div>
   </form>
          </FormProvider>
  )
}


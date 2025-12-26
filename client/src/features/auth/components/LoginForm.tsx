// Login Forms works just to collect data and validate formats (is the email an email?) 
// Keep the login form "dumb" Presentational.

import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";


import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { LoginFormData } from "../schemas/login.schemas";
import { EmailInput } from "../components/EmailInput";
import { PasswordInput } from "../components/PasswordInput";


type LoginFormProps = {
    onSubmit: (data: LoginFormData) => Promise<void> | void;
    methods: UseFormReturn<LoginFormData>;
}
export default function LoginForm({ onSubmit, methods }: LoginFormProps ) {
 
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

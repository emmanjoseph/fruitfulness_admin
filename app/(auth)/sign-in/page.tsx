"use client"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { signIn } from "@/lib/api"

const formSchema = z.object({
  email: z
    .string()
    .min(5, "Invalid email address.")
    .max(32, "Email address must be at most 32 characters."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password must be at most 100 characters."),
})

export default function Page() {
  const router = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

async function onSubmit(data: z.infer<typeof formSchema>) {
  try {
    toast.loading("Signing you in...");

    const result = await signIn(data.email, data.password);
    console.log("login result", result);
    
    // Log token if available (dev mode only)
    if (result?.token) {
      console.log("Token created:", result.token);
    }

    toast.dismiss();
    toast.success("Signed in successfully");

    router.push("/");
  } catch (err) {
    toast.dismiss();
    toast.error("Invalid email or password");
    console.error("Sign in error:", err);
  }
}


  
  return (
  <div className='min-h-screen flex items-center justify-center font-sans'>
    <div className="relative hidden bg-[url(/hero-img.png)] lg:block w-1/2 h-screen">
     <div className="w-full h-full bg-linear-60 from-black p-10 flex flex-col justify-between">
       <h1 className='font-bold'>Fruifulness Travel <br /> Admin Panel</h1>
       <p className='max-w-lg'>Welcome to your tour management dashboard. Sign in to manage bookings, update itineraries, and deliver unforgettable experiences to your travelers.</p>
     </div>
    </div>
    <div className="w-full md:w-1/2 ">
   
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-120 mx-auto p-3 space-y-4">
             <div className="py-2">
          <h2 className="font-semibold">Welcome back</h2>
    </div>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) =>(
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="text-xs">
                    Email address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="enter your email"
                    autoComplete="off"
                    className="rounded-3xl h-14"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              ) }
            
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) =>(
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="text-xs">
                    Password
                  </FieldLabel>

                  <div className="flex items-center gap-x-1.5">
                     <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="enter your password"
                    autoComplete="off"
                    type={showPassword ? "text" : "password"}
                    className="rounded-3xl h-14"
                  />

                  <Button type="button" variant={'ghost'} size={'icon-lg'} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (<EyeOff />) : (<EyeOff className="opacity-50" />)}
                  </Button>
                  </div>
                 
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              ) }
            
            />

           <Button type="submit" className="w-full rounded-3xl h-12 mt-4 cursor-pointer">
              <p className="font-semibold">Sign In</p>
           </Button>
      {/* ... */}
      {/* Build the form here */}
      {/* ... */}
    </form>
    </div>
   
  </div> 
  )
}
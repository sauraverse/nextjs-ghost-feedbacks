'use client'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"


const SignIn = () => {
   
  const {toast} = useToast();
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    if(result?.error){
      if(result.error == 'CredentialsSignin'){
        toast({
          title: "Login Failed",
          description: 'Incorrect username/email or password',
          variant: 'destructive'
        }) 
      } else{
        toast({
          title: "Error",
          description: result.error,
          variant: 'destructive'
        })
      }
    }
    if(result?.url){
      router.replace('/dashboard')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-900" >
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-950 text-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Continue Ghost Messages
          </h1>
          <p className="mb-4">Sign-in to continue your anonymous journey👻<br /><span className="text-yellow-500"><i>Incase you see a <strong>White Screen</strong> after Logging in, just <strong>Refresh</strong> the page! And things will go normal. We're working on a fix.<br />Thanks for your patience in advance!!</i></span></p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" className="bg-zinc-900"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" className="bg-zinc-900"
                      {...field}                      
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <Button type="submit" className="bg-slate-100 text-black text-md hover:bg-slate-200">
             Login
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not registered yet? {' '} <Link href='/sign-up' className="text-blue-600 hover:text-blue-800 underline"> Create new Account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
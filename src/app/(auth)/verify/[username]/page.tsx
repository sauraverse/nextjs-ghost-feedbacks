'use client'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponses'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username: string}>()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        
      })
      const onSubmit = async (data:z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`,{
                username: params.username,
                code: data.code
            })

            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace('/sign-in')
        } catch (error) {
          console.error("Error in signup of user", error)
          const axiosError = error as AxiosError<ApiResponse>;
           
          toast({
            title: 'Signup failed',
            description: axiosError.response?.data.message,
            variant: 'destructive'
          })
        }
      }

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-900" >
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md bg-zinc-950 text-white">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Verify Your Account
            </h1>
            <p className="mb-4">Enter verification code sent to your email</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter verification code" className='bg-zinc-900' autoComplete='off'
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
          />
          <Button type="submit" className="bg-slate-100 text-black text-md hover:bg-slate-200">
            Submit
          </Button>
          </form>
        </Form>  
      </div>
    </div>
  )
}

export default VerifyAccount
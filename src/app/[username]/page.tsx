
'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponses';


export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  
  const messageContent = form.watch('content');
  
  const [isLoading, setIsLoading] = useState(false);
  
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });
      
      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const specialChar = '||';
  
  const parseStringMessages = (messageString: string): string[] => {
    if (!messageString.includes(specialChar)) {
      return [messageString];
    }
    return messageString.split(specialChar);
  };
  
  const initialMessageString =
    "Thanks for being the vodka to my cranberry juice. We make a killer team... for forgetting bad decisions.||You're basically a walking, talking anti-depressant💊💉. Thanks for keeping me from spontaneously blasting💥.||Pretty sure my coffee is stronger than your will to live today. ☕️";
  const [completion, setCompletion] = useState(initialMessageString)
  
  //   const {
  //   complete,
  //   completion,
  //   isLoading: isSuggestLoading,
  //   error
  // } = useCompletion({
  //   api: '/api/suggest-messages',
  //   initialCompletion: initialMessageString,
  // });

  const fetchSuggestedMessages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/suggest-messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        }
      })
      if(!response.ok){
        setCompletion(initialMessageString)
      }
      const json = await response.json()
      setCompletion(json)
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally{
      setIsLoading(false)
    }
  };

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-zinc-900">
    <div className="container mx-auto my-8 p-6 bg-zinc-900 text-white rounded max-w-4xl">
      <h1 className="text-4xl font-black mb-6 text-center">
        <Link href='/'>👻Ghost Messages</Link>
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none bg-zinc-800"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled className="bg-slate-100 text-black text-md hover:bg-slate-200">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent} className="bg-slate-100 text-black text-md hover:bg-slate-200">
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      <Separator className="my-9 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      <div className="space-y-4 my-8">
        <div className="space-y-2 text-center mb-10">
          <h1 className="text-2xl font-bold mb-6  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text" >✨ Ask AI for some Suggestions</h1>
          <Button
            onClick={fetchSuggestedMessages}
            className="w-full md:w-auto bg-slate-100 text-black text-lg ring-4 border-0 rounded ring-purple-600 hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-white" variant={'outline'}
            disabled={isLoading}
          >
            ✨ Generate more Suggestions
          </Button>
        </div>
        <p className="ml-1 text-md italic text-slate-300 ">Click on any message below to select it.</p>
        <Card className='pb-1 bg-zinc-950 text-white border-purple-600'>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 bg-zinc-950">
            {
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 bg-zinc-900 text-left break-words flex items-center p-2 h-20 overflow-auto"
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="whitespace-normal break-words">{message}</div>
                </Button>
              ))
            }
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button className="bg-slate-100 text-black text-md hover:bg-slate-200">Create Your Account</Button>
        </Link>
      </div>
    </div>
    </div>
    <footer className="text-center p-2 md:p-6 bg-zinc-950 text-white">
    © 2024 Ghost Messages. <br />Visit developer <a href="https://sauraverse.com" target='_blank'>@<span className='underline'>sauraverse</span></a>
  </footer>
    </>
  );
}
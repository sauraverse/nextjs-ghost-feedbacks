'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-zinc-900 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text pb-2">
          Hear What Friends Think, Without Knowing Who
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Ghost Messages - Truthful Words, Hidden Voices
          </p> 
          <div className='mt-5'>
            <Link href='/sign-up'>
            <Button className=" text-lg ring-4 border-0 rounded ring-purple-600 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white" variant={'outline'}>Sign Up</Button>
            </Link>
            <p className="mt-2 md:mt-4 text-gray-400 md:text-md">
              Get onboard! Start receiving your messages
            </p>
          </div>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2800 })]}
          className="w-full max-w-lg md:max-w-xl "
        >
          <CarouselContent >
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4 ">
                <Card className='border-2 border-purple-700'>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
        </Carousel>
                
      </main>

      {/* Footer */}
      <footer className="text-center p-2 md:p-6 bg-zinc-950 text-white">
        © 2024 Ghost Messages. <br />Visit developer <a href="https://sauraverse.com" target='_blank'>@<span className='underline'>sauraverse</span></a>
      </footer>
    </>
  );
}

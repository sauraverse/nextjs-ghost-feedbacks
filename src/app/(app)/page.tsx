'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import Autoplay from 'embla-carousel-autoplay'
import messages from '@/messages.json'

const Home = () => {
  return (
    <>
    <main>
      <section>
        <h1>Dive into the world of anonymous conversations</h1>
        <p>Explore Ghost Feedbacks - Where your identity remains a secret.</p>
      </section>

      <Carousel plugins={[Autoplay({delay: 2000})]} className="w-full max-w-xs">
      <CarouselContent>
        {
          messages.map((message, index)=> (
            
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{message.content}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
    
    </>
  )
}

export default Home
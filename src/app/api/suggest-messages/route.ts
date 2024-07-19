import { GoogleGenerativeAI } from "@google/generative-ai";
import { StreamingTextResponse } from 'ai';
import { NextResponse } from "next/server";


// Access your API key as an environment variable.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey as string);



export async function POST(req: Request) {

  try {
    // Choose a model that's appropriate for your use case.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const prompt = "Generate a list of three short (using less than 20 tokens) one-way message suitable for sending anonymously to a friend. Each question should be separated by '||'. The message should be positive or complimentary towards the recipient, use simple English, and incorporate a touch of dark humor that is lighthearted and not offensive. Here are some elements to consider including (all optional): A relatable situation or object compared to the friend in a humorous way., A friendly dark twist on a positive sentiment., A reference to pop culture or current events with a dark spin. For example, your output should be structured like this: 'Thanks for being the lime🍋 to my Tequila🥂! We make a killer team... for forgetting bad decisions.||You're basically sunshine in human form! Even on the gloomiest days, you brighten my mood. ☀️||Pretty sure my coffee is stronger than your will to live today. ☕️'. Ensure the messages are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  // const stream = new ReadableStream({
  //   start(controller) {
  //     controller.enqueue(text);
  //     controller.close();
  //   }
  // });
  
  // // Respond with the stream
  // return new StreamingTextResponse(stream);
  return NextResponse.json(text)
 
  } catch (error) {
      console.error("Unexpected errror occured", error);
      throw error
    }
}
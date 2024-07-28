'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Message} from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponses"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const Dashboard = () => {

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const {toast} = useToast()

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message)=> message._id !== messageId))
  }

  const {data: session} = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const {register, watch, setValue} = form;

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async ()=> {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessages)

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error accepting messages",
        description: axiosError.response?.data.message || 'Failed to fetch message settings', 
        variant: 'destructive' 
      })
    } finally{
      setIsSwitchLoading(false)
    }
  },[setValue, toast])

  const fetchMessages = useCallback(async (refresh: boolean = false)=>{
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      
      setMessages(response.data.message as any || [])
      if(refresh){
        toast({
          title: "Refreshed Messages",
          description: 'Showing latest messages' 
        })
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error refreshing message",
        description: axiosError.response?.data.message || 'Failed to fetch message settings', 
        variant: 'destructive'
      })

    } finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  },[setIsLoading, setMessages, toast])

  useEffect(()=>{
    if(!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue, toast, fetchAcceptMessage, fetchMessages])

  //handle switch change
  const handleSwitchChange = async ()=>{
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: response.data.message,
        variant: 'default'
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || 'Failed to fetch message settings', 
        variant: 'destructive'
      })
    }
  }

  if(!session || !session.user) {

    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-600">
      <div className="space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
  }

  const {username} = session.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: "Profile URL has been copied"
    })
  }



   return (
    <div className="bg-zinc-700">
    <div className="my-8 mx-auto p-6 bg-zinc-700 text-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered rounded w-full p-2 mr-2 text-white"
          />
          <Button onClick={copyToClipboard} className="bg-slate-100 text-black text-md hover:bg-slate-200">Copy</Button>
        </div>
          <p className="ml-1 text-sm italic text-slate-300 mb-5">Want more secret messages? Share this link with friends to get some!</p>
      </div>

      <div className="mb-4 mt-5">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4 bg-slate-100 text-black"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display. Share your link with friends to get some!</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default Dashboard
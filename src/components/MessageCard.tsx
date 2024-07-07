'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Message } from "@/model/User";
import { useToast } from "./ui/use-toast";
import { ApiResponse } from "@/types/ApiResponses";
import axios, { AxiosError } from "axios";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import dayjs from 'dayjs';
  

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: any) => void;
}  
const MessageCard = ({message, onMessageDelete}:MessageCardProps) => {
    const {toast} = useToast()
    const handleDeleteConfirm = async ()=> {
        try {
            const response = await axios.delete<ApiResponse>(
              `/api/delete-message/${message._id}`
            );
            toast({
              title: response.data.message,
            });
            onMessageDelete(message._id);
      
          } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
              title: 'Error',
              description:
                axiosError.response?.data.message ?? 'Failed to delete message',
              variant: 'destructive',
            });
          } 
        
    }
  return (
    <Card className="card-bordered">
        <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>{message.content}</CardTitle>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant='destructive'><X className="w-6 h-6"/></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Sure want to delete this message permanently?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your message
                        and remove from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction style={{ backgroundColor: 'red', color: 'white' }} onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        <div>
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
            
        </CardHeader>
        
    </Card> 


  )
}

export default MessageCard
  
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
import axios from "axios";
import { X } from "lucide-react";
  

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}  
const MessageCard = ({message, onMessageDelete}:MessageCardProps) => {
    const {toast} = useToast()
    const handleDeleteConfirm = async ()=> {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast({
            title: response.data.message
        })
        
    }
  return (
    <Card>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>

            <AlertDialog>
                <AlertDialogTrigger><X/></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Sure want to delete this message permanently?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <CardDescription>Card Description</CardDescription>
        </CardHeader>
        
    </Card> 


  )
}

export default MessageCard
  
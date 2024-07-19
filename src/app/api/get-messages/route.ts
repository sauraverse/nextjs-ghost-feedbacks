import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";
import {User} from 'next-auth';
import mongoose from "mongoose";

export async function GET(request:Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const _user: User = session?.user as User

    if(!session || !_user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(_user._id);
    try {
        const userExists = await UserModel.findById(userId).lean();
        if(!userExists){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404})
        }
        const userWithMessages = await UserModel.aggregate([
            { $match: {_id: userId} },
            { $unwind: '$messages' },
            { $sort: {'messages.createdAt': -1}},
            { $group: {_id: '$_id', messages: {$push: '$messages'}}},
        ]).exec();
        
        
        if(!userWithMessages || userWithMessages.length === 0){

            const user = await UserModel.findById(userId);
            const defaultMessage = {content:"Welcome onboard! While the sender's identity here always remains a mystery, I'm developer of this! Sorry for revealing😜", createdAt: new Date()}
            user?.messages.push(defaultMessage as Message);
            await user?.save();

            return Response.json({
                success: true,
                message: [],
                info: 'No message yet? Share your link with friends to get some!'
            }, {status: 200})
        }
        
        return Response.json({
            success: true,
            message: userWithMessages[0].messages
        }, {status: 200})
    } catch (error) {
        console.error("Error getting message from database", error);
        return Response.json({
            success: false,
            message: "Error getting message from database"
        }, {status: 500})
    }
}
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    //todo: will implement this in all other routes.. //no need new version of next.js doesn't supports this it will not print other methods.
    // if(request.method !== 'GET'){
    //     return Response.json({
    //         success: false,
    //         message: 'This method not allowed..!! Only accepting GET method for this endpoint'
    //     }, {status: 405})
    // }
    await dbConnect()

    try {
        const {searchParams}= new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        //validating with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
            }, {status: 400})
        }

        const {username} = result.data
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true})
        
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: 'Username already exists. Try different '
            }, {status: 409})
        }else{
            return Response.json({
                success: true,
                message: 'Username available ✅'
            }, {status: 200})
        }
    } catch (error) {
        console.error("Error checking username", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {status: 500})
        
    }
}
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();
    // console.log("verify code route")
    try {
        const {username, code} = await request.json();
        // console.log(username, code)
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username: decodedUsername});

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();

            return Response.json(
                {
                    success: true,
                    message: "User verified successfully"
                },
                {
                    status: 200
                }
            )
        } else if (!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "Code has expired please sign up again"
                },
                {
                    status: 400
                }
            )
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Invalid code"
                },
                {
                    status: 400
                }
            )
        }
    } catch (error) {
        return Response.json({
            success:false,
            message:"Error verifying user"
        },{
            status:500
        })
    }
}
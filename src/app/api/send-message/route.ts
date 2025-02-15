import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";



export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json()
    console.log("Username..", username);
    console.log("content..", content);

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, {
                status: 404,
            })
        }

        if (!user.isAcceptingMessage) {
            return Response.json(
                { message: 'User is not accepting messages', success: false },
                { status: 403 } // 403 Forbidden status
            );
        }

        const newMessage = { content, createdAt: new Date() }

        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent successfully",
        }, {
            status: 201, // 201 Created status
        })
    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 } // 500 Internal Server Error status
        );
    }
}
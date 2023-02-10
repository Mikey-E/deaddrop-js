import readline from "readline";
import { saveMessage, userExists } from "./db";
import { log } from "./logging";

export const sendMessage = async (user: string) => {
    try {

		//This seems to throw an err and not enter the if-block when there's no user.
		//But in this assignment i'm not sure if we're supposed to fundamentally change how
		//deaddrop works other than to add log statements, so I'll leave it alone.
        if (!await userExists(user)) {
            throw new Error("Destination user does not exist");
        }

        getUserMessage().then(async (message) => {
            await saveMessage(message, user);
        });

    } catch (error) {
		//When !await userExists(user) fails.
		//Ideally I'd try-catch the above if-block specifically but I'm not changing deaddrop's core functionality.
		//So I'll have to log that this most likely happened bc the user doesn't exist, but not certainly.
		log("Send-message error to \"" + user + "\" most likely because \"" + user + "\" doesn't exist");

        console.error("Error occured creating a new user.", error);
    }
}

const getUserMessage = async (): Promise<string> => {
    let rl = readline.createInterface(process.stdin, process.stdout);
    let message: string = await new Promise(resolve => rl.question("Enter your message: ", resolve));
    rl.close();
    return message;
}

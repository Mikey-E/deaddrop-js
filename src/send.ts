import readline from "readline";
import { saveMessage, userExists } from "./db";
import { log } from "./logging";
import { sub_encrypt } from "./cipher";

export const sendMessage = async (user: string) => {
    try {

		//New solution to user not existing.
		//Yes it results in a double-check but at least the if-block is now likely to execute in earnest
		//if the condition is false.
		try {
			await userExists(user);
		} catch (error) {
			log("Tried to send message to \"" + user + "\" but that user doesn't exist");
            throw new Error("User does not exist");
		}

		/*Old solution.
		//This seems to throw an err and not enter the if-block when there's no user.
		//But in this assignment I'm not sure if we're supposed to fundamentally change how
		//deaddrop works other than to add log statements, so I'll leave it alone.
		*
		* Nvm, looks like I have no choice (see above).
		*/
        if (!await userExists(user)) {
			log("Tried to send message to \"" + user + "\" but that user doesn't exist");
            throw new Error("Destination user does not exist");
        }

        getUserMessage().then(async (message) => {
            await saveMessage(pad_encrypt(message), user);
        });

		log("Message sent to \"" + user + "\"");

    } catch (error) {

		/*Old solution.
		//When !await userExists(user) fails.
		//Ideally I'd try-catch the above if-block specifically but I'm not changing deaddrop's core functionality.
		//So I'll have to log that this most likely happened bc the user doesn't exist, but not certainly.
		log("Send-message error to \"" + user + "\" most likely because \"" + user + "\" doesn't exist");
		*/

        console.error("Error occured creating a new user.", error);
    }
}

const getUserMessage = async (): Promise<string> => {
    let rl = readline.createInterface(process.stdin, process.stdout);
    let message: string = await new Promise(resolve => rl.question("Enter your message: ", resolve));
    rl.close();
    return message;
}

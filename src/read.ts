import { getMessagesForUser, userExists } from "./db";
import { authenticate } from "./session";
import { log } from "./logging";
import { sub_decrypt } from "./cipher";

export async function readMessages(user: string) {
    try {

		//New solution to user not existing.
		//Yes it results in a double-check but at least the if-block is now likely to execute in earnest
		//if the condition is false.
		try {
			await userExists(user);
		} catch (error) {
			log("Tried to read messages from \"" + user + "\" but that user doesn't exist");
            throw new Error("User does not exist");
		}

        if (!await userExists(user)) {
			log("Tried to read messages from \"" + user + "\" but that user doesn't exist");
            throw new Error("User does not exist");
        }

        if (!await authenticate(user)) {
			log("Unable to authenticate \"" + user + "\", most likely wrong password.");
            throw new Error("Unable to authenticate");
        }

        getMessagesForUser(user).then((messages) => {
            messages.forEach((e: string) => console.log(sub_decrypt(e), "\n"));
        });

		log("Messages read by \"" + user + "\"");

    } catch (error) {

		/*Old solution.
		//Same spiel as in send.ts
		log("Read-message error to \"" + user + "\" most likely because \"" + user + "\" doesn't exist");
		*/

        console.error("Error occured during reading.", error);
    }
}

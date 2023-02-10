import { getMessagesForUser, userExists } from "./db";
import { authenticate } from "./session";
import { log } from "./logging";

export async function readMessages(user: string) {
    try {
        if (!await userExists(user)) {
            throw new Error("User does not exist");
        }

        if (!await authenticate(user)) {
            throw new Error("Unable to authenticate");
        }

        getMessagesForUser(user).then((messages) => {
            messages.forEach((e: string) => console.log(e, "\n"));
        });

    } catch (error) {

		//Same spiel as in send.ts
		log("Read-message error to \"" + user + "\" most likely because \"" + user + "\" doesn't exist");

        console.error("Error occured during reading.", error);
    }
}

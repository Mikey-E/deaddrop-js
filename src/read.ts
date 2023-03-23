import { getMessagesForUser, userExists } from "./db";
import { authenticate } from "./session";
import { log } from "./logging";
import { pad_decrypt } from "./cipher";

//MAC changes
import crypto from "crypto";

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
			//MAC changes
            messages.forEach((e: string) => {

				//First step, undo the encryption
				let decrypted_message: string = pad_decrypt(e);

				//Next, get an array as such: [hmac, sendername, message]

				//Gives hmac and sendername. Can't continue splitting on commas past 2 because the message might have commas
				let sections = decrypted_message.split(",", 2);
				sections.push(decrypted_message.slice(sections.join(",").length + 1));//Sections now contains message too

				//sift them back out
				let hmac_from_db: string = sections[0];
				let sendername: string = sections[1];
				let message: string = sections[2];

				//MAC key
				let key: string = sendername + user;

				//calculate HMAC via secret suffix
				let calculated_hmac: string = crypto.createHash('sha256').update(message + key).digest("hex");

				//check for tampering
				let altered: boolean = false;
				if (calculated_hmac !== hmac_from_db){
					altered = true;
					log("WARNING: integrity of message (and/or HMAC/sender) from "
						+ sendername + " to " + user + " could not be verified.");
				}

				console.log("---------------------------------", "\n");//Helps with readability
				console.log("From: " + sendername, "\n");
				console.log("Message: " + message, "\n");
				console.log("HMAC: " + hmac_from_db, "\n");
				console.log((altered ? "WARNING: integrity of message (and/or HMAC/sender) could not be verified"
					: "Integrity verified.") , "\n");
			});
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

//File to create a simple logging function to be used elsewhere as desired.

//import writeFileSync as fs from 'fs';
import * as fs from 'fs';

export const log = (str: string) => {
	fs.writeFileSync("../logs.txt", str)
}

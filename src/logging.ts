//File to create a simple logging function to be used elsewhere as desired.

import writeFileSync from 'fs';

export const log = (str: string) => {
	writeFileSync("../logs.txt", str)
}

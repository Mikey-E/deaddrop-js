//File to create a simple padding cipher.

export function sub_encrypt(str: string, pads: number = 1): string {
	let result = "";
	for(let i = 0; i < str.length; i++){

		//toString(36) gives printable characters via base 36. Ref [1].
		let padding = (Math.random() + 1).toString(36).substring(2, 2 + pads)

		result += padding + str.charAt(i);
	}
	return result;
}

export function sub_decrypt(str: string, pads: number = 1): string {
	let result = "";
	for(let i = pads; i < str.length; i += 1 + pads){
		result += str.charAt(i);
	}
	return result;
}

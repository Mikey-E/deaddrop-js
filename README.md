#  deaddrop-js

A deaddrop utility written in Typescript. Put files in a database behind a password to be retrieved at a later date.

This is a part of the University of Wyoming's Secure Software Design Course (Spring 2023). This is the base repository to be forked and updated for various assignments. Alternative language versions are available in:
- [Go](https://github.com/andey-robins/deaddrop-go)
- [Rust](https://github.com/andey-robins/deaddrop-rs)

## Versioning

`deaddrop-js` is built with:
- node v18.13.0

## Usage

`npm run build && node dist/index.js --help` for instructions

Then run `node dist/index.js --new --user <username here>` and you will be prompted to create the initial password.

## Database

Data gets stored into the local database file dd.db. This file will not by synched to git repos. Delete this file if you don't set up a user properly on the first go

## Logging Strategy

Events to trigger a log statement:
- sending a message to a user that exists
- reading messages from a user that exists
- creating a new user
- reading messages with the wrong password
- reading the messages for a user which doesn’t exist
- sending messages to a user which doesn’t exist

Other Notes:
- ~~timestamps on log statements seem like a good idea but it was not asked for at this time so it shall not be implemented
at this time.~~ Timestamps are now implemented.
- assuming that for privacy, no message content should be in logs.

## Mitigation

In the previous assignment submission (for Security Analysis), under section 4: "One way in which the system could
be improved" it was
mentioned how the database dd.db can be opened up by anyone and searched through to find the messages sitting inside it in
plaintext. The proposed solution was to encrypt those messages into ciphertext as well.

In this homework, that solution will
be implemented with a cipher based on padding random characters[1]. While such a cipher is not the most secure cipher,
this change will serve as a proof-of-concept of having the messages live in the database as ciphertext.

cipher.ts contains 2 functions: one to encrypt a string by padding random characters inbetween the plaintext characters
with a default amount of 1 character(s),
and one function to undo (decrypt) that.

## MAC Strategy

### First some important notes about other changes

readPassIn was previously adding an anonymous listener that was never removed. This caused all further prompts after
Password: \*\*\*\*\*\*\* to also be written as Password: \*\*\*\*\*\*\*. The rl was never closed (likewise in some other
functions), which would cause multiple characters to be printed out e.g. when typing "a" stdout would show "aa" or "aaa"
upon that single keypress. These have been fixed by naming a reference to the anonymous listener and then removing it after
resolving the user input, as well as closing the rl in readPassIn and other functions.

Timestamps are now implemented.

### The MAC

The MAC implemented is a hash-based MAC (HMAC). This is done by secret suffix[2, p322] (as opposed to secret prefix) i.e. the
secret key is concatenated on to the end of the message before hashing that concatenation to produce the HMAC. The secret key
itself is a concatenation of the sender's name and the receiver's name.

### The schema

A straightforward schema for requiring a user to authenticate before sending a message is to prompt for the username and
password upon the --send command. From there, the sender's name is prepended as part
of the message itself; this allows the sender of the message to easily<sup>TM</sup> be displayed whenever it is retrieved,
and also it is
protected from tampering because it has been used as an indirect input to the hash.

The new message format in the database is a string of the HMAC, sender's name, and message. All comma delimited.

In the interest of not changing the Deaddrop_User_Guide.pdf, no new cmdline flags will be added to the send command. The
sender will be prompted for their username and password at runtime.

### Justification for MAC changes as correct

The function to create a HMAC requires a key and a message.
That key must not be reproducible by an attacker, because the attacker could then create an HMAC to match their changes.
Given how the key is made with the sender and receiver name,
at least one of either the sender or receiver must remain unknown to an attacker. The recipient is stored in the
database by the SQL in saveMessage, and the sender is part of the message. Protecting them
in the database requires cryptography. By serendipity, the change I implemented in the logging assignment was just that;
cipher.ts with pad_encrypt and pad_decrypt. We will assume this cryptography is secure despite that in the logging
assignment it was meant for proof-of-concept. It protects the identity of the sender of all messages in the database, and
therefore the attacker now cannot reproduce the key; cannot produce the correct HMAC for any given changes.

Having a single key stored by deaddrop in either sourcecode or the database itself would introduce a single point of failure.
With the key being different in every permutation of sender and user, it is more secure.
It is true that with N users an attacker could guess the key with probability 1/(N-1), though we'll assume this is a
tolerable risk, especially since it decreases as deaddrop's userbase scales.

Secret suffix was chosen over secret prefix because that requires an attacker to be able to find a collision to exploit.
This is a
much taller order to exploit than the weakness in secret prefix, which allows an attacker to tack on new blocks and recompute
a hash[2, p323].


## References

[1] Generate random string/characters in JavaScript (2023, Feb 9). Stack Overflow.
https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

[2] Christoff Paar and Jan Pelzl. Understanding Cryptography. Springer. 2010.

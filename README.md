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
- timestamps on log statements seem like a good idea but it was not asked for at this time so it shall not be implemented
at this time.
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

## References

[1] Generate random string/characters in JavaScript (2023, Feb 9). Stack Overflow.
https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

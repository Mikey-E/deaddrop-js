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
- sending and reading a message to a user that exists
- creating a new user
- reading messages with the wrong password
- reading the messages for a user which doesn’t exist
- sending messages to a user which doesn’t exist
- other tasks that would be appropriate !???????????????????????????????????????????????

Other Notes:
- timestamps on log statements seem like a good a idea but it was not asked for at this time so it shall not be implemented
at this time.

## Mitigation

In the previous assignment submission (for Security Analysis), under section 4: "One way in which the system could
be improved" it was
mentioned how the database dd.db can be opened up by anyone and searched through to find the messages sitting in inside it in
plaintext. The proposed solution was to encrypt those messages into ciphertext as well. In this homework, that solution will
be implemented with a substitution cipher[1]. This cipher will consider the printable ascii characters in the range
{20, 21, ... , 127} and replace them with their following neighbor, with 127 wrapping around to 20. Decryption undoes this by
substituting in the reverse order. While substituion ciphers are not the most secure ciphers, this change will serve as a
proof-of-concept of having the messages live in the database as ciphertext.

## References

[1] Substitution cipher (2023, Feb 9). Wikipedia. https://en.wikipedia.org/wiki/Substitution_cipher

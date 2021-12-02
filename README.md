# proof-on-login

> a proof-of-work for your login

Secure unsecured endpoints by requesting a proof-of-work (PoW) on the client side.
To increase to time required the PoW may be calculated using different complexities.

How does that work?




# usage




# algorithm

At backend:

1. create signed token with 
   - complexity
   - required hash algorithm
   - timestamp
   - random part
2. use signed token as challenge
3. transmit challenge to browser

On frontend:

1. Obtain complexity from challenge
2. calculate nonce from complexity (loop ...)
3. if nonce is found transmit challenge and nonce together with the user data (e.g. username + password)

Again at backend:

1. Verify challenge signature
2. Obtain complexity, hash from challenge
3. Generate pow by hashing (challenge + nonce) 
4. verify pow and needed complexity



SHA-1 = 20 bytes
SHA-256 = 32 bytes
SHA-384 = 48 bytes
SHA-512 = 64 bytes


https://bradyjoslin.com/blog/hmac-sig-webcrypto/

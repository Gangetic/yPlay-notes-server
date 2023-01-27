# JWT Token
its standard that defines a compact and self-container way of securing transmitting info between parties as a json object


## uses:
- ### Authorization: 
    This is the most common scenario for using JWT. Once the user is logged in, each subsequent request will include the JWT, allowing the user to access routes, services, and resources that are permitted with that token. Single Sign On is a feature that widely uses JWT nowadays, because of its small overhead and its ability to be easily used across different domains.

- ### Information Exchange: 
   JSON Web Tokens are a good way of securely transmitting information between parties. Because JWTs can be signed—for example, using public/private key pairs—you can be sure the senders are who they say they are. Additionally, as the signature is calculated using the header and the payload, you can also verify that the content hasn't been tampered with.

## structure 
- header
- payload
- signature

typical JWT token

`
xxxxx.yyyyy.zzzzz
`
 


import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

var config = "http://identityserver4.yuanjingtech.com/.well-known/openid-configuration/jwks";
var conf = fetch(config);

/*
* {
"keys": [
{
"kty": "RSA",
"use": "sig",
"kid": "1bc8fde7a3dd47efabe690e51f104322797d300fbc3d9318da5978d8a6a19362",
"e": "AQAB",
"n": "poXji-r3J8o3OUFaCyCjLqVI1WGJnWgc3-J0YIdUBTa1nDzSKFn37_evx6HaduQNe9Gu6nKeSiTC6jaZXwqMHqmoTlto0GGmgho-MY2KZxzRli7WmUyDWbYGJ808Ak_ZcOy-J5nR8x3cjhh1My_hsKVujRnUIxp2131aaomFq0YW7eldX9jM13FiQbCEeGSr1QQgjErhadMa0fCIv0e3NPj7il1Vl73wwfevxmZom09w9zkNcJUYHyviFosYVi5837tURB9KaxEWm1VdRZcOj-z2mIZThngmMka8IgTHrAgsuhdkczvrtFbPxRTcOFaQC7O6DDk653xbIVg89ySvEQ"
}
]
}
* */
/**
 * { user: { id: 12345, roles: ['user', 'admin'] } }
 *
 * */
export function getUser(token: string) {
    // reference to IdentityServer instance
    const issuer = 'http://localhost:5000';     // can potentially use the "iss" claim from the access token instead

// define authentication middleware
//     const auth = jwt({
//         secret: jwksClient.expressJwtSecret({
//             cache: true,        // see https://github.com/auth0/node-jwks-rsa#caching
//             rateLimit: true,    // see https://github.com/auth0/node-jwks-rsa#rate-limiting
//             jwksRequestsPerMinute: 2,
//             jwksUri: `${issuer}/.well-known/openid-configuration/jwks`      // we are hardcoding the default location of the JWKS Uri here - but another approach is to get the value from the discovery endpoint
//         }),
//
//         // validate the audience & issuer from received token vs JWKS endpoint
//         audience: 'api1',
//         issuer: issuer,
//         algorithms: ['RS256']
//     });
    return {};
}

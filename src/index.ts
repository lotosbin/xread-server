import {makeExecutableSchema} from "graphql-tools";
import {ApolloServer, gql} from "apollo-server";
import fs from "fs";
import resolvers from "./resolvers";
import {getUser} from "./oauth";

const typeDefs = gql`${fs.readFileSync(__dirname.concat('/schema.graphql'), 'utf8')}`;
(async () => {
    let schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });
    let config: any = {
        schema: schema,
        context: ({req}) => {
            // get the user token from the headers
            const token = req.headers.authorization || '';

            // try to retrieve a user with the token
            const user = getUser(token);

            // add the user to the context
            return {user};
        },
    };
    const server = new ApolloServer(config);
    server.listen({port: process.env.PORT || 4000}).then(({url}) => {
        console.log(`🚀  Server ready at ${url}`);
    });

})();

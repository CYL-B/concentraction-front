/*https://www.apollographql.com/docs/react/api/link/introduction*/
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
// import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { setContext } from '@apollo/client/link/context';
import gql from "graphql-tag";


//connect the ApolloClient instance with the GraphQL API and .
const httpLink = createHttpLink({
  uri: "http://localhost:5050/graphql",
});

// const batchLink = new BatchHttpLink({
//   uri: 'http://localhost:5050/graphql',
//   batchInterval: 10, // Time in ms to batch operations (e.g., 10ms)
// });

//Add an authorization header to every HTTP request by chaining together Apollo Links
// const authLink = new ApolloLink((operation, forward) => {
//   // get the authentication token from local storage if it exists
//   const token = sessionStorage.getItem("token");

//   operation.setContext(({ headers }) => ({
//     // return the headers to the context
//     headers: {
//       authorization: token ? token : "",
//       ...headers,
//     },
//   }));
//   return forward(operation);
// });

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    },
  };
})

// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors)
//     graphQLErrors.forEach(({ message, locations, path }) =>
//       console.log(
//         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
//       )
//     );
//   if (networkError) console.error(`[Network error]: ${networkError}`);
// });

//uri specifies the URL of our GraphQL server.

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

apolloClient.query({
  query: gql`
    query TestQuery {
      __typename
    }
  `,
})
  .then(response => console.log("GraphQL response:", response))
  .catch(error => console.error("GraphQL error:", error));
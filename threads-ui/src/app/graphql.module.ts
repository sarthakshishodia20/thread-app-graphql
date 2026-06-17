import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';

// ==========================================
// APOLLO CLIENT SETUP — SAMJHO KAISE KAAM KARTA HAI:
//
// Har GraphQL request ke saath:
//   1. authLink → localStorage se JWT token uthata hai
//   2. Authorization header mein dalta hai: "Bearer <token>"
//   3. httpLink → actual POST request /graphql pe bhejta hai
//
// Backend mein context.user = decoded token hota hai
// ==========================================

const GRAPHQL_URL = 'http://localhost:3000/graphql';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  // Step 1: Auth link — token header mein daal do
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('threads_token');
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  // Step 2: HTTP link — actual request yahan jaayegi
  const http = httpLink.create({ uri: GRAPHQL_URL });

  // Step 3: Chain karein — pehle auth, phir http
  return {
    link: ApolloLink.from([authLink, http]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'network-only' },
      query: { fetchPolicy: 'network-only' },
    },
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}

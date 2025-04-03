import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
 
const client = new ApolloClient({
  //uri: 'http://localhost:4000/',   
  uri: 'http://192.168.1.148:4000/',
  cache: new InMemoryCache(),
});

export default client;
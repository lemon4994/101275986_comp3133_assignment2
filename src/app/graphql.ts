import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export function apolloFactory(httpLink: HttpLink) {
  return {
    cache: new InMemoryCache(),
    link: httpLink.create({
      uri: 'http://localhost:4000/graphql'
    })
  };
}

export const apolloProviders = [
  {
    provide: APOLLO_OPTIONS,
    useFactory: apolloFactory,
    deps: [HttpLink]
  }
];

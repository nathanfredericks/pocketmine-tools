import React, { Component } from 'react';
import { Card, Badge, Form } from 'react-bootstrap';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import {
  InstantSearch,
  Hits,
  Highlight,
  connectSearchBox,
  connectStateResults,
  Configure
} from 'react-instantsearch-dom';
import Layout from '../components/Layout';

export default class extends Component {
  render = () => {
    const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
      server: {
        // @ts-ignore
        apiKey: process.env.POGGIT_SEARCH_API_KEY,
        nodes: [
          {
            // @ts-ignore
            host: process.env.POGGIT_SEARCH_HOST,
            // @ts-ignore
            port: process.env.POGGIT_SEARCH_PORT,
            // @ts-ignore
            protocol: process.env.POGGIT_SEARCH_PROTOCOL,
          },
        ],
      },
      additionalSearchParameters: {
        query_by: 'name,tagline,keywords',
      },
    });
    const searchClient = typesenseInstantsearchAdapter.searchClient;

    return (
      <Layout title="Poggit Search">
        <InstantSearch
          indexName="plugins"
          searchClient={searchClient}
        >
          <Configure hitsPerPage={5} />
          <CustomSearchBox />
          <Content />
          <Hits hitComponent={Hit} />
        </InstantSearch>
      </Layout>
    );
  };
}

const SearchBox = ({ currentRefinement, refine }) => (
  <Form.Control
    className="mb-3"
    type="search"
    placeholder="Search for plugins on Poggit"
    value={currentRefinement}
    onChange={(event) => refine(event.currentTarget.value)}
  />
);

const CustomSearchBox = connectSearchBox(SearchBox);

const Content = connectStateResults(
  ({ searchState, searchResults }) => (searchResults && searchResults.nbHits !== 0
    ? null
    : (
      <div>
          No plugins were found matching <em>{searchState.query}</em>
      </div>
    )),
);


const Hit = ({ hit }) => {
      return (
        <Card className="w-100 mb-2">
          <Card.Body>
            <a href={hit.html_url}>
              <Card.Title>
                <Highlight attribute="name" tagName="mark" hit={hit} />
                <Badge variant="light">{`v${hit.version}`}</Badge>
              </Card.Title>
            </a>
            <Card.Text>
              <Highlight attribute="tagline" tagName="mark" hit={hit} />
            </Card.Text>
          </Card.Body>
        </Card>
  );
};

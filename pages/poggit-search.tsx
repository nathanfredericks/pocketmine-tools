import React, { Component, useEffect, useState } from 'react';
import { Badge, Card, Form } from 'react-bootstrap';
import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  useInstantSearch,
  useSearchBox
} from 'react-instantsearch-hooks-web';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import Layout from '../components/Layout';
import useDebounce from '../lib/useDebounce';
import Head from 'next/head';
export default class PoggitSearch extends Component {
  render() {
    const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
      server: {
        // @ts-ignore
        apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY,
        nodes: [
          {
            // @ts-ignore
            host: process.env.NEXT_PUBLIC_SITE_HOST,
            // @ts-ignore
            port: process.env.NEXT_PUBLIC_SITE_PORT,
            // @ts-ignore
            protocol: process.env.NEXT_PUBLIC_SITE_PROTOCOL,
            path: '/api/poggit-search'
          },
        ],
      },
      additionalSearchParameters: {
        query_by: 'name,tagline,keywords',
      },
    });
    const searchClient = typesenseInstantsearchAdapter.searchClient;
    return (
      <>
        <Head>
          <meta name="description" content="Search Poggit for plugins" />
        </Head>
        <Layout title="Poggit Search" showNav={true}>
          <InstantSearch searchClient={searchClient} indexName="plugins">
            <Configure hitsPerPage={5} />
            <CustomSearchBox />
            <NoResultsBoundary fallback={<NoResults />}>
              <Hits hitComponent={Hit} />
            </NoResultsBoundary>
          </InstantSearch>
        </Layout>
      </>
    );
  }
}
// @ts-ignore
const CustomSearchBox = ({ ...props }) => {
  const { refine } = useSearchBox(props);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  useEffect(() => {
    if (debouncedSearchTerm) {
      refine(searchTerm);
    } else {
      refine('');
    }
  });
  return (
    <Form>
      <Form.Control
        type="search"
        className="mb-3"
        placeholder="Search for plugins on Poggit"
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
      />
    </Form>
  );
};
// @ts-ignore
function Hit({ hit }) {
  return (
    <Card className="w-100 mb-2">
      <Card.Body>
        <Card.Title>
          <a href={hit.html_url} target="_blank" rel="noreferrer">
            <Highlight attribute="name" hit={hit} />
          </a>{' '}
          <Badge bg="primary" pill>
            v{hit.version}
          </Badge>
        </Card.Title>
        <Card.Text>
          <Highlight attribute="tagline" hit={hit} />
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
// @ts-ignore
function NoResultsBoundary({ children, fallback }) {
  const { results } = useInstantSearch();
  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned yet.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div className="d-none">{children}</div>
      </>
    );
  }
  return children;
}
function NoResults() {
  const { indexUiState } = useInstantSearch();
  return (
    <div>
      <p>
        No results for <q>{indexUiState.query}</q>.
      </p>
    </div>
  );
}

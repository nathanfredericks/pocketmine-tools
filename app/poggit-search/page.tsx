'use client';
import { useEffect, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  useInstantSearch,
  useSearchBox,
} from 'react-instantsearch';
import AlgoliaLogoBlue from '../../public/static/Algolia-logo-blue.svg';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import Layout from '../../components/Layout';
import useDebounce from '../../lib/useDebounce';
import type { Hit as AlgoliaHit } from 'instantsearch.js';
const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || ''
);
export default function PoggitSearch() {
  return (
    <Layout title="Poggit Search" showNav={true}>
      <InstantSearch searchClient={searchClient} indexName="plugins">
        <Configure hitsPerPage={5} />
        <CustomSearchBox />
        <NoResultsBoundary fallback={<NoResults />}>
          <Hits hitComponent={Hit} />
        </NoResultsBoundary>
      </InstantSearch>
      Powered by <AlgoliaLogoBlue height="15" />
    </Layout>
  );
}
function CustomSearchBox() {
  const { refine } = useSearchBox();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  useEffect(() => {
    refine(debouncedSearchTerm);
  }, [debouncedSearchTerm, refine]);
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
}
function Hit({ hit }: { hit: AlgoliaHit<{ name: string; tagline: string; html_url: string }> }) {
  return (
    <Card className="w-100 mb-2">
      <Card.Body>
        <Card.Title>
          <a href={hit.html_url} target="_blank" rel="noreferrer">
            <Highlight attribute="name" hit={hit} />
          </a>
        </Card.Title>
        <Card.Text>
          <Highlight attribute="tagline" hit={hit} />
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
function NoResultsBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }): React.ReactElement {
  const { results } = useInstantSearch();
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div className="d-none">{children}</div>
      </>
    );
  }
  return <>{children}</>;
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

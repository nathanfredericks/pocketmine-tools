'use client';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  useInstantSearch,
  useSearchBox,
} from 'react-instantsearch';
import Image from 'next/image';
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
    <Layout title="Search Poggit" showNav={true}>
      <InstantSearch searchClient={searchClient} indexName="plugins">
        <Configure hitsPerPage={5} />
        <CustomSearchBox />
        <NoResultsBoundary fallback={<NoResults />}>
          <Hits hitComponent={Hit} />
        </NoResultsBoundary>
      </InstantSearch>
      Powered by <Image src="/static/Algolia-logo-blue.svg" alt="Algolia" height={15} width={60} className="dark:brightness-0 dark:invert inline-block" />
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
    <div>
      <Input
        type="search"
        className="mb-3"
        placeholder="Search for plugins on Poggit"
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
      />
    </div>
  );
}
function Hit({ hit }: { hit: AlgoliaHit<{ name: string; tagline: string; html_url: string }> }) {
  return (
    <Card className="w-full mb-4">
      <CardContent>
        <CardTitle>
          <a href={hit.html_url} target="_blank" rel="noreferrer">
            <Highlight attribute="name" hit={hit} />
          </a>
        </CardTitle>
        <CardDescription>
          <Highlight attribute="tagline" hit={hit} />
        </CardDescription>
      </CardContent>
    </Card>
  );
}
function NoResultsBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }): React.ReactElement {
  const { results } = useInstantSearch();
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div className="hidden">{children}</div>
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

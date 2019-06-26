import React, { Component } from 'react';
import { Card, Badge, Form } from 'react-bootstrap';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  Highlight,
  connectSearchBox,
  connectStateResults
} from 'react-instantsearch-dom';
import './PoggitSearch.scss';
import SemverJS from '@brunorb/semverjs';
import * as gtag from '../utils/gtag';

export default class extends Component {
  componentDidMount = () => {
    gtag.event({
      action: 'search',
    });
  }

  render = () => {
    const searchClient = algoliasearch(
      'XI77W278IB',
      'cf3b496f36aefb12a0a875810c234554',
    );

    return (
      <>
        <InstantSearch
          indexName="prod_POGGIT_SEARCH"
          searchClient={searchClient}
        >
          <CustomSearchBox />
          <Content></Content>
          <Hits hitComponent={Hit} />
        </InstantSearch>
      </>
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
  ({ searchState, searchResults }) =>
    searchResults && searchResults.nbHits !== 0
      ? null
      : <div>
          No plugins were found matching <em>{searchState.query}</em>
        </div>
);


const Hit = ({ hit }) => {
  if (hit.api && hit.api.length) {
    if (SemverJS.split(hit.api[0].from).major == '3') {
      return (
        <Card className="w-100 mb-2">
          <Card.Body>
            <img src={hit.logo_url} />
            <a href={`https://poggit.pmmp.io/p/${hit.project_name}`}>
              <Card.Title>
       
                <Highlight attribute="name" tagName="mark" hit={hit} />
                <Badge variant="light">{hit.api[0].from}</Badge>
              </Card.Title>
            </a>
            <Card.Text>
              <Highlight attribute="tagline" tagName="mark" hit={hit} />
            </Card.Text>
          </Card.Body>
        </Card>
      );
    } else {
      return null;
    }
  } else {
    return null;
  }
};

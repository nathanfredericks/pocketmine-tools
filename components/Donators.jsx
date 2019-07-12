import React, { Component } from 'react';
import { Card, Badge, Form } from 'react-bootstrap';

export default class extends Component {
  render = () => {
    return (
      <>
        <h1>Donators</h1>
        Donating to PMT helps <a href="https://twitter.com/nathfreder">me</a> cover server costs and keep the site up and running.
        Here are some of the most recent donators, check them out (because they're awesome ⚡️)!
        <Card style={{ width: '18rem' }} className="mt-4">
            <Card.Body>
                <Card.Title>Tinh Truong <Badge variant="light">$3</Badge></Card.Title>
                <Card.Link href="https://twitter.con/onetinhcan">Twitter</Card.Link>
                {/* <Card.Link href="#">Website</Card.Link> */}
            </Card.Body>
        </Card>
      </>
    );
  };
}

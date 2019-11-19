import React from 'react';
import { Card } from 'react-bootstrap';

/**
 * Thanks a user for contributing to Monuments and Memorials
 */
export default class ContributionAppreciation extends React.Component {

    render() {
        return (
          <Card>
              <Card.Title>
                  Thank You
              </Card.Title>
              <Card.Body>
                  <p>Thank you for taking the time to contribute to Monuments and Memorials.</p>
              </Card.Body>
          </Card>
        );
    }
}
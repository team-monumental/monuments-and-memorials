import React from 'react';
import './SearchResult.scss';
import { Card } from 'react-bootstrap';
import Tags from '../Tags/Tags';

export default class SearchResult extends React.Component {

    render() {
        const { monument, index } = this.props;
        return (
            <div className="search-result">
                <div className="icon"/>
                <Card>
                    <Card.Title>
                        <a href={'/monuments/' + monument.id}>
                            {index + 1}. {monument.title}
                        </a>
                    </Card.Title>
                    <Card.Body>
                        <div className="font-italic mb-2">
                            {monument.city}, {monument.state}
                        </div>
                        <Tags tags={monument.tags}/>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}
import React from 'react';
import './SearchResult.scss';
import { Card } from 'react-bootstrap';
import Tags from '../../Tags/Tags';

/**
 * A condensed Monument info card for use in search results
 */
export default class SearchResult extends React.Component {

    render() {
        const { monument, index } = this.props;
        const image = monument && monument.images ? monument.images.find(monument => monument.isPrimary) : null;
        const imageUrl = image ? `url("${image.url}")` : null;
        return (
            <div className="search-result">
                <div style={{backgroundImage: imageUrl}} className="monument-thumbnail"/>
                <Card>
                    <Card.Title>
                        <a href={'/monuments/' + monument.id}>
                            {index + 1}. {monument.title}
                        </a>
                    </Card.Title>
                    <Card.Body>
                        <div className="font-italic mb-2">
                            {[monument.city, monument.state].filter(str => str.trim()).join(', ')}
                        </div>
                        <Tags tags={monument.tags}/>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}
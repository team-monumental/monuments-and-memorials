import React from 'react';
import './SearchResult.scss';
import { Card } from 'react-bootstrap';
import Tags from '../../Tags/Tags';
import Address from "../../Monument/Details/Address/Address";

/**
 * A condensed Monument info card for use in search results
 */
export default class SearchResult extends React.Component {

    render() {
        const { monument, index, includeIndexInTitle } = this.props;
        const image = monument && monument.images ? monument.images.find(monument => monument.isPrimary) : null;
        const imageUrl = image ? `url("${image.url}")` : null;
        const title = includeIndexInTitle ?  (index + 1) + ". " + monument.title : monument.title;

        let tags = [];
        if (monument.monumentTags) {
            tags = monument.monumentTags.map(monumentTag => monumentTag.tag);
        }

        return (
            <div className="search-result">
                <div style={{backgroundImage: imageUrl}} className="monument-thumbnail"/>
                <Card>
                    <Card.Title>
                        <a href={'/monuments/' + monument.id}>
                            {title}
                        </a>
                    </Card.Title>
                    <Card.Body>
                        <Address monument={monument}/>
                        <Tags tags={tags}/>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}
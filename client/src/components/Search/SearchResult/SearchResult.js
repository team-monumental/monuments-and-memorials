import React from 'react';
import './SearchResult.scss';
import { Card } from 'react-bootstrap';
import Tags from '../../Tags/Tags';
import Address from "../../Monument/Details/Address/Address";
import { Link } from 'react-router-dom';

/**
 * A condensed Monument info card for use in search results
 */
export default class SearchResult extends React.Component {

    render() {
        const { monument, index, includeIndexInTitle, hideImages, searchUri, monumentUri } = this.props;
        const image = monument && monument.images ? monument.images.find(monument => monument.isPrimary) : null;
        const imageUrl = image ? `url("${image.url}")` : null;
        const title = includeIndexInTitle ?  (index + 1) + ". " + monument.title : monument.title;

        let tags = [];
        if (monument.monumentTags) {
            tags = monument.monumentTags.map(monumentTag => monumentTag.tag);
        }

        return (
            <div className="search-result">
                {!hideImages &&
                    <div style={{backgroundImage: imageUrl}} className="monument-thumbnail"/>
                }
                <Card>
                    <Card.Title>
                        <Link to={`${monumentUri}/${monument.id}`}>
                            {title}
                        </Link>
                    </Card.Title>
                    <Card.Body>
                        <Address monument={monument}/>
                        <Tags tags={tags} searchUri={searchUri}/>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}
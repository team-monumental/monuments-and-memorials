import * as React from 'react';
import './Favorites.scss';
import { Card } from 'react-bootstrap';
import Spinner from '../../Spinner/Spinner';
import SearchResult from '../../Search/SearchResult/SearchResult';

export default class Favorites extends React.Component {

    render() {
        const { favorites, pending } = this.props;

        return (<>
            <Spinner show={pending}/>
            <Card className="favorites">
                <Card.Header>
                    <Card.Title>Your Favorites</Card.Title>
                </Card.Header>
                <Card.Body>
                    {favorites && <>
                        {favorites.map(favorite => (
                            <SearchResult key={favorite.monument.id} monument={favorite.monument} includeIndexInTitle={false}/>
                        ))}
                    </>}
                    {(!favorites || !favorites.length) && <>
                        You don't have any favorites yet. You can favorite monuments and memorials by clicking the star on their page.
                    </>}
                </Card.Body>
            </Card>
        </>);
    }
}
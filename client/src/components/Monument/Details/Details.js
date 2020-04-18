import React from 'react';
import './Details.scss';
import Tags from '../../Tags/Tags';
import Gallery from '../Images/Gallery/Gallery';
import About from './About/About';
import Address from './Address/Address';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

/**
 * Displays all the main info about a Monument, for the Monument's record page
 */
export default class Details extends React.Component {

    render() {
        const { monument, favorite, fetchFavoritePending, onToggleFavorite, showFavorite } = this.props;

        let inscription;
        if (monument.inscription) {
            inscription = (
                <div className="mt-3">
                    <span className="detail-label">Inscription:</span> {this.formatInscription(monument.inscription)}
                </div>
            )
        }

        const images = (monument.images || [])
            .filter(image => {
                return !image.isPhotoSphere;
            }).sort((a, b) => {
                // Show the primary image first
                if (a.isPrimary) return -1;
                // Then order by id, as this is easier than ordering by createdDate within javascript
                else return a.id - b.id;
            });

        let tags = [];
        if (monument.monumentTags) {
            tags = monument.monumentTags.map(monumentTag => monumentTag.tag);
        }

        return (
            <div className="details">
                <div>
                    <div className="d-flex">
                        <div className="h1 mb-0 pb-2">
                            {monument.title}
                            {showFavorite &&
                                <OverlayTrigger
                                    placement="top"
                                    overlay={props => (
                                        <Tooltip {...props} show={props.show ? 'show' : ''} className={'favorite-tooltip'}>
                                            {favorite ? 'Unfavorite' : 'Favorite'}
                                        </Tooltip>
                                    )}>
                                    <Button disabled={fetchFavoritePending} variant="bare"
                                            onClick={() => onToggleFavorite()}
                                            className={'p-0 text-primary ml-2 mr-0 my-0 favorite-icon' + (favorite ? ' favorited' : '')}>
                                        <i className="material-icons">
                                            {favorite ? 'star' : 'star_border'}
                                        </i>
                                        <i className="material-icons hover">
                                            star
                                        </i>
                                    </Button>
                                </OverlayTrigger>
                            }
                        </div>
                    </div>
                    <div>
                        <div className="fields">
                            <div className={'field font-italic' + (monument.isTemporary ? ' mb-0' : '')}><Address monument={monument}/></div>
                            {monument.isTemporary &&
                                <div className="field font-italic">Temporary Monument or Memorial</div>
                            }
                            <div className="field">{monument.description}</div>
                        </div>
                        <Tags tags={tags}/>
                    </div>
                </div>
                <Gallery images={images}/>
                <div className="inscription">
                    {inscription}
                </div>
                <About monument={monument} contributions={monument.contributions} references={monument.references}/>
            </div>
        )
    }

    formatInscription(inscription) {
        if (!inscription) return inscription;
        // This nifty little regex removes all of the double quotes in the string
        inscription = inscription.replace(/["]+/g, '');
        return '"' + inscription + '"';
    }
}
import React from 'react';
import Tags from '../../Tags/Tags';
import Gallery from '../Gallery/Gallery';
import About from './About/About';
import Address from './Address/Address';

/**
 * Displays all the main info about a Monument, for the Monument's record page
 */
export default class Details extends React.Component {

    render() {
        const { monument } = this.props;

        let inscription;
        if (monument.inscription) {
            inscription = (
                <div className="mt-3">
                    <span className="detail-label">Inscription:</span> {this.formatInscription(monument.inscription)}
                </div>
            )
        }

        return (
            <div className="main">
                <div>
                    <div className="h5">
                        {monument.title}
                    </div>
                    <div>
                        <div className="fields">
                            <div className="field font-italic"><Address monument={monument}/></div>
                            <div className="field">{monument.description}</div>
                        </div>
                        <Tags tags={monument.tags}/>
                    </div>
                </div>
                <Gallery images={monument.images}/>
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
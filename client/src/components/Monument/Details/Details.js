import React from 'react';
import Tags from '../../Tags/Tags';
import Gallery from '../Gallery/Gallery';
import About from './About/About';
import Address from './Address/Address';

export default class Details extends React.Component {

    render() {
        const { monument, tags, images, contributions, references } = this.props;

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
                        <Tags tags={tags}/>
                    </div>
                </div>
                <Gallery images={images}/>
                <div className="inscription">
                    {inscription}
                </div>
                <About monument={monument} contributions={contributions} referneces={references}/>
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
import * as React from 'react';
import './AddedReferences.scss';

/**
 * Presentational component for displaying newly added references for a Monument
 */
export default class AddedReferences extends React.Component {

    render() {
        const { references } = this.props;

        let addedReferenceDisplay = [];

        for (const reference of references) {
            addedReferenceDisplay.push(<li key={reference} className="added">{reference}</li>);
        }

        return (
            <div>
                <span className="font-weight-bold">Added References:&nbsp;</span>
                {
                    addedReferenceDisplay.length ?
                        <ul>{addedReferenceDisplay}</ul> :
                        <span className="font-weight-bold">NONE</span>
                }
            </div>
        );
    }
}
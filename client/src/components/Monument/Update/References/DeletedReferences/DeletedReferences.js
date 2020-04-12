import * as React from 'react';
import './DeletedReferences.scss';

/**
 * Presentational component for displaying deleted references for a Monument
 */
export default class DeletedReferences extends React.Component {

    render() {
        const { references } = this.props;

        let deletedReferenceDisplays = [];

        for (const reference of references) {
            deletedReferenceDisplays.push(<li key={reference} className="removed">{reference}</li>);
        }

        return (
            <div>
                <span className="font-weight-bold">Deleted References:&nbsp;</span>
                {
                    deletedReferenceDisplays.length ?
                        <ul>{deletedReferenceDisplays}</ul> :
                        <span className="font-weight-bold">NONE</span>
                }
            </div>
        );
    }
}
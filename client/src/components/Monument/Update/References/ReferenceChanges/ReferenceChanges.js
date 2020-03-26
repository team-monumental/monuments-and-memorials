import * as React from 'react';
import './ReferenceChanges.scss';

/**
 * Presentational component for displaying changed/unchanged references for a Monument
 */
export default class ReferenceChanges extends React.Component {

    renderReferenceChange(oldValue, newValue, didChange) {
        return (
            <li key={newValue} className="reference-change">
                <span className="old-attribute">{oldValue}</span>
                <i className="material-icons">arrow_right_alt</i>
                <span className="new-attribute">{newValue}</span>
                {
                    didChange ?
                        <div/> :
                        <span className="font-weight-bold">&nbsp;(NO CHANGES)</span>
                }
            </li>
        );
    }

    renderChangedReferences() {
        const { changedReferences } = this.props;

        let changedReferenceDisplays = [];

        for (const reference of changedReferences) {
            changedReferenceDisplays.push(this.renderReferenceChange(reference.oldReferenceValue, reference.newReferenceValue, true));
        }

        return (
            <div>
                <span className="font-weight-bold">Changed References:&nbsp;</span>
                <ul>{changedReferenceDisplays}</ul>
            </div>
        );
    }

    renderUnchangedReferences() {
        const { unchangedReferences } = this.props;

        let unchangedReferenceDisplays = [];

        for (const reference of unchangedReferences) {
            unchangedReferenceDisplays.push(this.renderReferenceChange(reference, reference, false));
        }

        return (
            <div>
                <span className="font-weight-bold">Unchanged References:&nbsp;</span>
                <ul>{unchangedReferenceDisplays}</ul>
            </div>
        );
    }

    render() {
        const { didChange=true } = this.props;

        return didChange ? this.renderChangedReferences() : this.renderUnchangedReferences();
    }
}
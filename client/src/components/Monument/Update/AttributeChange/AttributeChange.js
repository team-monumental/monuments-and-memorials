import * as React from 'react';
import './AttributeChange.scss';

/**
 * Presentational component for displaying a change in a Monument attribute
 */
export default class AttributeChange extends React.Component {

    render() {
        const { attributeLabel, oldAttribute, newAttribute, didChange, isBoolean=false } = this.props;

        return (
            <div className="attribute-update">
                <span className="font-weight-bold">{attributeLabel}:&nbsp;</span>
                {
                    isBoolean ? <span className="old-attribute">{oldAttribute ? 'Yes' : 'No'}</span> :
                        oldAttribute.length ?
                            <span className="old-attribute">{oldAttribute}</span> :
                            <span className="old-attribute none">NONE</span>
                }
                <i className="material-icons">arrow_right_alt</i>
                {
                    isBoolean ? <span className="new-attribute">{newAttribute ? 'Yes' : 'No'}</span> :
                        newAttribute.length ?
                            <span className="new-attribute">{newAttribute}</span> :
                            <span className="new-attribute none">NONE</span>
                }
                {
                    didChange ?
                        <div/> :
                        <span className="font-weight-bold">&nbsp;(NO CHANGES)</span>
                }
            </div>
        );
    }
}
import * as React from 'react';

/**
 * Presentational component for displaying unchanged Tags/Materials for a Monument
 */
export default class UnchangedTags extends React.Component {

    render() {
        const {tags, areMaterials} = this.props;

        let unchangedTagsDisplay = <span className="font-weight-bold">NONE</span>;

        if (tags && tags.length) {
            unchangedTagsDisplay = (
                <ul>
                    {tags.map(tag => <li key={tag}>{tag}</li>)}
                </ul>
            );
        }

        return (
            <div>
                <span
                    className="font-weight-bold">{areMaterials ? 'Unchanged Materials' : 'Unchanged Tags'}&nbsp;</span>
                {unchangedTagsDisplay}
            </div>
        );
    }
}
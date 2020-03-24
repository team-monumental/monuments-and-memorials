import * as React from 'react';
import './AddedTags.scss';

/**
 * Presentational component for displaying newly added Tags/Materials for a Monument
 */
export default class AddedTags extends React.Component {

    render() {
        const { tags, areMaterials } = this.props;

        let addedTagsDisplay = <span className="font-weight-bold">NONE</span>;

        if (tags && tags.length) {
            addedTagsDisplay = (
                <ul>
                    {tags.map(tag => <li className="added" key={tag}>{tag}</li>)}
                </ul>
            );
        }

        return (
            <div>
                <span className="font-weight-bold">{areMaterials ? 'Added Materials:' : 'Added Tags:'}&nbsp;</span>
                {addedTagsDisplay}
            </div>
        );
    }
}
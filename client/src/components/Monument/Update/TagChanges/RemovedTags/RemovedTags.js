import * as React from 'react';
import './RemovedTags.scss';

/**
 * Presentational component for displaying removed Tags/Materials for a Monument
 */
export default class RemovedTags extends React.Component {

    render() {
        const { tags, areMaterials } = this.props;

        let removedTagsDisplay = <span className="font-weight-bold">NONE</span>;

        if (tags && tags.length) {
            removedTagsDisplay = (
                <ul>
                    {tags.map(tag => <li className="removed" key={tag}>{tag}</li>)}
                </ul>
            );
        }

        return (
            <div>
                <span className="font-weight-bold">{areMaterials ? 'Removed Materials:' : 'Removed Tags'}&nbsp;</span>
                {removedTagsDisplay}
            </div>
        );
    }
}
import React from 'react';
import './TagDirectoryPage.scss';

/**
 * Root container component for the Tag Directory Page
 */
class TagDirectoryPage extends React.Component {

    constructor(props) {
        super(props);

        const { dispatch } = this.props;
        // TODO: Dispatch Fetch Tags
    }

    static mapStateToProps(state) {
         // TODO
    }

    render() {
        const { tags } = this.props;

        return (
            <div className='tag-directory-page-container'>
            </div>
        );
    }
}
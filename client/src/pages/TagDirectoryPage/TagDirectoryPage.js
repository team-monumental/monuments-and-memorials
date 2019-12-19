import React from 'react';
import './TagDirectoryPage.scss';
import fetchTags from '../../actions/tagDirectory';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import TagColumn from '../../components/TagColumn/TagColumn';

/**
 * Root container component for the Tag Directory Page
 */
class TagDirectoryPage extends React.Component {

    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        dispatch(fetchTags());
    }

    static mapStateToProps(state) {
        return state.tagDirectoryPage;
    }

    render() {
        const { tags, fetchTagsPending } = this.props;

        const allTags = [];
        const allMaterials = [];

        tags.forEach((tag) => {
            if (tag.isMaterial) {
                allMaterials.push(tag);
            }
            else {
                allTags.push(tag);
            }
        });

        return (
            <div className='tag-directory-page-container'>
                <Spinner show={fetchTagsPending}/>
                <div className='page-title'>
                    <h1>
                        Tag Directory
                    </h1>
                </div>
                <div className='columns-container'>
                    <div className='tags-column column'>
                        <TagColumn
                            variant='tags'
                            tags={allTags}
                        />
                    </div>
                    <div className='materials-column column'>
                        <TagColumn
                            variant='materials'
                            tags={allMaterials}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(TagDirectoryPage.mapStateToProps)(TagDirectoryPage);
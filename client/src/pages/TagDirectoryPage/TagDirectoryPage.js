import React from 'react';
import './TagDirectoryPage.scss';
import fetchTags from '../../actions/tagDirectory';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import Tags from '../../components/Tags/Tags';
import { Helmet } from 'react-helmet';
import Footer from '../../components/Footer/Footer';

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

        const allTags = tags.filter(tag => !tag.isMaterial);
        const allMaterials = tags.filter(tag => tag.isMaterial);

        return (
            <div className="page-container">
                <div className="tag-directory-page-container">
                    <Helmet title="Tags and Materials | Monuments and Memorials"/>
                    <Spinner show={fetchTagsPending}/>
                    <div className="page-title">
                        <h1>
                            Tag Directory
                        </h1>
                    </div>
                    <div className="columns-container">
                        <div className="tags-column column">
                            <h2 className="font-weight-bold">
                                Tags
                            </h2>
                            <Tags tags={allTags} selectable={false}/>
                        </div>
                        <div className="materials-column column">
                            <h2 className="font-weight-bold">
                                Materials
                            </h2>
                            <Tags tags={allMaterials} selectable={false}/>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default connect(TagDirectoryPage.mapStateToProps)(TagDirectoryPage);
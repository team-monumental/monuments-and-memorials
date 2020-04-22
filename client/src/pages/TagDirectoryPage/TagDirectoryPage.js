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
        this.state = {
            alphanumericFilter: ''
        }
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchTags());
    }

    static mapStateToProps(state) {
        return state.tagDirectoryPage;
    }

    render() {
        const { alphanumericFilter } = this.state;
        let { tags, fetchTagsPending } = this.props;

        tags = tags.filter(tag => tag.name.toLowerCase().startsWith(alphanumericFilter));
        const allTags = tags.filter(tag => !tag.isMaterial);
        const allMaterials = tags.filter(tag => tag.isMaterial);

        return (
            <div className="page-container">
                <div className="tag-directory page static">
                    <Helmet title="Tags and Materials | Monuments and Memorials"/>
                    <Spinner show={fetchTagsPending}/>
                    <div className="static-page-body">
                        <div className="row">
                            <div className="col-12">
                                <div className="static-page-title">
                                    <h1>Tag Directory</h1>
                                </div>
                                <div className="static-page-text">
                                    <p>
                                        This page provides a list of every tag and material in our system.
                                        When deciding which tags or materials to add to your monument or memorial,
                                        we suggest using existing ones first before resorting to creating new ones.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {this.renderAlphanumericFilter()}
                            <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                                <div className="static-page-title">
                                    <h2>Tags ({allTags.length})</h2>
                                </div>
                                <div className="static-page-text">
                                    <Tags tags={allTags} selectable={false}/>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="static-page-title">
                                    <h2>Materials ({allMaterials.length})</h2>
                                </div>
                                <div className="static-page-text">
                                    <Tags tags={allMaterials} selectable={false}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }

    renderAlphanumericFilter() {
        const { tags } = this.props;
        const { alphanumericFilter } = this.state;
        const characters = '012345679abcdefghijklmnopqrstuvwxyz'.split('')
            .filter(character => {
                return tags.find(tag => tag.name.toLowerCase().startsWith(character));
            });
        return (
            <div className="alphanumeric-filter">
                <span className={`character${alphanumericFilter === '' ? ' selected' : ''}`}>
                    <a href="javascript:void();"
                       onClick={() => this.setState({alphanumericFilter: ''})}>
                        All
                    </a>
                </span>
                {characters.map(character => (
                    <span key={character} className={`character${alphanumericFilter === character ? ' selected' : ''}`}>
                        <a href="javascript:void();"
                           onClick={() => this.setState({alphanumericFilter: character})}>
                            {character.toUpperCase()}
                        </a>
                    </span>
                ))}
            </div>
        );
    }
}

export default connect(TagDirectoryPage.mapStateToProps)(TagDirectoryPage);
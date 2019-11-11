import * as React from 'react';
import './TagsFilter.scss';
import { withRouter } from 'react-router-dom';
import Tags from '../../../Tags/Tags';
import search from '../../../../utils/search';
import { searchTags, loadTags, clearTagSearchResults, loadMaterials, searchMaterials, clearMaterialSearchResults } from '../../../../actions/tagsFilter';
import { connect } from 'react-redux';

class TagsFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            selectedTags: []
        };
    }

    static mapStateToProps(state, props) {
        if (props.variant === 'materials') {
            return {
                ...state.materialsFilterSearch,
                ...state.materialsFilterLoad
            }
        } else {
            return {
                ...state.tagsFilterSearch,
                ...state.tagsFilterLoad
            };
        }
    }

    componentDidMount() {
        if (this.state.searchQuery) this.searchTags();
        if (this.props.tags && this.state.selectedTags.length === 0) {
            this.loadTags();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((!prevProps.selectedTags || !prevProps.selectedTags.length) &&
            this.props.selectedTags && this.props.selectedTags.length) {
                this.setState({
                    selectedTags: (this.state.selectedTags || []).concat(this.props.selectedTags)
                        .map(tag => {
                            tag.selected = true;
                            return tag;
                        })
                })
        }
    }

    render() {
        const { searchQuery, selectedTags } = this.state;
        const { searchResults, variant } = this.props;
        const visibleSearchResults = searchResults.filter(result => {
            return !selectedTags.find(tag => tag.id === result.id);
        });

        return (
            <div className="tags-filter">
                <div className="selected-tags">
                    <Tags selectable onSelect={this.handleSelectTag.bind(this)} tags={selectedTags} selectedIcon="clear"/>
                </div>
                <div className="search">
                    <input type="text"
                           value={searchQuery}
                           onChange={(event) => this.handleSearchChange(event.target.value)}
                           placeholder={variant.charAt(0).toUpperCase() + variant.slice(1) + '...'}
                           className="form-control"
                           onKeyDown={(event) => this.handleKeyDown(event)}/>
                    {searchQuery && <i className="material-icons search-clear" onClick={() => this.handleClear()}>clear</i>}
                </div>
                <div className="search-results">
                    <Tags selectable onSelect={this.handleSelectTag.bind(this)} tags={visibleSearchResults}/>
                </div>
            </div>
        );
    }

    async handleSelectTag(value, tag) {
        let { selectedTags } = this.state;
        // If the tag is being selected, add it to the selected tags and sort them alphabetically
        if (value) {
            tag.selected = true;
            selectedTags.push(tag);
            selectedTags = selectedTags.sort();
        // If the tag is being deselected, remove it from the selected tags
        } else {
            const index = selectedTags.findIndex(t => t.name === tag.name);
            if (index >= 0) {
                [ tag ] = selectedTags.splice(index, 1);
                tag.selected = false;
            }
        }

        await this.setState({selectedTags});

        // After the selectedTags is updated, update the search results for monuments on the page
        this.searchMonuments();
    }

    async handleSearchChange(value) {
        await this.setState({searchQuery: value});
        this.searchTags();
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') this.searchTags();
    }

    handleClear() {
        const { dispatch, variant } = this.props;
        if (variant === 'materials') dispatch(clearMaterialSearchResults());
        else dispatch(clearTagSearchResults());
        this.setState({searchQuery: ''});
    }

    searchTags() {
        const { dispatch, variant } = this.props;
        const { searchQuery } = this.state;
        if (variant === 'materials') dispatch(searchMaterials(searchQuery));
        else dispatch(searchTags(searchQuery));
    }

    // Loads specific tags by name, which were already selected at page load but need to have the full record loaded in
    loadTags() {
        const { dispatch, tags, variant } = this.props;
        if (variant === 'materials') dispatch(loadMaterials(tags));
        else dispatch(loadTags(tags));
    }

    searchMonuments() {
        const params = {};
        params[this.props.variant] = this.state.selectedTags.map(tag => tag.name);
        search(params, this.props.history);
    }
}

export default connect(TagsFilter.mapStateToProps)(withRouter(TagsFilter));
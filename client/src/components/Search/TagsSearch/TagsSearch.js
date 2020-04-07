import * as React from 'react';
import './TagsSearch.scss';
import Tags from '../../Tags/Tags';
import { searchTags, loadTags, clearTagSearchResults, loadMaterials, searchMaterials, clearMaterialSearchResults } from '../../../actions/tagsSearch';
import { connect } from 'react-redux';

class TagsSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            selectedTags: [],
            createdTags: [],
            createdTagsKey: -1
        };
    }

    static mapStateToProps(state, props) {
        if (props.variant === 'materials') {
            return {
                ...state.materialsSearch,
                ...state.materialsLoad
            }
        } else {
            return {
                ...state.tagsSearch,
                ...state.tagsLoad
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
        const { searchQuery, selectedTags, createdTags, createdTagsKey } = this.state;
        const { searchResults, variant, className, allowTagCreation } = this.props;
        const visibleSearchResults = searchResults.filter(result => {
            return !selectedTags.find(tag => tag.id === result.id);
        });

        let createNewTagDisplay = (
          <div/>
        );

        if (allowTagCreation && searchQuery !== '' && !selectedTags.find(tag => tag.name === searchQuery)
            && !createdTags.find(tag => tag.name === searchQuery))
        {
            const tag = {
                id: createdTagsKey,
                name: searchQuery,
                isMaterial: variant === 'materials',
                selected: false
            };

            createNewTagDisplay = (
                <div className="new-tag-container">
                    <p>Create New:</p>
                    <Tags
                        selectable
                        onSelect={(value, tag) => this.handleNewTagSelect(value, tag)}
                        tags={[tag]}
                        selectedIcon="clear"
                    />
                </div>
            );
        }

        return (
            <div className={className !== undefined ? "tags-search " + className : "tags-search"}>
                <div className="selected-tags">
                    <Tags selectable onSelect={this.handleSelectTag.bind(this)} tags={selectedTags} selectedIcon="clear"/>
                    <Tags selectable onSelect={this.handleNewTagSelect.bind(this)} tags={createdTags} selectedIcon="clear"/>
                </div>
                <div className="search">
                    <input type="text"
                           name={variant}
                           value={searchQuery}
                           onChange={(event) => this.handleSearchChange(event.target.value)}
                           placeholder={variant.charAt(0).toUpperCase() + variant.slice(1) + '...'}
                           className="form-control"
                           onKeyDown={(event) => this.handleKeyDown(event)}
                           autoComplete="off"/>
                    {searchQuery && <i className="material-icons search-clear" onClick={() => this.handleClear()}>clear</i>}
                </div>
                <div className="search-results">
                    <Tags selectable onSelect={this.handleSelectTag.bind(this)} tags={visibleSearchResults}/>
                    {createNewTagDisplay}
                </div>
            </div>
        );
    }

    async handleSelectTag(value, tag) {
        let { selectedTags } = this.state;
        const { createdTags } = this.state;
        const { variant, onChange } = this.props;
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

        onChange(variant, selectedTags, createdTags);
    }

    async handleNewTagSelect(value, tag) {
        let { createdTags, createdTagsKey } = this.state;
        const { selectedTags } = this.state;
        const { variant, onChange } = this.props;

        // If the Tag is being selected, add it to the created Tags and sort them alphabetically
        if (value) {
            tag.selected = true;
            createdTags.push(tag);
            createdTags = createdTags.sort();
            createdTagsKey--;
        }
        // Otherwise, the Tag is being deselected, remove it from the created Tags
        else {
            const index = createdTags.findIndex(t => t.name === tag.name);
            if (index >= 0) {
                [ tag ] = createdTags.splice(index, 1);
                tag.selected = false;
            }
        }

        await this.setState({createdTags, createdTagsKey});

        onChange(variant, selectedTags, createdTags);
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

    handleSelectedTagsClear() {
        this.setState({selectedTags: [], createdTags: []});
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
}

export default connect(TagsSearch.mapStateToProps, null, null, {forwardRef: true})(TagsSearch);
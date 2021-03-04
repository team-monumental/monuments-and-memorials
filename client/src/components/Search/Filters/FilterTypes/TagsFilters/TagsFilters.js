import * as React from 'react';
import '../../../TagsSearch/TagsSearch.scss';
import Tags from '../../../../Tags/Tags';
import Tag from '../../../../Tags/Tag/Tag'
import { searchTags, clearTagSearchResults, searchMaterials, clearMaterialSearchResults } from '../../../../../actions/tagsSearch';
import { connect } from 'react-redux';

class TagsFilter extends React.Component {

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
            }
        } else {
            return {
                ...state.tagsSearch,
            };
        }
    }
    

    render() {
        const { searchQuery } = this.state;
        const { searchResults, variant, className, searchUri, tags} = this.props;
        const visibleSearchResults = searchResults.filter(result => {
            return !tags.find(tag => tag === result.name);
        });

        let createNewTagDisplay = (
          <div/>
        );

        return (
            <div className={className !== undefined ? "tags-search " + className : "tags-search"}>
                <div className="selected-tags">
                    <div className="tags">
                {tags.map((tag) => {
                    return (
                        <Tag key={tag} name={tag} isMaterial={variant} selectable={true} onSelect={(value) => this.handleSelectTag(value, tag)} selectedIcon={"clear"} selected={true} searchUri={searchUri}/>
                    );
                })}
            </div>
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
                    <Tags selectable onSelect={(value, tag) => this.handleSelectTag(value, tag.name)} tags={visibleSearchResults}/>
                    {createNewTagDisplay}
                </div>
            </div>
        );
    }

    async handleSelectTag(value, tag) {
        
        const { onChange, tags } = this.props
        console.log(value, tag, tags) 
        if (!tags.includes(tag) || !value) {
            onChange(value, tag);
        }
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

}

export default connect(TagsFilter.mapStateToProps, null, null, {forwardRef: true})(TagsFilter);
import * as React from 'react';
import './Filters.scss';
import { withRouter } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import TagsSearch from '../TagsSearch/TagsSearch';
import search from "../../../utils/search";

class Filters extends React.Component {

    constructor(props) {
        super(props);
        const { distance } = props;
        this.state = { distance };
    }

    async handleFilterChange(name, value) {
        const { onChange } = this.props;

        const updatedState = {};
        updatedState[name] = value;
        await this.setState(updatedState);

        onChange(this.state);
    }

    handleTagsSearchTagSelect(variant, selectedTags) {
        const params = {};

        params[variant] = selectedTags.map(tag => tag.name);
        search(params, this.props.history);
    }

    render() {

        const { showDistance, tags, materials } = this.props;

        const distanceFilter = showDistance ? (
            <Form.Control onChange={event => this.handleFilterChange('distance', event.target.value)} as="select" style={{width: 'min-content'}} className="py-1 px-2" defaultValue="25">
                <option value="10">Within 10 miles</option>
                <option value="15">Within 15 miles</option>
                <option value="25">Within 25 miles</option>
                <option value="50">Within 50 miles</option>
                <option value="100">Within 100 miles</option>
            </Form.Control>
        ) : null;

        return (
            <div className="filters">
                {distanceFilter}
                <div className="tags-container">
                    <TagsSearch
                        variant="tags"
                        tags={tags}
                        onChange={(variant, selectedTags) => this.handleTagsSearchTagSelect(variant, selectedTags)}
                        allowTagCreation={false}
                    />
                    <TagsSearch
                        variant="materials"
                        tags={materials}
                        onChange={(variant, selectedTags) => this.handleTagsSearchTagSelect(variant, selectedTags)}
                        allowTagCreation={false}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(Filters);
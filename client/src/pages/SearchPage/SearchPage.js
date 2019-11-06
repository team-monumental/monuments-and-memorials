import React from 'react';
import { connect } from 'react-redux';
import searchMonuments from '../../actions/search';
import Spinner from '../../components/Spinner/Spinner';
import Search from '../../components/Search/Search';
import * as QueryString from 'query-string';

/**
 * Root container component for the search page which handles retrieving the search results
 * and the total count of search results via redux actions. It does this solely by checking the
 * page's query params when it is rendered, so other pages must redirect to the search page in order
 * to trigger a search
 */
class SearchPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: this.getQueryParam('page') || 1,
            limit: this.getQueryParam('limit') || 25
        }
    }

    static mapStateToProps(state) {
        if (state.searchPage) {
            const { monuments, count } = state.searchPage;
            if (monuments.error || count.error || monuments.errors || count.errors) return {};
        }
        return state.searchPage;
    }

    componentDidMount() {
        const { dispatch, location: { search } } = this.props;
        dispatch(searchMonuments(QueryString.parse(search)));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { dispatch, location: { search } } = this.props;
        if (prevProps.location.search !== search) {
            dispatch(searchMonuments(QueryString.parse(search)));
        }
    }

    render() {
        const { page, limit } = this.state;
        const { monuments, count, pending, location: { search } } = this.props;
        const { lat, lon } = QueryString.parse(search);
        return (
            <div style={{height: '100%'}}>
                <Spinner show={pending}/>
                <Search monuments={monuments} count={count} page={page} limit={limit} lat={lat} lon={lon}
                        onLimitChange={this.onLimitChange.bind(this)} onPageChange={this.onPageChange.bind(this)}/>
            </div>
        );
    }

    getQueryParam(param) {
        let value = this.props.history.location.search.match(new RegExp(`(?<=${param}=)\\d+`));
        if (value) {
            try {
                value = parseInt(value);
                let state = {};
                state[param] = value;
                if (value !== this.state[param]) this.setState(state);
            } catch (err) {}
        }
        return parseInt(value);
    }

    async onLimitChange(limit) {
        await this.setState({limit, page: 1});
        this.search();
    }

    async onPageChange(page) {
        await this.setState({page});
        this.search();
    }


    search() {
        const { page, limit } = this.state;
        const { location: { search }, history } = this.props;
        const queryString = QueryString.stringify({
            q: QueryString.parse(search).q,
            page,
            limit
        });
        history.push(`/search/?${queryString}`);
    }
}

export default connect(SearchPage.mapStateToProps)(SearchPage);
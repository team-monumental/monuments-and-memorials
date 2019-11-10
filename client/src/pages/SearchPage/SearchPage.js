import React from 'react';
import { connect } from 'react-redux';
import searchMonuments from '../../actions/search';
import Spinner from '../../components/Spinner/Spinner';
import Search from '../../components/Search/Search';
import * as QueryString from 'query-string';
import search from '../../utils/search';

/**
 * Root container component for the search page which handles retrieving the search results
 * and the total count of search results via redux actions. It does this solely by checking the
 * page's query params when it is rendered, so other pages must redirect to the search page in order
 * to trigger a search
 */
class SearchPage extends React.Component {

    constructor(props) {
        super(props);
        const params = QueryString.parse(this.props.history.location.search);
        this.state = {
            q: params.q,
            page: params.page || 1,
            limit: params.limit || 25,
            lat: params.lat,
            lon: params.lon
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
        const { page, limit, lat, lon } = this.state;
        const { monuments, count, pending } = this.props;
        return (
            <div className="h-100">
                <Spinner show={pending}/>
                <Search monuments={monuments} count={count} page={page} limit={limit} lat={lat} lon={lon}
                        onLimitChange={this.onLimitChange.bind(this)} onPageChange={this.onPageChange.bind(this)}/>
            </div>
        );
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
        const { q, page, limit } = this.state;
        search({q, page, limit}, this.props.history);
    }
}

export default connect(SearchPage.mapStateToProps)(SearchPage);
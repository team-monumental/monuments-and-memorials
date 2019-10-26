import React from 'react';
import { connect } from 'react-redux';
import searchMonuments from '../../actions/search';
import Spinner from '../../components/Spinner/Spinner';
import Search from '../../components/Search/Search';
import * as QueryString from 'query-string';

class SearchPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: this.getQueryParam('page') || 1,
            limit: this.getQueryParam('limit') || 25
        }
    }

    static mapStateToProps(state) {
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
        const { monuments, count, pending } = this.props;
        return (
            <div>
                <Spinner show={pending}/>
                <Search monuments={monuments} count={count} page={page} limit={limit}
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
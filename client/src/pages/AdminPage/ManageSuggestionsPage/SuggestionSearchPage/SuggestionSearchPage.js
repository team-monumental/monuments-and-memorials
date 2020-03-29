import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as QueryString from 'query-string';

class SuggestionSearchPage extends React.Component {

    constructor(props) {
        super(props);

        const params = QueryString.parse(props.history.location.search);
        this.state = {
            page: params.page || 1,
            limit: params.limit || 25
        };
    }

    static mapStateToProps(state) {

    }
}

export default withRouter(connect(SuggestionSearchPage.mapStateToProps)(SuggestionSearchPage));
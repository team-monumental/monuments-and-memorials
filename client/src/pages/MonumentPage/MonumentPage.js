import React from 'react';
import { connect } from 'react-redux';

import Monument from '../../components/Monument/Monument';
import Spinner from '../../components/Spinner/Spinner';
import fetchMonument from '../../actions/monument';

class MonumentPage extends React.Component {

    static mapStateToProps(state) {
        return state.monumentPage;
    }

    componentDidMount() {
        const { dispatch, match: { params: { monumentId } } } = this.props;
        dispatch(fetchMonument(monumentId));
    }

    render() {
        const { monument, pending } = this.props;
        return (
            <div>
                <Spinner show={pending}/>
                <Monument monument={monument}/>
            </div>
        )
    }
}

export default connect(MonumentPage.mapStateToProps)(MonumentPage);
import * as React from 'react';
import './MapPage.scss';
import MapResults from '../../components/Search/MapResults/MapResults';
import { connect } from 'react-redux';
import fetchMonuments from '../../actions/map';
import { Helmet } from 'react-helmet';

class MapPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            zoomSize: '5'
        };
        const { dispatch } = props;
        dispatch(fetchMonuments());
    }

    componentDidMount() {
        if (window.innerWidth < 700) {
            this.setState({zoomSize: 3});
        }
        else if (window.innerWidth >= 700 && window.innerWidth < 1600) {
            this.setState({zoomSize: 4});
        }
    }

    static mapStateToProps(state) {
        if (state.mapPage) {
            const monuments = state.mapPage.monuments;
            if (monuments.error || monuments.errors) return {};
        }
        return state.mapPage;
    }

    render() {
        const { monuments } = this.props;
        return (
            <div className="map-page">
                <Helmet title="Map | Monuments and Memorials"/>
                <MapResults monuments={monuments} useCircleMarkers zoom={this.state.zoomSize}/>
            </div>
        );
    }
}

export default connect(MapPage.mapStateToProps)(MapPage);
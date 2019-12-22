import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AboutInformation from '../../components/About/AboutInformation/AboutInformation';
import fetchAboutPageStatistics from '../../actions/about-page';
import Spinner from '../../components/Spinner/Spinner';

/**
 * Root container component for the page that contains information about the site
 */
class AboutPage extends React.Component {

    static mapStateToProps(state) {
        return state.aboutPage;
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchAboutPageStatistics());
    }

    render() {
        const { fetchContributorsPending, contributors, contributorsError } = this.props;

        console.log(contributors);

        return (
            <div className='about-page-container'>
                <Spinner show={fetchContributorsPending}/>
                <AboutInformation/>
            </div>
        );
    }
}

export default withRouter(connect(AboutPage.mapStateToProps)(AboutPage));
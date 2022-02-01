import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import AboutInformation from '../../components/About/AboutInformation/AboutInformation';
import fetchAboutPageStatistics from '../../actions/about-page';
import Spinner from '../../components/Spinner/Spinner';
import {Helmet} from 'react-helmet';
import Footer from '../../components/Footer/Footer';

/**
 * Root container component for the page that contains information about the site
 */
class AboutPage extends React.Component {

    static mapStateToProps(state) {
        return state.aboutPage;
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchAboutPageStatistics());
    }

    render() {
        const {
            fetchContributorsPending, fetchMonumentStatisticsPending, contributors, monumentStatistics,
            contributorsError, monumentStatisticsError
        } = this.props;

        return (
            <div className="page-container">
                <div className="about page static">
                    <Helmet title="About | Monuments and Memorials"/>
                    <Spinner show={fetchContributorsPending || fetchMonumentStatisticsPending}/>
                    <AboutInformation
                        contributors={contributorsError ? null : contributors.filter(contributor => contributor)}
                        monumentStatistics={monumentStatisticsError ? null : monumentStatistics}
                    />
                </div>
                <Footer/>
            </div>
        );
    }
}

export default withRouter(connect(AboutPage.mapStateToProps)(AboutPage));
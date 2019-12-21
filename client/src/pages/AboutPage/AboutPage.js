import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AboutInformation from '../../components/About/AboutInformation/AboutInformation';

/**
 * Root container component for the page that contains information about the site
 */
class AboutPage extends React.Component {

    static mapStateToProps(state) {

    }

    render() {
        return (
            <div className='about-page-container'>
                <AboutInformation/>
            </div>
        );
    }
}

export default withRouter(connect(AboutPage.mapStateToProps)(AboutPage));
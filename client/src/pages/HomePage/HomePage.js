import React from 'react';
import './HomePage.scss';
import SuggestChanges from '../../components/SuggestChanges/SuggestChanges';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

class HomePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dismissAlert: false
        }
    }

    handleSuggestChangesButtonClick() {
        const { history } = this.props;
        history.replace('/create');
    }

    static mapStateToProps(state) {
        return {
            session: state.session
        };
    }

    render() {
        const { location, session } = this.props;
        const alert = location.state && !session.pending && !session.user && location.state.alert ?
            <span dangerouslySetInnerHTML={{__html: location.state.alert}}/>
            : undefined;
        const { dismissAlert } = this.state;

        let mapLink = (
            <Link to="/map">click here</Link>
        );

        let suggestionLink = (
            <Link to="/create" key="login">click here</Link>
        );

        return (
            <>
                <Helmet title="Monuments and Memorials"/>
                {alert && !dismissAlert &&
                    <Alert variant="danger"
                           onClose={() => this.setState({dismissAlert: true})}
                           dismissible
                           className="mx-4 d-flex align-items-center">
                        <i className="material-icons mr-2">warning</i>
                        <span>{alert}</span>
                    </Alert>
                }
                <div className="home page static">
                    <div className="static-page-body">
                        <div className="row align-items-center">
                            <div className="col-lg-5 col-12">
                                <div className="static-page-title">
                                    <h1>Welcome to Monuments + Memorials</h1>
                                </div>
                                <div className="static-page-text">
                                    <p>
                                        Thank you for visiting <span className='font-italic'>Monuments + Memorials</span>, a
                                        crowd-sourced initiative developed at Rochester Institute of Technology.
                                    </p>
                                    <p>
                                        Begun in the spring 2019 with data collection and launched as a site in fall 2019,&nbsp;
                                         <span className='font-italic'>Monuments + Memorials</span> is a long-term look at monuments,
                                        memorials, and memory in the US. To view monuments and memorials, {mapLink}. To enter
                                        data, {suggestionLink}.
                                    </p>
                                </div>
                                <Link to="/about" className="btn btn-primary mt-3">Learn More</Link>
                            </div>
                            <div className="col-lg-7 col-12 home-page-image-container">
                                <div className="home-page-image"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col static-page-centered-col">
                                <div className="static-page-centered">
                                    <div className="static-page-title">
                                        <h2>Our Mission</h2>
                                    </div>
                                    <div className="static-page-text">
                                        <p>
                                            <span className='font-italic'>Monuments + Memorials</span> is a crowd-sourced initiative to map every permanent and temporary monument or memorial in the United States
                                            and its inhabited territories (American Samoa, Guam, Puerto Rico, the North Mariana Islands,
                                            and U.S. Virgin Islands). We invite anyone to contribute information and an image of
                                            monuments and memorials in these areas.
                                        </p>
                                        <p>
                                            Students from K-12 and higher education, as well as community groups and other organizations,
                                            are invited to join us in documenting our monuments and memorials.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-12">
                                <div className="static-page-title">
                                    <h2>Contributing</h2>
                                </div>
                                <div className="static-page-text pr-lg-4">
                                    <p>
                                        If you would like to join our team as a Monuments + Memorials <strong>Partner</strong> and
                                        serve as a key connection to local communities, please let us know. Partners are vital to
                                        the efforts to collect data from a defined area (such as a city, town, or country) or related
                                        to a particular theme or subject (such as Doughboy statues, memorials to Martin Luther King,
                                        Jr., and other subjects). We are looking for Partners across the United States.
                                    </p>
                                    <p>
                                        If you would like to join our team as a Monuments + Memorials <strong>Researcher</strong> and
                                        serve as a key connection to research about monuments + memorials, please let us know.
                                        Researchers are vital to the ongoing efforts of data collection and may contribute to data
                                        refinement and interpretation. We are looking for Researchers across the United States.
                                    </p>
                                    <p>
                                        If you would like to join our team as a Monuments + Memorials <strong>Contributor</strong>
                                        &nbsp;and serve as a key connection to research about monuments + memorials, please sign up
                                        for an account and begin entering data.
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-6 col-12">
                                <SuggestChanges mode="create" onButtonClick={() => this.handleSuggestChangesButtonClick()}/>
                            </div>
                        </div>
                        <p>
                            Thank you for your efforts to help us document monuments + memorials.<br/>
                            If you have any questions, please <a href="mailto:contact@monuments.us.org">contact us</a>.
                        </p>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(HomePage.mapStateToProps)(withRouter(HomePage));
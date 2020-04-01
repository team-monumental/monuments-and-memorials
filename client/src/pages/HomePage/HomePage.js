import React from 'react';
import './HomePage.scss';
import SuggestChanges from '../../components/SuggestChanges/SuggestChanges';
import { NavLink, withRouter } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
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
        history.replace('/create/')
    }

    render() {
        const alert = this.props.location.state ? this.props.location.state.alert : undefined;
        const { dismissAlert } = this.state;

        let mapNavLink = (
            <NavLink onClick={e => {
                e.preventDefault();
                window.location.replace('/map');
            }} to='/map' key='map'>click here</NavLink>
        );

        let loginLink = (
            <NavLink onClick={e => {
                e.preventDefault();
                window.location.replace('/login');
            }} to="/login" key="login">click here</NavLink>
        );

        return (
            <>
                <Helmet title="Monuments and Memorials"/>
                {alert && !dismissAlert &&
                    <Alert variant="danger"
                           onClose={() => this.setState({dismissAlert: true})}
                           dismissible
                           className="mx-4">
                        {alert}
                    </Alert>
                }
                <div id="welcome-page-body">
                    <div id='home-page-title'>
                        Welcome to Monuments + Memorials
                    </div>
                    <div id='home-page-image'/>
                    <div>
                        <p>
                            Thank you for visiting <span className='font-italic'>Monuments + Memorials</span>, a
                            crowd-sourced initiative developed at Rochester Institute of Technology. Begun in the spring
                            2019 with data collection and launched as a site in fall 2019,&nbsp;
                            <span className='font-italic'>Monuments + Memorials</span> is a long-term look at monuments,
                            memorials, and memory in the US. To view monuments and memorials, {mapNavLink}. To enter
                            data, {loginLink}.
                            <br/>
                            <br/>
                            Our goal is to map every permanent and temporary monument or memorial in the United States
                            and its inhabited territories (American Samoa, Guam, Puerto Rico, the North Mariana Islands,
                            and U.S. Virgin Islands). We invite anyone to contribute information and an image of
                            monuments and memorials in these areas.
                            <br/>
                            <br/>
                            Students from K-12 and higher education, as well as community groups and other organizations,
                            are invited to join us in documenting our monuments and memorials.
                            <br/>
                            <br/>
                            If you would like to join our team as a Monuments + Memorials <strong>Partner</strong> and
                            serve as a key connection to local communities, please let us know. Partners are vital to
                            the efforts to collect data from a defined area (such as a city, town, or country) or related
                            to a particular theme or subject (such as Doughboy statues, memorials to Martin Luther King,
                            Jr., and other subjects). We are looking for Partners across the United States.
                            <br/>
                            <br/>
                            If you would like to join our team as a Monuments + Memorials <strong>Researcher</strong> and
                            serve as a key connection to research about monuments + memorials, please let us know.
                            Researchers are vital to the ongoing efforts of data collection and may contribute to data
                            refinement and interpretation. We are looking for Researchers across the United States.
                            <br/>
                            <br/>
                            If you would like to join our team as a Monuments + Memorials <strong>Contributor</strong>
                            &nbsp;and serve as a key connection to research about monuments + memorials, please sign up
                            for an account and begin entering data.
                            <br/>
                            <br/>
                            Thank you for your efforts to help us document monuments + memorials.<br/>
                            If you have any questions, please contact the project coordinator, Juilee Decker&nbsp;
                            <a href="mailto:jdgsh@rit.edu">jdgsh@rit.edu</a>.
                        </p>
                    </div>
                    <SuggestChanges onButtonClick={() => this.handleSuggestChangesButtonClick()}/>
                </div>
            </>
        );
    }
}

export default withRouter(HomePage);
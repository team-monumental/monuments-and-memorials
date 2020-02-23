import React from 'react';
import './HomePage.scss';
import SuggestChanges from '../../components/Monument/SuggestChanges/SuggestChanges';
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

    render() {
        const alert = this.props.location.state ? this.props.location.state.alert : undefined;
        const { dismissAlert } = this.state;

        let mapNavLink = (
            <NavLink onClick={e => {
                e.preventDefault();
                window.location.replace('/map');
            }} to='/map' key='map'>click here</NavLink>
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
                            Thank you for visiting <span className='font-italic'>Monuments + Memorials</span>, a crowd-sourced initiative developed at Rochester Institute of Technology.
                            Begun in the spring 2019 with data collection and launched as a site in fall 2019, <span className='font-italic'>Monuments + Memorials</span> is a long-term
                            look at monuments, memorials, and memory in the US. To view monuments and memorials, {mapNavLink}. To enter
                            data, click here.
                            <br/>
                            <br/>
                            Our goal is to map every monument or memorial in the United States and its inhabited territories (American Samoa, Guam,
                            Puerto Rico, the North Mariana Islands, and U.S. Virgin Islands). We invite anyone to contribute information and an
                            image of monuments and memorials in these areas.
                            <br/>
                            <br/>
                            Students from K-12 and higher education, as well as community groups and other organizations, are invited to join us
                            in documenting our monuments and memorials. If you would like to join our team as a project partner and collect data
                            from a defined area (such as a city, town, or county), please let us know. We are looking for partners across the
                            United States.
                            <br/>
                            <br/>
                            If you have any questions, please contact the project coordinator, <b>Juilee Decker jdgsh@rit.edu</b>.
                        </p>
                    </div>
                    <SuggestChanges/>
                </div>
            </>
        );
    }
}

export default withRouter(HomePage);
import React from 'react';
import './App.scss';
import './theme.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import Header from './components/Header/Header';
import MonumentPage from './pages/MonumentPage/MonumentPage';
import SearchPage from './pages/SearchPage/SearchPage';
import ErrorHandler from './containers/ErrorHandler/ErrorHandler';
import Toaster from './containers/Toaster/Toaster';
import MapPage from './pages/MapPage/MapPage';
import CreateMonumentPage from './pages/CreateMonumentPage/CreateMonumentPage';
import MonumentBulkCreatePage from './pages/MonumentBulkCreatePage/MonumentBulkCreatePage';
import TagDirectoryPage from './pages/TagDirectoryPage/TagDirectoryPage';
import SuggestChanges from './components/Monument/SuggestChanges/SuggestChanges';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            headerHeight: 0
        };
    }

    render() {
        const { headerHeight } = this.state;

        let mapNavLink = (
            <NavLink onClick={e => {
                e.preventDefault();
                window.location.replace('/map');
            }} to='/map' key='map'>click here</NavLink>
        );

        return (
            <div className="App">
                <Helmet title={'Monuments and Memorials'}/>
                <Toaster/>
                <Router>
                    <Header onRender={headerHeight => this.setState({headerHeight})}/>
                    <div style={{height: `calc(100vh - ${headerHeight}px)`}}>
                        <ErrorHandler>
                            <Route path="/map" component={MapPage}/>
                            <Route exact path="/">
                                <div id="welcome-page-body">
                                    <h1>
                                        Welcome to Monuments + Memorials
                                    </h1>
                                    <div>
                                        <img className='homePageImage' src={process.env.PUBLIC_URL + '/home_page_image.jpg'}/>
                                    </div>
                                    <div>
                                        <div className='about-information-container'>
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
                                    </div>
                                    <div>
                                        <SuggestChanges/>
                                    </div>
                                </div>
                            </Route>
                            <Route path="/monuments/:monumentId/:slug?" component={MonumentPage}/>
                            <Route path="/search" component={SearchPage}/>
                            <Route path="/create" component={CreateMonumentPage}/>
                            <Route path='/bulk-create' component={MonumentBulkCreatePage}/>
                            <Route path='/tag-directory' component={TagDirectoryPage}/>
                        </ErrorHandler>
                    </div>
                </Router>
            </div>
        );
    }
}

export default connect()(App);

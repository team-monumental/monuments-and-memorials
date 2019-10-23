import React from 'react';
import './App.scss';
import './theme.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Header from './components/Header/Header';
import Monument from './components/Monument/Monument';
import Search from './components/Search/Search';

export default class App extends React.Component {

    render() {
        return (
            <div className="App">
                <Helmet title={'Monuments and Memorials'}/>
                <Router>
                    <Header/>
                    <div className="page">
                        <Route path="/map">
                            <div className="homepage-map gmaps">
                                <div className="mapouter">
                                    <div className="gmap_canvas">
                                        <iframe id="gmap_canvas"
                                                title="gmaps-iframe"
                                                src="https://maps.google.com/maps?q=lincoln%20memorial&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                                frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"/>
                                    </div>
                                </div>
                            </div>
                        </Route>
                        <Route exact path="/">
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <h1>Welcome!</h1>
                            </div>
                        </Route>
                        <Route path="/monuments/:monumentId/:slug?" component={Monument}/>
                        <Route path="/search" component={Search}/>
                    </div>
                </Router>
            </div>
        );
    }
}

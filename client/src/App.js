import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Monument from './components/Monument/Monument';

function App() {
    return (
        <div className="App">
            <Router>
                <Header/>
                <div style={{padding: '0 4rem'}}>
                    <Route path="/map">
                        <div className="gmaps">
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
                </div>
            </Router>
        </div>
    );
}

export default App;

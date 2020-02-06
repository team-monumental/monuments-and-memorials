import React from 'react';
import './App.scss';
import './theme.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

import Header from './components/Header/Header';
import MonumentPage from './pages/MonumentPage/MonumentPage';
import SearchPage from './pages/SearchPage/SearchPage';
import ErrorHandler from './containers/ErrorHandler/ErrorHandler';
import Toaster from './containers/Toaster/Toaster';
import MapPage from './pages/MapPage/MapPage';
import CreateMonumentPage from './pages/CreateMonumentPage/CreateMonumentPage';
import MonumentBulkCreatePage from './pages/MonumentBulkCreatePage/MonumentBulkCreatePage';
import TagDirectoryPage from './pages/TagDirectoryPage/TagDirectoryPage';
import AboutPage from './pages/AboutPage/AboutPage';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            headerHeight: 0
        };
    }

    render() {
        const { headerHeight } = this.state;
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
                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                    <h1>Welcome!</h1>
                                </div>
                            </Route>
                            <Route path="/monuments/:monumentId/:slug?" component={MonumentPage}/>
                            <Route path="/search" component={SearchPage}/>
                            <Route path="/create" component={CreateMonumentPage}/>
                            <Route path="/bulk-create" component={MonumentBulkCreatePage}/>
                            <Route path="/tag-directory" component={TagDirectoryPage}/>
                            <Route path="/about" component={AboutPage}/>
                        </ErrorHandler>
                    </div>
                </Router>
            </div>
        );
    }
}

export default connect()(App);

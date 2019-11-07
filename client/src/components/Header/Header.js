import React from 'react';
import './Header.scss';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import SearchBar from './SearchBar/SearchBar';

export default class Header extends React.Component {

    links = [
        {name: 'Home', route: '/', exact: true},
        {name: 'Map', route: '/map'},
        {name: 'About', route: '/about'}
    ];

    componentDidMount() {
        this.props.onRender(this.divRef.clientHeight);
    }

    render() {
        return (
            <div className="header" id="pageHeader" ref={element => this.divRef = element}>
                <div className="left">
                    <div className="links d-none d-lg-block">
                        {this.links.map(link =>
                            <NavLink onClick={e => {
                                e.preventDefault();
                                window.location.replace(link.route);
                            }} to={link.route} exact={link.exact} className="header-link mr-4" activeClassName="active" key={link.name}>{link.name}</NavLink>
                        )}
                    </div>
                </div>
                <div className="center">
                    <SearchBar/>
                </div>
                <div className="right">
                    <Button size="sm" variant="link-secondary">Log in</Button>
                    <Button size="sm">Sign up</Button>
                </div>
            </div>
        );
    }
}
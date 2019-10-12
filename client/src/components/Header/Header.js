import React from 'react';
import './Header.scss';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default class Header extends React.Component {

    links = [
        {name: 'Home', route: '/', exact: true},
        {name: 'Map', route: '/map'},
        {name: 'About', route: '/about'}
    ];

    render() {
        return (
            <div className="header">
                <div className="left">
                    <div className="links">
                        {this.links.map((link, index) =>
                            <NavLink to={link.route} exact={link.exact} className="header-link" activeClassName="active" key={link.name}>{link.name}</NavLink>
                        )}
                    </div>
                </div>
                <div className="center">
                    Put a search bar here pls
                </div>
                <div className="right">
                    <Button size="sm" variant="link-secondary">Log in</Button>
                    <Button size="sm">Sign up</Button>
                </div>
            </div>
        );
    }
}
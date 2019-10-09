import React from 'react';
import './Header.css';
import Logo from '../Logo/Logo';
import { Link } from 'react-router-dom';

export default class Header extends React.Component {

    links = [
        {name: 'Home', route: '/'},
        {name: 'About', route: '/about'},
        {name: 'Contribute', route: '/contribute'},
        {name: 'Map', route: '/map'}
    ];

    render() {
        return (
            <div className="header">
                <div className="left">
                    <Logo/>
                </div>
                <div className="center">
                    {this.links.map(link =>
                        <Link to={link.route} className="header-link" key={link.name}>{link.name}</Link>
                    )}
                </div>
                <div className="right">
                    <button className="button-outline">Log in</button>
                    <button className="button">Sign up</button>
                </div>
            </div>
        );
    }
}
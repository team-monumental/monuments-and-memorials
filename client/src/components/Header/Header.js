import React from 'react';
import './Header.css';
import Logo from '../Logo/Logo';

export default class Header extends React.Component {

    render() {
        return (
            <div className="header">
                <div className="left">
                    <Logo/>
                </div>
                <div className="right">
                    <a className="header-link" href="/">Home</a>
                    <a className="header-link" href="/about">About</a>
                    <a className="header-link" href="/contribute">Contribute</a>
                    <a className="header-link active" href="/map">Map</a>
                    <button className="button-outline">Log in</button>
                    <button className="button">Sign up</button>
                </div>
            </div>
        );
    }
}
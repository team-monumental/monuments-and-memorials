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
                    <a className="header-link">Home</a>
                    <a className="header-link">About</a>
                    <a className="header-link">Contribute</a>
                    <a className="header-link active">Map</a>
                    <button className="button-outline">Log in</button>
                    <button className="button">Sign up</button>
                </div>
            </div>
        );
    }
}
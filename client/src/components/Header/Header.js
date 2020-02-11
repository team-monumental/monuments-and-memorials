import React from 'react';
import './Header.scss';
import { NavLink } from 'react-router-dom';
import {Button, Modal} from 'react-bootstrap';
import SearchBar from './SearchBar/SearchBar';
import CheeseburgerMenu from 'cheeseburger-menu'
import Logo from '../Logo/Logo';
import { Link } from 'react-router-dom';

export default class Header extends React.Component {

    links = [
        {name: 'Home', route: '/', exact: true},
        {name: 'Map', route: '/map'},
        {name: 'About', route: '/about'}
    ];

    constructor(props) {
        super(props);
        this.state = {
            screenWidth: 0,
            isMenuOpen: false,
            isSearchModalOpen: false
        };
        this.resize = this.resize.bind(this);
    }

    componentDidMount() {
        this.props.onRender(this.divRef.clientHeight);
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    resize() {
        this.setState({screenWidth: window.innerWidth});
    }

    render() {
        let headerLinks = this.links.map(link =>
            <NavLink onClick={e => {
                e.preventDefault();
                window.location.replace(link.route);
            }} to={link.route} exact={link.exact} className="header-link mr-4" activeClassName="active" key={link.name}>{link.name}</NavLink>
        );
        return (
            <div className="header" id="pageHeader" ref={element => this.divRef = element}>

                <div className="left">
                    <Logo size="35px"/>

                    <div className="desktop-links">
                        <div className="links d-lg-block">
                            {headerLinks}
                        </div>
                    </div>
                </div>

                <div className="center">
                    {/* Desktop and Tablet */}
                    {window.innerWidth >= 576 && <>
                        <div className="search-bar-container">
                            <SearchBar/>
                        </div>
                    </>}

                    {/* Mobile */}
                    {window.innerWidth < 768 && <>
                        <Modal className="mobile-search-modal" show={this.state.isSearchModalOpen} onHide={() => {this.setState({isSearchModalOpen: false})}} animation={false}>
                            <Modal.Header closeButton>
                                <Logo size="35px"/>
                            </Modal.Header>
                            <Modal.Body>
                                <SearchBar onCloseModal={() => {
                                    this.setState({isSearchModalOpen: false})
                                }}/>
                            </Modal.Body>
                        </Modal>
                    </>}
                </div>

                <div className="right">
                    {/* Desktop */}
                    {window.innerWidth >= 992 && <div className="login-signup-buttons">
                        <Link to="/login" className="btn btn-sm btn-link-secondary text-nowrap">Log in</Link>
                        <Link to="/signup" className="btn btn-sm btn-primary text-nowrap">Sign up</Link>
                    </div>}
                    {/* Mobile */}
                    {window.innerWidth < 768 && <>
                        <Button variant="link-secondary" className="search-icon" onClick={() => this.setState({isSearchModalOpen: true})}>
                            <i className="material-icons">
                                search
                            </i>
                        </Button>
                    </>}
                    {/* Tablet and Mobile */}
                    {window.innerWidth < 992 && <>
                        <Button variant="link-secondary" className="menu-icon" onClick={() => this.setState({isMenuOpen: true})}>
                            <i className="material-icons">
                                menu
                            </i>
                        </Button>
                        <CheeseburgerMenu isOpen={this.state.isMenuOpen} closeCallback={() => {this.setState({isMenuOpen: false})}}>
                            <ul>
                                <div className="links d-lg-block">
                                    {headerLinks.map(link =>
                                        <li>{link}</li>
                                    )}
                                </div>
                                <hr/>
                                <li><Button size="sm" variant="link-secondary" className="p-0">Log in</Button></li>
                                <li><Button size="sm" variant="link-secondary" className="p-0">Sign up</Button></li>
                            </ul>
                        </CheeseburgerMenu>
                    </>}
                </div>
            </div>
        );
    }
}
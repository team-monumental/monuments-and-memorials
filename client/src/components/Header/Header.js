import React from 'react';
import './Header.scss';
import { NavLink } from 'react-router-dom';
import {Button, Modal} from 'react-bootstrap';
import SearchBar from './SearchBar/SearchBar';
import CheeseburgerMenu from 'cheeseburger-menu'
import Logo from '../Logo/Logo';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends React.Component {

    links = [
        {name: 'Home', route: '/', exact: true},
        {name: 'Map', route: '/map'},
        {name: 'About', route: '/about'},
        {name: 'Bulk Create', route: '/bulk-create', exact: true, protected: true}
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

    static mapStateToProps(state) {
        return {session: state.session};
    }

    componentDidMount() {
        this.props.onRender(this.divRef.clientHeight);
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    resize() {
        this.setState({screenWidth: window.innerWidth});
    }

    handleLogout() {
        const { onLogout, history } = this.props;
        // If the user is currently on an authenticated route, tell ProtectedRoute not to show the unauthorized banner
        history.replace({
            pathname: history.location.pathname,
            state: { suppressAuthenticationBanner: true }
        });
        onLogout();
    }

    render() {
        const { session } = this.props;
        let headerLinks = this.links.map(link => {
            let navLink = <NavLink to={link.route} exact={link.exact} className="header-link mr-4" activeClassName="active" key={link.name}>{link.name}</NavLink>;

            if (link.protected) {
                if (session.user) {
                    return navLink;
                }
                else {
                    return;
                }
            }

            return navLink;
        });
        return (
            <div className="header" id="pageHeader" ref={element => this.divRef = element}>

                <div className="left">
                    <Logo/>

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
                                <Logo/>
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
                        {!session.pending && <>
                            {session.user &&
                                <div className="d-flex">
                                    <Button onClick={() => this.handleLogout()} size="sm" variant="link-secondary" className="p-0 border-0 header-link">
                                        Log out
                                    </Button>
                                    <div className="mx-2 spacer">
                                        |
                                    </div>
                                    <NavLink to="/account" className="header-link" activeClassName="active">
                                        My Account
                                    </NavLink>
                                </div>
                            }
                            {!session.user && <>
                                <Link to="/login" className="btn btn-sm btn-link-secondary text-nowrap header-link">Log in</Link>
                                <Link to="/signup" className="btn btn-sm btn-primary text-nowrap">Sign up</Link>
                            </>}
                        </>}
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
                                {session.user && <>
                                    <li>
                                        <NavLink to="/account" className="header-link" activeClassName="active">
                                            My Account
                                        </NavLink>
                                    </li>
                                    <li>
                                        <Button onClick={() => this.handleLogout()} size="sm" variant="link-secondary" className="p-0 header-link">Log out</Button>
                                    </li>
                                </>}
                                {!session.user && <>
                                    <li>
                                        <Link to="/login" className="btn btn-sm btn-link-secondary p-0 header-link">Log in</Link>
                                    </li>
                                    <li>
                                        <Link to="/signup" className="btn btn-sm btn-link-secondary p-0 header-link">Sign up</Link>
                                    </li>
                                </>}
                            </ul>
                        </CheeseburgerMenu>
                    </>}
                </div>
            </div>
        );
    }
}

export default withRouter(connect(Header.mapStateToProps)(Header));

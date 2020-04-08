import React from 'react';
import './Header.scss';
import { NavLink } from 'react-router-dom';
import {Button, Modal} from 'react-bootstrap';
import SearchBar from './SearchBar/SearchBar';
import CheeseburgerMenu from 'cheeseburger-menu'
import Logo from '../Logo/Logo';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Role } from '../../utils/authentication-util';

class Header extends React.Component {

    links = [
        {name: 'Home', route: '/', exact: true},
        {name: 'Map', route: '/map'},
        {name: 'About', route: '/about'},
        {name: 'My Account', route: '/account', protected: true},
        {name: 'Control Panel', route: '/panel', protected: true, roles: Role.PARTNER_OR_ABOVE}
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
        const navLinks = this.links.map(link => {
            return {
                ...link,
                element: (
                    <NavLink to={link.route} exact={link.exact} className="nav-link mr-3" activeClassName="active"
                             key={link.name}>{link.name}</NavLink>
                )
            };
        });
        const publicLinks = navLinks.filter(link => !link.protected).map(link => link.element);
        const privateLinks = navLinks.filter(link => link.protected && session.user &&
            (!link.roles || link.roles.includes(session.user.role)) && (!link.role || link.role === session.user.role))
            .map(link => link.element);
        return (
            <div className="header" id="pageHeader" ref={element => this.divRef = element}>

                <div className="left">
                    <Logo/>

                    <div className="desktop-links">
                        <div className="links d-lg-block">
                            {publicLinks}
                        </div>
                    </div>
                </div>

                <div className="center">
                    {/* Desktop  */}
                    {window.innerWidth >= 768 && <>
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
                                <div className="d-flex align-items-center links ml-3">
                                    {privateLinks}
                                    <Button onClick={() => this.handleLogout()} size="sm" variant="light">
                                        Log out
                                    </Button>
                                </div>
                            }
                            {!session.user && <>
                                <Link to="/login" className="btn btn-sm btn-link-secondary text-nowrap nav-link mr-2">Log in</Link>
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
                                {publicLinks.concat(privateLinks).map(link =>
                                    <li key={link.key}>{link}</li>
                                )}
                                <hr/>
                                {session.user && <>
                                    <li>
                                        <Button onClick={() => this.handleLogout()} size="sm" variant="link-secondary" className="p-0 nav-link">Log out</Button>
                                    </li>
                                </>}
                                {!session.user && <>
                                    <li>
                                        <Link to="/login" className="btn btn-sm btn-link-secondary p-0 nav-link">Log in</Link>
                                    </li>
                                    <li>
                                        <Link to="/signup" className="btn btn-sm btn-link-secondary p-0 nav-link">Sign up</Link>
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

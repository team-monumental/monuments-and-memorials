import React from 'react';
import './Header.scss';
import { NavLink } from 'react-router-dom';
import {Button, Modal} from 'react-bootstrap';
import SearchBar from './SearchBar/SearchBar';
import CheeseburgerMenu from 'cheeseburger-menu';

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
        return (
            <div className="header" id="pageHeader" ref={element => this.divRef = element}>
                {
                    this.state.screenWidth > 830 && <>
                        <div className="left">
                            <div className="links d-lg-block">
                                {this.links.map(link =>
                                    <NavLink onClick={e => {
                                        e.preventDefault();
                                        window.location.replace(link.route);
                                    }} to={link.route} exact={link.exact} className="header-link mr-4" activeClassName="active" key={link.name}>{link.name}</NavLink>
                                )}
                            </div>
                        </div>
                        <div className="center">
                            <SearchBar barWidth="41%" locationSearchMargin='0%' buttonWidth='16%' barBottomSpacing='0%' closeModal={false}/>
                        </div>
                        <div className="right">
                            <Button size="sm" variant="link-secondary">Log in</Button>
                            <Button size="sm">Sign up</Button>
                        </div>
                    </>
                }
                {
                    this.state.screenWidth <= 830 && this.state.screenWidth > 575 && <>
                        <div className="left">
                            <img className='header-icon' src={process.env.PUBLIC_URL + '/MM-logo-rev-3.png'} alt="my image"/>
                        </div>
                        <div className="center">
                            <SearchBar barWidth="41%" locationSearchMargin='0%' buttonWidth='16%' barBottomSpacing='0%' closeModal={false}/>
                        </div>
                        <div className="right">
                            <Button variant="link-secondary" style={{padding: 0}}><img className='header-icon' src={process.env.PUBLIC_URL + '/menu-alt-512.png'} alt="my image" onClick={() => {this.setState({isMenuOpen: true})}} /></Button>
                            <CheeseburgerMenu isOpen={this.state.isMenuOpen} closeCallback={() => {this.setState({isMenuOpen: false})}}>
                                <div className="my-menu-content">
                                    <ul>
                                        <div className="links d-lg-block">
                                            {this.links.map(link =>
                                                <li><NavLink onClick={e => {
                                                    e.preventDefault();
                                                    window.location.replace(link.route);
                                                }} to={link.route} exact={link.exact} className="header-link mr-4" activeClassName="active" key={link.name}>{link.name}</NavLink></li>
                                            )}
                                        </div>
                                        <hr/>
                                        <li><Button size="sm" variant="link-secondary" style={{padding: 0}}>Log in</Button></li>
                                        <li><Button size="sm" variant="link-secondary" style={{padding: 0}}>Sign up</Button></li>
                                    </ul>
                                </div>
                            </CheeseburgerMenu>

                        </div>
                    </>
                }
                {
                    this.state.screenWidth <= 575 && <>
                        <div className="left">
                            <img className='header-icon' src={process.env.PUBLIC_URL + '/MM-logo-rev-3.png'} alt="my image"/>
                        </div>
                        <div className="center">
                            <Modal show={this.state.isSearchModalOpen} onHide={() => {this.setState({isSearchModalOpen: false})}} animation={false}>
                                <Modal.Header closeButton>
                                    <img className='header-icon' src={process.env.PUBLIC_URL + '/MM-logo-rev-3.png'} alt="my image" style={{marginBottom: '1%'}}/>
                                </Modal.Header>
                                <SearchBar barWidth="100%" locationSearchMargin='0%' buttonWidth='100%' barBottomSpacing='1%' closeModal={() => {this.setState({isSearchModalOpen: false})}}/>
                            </Modal>
                        </div>
                        <div className="right">
                            <Button variant="link-secondary" style={{padding: 0, marginRight: '5%'}}>
                                <img className='header-icon' src={process.env.PUBLIC_URL + '/search-512.png'} alt="my image" onClick={() => {this.setState({isSearchModalOpen: true})}} />
                            </Button>
                            <Button variant="link-secondary" style={{padding: 0}}>
                                <img className='header-icon' src={process.env.PUBLIC_URL + '/menu-alt-512.png'} alt="my image" onClick={() => {this.setState({isMenuOpen: true})}} />
                            </Button>
                            <CheeseburgerMenu isOpen={this.state.isMenuOpen} closeCallback={() => {this.setState({isMenuOpen: false})}}>
                                <div className="my-menu-content">
                                    <ul>
                                        <div className="links d-lg-block">
                                            {this.links.map(link =>
                                                <li><NavLink onClick={e => {
                                                    e.preventDefault();
                                                    window.location.replace(link.route);
                                                }} to={link.route} exact={link.exact} className="header-link mr-4" activeClassName="active" key={link.name}>{link.name}</NavLink></li>
                                            )}
                                        </div>
                                        <hr/>
                                        <li><Button size="sm" variant="link-secondary" style={{padding: 0}}>Log in</Button></li>
                                        <li><Button size="sm" variant="link-secondary" style={{padding: 0}}>Sign up</Button></li>
                                    </ul>
                                </div>
                            </CheeseburgerMenu>
                        </div>
                    </>
                }
            </div>
        );
    }
}
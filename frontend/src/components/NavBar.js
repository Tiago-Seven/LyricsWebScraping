import React, { Component } from "react";
import "../App.css";
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: {}
    };

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar color="dark" dark expand="md" className="sticky-nav">
          <NavbarBrand className="text-white">Lyrics Stats</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/"> Home </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/music"> Search Music </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/album"> Search Album </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <a href="https://github.com/pigaoMIEIC/LyricsWebScraping" >
                    <img alt="Git-Hub Mark" src={require("../GitHub-Mark-Light-32px.png")} />
                  </a>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/about"> About </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </React.Fragment>
    );
  }
}

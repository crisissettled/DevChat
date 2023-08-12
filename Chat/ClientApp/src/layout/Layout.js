import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from '../components/nav/NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <NavMenu />
        <Container tag="main">
          {this.props.children}
        </Container>
      </div>
    );
  }
}

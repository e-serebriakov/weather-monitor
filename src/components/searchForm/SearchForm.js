import React, { Component } from 'react';

import styled from 'styled-components';

const Input = styled.input`
  font-size: 16px;
  background-color: palevioletred;
`;

const Button = styled.button`
  font-size: 1.5em;
  text-align: center;
  color: #fff;
  background-color: palevioletred;
`;

export default class SearchForm extends Component {
  render() {
    return (
      <form>
        TEST FORM
        <Input type="text" placeholder="Введите название города" />
        <Button>Click</Button>
      </form>
    );
  }
}

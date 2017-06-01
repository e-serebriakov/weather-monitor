import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { addBtnShake } from './styles/keyframes';

const Form = styled.form`
  position: relative;
  margin-bottom: 50px;

  @media (min-width: 730px) {
    margin-left: 10px;
    text-align: left;
  }
`;

const Input = styled.input`
  height: 40px;
  width: 220px;
  margin-right: 10px;
  padding: 0 10px;
  font-size: 1em;
  line-height: 40px;
  color: #131516;
  border: ${props => props.inputError ? '1px solid #fe4a49' : '0'};
  outline: 0;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

const ErrorText = styled.p`
  position: absolute;
  top: 100%;
  left: 0;
  font-size: 0.85em;
  color: #fe4a49;
`;

const Button = styled.button`
  width: 100px;
  height: 40px;
  line-height: 40px;
  font-size: 1em;
  text-align: center;
  color: #fff;
  border: 0;
  border-radius: 5px;
  outline: 0;
  background-color: #fe4a49;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  cursor: pointer;
  animation: ${addBtnShake} 5s linear infinite;
`;

const AddForm = ({ inputError, onClickBtn, onInputChange, inputValue, inputRef }) => {
  return (
    <Form>
      <Input
        type="text"
        placeholder="input city name or code"
        value={inputValue}
        onChange={onInputChange}
        innerRef={inputRef}
        inputError={inputError}
      />
      {inputError &&
        <ErrorText>
          Enter city name (example: Moscow, ru) with country code or city code (example: 2172797)
        </ErrorText>}
      <Button onClick={onClickBtn}>Add city</Button>
    </Form>
  );
};

AddForm.propTypes = {
  inputRef: PropTypes.node.isRequired,
  inputError: PropTypes.bool.isRequired,
  onClickBtn: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
};

export default AddForm;

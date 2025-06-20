import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.primary ? '#0077cc' : 'white'};
  color: ${props => props.primary ? 'white' : '#0077cc'};
  border: 1px solid ${props => props.primary ? '#0077cc' : '#ccc'};
  
  &:hover {
    background-color: ${props => props.primary ? '#005fa3' : '#f0f0f0'};
  }
  
  &:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
    border-color: #cccccc;
  }
`;

const Button = ({ children, ...props }) => {
  return (
    <StyledButton {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;

import React from 'react';
import styled from 'styled-components';

const Button = styled.button<{ disabled: boolean }>`
  margin-top: 5px;
  padding: 2px 5px;
  background: ${props => props.disabled ? '#a0a0a0' : '#4CAF50'};
  color: white;
  border: none;
  border-radius: 2px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 10px;
  opacity: ${props => props.disabled ? 0.7 : 1};
  &:hover {
    background: ${props => props.disabled ? '#a0a0a0' : '#45a049'};
  }
`;

interface StyledButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const StyledButton: React.FC<StyledButtonProps> = ({ onClick, children, style, disabled = false }) => {
  return <Button onClick={onClick} style={style} disabled={disabled}>{children}</Button>;
};

export default StyledButton;
import styled from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
}

const StyledButton = styled.button`
  background-color: ${(props) => props.color};
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
  margin-right: 5px;
  &:active {
    opacity: 0.9;
  }
`;

export default function Button({
  children,
  color,
  ...rest
}: React.PropsWithChildren<ButtonProps>) {
  return (
    <StyledButton color={color} {...rest}>
      {children}
    </StyledButton>
  );
}

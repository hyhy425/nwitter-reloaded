import { styled } from "styled-components";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  grid-template-rows: 1fr 5fr;
`;

export default function Home() {
  return (
    <Wrapper>
      <h1>Home</h1>
    </Wrapper>
  );
}

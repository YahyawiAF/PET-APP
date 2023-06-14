import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";

function Loader() {
  return (
    <ConstainerSpinner>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </ConstainerSpinner>
  );
}

const ConstainerSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export default Loader;
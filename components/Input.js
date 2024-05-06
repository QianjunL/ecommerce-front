import styled from "styled-components"

const StyledInput = styled.input`
    width: 100%;
    padding: 5px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    @media screen and (max-width: 588px) {
        margin-bottom: 20px;
    }
`;

export default function Input(props) {
    return <StyledInput {...props} />
}
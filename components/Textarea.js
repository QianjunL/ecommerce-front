import styled from "styled-components"

const StyledTextarea = styled.textarea`
    width: 100%;
    padding: 5px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-family: inherit;
    @media screen and (max-width: 588px) {
        margin-bottom: 20px;
    }
`;

export default function Textarea(props) {
    return <StyledTextarea {...props} />
}
import styled from "styled-components";
import StarOutlineIcon from "./icons/StarOutlineIcon";
import { useState } from "react";
import StarSolidIcon from "./icons/StarSolidIcon";
import { primary } from "@/lib/colors";

const StarsWrapper = styled.div`
    display: inline-flex;
    gap: 1px;
    align-items: center;
`;

const StarWrapper = styled.button`
    ${props => props.size === 'md' && `
        height: 1.4rem;
        width: 1.4rem;
    `}
    ${props => props.size === 'sm' && `
    height: 1rem;
    width: 1rem;
    `}
    ${props => !props.disabled && `
        cursor: pointer;
    `}
    padding: 0;
    border: 0;
    display: inline-block;
    background: transparent;
    color: ${primary};
`;

export default function StarsRating({
    size='md',
    defaultClickTimes=0, 
    disabled, 
    onChange=()=>{}
    }) {
    const [clickTimes, setClickTimes] = useState(defaultClickTimes);
    const five = [1, 2, 3, 4, 5];

    function handleStarClick(n) {
        if (disabled) {
            return;
        }
        setClickTimes(n);
        onChange(n);
    }

    return (
        <StarsWrapper>
            {five.map(n => (
                <>
                        <StarWrapper
                        size={size}
                        disabled={disabled}
                        onClick={() => handleStarClick(n)}
                        >
                            {clickTimes >= n 
                            ? <StarSolidIcon /> 
                            : < StarOutlineIcon 
                            />}
                            </StarWrapper>
                </>
            ))}
        </StarsWrapper>
    );
}
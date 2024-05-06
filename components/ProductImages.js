import { useState } from "react";
import styled from "styled-components";

const Image = styled.img`
max-width: 100%;
max-height: 100%;
`;

const FirstImage = styled.img`
    max-width: 100%;
    max-height: 200px;
`;

const ImageButtons = styled.div`
display: flex;
gap: 10px;
flex-grow: 0;
margin-top: 10px;
cursor: pointer;
`;

const ImageButton = styled.div`
    border: 1px solid #aaa;
    ${props => props.active ? `
        border-color: #ccc;
    ` : `
        border-color: transparent;
        opacity: .7;
    `}

    height: 40px;
    padding: 10px;
    border-radius: 5px;
`;

const FirstImageWrapper = styled.div`
    text-align: center;

`;

export default function ProductImages({image}) {
    const [activeImage, setActiveImage] = useState(image?.[0]);

    return (
        <>
        <FirstImageWrapper>
            <FirstImage src={activeImage}/>
        </FirstImageWrapper>
        <ImageButtons>
            {image.map(img => (
                <ImageButton  
                key={img}
                active={img === activeImage}
                onClick={() => setActiveImage(img)}
                >
                    <Image src={img} alt=""/>
                </ImageButton>
            ))}
        </ImageButtons>
        </>
    )
}
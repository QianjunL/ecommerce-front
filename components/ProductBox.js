import styled from "styled-components";
import Button, {ButtonStyle} from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import Link from "next/link";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import {primary} from "@/lib/colors";
import FlyingButton from "@/components/FlyingButton";
import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
import HeartSolidIcon from "@/components/icons/HeartSolidIcon";
import axios from "axios";

const ProductWrapper = styled.div`
    button {
        width: 100%;
        text-align: center;
        justify-content: center;
    }
`;

const WhiteBox = styled(Link)`
    background-color: #fff;
    padding: 20px;
    height: 120px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    position: relative;
    img {
        max-width: 100%;
        max-height: 80px;
    }
`;

const Title = styled(Link)`
    font-weight: normal;
    font-size: .9rem;
    margin: 0;
    color: inherit;
    text-decoration: none;
`;

const ProductInfoBox = styled.div`
    margin-top: 5px;
`;

const PriceRow = styled.div`
    display: block;
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
    @media screen and (min-width: 768px) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 2px;
    }
`;

const Price = styled.div`
    font-size: 1rem;
    font-weight: 600;
    text-align: right;
    @media screen and (min-width: 768px) {
        font-size: 1.5rem;
        font-weight: 600;
        text-align: left;
    }
`;

const WishListButton = styled.button`
    border: 0;
    width: 40px !important;
    height: 40px;
    padding: 10px;
    background: transparent;
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    ${props => props.wished ? `
        color: red;
    ` : `
        color: black;
    `}
    svg {
        width: 16px;
    }
`;

export default function ProductBox(
    {_id, title, desc, price, image, wished=false, 
    onRemoveFromWishlist=()=>{},
    }
    ) {
    const {addProduct} = useContext(CartContext);
    const [isWished, setIsWished] = useState(wished);
    const url = '/product/' + _id;

    function addToWishlist(e) {
        e.preventDefault();
        const nextValue = !isWished;
        if (nextValue === false && onRemoveFromWishlist) {
            onRemoveFromWishlist(_id);
        }
        axios.post('/api/wishlist', {
            product:_id,
        }).then(() => {});
        setIsWished(nextValue);
    }

    return (
        <ProductWrapper>
        <WhiteBox href={url}>
            <div>
            <WishListButton 
            wished={isWished}
            onClick={addToWishlist}
            >
                {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon/>}
            </WishListButton>
            <img src={image?.[0]} alt=""/>
            </div>
        </WhiteBox>
        <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
            <Price>
            ${price}
            </Price>
            <FlyingButton _id={_id} src={image?.[0]}>Add to cart</FlyingButton>
        </PriceRow>
        </ProductInfoBox>
        </ProductWrapper>

    )
}
import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductImages from "@/components/ProductImages";
import ProductReviews from "@/components/ProductReviews";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import CartIcon from "@/components/icons/CartIcon";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useContext } from "react";
import styled from "styled-components";
import FlyingButton from "@/components/FlyingButton";

const ColWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin: 40px 0;
    @media screen and (min-width: 768px) {
        grid-template-columns: .8fr 1.2fr;
    }
`;

const PriceRow = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`;

const Price = styled.span`
    font-size: 1.4rem;
`;

const Para = styled.p`
`;

export default function ProductDetail({product}) {
    const {addProduct} = useContext(CartContext);

    return(
        <>
        <Header />
        <Center>
            <ColWrapper>
                <WhiteBox>
                    <ProductImages image={product.image}/>
                </WhiteBox>
                <div>
                <Title>{product.title}</Title>
                <Para>{product.desc}</Para>
                <PriceRow>
                    <div>
                        <Price>${product.price}</Price>
                        </div>
                    <div>
                        <FlyingButton main _id={product._id} src={product.image?.[0]}>
                            <CartIcon />
                        Add to cart
                        </FlyingButton>
                    </div>
                </PriceRow>
                </div>
            </ColWrapper>
                <ProductReviews product={product}/>
        </Center>
        </>
    );
}


export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;
    const product = await Product.findById(id);
    if (!product) {
        return {
            notFound: true,
        };
    }
    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
        },
    };
}
import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import { RevealWrapper } from "next-reveal";
import { useSession } from "next-auth/react";


const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin-top: 40px;
    margin-bottom: 40px;
    table thead tr th:nth-child(3),
    table tbody tr td:nth-child(3),
    table tbody tr.subtotal td:nth-child(2)
     {
        text-align: right;
    }
    table tr.subtotal td {
        padding: 15px 0;
    }
    table tbody tr.subtotal td:nth-child(2) {
        font-size: 1.4rem;
    }
    tr.total td {
        font-weight: bold;
    }
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.3fr .7fr;
     }
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 5px;
    padding: 30px;
    @media screen and (max-width: 588px) {
        margin-top: 30px;
        
    }
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled.div`
    width: 70px;
    height: 100px;
    padding: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display:flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    img {
        max-width: 60px;
        max-height: 60px;
    }
    @media screen and (min-width: 768px) {
        width: 100px;
        height: 100px;
        padding: 10px;
        img {
            max-width: 80px;
            max-height: 80px;
        }
    }
`;

const QuantityLabel = styled.span`
    padding: 0 15px;
    display: block;
    @media screen and (min-width: 768px) {
        display: inline-block;
    }
`;

const StateHolder = styled.div`
    display: flex;
    gap: 5px;
`;


export default function CartPage() {
    const {cartProducts, addProduct, removeProduct, clearCart} = useContext(CartContext);
    const {data: session} = useSession();
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isSuccess,setIsSuccess] = useState(false);
    const [shippingFee, setShippingFee] = useState(null);

    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post('/api/cart', {ids: cartProducts})
            .then(response => {
                setProducts(response.data);
            })
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        if (window?.location.href.includes('success')) {
            setIsSuccess(true);
            clearCart();
        }
        axios.get('/api/settings?name=shippingFee').then(res => {
            setShippingFee(res.data.value);
          })
    }, []);

    useEffect(() => {
        if (!session) {
            return ;
        }
        axios.get('/api/address').then(response => {
            setName(response.data.name);
            setEmail(response.data.email);
            setCity(response.data.city);
            setStreetAddress(response.data.streetAddress);
            setZipCode(response.data.zipCode);
            setState(response.data.state);
            setCountry(response.data.country);
        });
    }, [session]);

    // useEffect(() => {
    //     if (isSuccess) {
    //         clearCart();
    //     }
    // }, [isSuccess, clearCart]);


    function addMoreProduct(id) {
        addProduct(id);
    }

    function subtractProduct(id) {
        removeProduct(id);
    }

    async function handlePayment() {
        const response = await axios.post('/api/checkout', {
            name, email, streetAddress, city, state, zipCode, country,
            cartProducts,
        });
        if (response.data.url) {
            window.location = response.data.url;
        }
    }



    let productsTotal = 0;
    for (const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0;
        productsTotal += price;
    }

    if (isSuccess) {
        return (
            <>
                <Header />
                <Center>
                    <ColumnsWrapper>
                    <Box>
                        <h1>Thanks for your order.</h1>
                        <p>We will email you when your order is shipped.</p>
                    </Box>
                    </ColumnsWrapper>
                </Center>
            </>
        );
    } 

    return (
        <>
        <Header />
        <Center>
        <ColumnsWrapper>
        <RevealWrapper delay={0}>
        <Box>
            <h2>Cart</h2>
                {!cartProducts.length > 0 && (
                    <div>Your cart is empty</div>
                )}
            {products?.length > 0 && (
                <Table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                    {products.map(product => (
                        <tr>
                            <ProductInfoCell>
                                <ProductImageBox>
                                <img src={product.image[0]} alt=""/>
                                </ProductImageBox>
                                {product.title}
                                </ProductInfoCell>
                            <td>
                                <Button
                                onClick={() => subtractProduct(product._id)}
                                >
                                    -
                                    </Button>
                                <QuantityLabel>
                                {cartProducts.filter(id => id === product._id).length}
                                </QuantityLabel>
                                <Button 
                                onClick={() => addMoreProduct(product._id)}
                                >
                                    +
                                    </Button>
                                </td>
                            <td>
                                ${cartProducts.filter(id => id === product._id).length * product.price}
                            </td>
                        </tr>
                    ))}
                    <tr className="subtotal">
                        <td colSpan={2}>Products Total</td>
                        <td>${productsTotal}</td>
                    </tr>
                    <tr className="subtotal">
                        <td colSpan={2}>Shipping Fee</td>
                        <td>${shippingFee}</td>
                    </tr>
                    <tr className="subtotal total">
                        <td colSpan={2}>Total</td>
                        <td>${parseFloat(productsTotal) + parseFloat(shippingFee)}</td>
                    </tr>
                    </tbody>
                </Table>
                )}
            </Box>
        </RevealWrapper>
            {!!cartProducts?.length && (
                <RevealWrapper delay={100}>
                    <Box>
                        <h2>Order Information</h2>
                        <Input type="text" 
                        placeholder="Name" 
                        value={name}
                        name="name"
                        onChange={e => setName(e.target.value)}/>
                        <Input 
                        type="text" 
                        placeholder="Email" 
                        value={email} 
                        name="email"
                        onChange={e => setEmail(e.target.value)}/>
                        <Input 
                        type="text" 
                        placeholder="Street Address" 
                        value={streetAddress} 
                        name="streetAddress"
                        onChange={e => setStreetAddress(e.target.value)}/>
                        <Input 
                        type="text" 
                        placeholder="City" 
                        value={city} 
                        name="city"
                        onChange={e => setCity(e.target.value)}/>
                        <StateHolder>
                        <Input 
                        type="text" 
                        placeholder="State" 
                        value={state} 
                        onChange={e => setState(e.target.value)}/>
                        <Input 
                        type="text" 
                        placeholder="Postal Code" 
                        value={zipCode} 
                        name="zipCode"
                        onChange={e => setZipCode(e.target.value)}/>
                        </StateHolder>
                        <Input 
                        type="text" 
                        placeholder="Country" 
                        name="country"
                        value={country} 
                        onChange={e => setCountry(e.target.value)}/>
                        <Button primary block 
                        onClick={handlePayment}>
                            Continue to checkout
                            </Button>
                    </Box>
                </RevealWrapper>

            )}
        </ColumnsWrapper>
        </Center>
        </>
    );
}
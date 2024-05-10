import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import OrderDetail from "@/components/OrderDetail";
import ProductBox from "@/components/ProductBox";
import Spinner from "@/components/Spinner";
import Tabs from "@/components/Tabs";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";
import {signIn, signOut, useSession} from 'next-auth/react';
import { RevealWrapper } from "next-reveal";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { ButtonStyle } from "@/components/Button";


const StyledLink = styled(Link)`
    margin-left: 10px;
    ${ButtonStyle}
`;


const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.2fr .8fr;
    gap: 40px;
    margin: 40px 0;
    p {
        margin: 6px;
    }
`;

const StateHolder = styled.div`
    display: flex;
    gap: 5px;
`;

const WishedProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
`;

export default function Account() {
    const {data: session} = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [addressLoaded, setAddressLoaded] = useState(true);
    const [wishlistLoaded, setWishlistLoaded] = useState(true);
    const [wishedProducts, setWishedProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('Order');
    const [orders, setOrders] = useState([]);
    const [ordersLoaded, setOrdersLoaded] = useState(true);


    async function logout() {
        await signOut({
            callbackUrl: process.env.NEXT_PUBLIC_URL,
        });
    }

    async function login() {
        await signIn('google');
    }

    // function saveAddressInfo() {
    //     const data = {name, email, city, streetAddress, state, zipCode, country}
    //     axios.put('/api/address', data);
    // }

    function saveAddressInfo() {
        const data = {name, email, city, streetAddress, state, zipCode, country};
        axios.put('/api/address', data)
            .then(() => {
                alert('Save successful');
            })
            .catch((error) => {
                console.error('Error saving account profile details:', error);
            });
    }

    function productRemovedFromWishlist(idToRemove) {
        setWishedProducts(products =>  {
            return [...products.filter(p => p?._id.toString() !== idToRemove)];
        })
    }

    useEffect(() => {
        if (!session) {
            return;
        }
            setAddressLoaded(false);
            setWishlistLoaded(false);
            setOrdersLoaded(false);
            axios.get('/api/address').then(response => {
                setName(response.data?.name);
                setEmail(response.data?.email);
                setCity(response.data?.city);
                setStreetAddress(response.data?.streetAddress);
                setZipCode(response.data?.zipCode);
                setState(response.data?.state);
                setCountry(response.data?.country);
                setAddressLoaded(true);
            });
            axios.get('/api/wishlist').then(response => {
                setWishedProducts(response.data.map(wp => wp.product));
                setWishlistLoaded(true);
            });
            axios.get('api/orders').then(response => {
                setOrders(response.data);
                setOrdersLoaded(true);
            })
    }, [session]);

    return (
        <>
            <Header />
            <Center>
                <ColsWrapper>
                    <div>
                        <RevealWrapper delay={0}>
                            <WhiteBox>
                                <Tabs 
                                onChange={setActiveTab}
                                tabs={['Order', 'Wishlist']} 
                                active={activeTab} 
                                />
                                {activeTab === 'Order' && (
                                    <>
                                    {!ordersLoaded && (
                                        <Spinner fullWidth={true}/>
                                    )}
                                    {ordersLoaded && (
                                        <div>
                                            {orders.length === 0 && session && (
                                                <>
                                                <p>No current orders
                                                    <StyledLink 
                                                    href='/products'
                                                    outline
                                                    primary
                                                    >
                                                    Expolore all products
                                                    </StyledLink>
                                                    </p>
                                                </>
                                            )}
                                              {orders.length === 0 && !session && (
                                                    <p>Login to view your orders</p>
                                                )}
                                            {orders.length > 0 && orders.map(o => (
                                                <OrderDetail {...o} />
                                            ))}
                                        </div>
                                    )}
                                    </>
                                )}
                                {activeTab === 'Wishlist' && (
                                <>
                                {!wishlistLoaded && (
                                    <Spinner fullWidth={true}/>
                                )}
                                {wishlistLoaded && (
                                    <>
                                    <WishedProductsGrid>
                                    {wishedProducts.length > 0 && wishedProducts.map(wp => (
                                        <ProductBox {...wp} 
                                        key={wp?._id}
                                        wished={true}
                                        onRemoveFromWishlist={productRemovedFromWishlist}
                                        />
                                    ))}
                                    </WishedProductsGrid>
                                    {wishedProducts.length === 0 && (
                                        <>
                                        {session && (
                                            <p>Your wishlist is empty</p>
                                        )}
                                        {!session && (
                                            <p>Login to add products to your wishlist</p>
                                        )}
                                        </>
                                    )}
                                    </>
                                    
                                )}
                                </>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                    <div>
                        <RevealWrapper delay={100}>
                            <WhiteBox>
                                <h2>{session ? 'Account Profile' : 'Login' }</h2>
                                {!addressLoaded && (
                                    <Spinner fullWidth={true}/>
                                )}
                                {addressLoaded && session && (
                                    <>
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
                                    onClick={saveAddressInfo}
                                    >
                                    Save
                                    </Button>
                                    <hr/>
                                    </>
                                )}

                                    {session && (
                                        <Button 
                                        onClick={logout}
                                        primary
                                        >Logout
                                        </Button>
                                    )}
                                    {!session && (
                                        <Button primary onClick={login}>Login with Google</Button>
                                    )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                </ColsWrapper>
            </Center>
        </>
    );
}
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import Link from "next/link";
import styled from "styled-components";
import { RevealWrapper } from "next-reveal";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

const CategoryGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

const CategoryTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 10px;
    h2 {
        margin-bottom: 15px;
        margin-top: 10px;

    }
    a {
        color: #555;
        text-decoration: none;
    }
`;

const CategoryWrapper = styled.div`
    margin-bottom: 40px;
`;

const ShowAllSquare = styled(Link)`
    background-color: #ddd;
    height: 160px;
    border-radius: 5px;
    align-items: center;
    display: flex;
    justify-content: center;
    color: #555;
    text-decoration: none;
`;

export default function Categories({mainCategories, categoryProducts, wishedProducts=[]}) {
    return (
        <>        
        <Header />
        <Center>
        {mainCategories.map(cat => (
            <CategoryWrapper>
                <CategoryTitle>
                    <h2>{cat.name}</h2>
                    <div><Link href={'/category/'+cat._id}>Show all</Link></div>
                    </CategoryTitle>
                <CategoryGrid>
                    {categoryProducts[cat._id].map((p, index) => (
                        <RevealWrapper delay={index*50}>
                            <ProductBox {...p} wished={wishedProducts.includes(p._id)} />
                        </RevealWrapper>

                    ))}
                    <RevealWrapper delay={categoryProducts[cat._id].length*50}>
                        <ShowAllSquare href={'/category/'+cat._id}>
                            Show all &rarr;
                        </ShowAllSquare>
                    </RevealWrapper>
                </CategoryGrid>
            </CategoryWrapper>
        ))}
        </Center>

        </>
    )
}

export async function getServerSideProps(ctx) {
    await mongooseConnect();
    const categories = await Category.find();
    const mainCategories = categories.filter(c => !c.parent);
    const categoryProducts = {}; // catID => [products]
    const allFetchedProductsId = [];
    for (const mainCat of mainCategories) {
        const mainCatId = mainCat._id.toString()
        const childCatIds = categories
        .filter(c => c?.parent?.toString() === mainCatId)
        .map(c => c._id.toString());
        const categoriesIds = [mainCatId, ...childCatIds];
        const products = await Product.find({category: categoriesIds}, null, {limit: 3, sort:{'_id': -1}});
        allFetchedProductsId.push(...products.map(p => p._id.toString()));
        categoryProducts[mainCat._id] = products;
    }

    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const wishedProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session?.user.email,
        product: allFetchedProductsId,
    }) : [];

    return {
        props: {
            mainCategories: JSON.parse(
                JSON.stringify(mainCategories)
                ),
            categoryProducts: JSON.parse(JSON.stringify(categoryProducts)),
            wishedProducts: wishedProducts.map(i => i.product.toString()),
        },
    }
}
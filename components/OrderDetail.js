import styled from "styled-components"

const StyledOrder = styled.div`
    margin: 10px 0;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    time {
        font-size: 1rem;
        font-weight: bold;
        color: #555;
    }
`;

const ProductRow = styled.div`
    span {
        color: #aaa;
    }
`;

const AddressLine = styled.div`
    font-size: .8rem;
    line-height: 1rem;
    margin-top: 5px;
    color: #888;
`;

export default function OrderDetail({line_items, createdAt, ...rest}) {
    const formattedDate = new Date(createdAt);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    const formattedTime = formattedDate.toLocaleDateString('en-US', options);

    return (
        <StyledOrder>
            <div>
                <time>{formattedTime}</time>
                <AddressLine>
                    {rest.name} <br /> 
                    {rest.email} <br />
                    {rest.streetAddress} <br />
                    {rest.zipCode} {rest.city} <br />
                    {rest.state} {rest.country} <br />
                </AddressLine>
            </div>
            <div>
                {line_items.map(item => (
                    <ProductRow>
                        <span>{item.quantity} x </span>
                        {item.price_data.product_data.name}
                    </ProductRow>
                ))}
            </div>
        </StyledOrder>
    )
}
import styled from "styled-components";
import Input from "./Input";
import WhiteBox from "./WhiteBox";
import StarsRating from "./StarsRating";
import Textarea from "./Textarea";
import Button from "./Button";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";

const ReviewTitle = styled.h2`
    font-size: 1.2rem;
    margin-bottom: 5px;
`;

const Subtitle = styled.h3`
    font-size: 1rem;
    margin-top: 5px;
`;

const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 40px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
        gap: 40px;
    }
`;

const ReviewWrapper = styled.div`
    margin-bottom: 10px;
    border-top: 1px solid #eee;
    padding: 10px 0;
    h3 {
        margin: 3px 0;
        font-size: 1rem;
        color: #333;
        font-weight: normal;
    }
    p {
        margin: 0;
        font-size: .7rem;
        line-height: 1rem;
        color: #555;
    }
`;

const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    time {
        font-size: 12px;
        color: #aaa;
    }
`;

export default function ProductReviews({product}) {
    const [subject, setSubject] = useState('');
    const [desc, setDesc] = useState('');
    const [stars, setStars] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    function submitReview() {
        const data = {subject, desc, stars, product: product._id};
        axios.post('/api/reviews', data).then(res => {
            setSubject('');
            setDesc('');
            setStars(0);
            loadReviews();
        })
    }

    function loadReviews() {
        setIsLoading(true);
        axios.get('/api/reviews?product='+product._id).then(res => {
            setReviews(res.data);
            setIsLoading(false);
        })
    }

    useEffect(() => {
        loadReviews();
    }, []);

    return (
        <div>
            <ReviewTitle>Reviews</ReviewTitle>
            <ColsWrapper>
            <div>
            <WhiteBox>
                <Subtitle>Add Review</Subtitle>
                <div>
                    <StarsRating onChange={setStars} />
                </div>
                <Input 
                // style={{ marginTop: '10px' }}
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Subject" 
                />
                <Textarea 
                value={desc}
                // style={{ marginTop: '10px' }}
                rows={10}
                onChange={e => setDesc(e.target.value)}
                placeholder="Share your review" 
                />
                <div>
                    <Button
                    onClick={submitReview} 
                    primary>
                        Submit
                        </Button>
                </div>
                </WhiteBox>
            </div>
            <div>
            <WhiteBox>
                <Subtitle>All Reviews</Subtitle>
                    {isLoading && (
                        <Spinner fullWidth={true} />
                    )}
                    {reviews.length === 0 && (
                        <p>No reviews yet</p>
                    )}
                    {reviews.length > 0 && reviews.map(review => (
                        <ReviewWrapper>
                            <ReviewHeader>
                                <StarsRating 
                            size={'sm'}
                            disabled={true} 
                            defaultClickTimes={review.stars} 
                            />
                                <time>{(new Date(review.createdAt)).toLocaleString('en-CA')}</time>
                            </ReviewHeader>
                            <h3>{review.subject}</h3>
                            <p>{review.desc}</p>
                        </ReviewWrapper>
                    ))}
                </WhiteBox>
            </div>
            </ColsWrapper>
        </div>
    );
}
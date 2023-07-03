
import {useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router'

import { RSSFeed } from '@/protos/taggy';

import FeedPage from '@/components/FeedPage';
import ItemCard from '@/components/ItemCard';
import FeedCard from '@/components/FeedCard/FeedCard';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import ApiGateway from '@/gateways/Api.gateway';

const Wrapper = styled.div`
    display: flex;
    padding: 20px;
    flex-direction: column;`

export default function RSSFeedPage(){
    const [source, setFeed] = useState<RSSFeed>()
    
    const sourceId : string = useRouter().query.sourceId as string;
    
    useEffect(()=>{
        if (!sourceId) return;
        ApiGateway.getRSSFeed(sourceId).then(data => {
            setFeed(data)
        })
    }, [sourceId])
    


    return (
        <Wrapper>
    
        <FeedPage source={source}></FeedPage>


        
        </Wrapper>   
    )
}
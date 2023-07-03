
import {useState, useRef, useEffect } from 'react';
import ItemCard from '../../../components/ItemCard';
import FeedCard from '@/components/FeedCard/FeedCard';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import { RSSFeed } from '@/protos/taggy';
import TextField from '@mui/material/TextField';
import ApiGateway from '@/gateways/Api.gateway';

import Link from 'next/link'
const Wrapper = styled.div`
    display: flex;
    padding: 20px;
    flex-direction: column;`
const FeedCardWrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
`

function addRSSFeed(url: string){
    ApiGateway.addRSSFeed(url)
}

export default function RSS(){
    const [sources, setFeeds] = useState(Array<RSSFeed>)
    useEffect(() => {
        ApiGateway.listRSSFeeds().then(data => {
                setFeeds(data)
            })
    }, [])

    
    return (
        <>
        
        <Typography variant="h4" >RSS Feeds</Typography>
    
        <FeedCardWrapper>
        {sources.map((source) => {
            return (<Link href={`/rss/feeds/${source.id}`}><FeedCard source={source}/></Link>)
        })}
        </FeedCardWrapper>
        </>
    )
}
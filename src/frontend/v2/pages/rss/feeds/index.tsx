
import {useState, useRef, useEffect } from 'react';
import ItemCard from '../../../components/ItemCard';
import FeedCard from '@/components/FeedCard/index';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import { RSSFeed } from '@/protos/taggy';
import TextField from '@mui/material/TextField';
import ApiGateway from '@/gateways/Api.gateway';

import Link from 'next/link'
const Wrapper = styled.div`
    display: flex;
    padding-top: 40px;
    padding-left: 40px;
    flex-direction: column;`

const SubTitle = styled.div`
    font-weight: 700;
    padding-top: 16px;
    font-size: 20px;
    color:rgba(255, 255, 255, 0.7);
`

const FeedCardWrapper = styled.div`
    display: flex;
    padding: 20px 0px;
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
        <Wrapper>
        
        <h1>RSS Feeds</h1>
        <SubTitle> Browse our current Feeds or add your love one!</SubTitle>
        <FeedCardWrapper>
        {sources.map((source) => {
            return (<Link href={`/rss/feeds/${source.id}`}><FeedCard source={source}/></Link>)
        })}
        </FeedCardWrapper>
        </Wrapper>
    )
}
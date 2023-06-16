
import {useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router'

import { RSSSource } from '@/protos/taggy';

import FeedCard from '@/components/FeedCard';
import SourceCard from '@/components/SourceCard/SourceCard';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import ApiGateway from '@/gateways/Api.gateway';

const Wrapper = styled.div`
    display: flex;
    padding: 20px;
    flex-direction: column;`

export default function RSS(){
    const [source, setSource] = useState(Array<RSSSource>)
    const [feeds, setFeeds] = useState(Array<RSSSource>)
    
    const sourceId : string = useRouter().query.sourceId as string;

    useEffect(() => {
        if (!sourceId) return;

        console.log(sourceId)
        ApiGateway.listRSSSourceFeeds(sourceId).then(data => {
                setFeeds(data)
            })
            
    }, [sourceId])

    
    const feedCards = feeds.map((feed)=>{
        return (<>
        <div>{feed.name}</div>
        <div>{feed.description}</div>
        </>)
    })

    return (
        <Wrapper>
        <div>{sourceId}</div>
        <Typography variant="h4" >Feeds</Typography>
        

        {feedCards}
        
        </Wrapper>   
    )
}
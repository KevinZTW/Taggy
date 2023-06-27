
import {useState, useRef, useEffect } from 'react';
import FeedCard from '@/components/FeedCard';
import SourceCard from '@/components/SourceCard/SourceCard';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import { RSSSource } from '@/protos/taggy';
import TextField from '@mui/material/TextField';
import ApiGateway from '@/gateways/Api.gateway';

import Link from 'next/link'
const Wrapper = styled.div`
    display: flex;
    padding: 20px;
    flex-direction: column;`
const SourceCardWrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
`

function addRSSSource(url: string){
    ApiGateway.addRSSSource(url)
}

export default function RSS(){
    const [sources, setSources] = useState(Array<RSSSource>)
    useEffect(() => {
        ApiGateway.listRSSSources().then(data => {
                setSources(data)
            })
    }, [])

    
    return (
        <>
        
        <Typography variant="h4" >RSS Sources</Typography>
    
        <SourceCardWrapper>
        {sources.map((source) => {
            return (<Link href={`/rss/${source.id}`}><SourceCard source={source}/></Link>)
        })}
        </SourceCardWrapper> 
        </>
    )
}

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
`

function addRSSSource(url: string){
    ApiGateway.addRSSSource(url)
}

export default function RSS(){
    const [sources, setSources] = useState(Array<RSSSource>)
    const searchInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        ApiGateway.listRSSSources().then(data => {
                setSources(data)
            })
    }, [])

    console.log(sources)
    
    return (
        <Wrapper>
        
        <Typography variant="h4" >RSS Sources</Typography>
        
        <TextField id="search-box" label="enter url" variant="filled"   inputRef={searchInputRef} />
        <Button onClick={()=>{
            const url = searchInputRef.current.value;
            alert(url);
            addRSSSource(url)}}>Add</Button>
        <SourceCardWrapper>
        {sources.map((source) => {
            return (<Link href={`/rss/${source.id}`}><SourceCard source={source}/></Link>)
        })}
        </SourceCardWrapper> 
        </Wrapper>   
    )
}
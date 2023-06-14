
import {useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router'

import { RSSSource } from '@/protos/taggy';

import FeedCard from '@/components/FeedCard';
import SourceCard from '@/components/SourceCard/SourceCard';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';


const Wrapper = styled.div`
    display: flex;
    padding: 20px;
    flex-direction: column;`

const SourceCardWrapper = styled.div`
    display: flex;
    gap: 10px;
`

function addRSSSource(url: string){
    fetch('/api/rss', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: url
        })
    })
}

function getSourceID(){
    const router = useRouter()
    return router.query.sourceId as string;
}

export default function RSS(){
    const [sources, setSources] = useState(Array<RSSSource>)
    const searchInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        fetch('/api/rss')
            .then(res => res.json())
            .then(data => {
                setSources(data)
            })
    }, [])

    const sourceId : string = getSourceID();
    
    return (
        <Wrapper>
        <div>{sourceId}</div>
        <Typography variant="h4" >XYZ Feeds</Typography>
        
        <TextField id="search-box" label="enter url" variant="filled" inputRef={searchInputRef} />
        <Button onClick={()=>{
            const url = searchInputRef?.current?.value as string;
            alert("Add RSS source with url:" + url);
            addRSSSource(url)}}>Add</Button>
        <SourceCardWrapper>
        {sources.map((source) => {
            return (<SourceCard source={source}/>)
        })}
        </SourceCardWrapper> 
        </Wrapper>   
    )
}
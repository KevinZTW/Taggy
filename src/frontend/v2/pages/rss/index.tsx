
import {useState, useEffect } from 'react';
import FeedCard from '@/components/FeedCard';
import SourceCard from '@/components/SourceCard/SourceCard';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import { RSSSource } from '@/protos/taggy';
import TextField from '@mui/material/TextField';


const Wrapper = styled.div`
    display: flex;
    padding: 10px;
    flex-direction: column;
    `
export default function RSS(){
    const [sources, setSources] = useState(Array<RSSSource>)


    useEffect(() => {
        fetch('/api/rss')
            .then(res => res.json())
            .then(data => {
                setSources(data)
            })
    }, [])

    console.log(sources)
    
    return (
        <Wrapper>
        
        <Typography variant="h4" >RSS Sources</Typography>
        
        <TextField id="search-box" label="enter url" variant="filled" />
        <Button>Add</Button>

        {sources.map((source) => {
            return (
                <>
                <SourceCard source={source}/>
                </>
            )
        })}
        </Wrapper>   
    )
}
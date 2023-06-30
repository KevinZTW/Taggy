
import {useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router'

import { RSSSource } from '@/protos/taggy';

import SourcePage from '@/components/SourcePage';
import ItemCard from '@/components/ItemCard';
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

export default function RSSSourcePage(){
    const [source, setSource] = useState<RSSSource>()
    
    const sourceId : string = useRouter().query.sourceId as string;
    
    useEffect(()=>{
        if (!sourceId) return;
        ApiGateway.getRSSSource(sourceId).then(data => {
            setSource(data)
        })
    }, [sourceId])
    


    return (
        <Wrapper>
    
        <SourcePage source={source}></SourcePage>


        
        </Wrapper>   
    )
}
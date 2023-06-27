
import {useState, useRef, useEffect } from 'react';
import { Router, useRouter } from 'next/router'

import { RSSFeed, RSSSource } from '@/protos/taggy';

import SourcePage from '@/components/SourcePage';
import FeedCard from '@/components/FeedCard';
import SourceCard from '@/components/SourceCard/SourceCard';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import ApiGateway from '@/gateways/Api.gateway';
import FeedPage from '@/components/FeedPage/FeedPage';



export default function RSSFeedPage(){
    const [feed, setFeed] = useState<RSSFeed>()
    const router = useRouter()
    const feedId : string = useRouter().query.feedId as string;
    
    useEffect(()=>{
        if (!feedId) return;
        ApiGateway.getRSSFeed(feedId).then(data => {
            setFeed(data)
        })
    }, [feedId])


    function goBack(){
        router.back()
    }
    return (
      <>
        <FeedPage item={feed} goBack={goBack}/>
      
      </>
    )
}
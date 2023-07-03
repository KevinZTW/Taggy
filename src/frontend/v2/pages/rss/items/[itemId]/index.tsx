
import {useState, useRef, useEffect } from 'react';
import { Router, useRouter } from 'next/router'

import { RSSItem, RSSFeed } from '@/protos/taggy';

import FeedPage from '@/components/FeedPage';
import ItemCard from '../../../components/ItemCard';
import FeedCard from '@/components/FeedCard/FeedCard';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import ApiGateway from '@/gateways/Api.gateway';
import ItemPage from '@/components/ItemPage/ItemPage';



export default function RSSItemPage(){
    const [item, setItem] = useState<RSSItem>()
    const router = useRouter()
    const itemId : string = useRouter().query.itemId as string;
    
    useEffect(()=>{
        if (!itemId) return;
        ApiGateway.getRSSItem(itemId).then(data => {
            setItem(data)
        })
    }, [itemId])


    function goBack(){
        router.back()
    }
    return (
      <>
        <ItemPage item={item} goBack={goBack}/>
      
      </>
    )
}
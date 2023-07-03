
import {useState, useEffect } from 'react';
import ItemCard from '../../components/ItemCard';
import Button from '@mui/material/Button';

export default function Timeline(){
    const [sources, setFeeds] = useState([])


    useEffect(() => {
        fetch('/api/rss')
            .then(res => res.json())
            .then(data => {
                setFeeds(data)
            })
    }, [])

    console.log(sources)
    return (
        <>
        <div>My Timeline</div>
        <ItemCard />
        <ItemCard />
        </>   
    )
}
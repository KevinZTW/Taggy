
import {useState, useEffect } from 'react';
import ItemCard from '../../components/ItemCard';
import Button from '@mui/material/Button';

export default function Timeline(){
    const [feeds, setFeeds] = useState([])


    // useEffect(() => {
    //     fetch('/api/rss')
    //         .then(res => res.json())
    //         .then(data => {
    //             setFeeds(data)
    //         })
    // }, [])

    console.log(feeds)
    return (
        <>
        <div>My Timeline</div>
        {/* <ItemCard />
        <ItemCard /> */}
        </>   
    )
}
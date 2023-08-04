import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { RSSFeed } from '@/protos/taggy';

import placeholderImg from "@/public/imgs/place_holder_img.png";

interface IProps {
    source: RSSFeed
}

export default function FeedCard({source}: IProps) {
    return (
        <>
        <Card sx={{ maxWidth: 600, display: 'flex' }}>
        {/* <CardHeader
            // action={
            //   <IconButton aria-label="settings">
            //     <MoreVertIcon />
            //   </IconButton>
            // }
            title={source.name}
            // subheader={source.description}
        /> */}
        <CardMedia
            component="img"
            sx={{ width: 160, }}
            height="160"
            image={`${source.imgUrl}` == "" ? placeholderImg.src : `${source.imgUrl}`}
        />
        <CardContent>
            <Typography variant="h5" component="div">
            {source.name}
            </Typography>
            {/* <div>id: {source.id}</div>
            <div>url: {source.url}</div>
            <div>last update: {source.lastUpdatedAt?.toString()}</div> */}
            <Typography variant="body2" color="text.secondary">
                {source.description}
            </Typography>
        </CardContent>
        {/* <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
            <FavoriteIcon />
            </IconButton>
            
        </CardActions> */}
        </Card>
        </>
    )
}
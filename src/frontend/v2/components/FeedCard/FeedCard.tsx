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



interface IProps {
    source: RSSFeed
}

export default function FeedCard({source}: IProps) {
    return (
        <>
        <Card sx={{ maxWidth: 345 }}>
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
            height="120"
            image={`${source.imgUrl}`}
            // alt="Paella dish"
        />
        <CardContent>
            <Typography variant="h5" component="div">
            {source.name}
            </Typography>
            <div>id: {source.id}</div>
            <div>url: {source.url}</div>
            <div>last update: {source.lastUpdatedAt?.toString()}</div>
            <Typography variant="body2" color="text.secondary">
                {source.description}
            </Typography>
        </CardContent>
        <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
            <FavoriteIcon />
            </IconButton>
            
        </CardActions>
        </Card>
        </>
    )
}
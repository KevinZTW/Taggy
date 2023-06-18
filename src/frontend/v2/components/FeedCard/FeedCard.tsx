import { RSSFeed } from "@/protos/taggy";

export default function FeedCard({feed}:{feed:RSSFeed}){
  return (
    <>
    <div>{feed.title}</div>
    <div>{feed.description}</div>
    <div>{feed.content}</div>
    </>
  )
}
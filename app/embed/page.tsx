"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from './page.module.css'

type TweetEmbedProps = {
  url: string;
}

type Media = {
  altText: string | null;
  size: { height: number, width: number };
  thumbnail_url: string;
  url: string;
  type: string;
}

type Tweet = {
  conversationID: string;
  timestamp: number;
  hashtags: string[];
  likes: number;
  media: Media[];
  replies: number;
  retweets: number;
  text: string;
  tweetID: string;
  tweetURL: string;
  username: string;
  userID: string;
}

const IMAGE_WIDTH = 200;

const convertToTweet = (json: any):Tweet => {
  return {
    conversationID: json.conversationID,
    timestamp: json.date_epoch,
    hashtags: json.hashtags,
    likes: json.likes,
    media: json.media_extended,
    replies: json.replies,
    retweets: json.retweets,
    text: json.text,
    tweetID: json.tweetID,
    tweetURL: json.tweetURL,
    username: json.user_name,
    userID: json.user_screen_name
  };
}

const TweetEmbed = ({ url }: TweetEmbedProps) => {
  const [tweet, setTweet] = useState<Tweet|null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`/embed/${encodeURIComponent(url)}`);
      const json = await data.json();
      setTweet(convertToTweet(json))
    };
    fetchData();
  }, [url]);
  return (<>
    {tweet && (
      <div className={styles.container}>
        <div>@{tweet.userID}: <span className={styles.tweetText}>{tweet.text}</span></div>
        <div>
          {tweet.media.map((item, index) => {
            const height = item.size.height;
            return <Image
              key={"image" + index}
              src={item.url}
              alt={item.altText || ""}
              width={height}
              height={height}
              className={styles.embedImage}
              style={{ width: IMAGE_WIDTH}} />;
          })}
        </div>
      </div>)}
  </>);
}

export default TweetEmbed;

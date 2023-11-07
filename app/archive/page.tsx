"use client";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from './page.module.css'

type TweetEmbedProps = {
  url: string;
  originalUrl: string;
  setError: Dispatch<SetStateAction<string | null>>;
  setFetching: Dispatch<SetStateAction<boolean>>;
  fetching: boolean;
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

const TweetEmbed = ({ url, originalUrl, setError, setFetching, fetching }: TweetEmbedProps) => {
  const [tweet, setTweet] = useState<Tweet | null>(null);
  useEffect(() => {
    console.log('eff')
    const fetchData = async () => {
      console.log("Fetching...");
      try {
        const data = await fetch(`/archive/${encodeURIComponent(url)}`);
        const json = await data.json();
        console.log("JSON: ", json);
        setTweet(convertToTweet(json))
        setFetching(false);
      } catch (err) {
        console.log("Got error")
        setError("Error fetching Tweet.");
        setFetching(false);
      }
    };
    if (url) {
      fetchData();
    }
  }, [url, setError, setFetching]);

  useEffect(() => {
    if (fetching) {
      setTweet(null);
    }
  }, [fetching]);

  return (<>
    {fetching && (
      <div className={styles.container} style={{overflow: "hidden"}}>
        Fetching {originalUrl.substring(0,40)}...
      </div>
    )}
    {!fetching && tweet && (
      <div className={styles.container}>
        <div>@{tweet.userID}: <span className={styles.tweetText}>{tweet.text}</span></div>
        <div>
          {tweet.media.map((item, index) => {
            const width = item.size.width;
            const height = item.size.height;
            if (item.type === "image") {
              return <Image
                key={"image" + index}
                src={item.url}
                alt={item.altText || ""}
                width={width}
                height={height}
                className={styles.embedImage}
                style={{ width: IMAGE_WIDTH}} />;
            } else {
              return <video
                key={"video" + index} autoPlay={false} controls={true} width={width} height={height}
                className={styles.embedImage}
                style={{ width: IMAGE_WIDTH }}>
                  <source src={item.url}/>
                </video>
            }
          })}
        </div>
      </div>)}
  </>);
}

export default TweetEmbed;

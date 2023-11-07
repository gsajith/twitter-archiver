'use client';
import { useCallback, useEffect, useState } from 'react';
import styles from './page.module.css'
import { isTwitterUrl } from '@/utils';
import TweetEmbed from './archive/page';

const TWITTER_BRIDGE_HOSTNAME = "api.vxtwitter.com"

const Home = () => {
  const [url, setUrl] = useState<string | number | readonly string[] | undefined>("");
  const [modifiedUrl, setModifiedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  const doFetch = useCallback(async () => {
    if (typeof url === 'string' && isTwitterUrl(url)) {
      console.log("Valid URL: " + url);
      const parsedUrl = new URL(url);
      parsedUrl.hostname = TWITTER_BRIDGE_HOSTNAME;
      parsedUrl.protocol = "https:";
      const replacedUrl = parsedUrl.toString();
      console.log("Will fetch: ", parsedUrl.toString());
      setModifiedUrl("");
      setTimeout(() => setModifiedUrl(replacedUrl), 100);
      setError(null);
      setFetching(true);
    } else {
      setFetching(false);
      setError("Invalid URL.")
      console.log("Invalid URL")
    }
  }, [url]);

  return (
    <main className={styles.main}>
      <div className={styles.inputContainer}>
        <input className={styles.urlInput} type="text" placeholder="Tweet URL here" value={url} onChange={(e) => {
          setUrl(e.target.value);
        }}></input>
        <button className={styles.urlButton}  onClick={() => doFetch()}>Fetch</button>
      </div>
      {modifiedUrl !== null && !error && <TweetEmbed
        originalUrl={url as string}
        url={modifiedUrl}
        setError={setError}
        setFetching={setFetching}
        fetching={fetching} />}
      {error && <div className={styles.errorContainer}>{error}</div>}
    </main>
  )
}

export default Home;

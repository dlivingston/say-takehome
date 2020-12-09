import React, { useState, useEffect } from "react";
import axios from "axios"
import './styles.css';
const REDDIT_URL = 'https://www.reddit.com/.json'

function App() {

  const[subreddits, setSubreddits] = useState([])
  async function getData() {
    const response = await axios.get(REDDIT_URL)
    return response.data.data.children
  }
  useEffect(() => {
    getData().then(response => {
      const newSRarray = []
      response.forEach(item => {
        if(newSRarray.findIndex(o => o.id === item.data.subreddit_id) === -1) {
          newSRarray.push({
            id: item.data.subreddit_id,
            subreddit: item.data.subreddit,
            sr_prefixed: item.data.subreddit_name_prefixed,
            posts: [
              {
                id: item.data.id,
                title: item.data.title,
                thumb: item.data.thumbnail,
                upvotes: item.data.ups,
                post_hint: item.data.post_hint,
                url: item.data.url,
                date_utc:  item.data.created_utc,
                permalink: item.data.permalink
              }
            ]
          })
        } else {
          let i = newSRarray.findIndex(o => o.id === item.data.subreddit_id)
          newSRarray[i].posts.push({
            id: item.data.id,
            title: item.data.title,
            thumb: item.data.thumbnail,
            upvotes: item.data.ups,
            post_hint: item.data.post_hint,
            url: item.data.url,
            date_utc:  item.data.created_utc,
            permalink: item.data.permalink
          })
        }
      });
      setSubreddits(newSRarray);
    });
  },[]);

  function compare(a, b) {
    const postA = a.upvotes;
    const postB = b.upvotes;
    let comparison = 0;
    if (postA > postB) { comparison = 1 } else if (postA < postB) { comparison = -1 }
    return comparison * -1;
  }
  function fomatDate(utc) {
    const d = new Date(utc * 1000).toLocaleDateString("en-US")
    return d
  }

  return (
    <div>
      <h1>Say Takehome Project</h1>
      {subreddits.map(sr => (
        <div className="subreddit" key={sr.id}>
          <h3>{sr.sr_prefixed}</h3>
          {sr.posts.sort(compare).map(post => (
            <div className="post" key={post.id}>
              <h4><a href={'https://www.reddit.com' + post.permalink}>{post.title}</a></h4>
              {(post.post_hint === "image") ? 
                <img src={post.url} alt=""/> :
                null
              }
              <div className="info-row">
                <p className="date"><strong>Date: </strong>{fomatDate(post.date_utc)}</p>
                <p className="upvotes"><strong>Upvotes: </strong>{post.upvotes} </p>
              </div>
              
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;

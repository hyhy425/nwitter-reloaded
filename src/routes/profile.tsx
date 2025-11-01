import { styled } from "styled-components";
import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Tweet from "../components/tweet";

import type { ITweet } from "../components/timeline";
import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import Button from "../components/button";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const Name = styled.span`
  font-size: 20px;
  margin-right: 10px;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const NameWrapper = styled.div`
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
`;

const EditInput = styled.input`
  width: 180px;
  font-size: 20px;
  text-align: center;
  background-color: #f5f5f5;
  color: #4a4a4a;
  border: none;
  border-bottom: 1px solid #aaa;
  outline: none;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [tweets, setTweets] = useState<ITweet[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName ?? "");

  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    await onSnapshot(tweetQuery, (snapshot) => {
      const tweets = snapshot.docs.map((doc) => {
        const { tweet, createdAt, userId, username } = doc.data();
        return {
          tweet,
          createdAt,
          userId,
          username,
          id: doc.id,
        };
      });
      setTweets(tweets);
    });
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleSaveName = async () => {
    if (!user) return;
    const trimmed = newName.replace(/\s+/g, "");
    const current = user.displayName ?? "";
    if (!trimmed || trimmed === current) {
      setIsEditing(false);
      return;
    }
    try {
      await updateProfile(user, { displayName: trimmed });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert("Failed to update name");
    }
  };

  useEffect(() => {
    setNewName(user?.displayName ?? "");
  }, [user?.displayName]);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        <svg
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
        </svg>
      </AvatarUpload>
      <NameWrapper>
        {isEditing ? (
          <>
            <EditInput
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />

            <Button color="cyan" onClick={handleSaveName}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Name>{user?.displayName ?? "Anonymous"}</Name>

            <Button color="cyan" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </>
        )}
      </NameWrapper>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}

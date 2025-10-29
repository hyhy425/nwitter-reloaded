import { useState } from "react";
import styled from "styled-components";

import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid #4a4a4a;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: #4a4a4a;
  background-color: #f5f5f5;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #4a4a4a;
  }
`;

const AttachFileBtn = styled.label`
  padding: 10px 0px;
  color: #4a4a4a;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #4a4a4a;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #4a4a4a;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [loading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    const trimmeed = tweet.trim();
    if (!user || loading) return;
    if (trimmeed === "" || tweet.length > 180) {
      setTweet("");
      return;
    }
    try {
      setLoading(true);
      await addDoc(collection(db, "tweets"), {
        tweet: trimmeed,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      setTweet("");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="What is happening?"
      />
      <AttachFileBtn htmlFor="file">
        {file ? "Photo added ✅" : "Add Photo"}
      </AttachFileBtn>
      <AttachFileInput
        type="file"
        id="file"
        onChange={onFileChange}
        accept="image/*"
      />
      <SubmitBtn type="submit" value={loading ? "Posting..." : "Post Tweet"} />
    </Form>
  );
}

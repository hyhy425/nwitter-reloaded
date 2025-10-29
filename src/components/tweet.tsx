import { styled } from "styled-components";
import type { ITweet } from "./timeline";

import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useState } from "react";
import Button from "./button";

const Wrapper = styled.div`
  padding: 20px;
  border: 1px solid #4a4a4a;
  border-radius: 15px;
`;

const Column = styled.div``;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin-top: 10px;
  font-size: 18px;
  overflow-wrap: anywhere;
`;

const TextArea = styled.textarea`
  width: 100%;
  margin-top: 10px;
  font-size: 16px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #4a4a4a;
  background-color: #f5f5f5;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &:focus {
    outline: none;
    border-color: #4a4a4a;
  }
  resize: none;
`;

export default function Tweet({ username, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const isOwner = user?.uid === userId;

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(tweet);
  const [saving, setSaving] = useState(false);

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || !isOwner) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
    } catch (e) {
      console.log(e);
    }
  };

  const onEdit = () => {
    if (!isOwner) return;
    setEditValue(tweet);
    setEditing(true);
  };

  const onSave = async () => {
    if (!isOwner) return;
    const newTweet = editValue.trim();
    if (newTweet === "") return alert("Tweet cannot be empty.");
    setSaving(true);
    try {
      await updateDoc(doc(db, "tweets", id), { tweet: newTweet });
      setEditing(false);
    } catch (e) {
      console.log(e);
      alert("Failed to update tweet.");
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setEditing(false);
    setEditValue(tweet);
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {editing ? (
          <>
            <TextArea
              rows={3}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              maxLength={180}
              disabled={saving}
            />
            <Button color="aquamarine" onClick={onSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button color="gray" onClick={onCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Payload>{tweet}</Payload>
            {user?.uid === userId && (
              <>
                <Button color="goldenrod" onClick={onEdit}>
                  Edit
                </Button>
                <Button color="tomato" onClick={onDelete}>
                  Delete
                </Button>
              </>
            )}
          </>
        )}
      </Column>
    </Wrapper>
  );
}

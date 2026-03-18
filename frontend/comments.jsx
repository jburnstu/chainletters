
import React, { StrictMode, useState, authoref, useEffect, createContext, useContext } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Outlet, NavLink, useParams, useOutletContext, useOutlet } from 'react-router-dom';
import { SubmissionButton, ModalJoinButton, ModalNewButton, NewModerationModalButton } from './buttons.jsx';
import { AuthorContext, DictsContext } from "./context.jsx";
import { contactAPI } from "./buttons.jsx";

```
When / where 
```


function Comments(props) {

    let selections = props.selections;
    let segmentKeys = Object.keys(selections);
    console.log(segmentKeys)

    async function getCommentsForSegmentTrace() {
        let segmentCommentDict = await Promise.all(segmentKeys.map(async (segmentID) => {
            segmentTraceData = await contactAPI(`segment_trace/${segmentID}`, "get");
            segmentTraceDataArray.push(segmentTraceData);
        }
        )
        )
    }

    return (
        <div className="comments">
            <StoryCommentPanel></StoryCommentPanel>
            {selectionArray.map(selectionID =>
                <SegmentCommentPanel segmentID={selectionID}> /</SegmentCommentPanel>
            )}
        </div>
    )
}

function StoryCommentPanel() { }


function SegmentCommentPanel(props) {

    let author = null;
    let moderationNotes = null;
    let content = null;
    let commentDict = null;

    const [isModerationOpen, setIsModerationOpen] = useState(false);


    return (<div className="segmentComment">
        <div>{author}</div>
        <div className="moderationContainer">
            <button onCLick={() => setIsModerationOpen(true)}></button>
            <div visible={isModerationOpen}></div>
        </div>
        <div className="segmentCommentsContainer">
            {commentDict.map(segmentCommentID => <SegmentComment commentDict={commentDict[segmentCommentID]}></SegmentComment>)}
        </div>
        <div className="addCommentContainer">
            <button onClick={createComment}></button>
            <textarea></textarea>
            <button onClick={submitComment}></button>
            <button onClick={abandonComment}></button>
        </div>
    </div>)
}


```
What would a large, all-comment-info-for-a-given-segment dict look like?
{segmentID: 
        {authorID::, segmentCommentID: 
                {authorID::, content::, childComments: [commentCommentID: {authorID::}, ]}}}
```
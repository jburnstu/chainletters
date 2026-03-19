
import React, { StrictMode, useState, authoref, useEffect, createContext, useContext } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Outlet, NavLink, useParams, useOutletContext, useOutlet } from 'react-router-dom';
import { SubmissionButton, ModalJoinButton, ModalNewButton, NewModerationModalButton } from './buttons.jsx';
import { AuthorContext, DictsContext } from "./context.jsx";
import { getRandomItem, contactAPI } from "./utilityFuncs.jsx";
export default { Comments };


export function Comments(props) {

    let selections = props.selections;
    let segmentKeys = Object.keys(selections);
    console.log(segmentKeys)

    let storyDict = props.storyDict;
    let segmentTraceWithInfo = storyDict.segment_trace

    // function getSegmentByID(segmentDictArray, id) {
    //     const idMatch = (segmentDict) => segmentDict.id == id;
    //     return segmentDictArray.find(idMatch);
    // }

    return (
        <div className="comments">
            <StoryCommentPanel />
            {segmentTraceWithInfo.map(segmentObj =>
                <SegmentInfoPanel key={segmentObj.id} isSelected={selections[segmentObj.id]} segmentInfo={segmentObj} />
            )}
        </div>
    )

    {/* {segmentKeys.map(segmentKey =>
    <SegmentInfoPanel key={segmentKey} isSelected={selections[segmentKey]} segmentInfo={getSegmentByID(segmentTraceWithInfo, segmentKey)} />
)} */}
}

function StoryCommentPanel() { }


function SegmentInfoPanel(props) {

    let segmentInfo = props.segmentInfo;
    console.log(segmentInfo);

    const [isModerationOpen, setIsModerationOpen] = useState(false);

    // function getArrayObjByID(array, id) {
    //     const idMatch = (obj) => obj.id == id;
    //     return array.find(idMatch);
    // }



    return (<div className={"segmentInfoContainer " + props.isSelected ? undefined : 'hidden'} >
        <div>{segmentInfo.author.display_name}</div>
        <div className="moderationContainer">
            <button onCLick={() => setIsModerationOpen(!isModerationOpen)}>LOOK AT MODERATION</button>
            <div className={isModerationOpen ? undefined : 'hidden'}>MODERATION PANEL</div>
        </div>
        <div className="segmentCommentsContainer">
            {segmentInfo.comments.map(segmentCommentObj =>
                <SegmentComment key={segmentCommentObj.id} segmentCommentInfo={segmentCommentObj} />)}
        </div>
        <div className="addCommentContainer">
            <button onClick={createComment}></button>
            <textarea></textarea>
            <button onClick={submitComment}></button>
            <button onClick={abandonComment}></button>
        </div>
    </ div>)
}


function SegmentComment(props) {

    let segmentCommentInfo = props.segmentCommentInfo;

    return (
        <div className="segmentCommentContainer">{commentDict.author.display_name}
            <textarea readOnly value={commentDict.text_content} />
            <div className="commentCommentsContainer">
                {segmentCommentInfo.comments.map(commentCommentObj =>
                    <CommentComment key={commentCommentObj.id} commentCommentInfo={commentCommentObj} />
                )}
            </div>
            <div className="addCommentCommentContainer"></div>
        </div>)
}

function CommentComment(props) {

    return (
        <div className="CommentCommentContainer">{props.commentCommentInfo.author.display_name}
            <textarea readOnly value={props.commentCommentInfo.text_content} />
        </div>
    )
}
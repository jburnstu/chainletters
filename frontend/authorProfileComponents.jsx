import { getRandomItem, contactAPI, getArrayObjByID } from "./utilityFuncs";
import { AuthorContext } from "./context.jsx";
import React, { StrictMode, useState, authoref, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Link, Outlet, NavLink, useParams, useOutletContext, useOutlet, useNavigate } from 'react-router-dom';
export default { AuthorProfile, AuthorListDisplayButton };

export function AuthorProfile(props) {

    let readOrWrite = props.readOrWrite;
    const { tabID } = useParams();

    console.log(props.dicts, tabID)
    let authorDict = getArrayObjByID(props.dicts, tabID);

    async function getArrayOfRecentSegmentTraces() {
        const numberOfSegments = 3;
        segmentByAuthorData = await contactAPI(`completed_segment_by_author/${authorDict.id}/`, "get");
        randomSegmentSelection = getRandomItem(segmentByAuthorData, numberOfSegments);

        const segmentTraceDataArray = [];
        let segmentTraceData;
        await Promise.all(randomSegmentIDArray.map(async (segmentID) => {
            segmentTraceData = await contactAPI(`segment_trace/${segmentID}`, "get");
            segmentTraceDataArray.push(segmentTraceData);
        }
        )
        )
        return segmentTraceDataArray;

    }

    const arrayOfRecentSegmentTraces = getArrayOfRecentSegmentTraces();

    // const removeCurrentStory = (storyDict) => props.setDicts(storyDict, readOrWrite, "remove");


    return (
        <div className="authorProfileContainer" id={"authorProfileContainer" + { tabID }}>
            {/* <StoryHeader storyDict={storyDict} wordCount={wordCount} /> */}
            <div className="recentSegmentsContainer">
                {getArrayOfRecentSegments.map(recentSegmentTrace =>
                    <RecentSegmentDisplay segmentTraceInfo={recentSegmentTrace} />)
                }
            </div>
            <div className="recentActivity"></div>
            {/* Comments, likes, reviews, etc? */}
        </div>
    )
}

function RecentSegmentDisplay() {

    let finalSegmentInfo = props.segmentTraceInfo.segment_trace.slice(-1)[0]
    let penultimateSegment = props.segmentTraceInfo.segment_trace.slice(-2)[0]

    return (
        <div>
            <textarea value={penultimateSegment.content}></textarea>
            <textarea value={finalSegment.content}></textarea>
        </div>
    )
}



export function AuthorListDisplayButton(props) {
    const authorID = useContext(AuthorContext);

    const [threeMostRecentAuthors, setThreeMostRecentAuthors] = useState([])

    const [isOpen, setIsOpen] = useState(false);

    // let arrayOfFriendDicts = contactAPI(`author_relation_by_author/${authorID}/`, "get");
    const [authorArray, setAuthorArray] = useState([])

    const onClick = () => {
        if (!isOpen) {
            contactAPI(`author_relation_by_author/${authorID}/`, "get")
                .then(function (value) {
                    console.log(value)
                    setAuthorArray(value.related_authors)
                })
                .then(function (innerValue) {
                    setIsOpen(true);
                }
                )
        }
        else { setIsOpen(false) }
    }

    return (
        <div className="friendSearchContainer">
            <button onClick={onClick}>AUTHORS</button>
            {authorArray.map(authorDict =>
                <FriendProfileButton key={authorDict.id} addAuthorTab={props.addAuthorTab} authorInfo={authorDict} />)}
        </div>
    )
}

function FriendProfileButton(props) {

    const onClick = () => { props.addAuthorTab(props.authorInfo, "author", "add") }

    console.log(props.authorInfo)
    return (
        <button onClick={onClick}>
            {props.authorInfo.display_name}
        </button>)
}

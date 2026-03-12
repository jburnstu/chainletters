
import React, { useState, authoref, useEffect, createContext, useContext } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Outlet, NavLink, useParams, useOutletContext, useOutlet } from 'react-router-dom';
import { SubmissionButton, ModalJoinButton, ModalNewButton, NewModerationModalButton } from './buttons.jsx';
import { AuthorContext, DictsContext } from "./context.jsx";
// import './dashboardStyles.css';


function AppByAuthor(props) {
    useEffect(() => console.log("Rendered"));

    const [authorid, setAuthorID] = useState(props.authorid);
    const [display_name, setDisplayName] = useState(props.display_name);
    const [writeDicts, setWriteDicts] = useState(props.writeDicts);
    const [readDicts, setReadDicts] = useState(props.readDicts);


    const rootPath = `/chainlettersstories/${authorid}/`;


    function changeStoryDicts(storyDict, readOrWrite = "write", addOrRemove = "add") {
        let dictArrayToChange = (readOrWrite == "write") ? writeDicts : readDicts
        let setFunction = (readOrWrite == "write") ? setWriteDicts : setReadDicts
        let newDictArray;
        switch (addOrRemove) {
            case "remove":
                newDictArray = [];
                dictArrayToChange.forEach(originalStoryDict => {
                    if (originalStoryDict.id != storyDict.id) {
                        newDictArray.push(originalStoryDict);
                    }
                }
                )
                break
            case "add":
            default:
                console.log("adding story " + storyDict + " to " + dictArrayToChange);
                newDictArray = dictArrayToChange.slice();
                newDictArray.push(storyDict);
                console.log(newDictArray)
        }
        setFunction(newDictArray);
    }


    return (
        <BrowserRouter>
            <AuthorContext.Provider value={authorid}>
                <Routes>
                    <Route path={rootPath} element={<UniversalHeader display_name={display_name} />}>
                        <Route index path="" relative element={<Home />} />
                        <Route path="write/" element={<Dashboard readOrWrite="write" dicts={writeDicts} setDicts={changeStoryDicts} />}>
                            <Route path=":storyID/"
                                element={<Story readOrWrite="write" dicts={writeDicts} setDicts={changeStoryDicts} />} />
                        </Route>
                        <Route path="read/" element={<Dashboard readOrWrite="read" dicts={readDicts}
                            setDicts={changeStoryDicts} />}>
                            <Route path=":storyID/"
                                element={<Story readOrWrite="read" dicts={readDicts} setDicts={changeStoryDicts} />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<NoMatch />} />
                </Routes>
            </AuthorContext.Provider>
        </BrowserRouter>
    );
}

function NoMatch() {
    return (
        <div style={{ padding: 20 }}>
            <h2>404: Page Not Found</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
        </div>
    );
}

function Home(props) {
    return (<div className="container"></div>);
}


function UniversalHeader(props) {

    return (
        <>
            <header className="universalHeader">
                <h1>CHAIN MATES</h1>
                <h1>Hi, {props.display_name}!</h1>
                <nav>
                    <Link to="" ><button type="button">HOME</button></Link>|{" "}
                    <Link to="write" ><button type="button">WRITE</button></Link>|{" "}
                    <Link to="read"><button type="button">READ</button></Link>
                </nav>
            </header >
            <Outlet></Outlet>
        </>
    )
}

function Dashboard(props) {

    const outlet = useOutlet();
    let arrayOfStoryIDs = props.dicts.map(dict => dict.id);

    const addNewStory = (storyID) => props.setDicts(storyID, props.readOrWrite, "add");

    return (
        <div className={props.readOrWrite + "DashboardContainer" + " dashboardContainer"}>
            <Sidebar readOrWrite={props.readOrWrite} addNewStory={addNewStory} />

            <nav className="storyTabs">
                {arrayOfStoryIDs.map((storyID, index) =>
                    <Link to={storyID + "/"} key={index + storyID}>
                        <button className="storyTabButton"
                            onClick={() => console.log("link button clicked", storyID)}
                        >{index}</button>
                    </Link>
                )}
            </nav>
            {outlet || <PlaceHolder />}
        </div >
    )
}

function PlaceHolder() {
    return (<div className="storyContainer">
        <div className="storyContent"></div>
        <div className="submissions"></div>
        <div className="comments"></div>
    </div>
    )
}

function Sidebar(props) {


    switch (props.readOrWrite) {
        case "write":
            return (
                <div className="sidebar">
                    <ModalNewButton addNewStory={props.addNewStory} />
                    <ModalJoinButton addNewStory={props.addNewStory} />
                </div>
            )
        case "read":
        default:
            return (
                <div className="sidebar">
                    <NewModerationModalButton addNewStory={props.addNewStory} />
                </div>
            )
    }
}


function Story(props) {

    let readOrWrite = props.readOrWrite;
    const { storyID } = useParams();

    function getStoryByID(storyDictArray, id) {
        const idMatch = (storyDict) => storyDict.id == id;
        return storyDictArray.find(idMatch);
    }
    let storyDict = getStoryByID(props.dicts, storyID);
    let storySoFar = storyDict.segmenttrace.slice(0, -1);
    let presavedCurrentContent = storyDict.segmenttrace.slice(-1);

    const [currentContent, setCurrentContent] = useState(presavedCurrentContent.earlier_segment_content);

    function handleChange(e) {
        setCurrentContent(e.target.value);
    }

    const removeCurrentStory = (storyDict) => props.setDicts(storyDict, readOrWrite, "remove");


    let storySoFarElement = storySoFar.map(segmentDict =>
        <textarea className="previousSegmentText" readOnly key={segmentDict.earlier_segmentid} value={segmentDict.earlier_segment_content}></ textarea>
    )

    let currentSegmentElement = <input className="currentSegmentText" type="text" value={currentContent} onChange={handleChange}></input>

    return (
        <div className="storyContainer" id={"storyContainer" + { storyID }}>
            <StoryHeader />
            <div className="storyContent">
                {storySoFarElement}
                {currentSegmentElement}
            </div>
            <SubmissionButtons readOrWrite={readOrWrite} currentContent={currentContent} segmentid={storyID} removeCurrentStory={removeCurrentStory} />
            <Comments />
        </div>
    )
}

function StoryHeader() {
    return (<div className="storyHeader">THIS IS THE STORY HEADER
    </div>)
}

function SubmissionButtons(props) {

    let arrayofButtonTypes;
    switch (props.readOrWrite) {
        case "read":
            arrayofButtonTypes = ["APPROVE"];
        case "write":
        default:
            arrayofButtonTypes = ["SAVE", "SUBMIT", "ABANDON"];
    }

    return (
        <div className="submissions">
            {arrayofButtonTypes.map(buttonType =>
                <SubmissionButton
                    key={buttonType}
                    submissionType={buttonType}
                    currentContent={props.currentContent}
                    segmentid={props.segmentid}
                    removeCurrentStory={props.removeCurrentStory} />)}
        </div>
    )
}

function Comments() {
    return (
        <div className="comments">THESE ARE THE COMMENTS</div>
    )
}

const READ_DICTS = JSON.parse(document.getElementById('read-dicts').textContent);
const WRITE_DICTS = JSON.parse(document.getElementById('write-dicts').textContent);
const AUTHORID = JSON.parse(document.getElementById('authorid').textContent);
const DISPLAYNAME = JSON.parse(document.getElementById('display_name').textContent);
createRoot(document.getElementById('myAppContainer')).render(
    <AppByAuthor authorid={AUTHORID} display_name={DISPLAYNAME} readDicts={READ_DICTS} writeDicts={WRITE_DICTS} />
);

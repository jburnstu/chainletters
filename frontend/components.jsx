
import React, { StrictMode, useState, authoref, useEffect, createContext, useContext } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Outlet, NavLink, useParams, useOutletContext, useOutlet } from 'react-router-dom';
import { SubmissionButton, ModalJoinButton, ModalNewButton, NewModerationModalButton } from './buttons.jsx';
import { AuthorContext, DictsContext } from "./context.jsx";
import { Comments } from "./comments.jsx";
import { getArrayObjByID } from "./utilityFuncs";


function AppByAuthor(props) {

    const [authorID, setAuthorID] = useState(props.authorID);
    const [displayName, setDisplayName] = useState(props.displayName);
    const [writeDicts, setWriteDicts] = useState(props.writeDicts);
    const [readDicts, setReadDicts] = useState(props.readDicts);

    const rootPath = `/chainlettersstories/${authorID}/`;


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
                newDictArray = dictArrayToChange.slice();
                newDictArray.push(storyDict);
        }
        setFunction(newDictArray)
        if (newDictArray == dictArrayToChange) {
            console.warn("WARNING: ", storyDict, " was not successfully added to / removed from ", dictArrayToChange)
        }
        else { console.log("Successfully changed ", dictArrayToChange, " to ", writeDicts) }
    }

    return (
        <StrictMode>
            <BrowserRouter>
                <AuthorContext.Provider value={authorID}>
                    <Routes>
                        <Route path={rootPath} element={<UniversalHeader displayName={displayName} />}>
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
        </StrictMode>
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
                <h1>Hi, {props.displayName}!</h1>
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
                    <Link to={storyID + "/"} key={index + storyID} className="storyTabLink">
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
    return (<div className="storyContainer">PLACEHOLDER
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

    let storyDict = getArrayObjByID(props.dicts, storyID);
    let presavedCurrentContent = storyDict.segment_trace.slice(-1).earlier_segment_content;

    const [currentContent, setCurrentContent] = useState(presavedCurrentContent);
    const [wordCount, setWordCount] = useState(0);

    let noSelections = {};
    storyDict.segment_trace.forEach(dictInArray =>
        noSelections[dictInArray["earlier_segment_id"]] = false)
    const [selectedSegmentDict, setSelectedSegmentDict] = useState(noSelections);

    console.log(storyDict);

    function changeSegmentSelection(segmentID) {
        setSelectedSegmentDict({ ...selectedSegmentDict, [segmentID]: !selectedSegmentDict[segmentID] })
    }

    function handleChange(e) {
        setCurrentContent(e.target.value);
        setWordCount(getWordCount(currentContent));
    }

    function getWordCount(myText) {
        // const spaceMatchPattern = /[\w\d][\s\W*\d*]+[\w\d]/;
        const spaceMatchPattern = /\S+/g;
        let numberOfSpaces = myText.match(spaceMatchPattern);
        return (numberOfSpaces ? numberOfSpaces : []).length;
    }

    const removeCurrentStory = (storyDict) => props.setDicts(storyDict, readOrWrite, "remove");


    return (
        <div className="storyContainer" id={"storyContainer" + { storyID }}>
            <StoryHeader storyDict={storyDict} wordCount={wordCount} />
            <div className="storyContent">
                {storyDict.segment_trace.map(segmentDict =>
                    <SegmentDisplay key={segmentDict.earlier_segment_id}
                        id={segmentDict.earlier_segment_id}
                        isFinalSegment={segmentDict.earlier_segment_id == storyID}
                        fixedContent={segmentDict.earlier_segment_content}
                        currentContent={currentContent}
                        changeSelection={changeSegmentSelection}
                        onChange={handleChange} />
                )
                }
            </div>
            <SubmissionButtons readOrWrite={readOrWrite} currentContent={currentContent} segmentID={storyID} removeCurrentStory={removeCurrentStory} />
            <Comments selections={selectedSegmentDict} storyDict={storyDict} />
        </div>
    )
}

function StoryHeader(props) {

    let storyData = props.storyDict["story_data"];
    let length = props.storyDict.segment_trace.length;

    return (<div className="storyHeader">
        <div>{storyData.title ? storyData.title : "Untitled"}</div>
        <div>{"Section " + length + " / " + (storyData.max_number_of_segments ? storyData.max_number_of_segments : "Infinite")}</div>
        <div>{"Word Count :" + props.wordCount + " / " + (storyData.max_segment_length ? storyData.max_segment_length : "Infinite")}</div>
    </div>)
}

function SegmentDisplay(props) {

    let readOnly = true;
    let onChange = null;
    let value = props.fixedContent;

    if (props.isFinalSegment) {
        readOnly = false;
        onChange = props.onChange;
        value = props.currentContent;
    }

    const onClick = () => {
        props.changeSelection(props.id)
    }


    return (
        <textarea className={`segmentDisplay ${readOnly ? undefined : 'currentSegmentDisplay'}`} readOnly={readOnly} value={value}
            onChange={onChange} onClick={onClick} ></ textarea>)

}

function SubmissionButtons(props) {

    let arrayOfButtonTypes;
    switch (props.readOrWrite) {
        case "read":
            arrayOfButtonTypes = ["APPROVE"];
        case "write":
        default:
            arrayOfButtonTypes = ["SAVE", "SUBMIT", "ABANDON"];
    }

    return (
        <div className="submissions">
            {arrayOfButtonTypes.map(buttonType =>
                <SubmissionButton
                    key={buttonType}
                    submissionType={buttonType}
                    currentContent={props.currentContent}
                    segmentID={props.segmentID}
                    removeCurrentStory={props.removeCurrentStory} />)}
        </div>
    )
}


const AUTHORID = JSON.parse(document.getElementById('author_id').textContent);
const DISPLAYNAME = JSON.parse(document.getElementById('display_name').textContent);
const READDICTS = JSON.parse(document.getElementById('read_dicts').textContent);
const WRITEDICTS = JSON.parse(document.getElementById('write_dicts').textContent);
createRoot(document.getElementById('myAppContainer')).render(
    <AppByAuthor authorID={AUTHORID} displayName={DISPLAYNAME} readDicts={READDICTS} writeDicts={WRITEDICTS} />
);


document.querySelectorAll("textarea").forEach(function (textarea) {
    textarea.style.height = textarea.scrollHeight + "px";
    textarea.style.overflowY = "hidden";

    textarea.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    });
});
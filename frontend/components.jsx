
import React, { useState, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Outlet, NavLink, useParams, useOutletContext } from 'react-router-dom';
import { NewButton, JoinButton, SubmissionButton, ModalButton, NewModerationButton } from './buttons.jsx';

function AppByUser(props) {

    const userid = props.userid;
    const displayname = props.displayname;

    // const [readAndWriteDicts, setReadAndWriteDicts] = useState({ "read": props.readDicts, "write": props.writeDicts });


    const [writeDicts, setWriteDicts] = useState(props.writeDicts);
    const [readDicts, setReadDicts] = useState(props.readDicts);

    // Structure of eg writeDicts is [{"34":["56":"hi there", ...,"34":"what's your name"]},...]

    const rootPath = `/chainlettersstories/${userid}/`;

    function changeStoryDicts(storyDict, readOrWrite = "write", addOrRemove = "add") {
        let setFunction = (readOrWrite == "write") ? setWriteDicts : setReadDicts
        let dictArrayToChange = readAndWriteDicts[readOrWrite];
        let newDictArray;
        switch (addOrRemove) {
            case "remove":
                newDictArray = dictArrayToChange.map(originalStoryDict =>
                    (Object.keys(originalStoryDict)[0] = Object.keys(storyDict[0])) ?
                        null : originalStoryDict);
                break
            case "add":
            default:
                newDictArray = dictArrayToChange.slice();
                newDictArray.push(newStoryDict);
        }
        setFunction(newDictArray);
    }


    return (

        <BrowserRouter>
            <Routes>
                <Route path={rootPath} element={<UniversalHeader displayname={displayname} />}>
                    <Route index path="" relative element={<Home />} />
                    <Route path="write/" element={<Dashboard readOrWrite="write" userid={userid} dicts={writeDicts} setDicts={changeStoryDicts} />}>
                        <Route path=":storyID/"
                            element={<Story readOrWrite="write" dicts={writeDicts} setDicts={changeStoryDicts} />} />
                    </Route>
                    <Route path="read/" element={<Dashboard readOrWrite="read" userid={userid} dicts={readDicts}
                        setDicts={changeStoryDicts} />}>
                        <Route path=":storyID/"
                            element={<Story readOrWrite="read" dicts={readDicts} setDicts={changeStoryDicts} />} />
                    </Route>
                </Route>
                <Route path="*" element={<NoMatch />} />
            </Routes>
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
    return (<></>);
}


function UniversalHeader(props) {

    return (
        <>
            <header>
                <h1>CHAIN MATES</h1>
                <h1>Hi, {props.displayname}!</h1>
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

    arrayOfStoryIDs = Object.keys(props.dicts);

    function addNewStory(storyID) {
        props.changeStoryDicts(storyID, readOrWrite = props.readOrWrite, addOrRemove = "add");
    }

    return (
        <div className={props.readOrWrite + "-dashboard-container"}>
            <Sidebar userid={props.userid} readOrWrite={props.readOrWrite} addNewStory={addNewStory} />

            <nav className="tabs">
                {arrayOfStoryIDs.map((storyID, index) =>
                    <Link to={storyID} key={storyID}>
                        <button className="story-tab-button"
                        >{index}</button>
                    </Link>
                )}
            </nav>
            <Outlet />
        </div>
    )

}

function Sidebar(props) {

    switch (props.readOrWrite) {
        case "write":
            return (
                <div className="sidebar">
                    <NewButton userid={props.userid} addNewStory={props.addNewStory} />
                    <JoinButton userid={props.userid} addNewStory={props.addNewStory} />
                    <ModalButton addNewStory={props.addNewStory} />
                </div>
            )
        default:
            return (
                <div className="sidebar">
                    <NewModerationButton userid={props.userid} addNewStory={props.addNewStory} />
                </div>
            )
    }
}


function Story(props) {

    const { storyID } = useParams();

    let storyDict = props.dicts[storyID];
    let readOrWrite = props.readOrWrite;
    let storySoFar = storyDict["previous"];
    let presavedCurrentContent = storyDict["current"].toString();

    const [currentContent, setCurrentContent] = useState(presavedCurrentContent);

    function handleChange(e) {
        setCurrentContent(e.target.value);
    }

    function removeCurrentStory() {
        props.changeStoryDicts(storyDict, readOrWrite = readOrWrite, addOrRemove = "remove");
    }

    let storySoFarElement = storySoFar.map(storySection =>
        <textarea readOnly key={storySection} value={storySection}></ textarea>
    )

    let currentSectionElement = <input type="text" value={currentContent} onChange={handleChange}></input>

    return (
        <div className="writeStoryContainer" id={"writeStoryContainer" + { currentSection }}>
            {storySoFarElement}
            {currentSectionElement}
            <SubmissionButtons readOrWrite={readOrWrite} currentContent={currentContent} userid={props.userid} sectionid={storyID} removeCurrentStory={removeCurrentStory} />
            <Comments />
        </div>
    )
}

function SubmissionButtons(props) {

    console.log(props.passRef);
    return (
        <div className="submit-buttons-container">
            <SubmissionButton currentContent={props.currentContent} submissionType="SAVE" userid={props.userid} sectionid={props.sectionid} removeCurrentStory={props.removeCurrentStory} />
            <SubmissionButton currentContent={props.currentContent} submissionType="SUBMIT" userid={props.userid} sectionid={props.sectionid} removeCurrentStory={removeCurrentStory} />
            <SubmissionButton currentContent={props.currentContent} submissionType="ABANDON" userid={props.userid} sectionid={props.sectionid} removeCurrentStory={removeCurrentStory} />
        </div>
    )
}


function Comments() {
    return (
        <></>
    )
}

const READ_DICTS = JSON.parse(document.getElementById('read-dicts').textContent);
const WRITE_DICTS = JSON.parse(document.getElementById('write-dicts').textContent);
const USERID = JSON.parse(document.getElementById('userid').textContent);
const DISPLAYNAME = JSON.parse(document.getElementById('displayname').textContent);
createRoot(document.getElementById('myappcontainer')).render(
    <AppByUser userid={USERID} displayname={DISPLAYNAME} readDicts={READ_DICTS} writeDicts={WRITE_DICTS} />
);

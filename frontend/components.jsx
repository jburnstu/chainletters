
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Outlet, NavLink, useParams, useOutletContext } from 'react-router-dom';
import { SubmissionButton, ModalButton, ModalNewButton } from './buttons.jsx';
import { UserContext, DictsContext } from "./context.jsx";


function AppByUser(props) {
    useEffect(() => console.log("Rendered"));

    const [userid, setUserID] = useState(props.userid);
    const [displayname, setDisplayName] = useState(props.displayname);
    const [writeDicts, setWriteDicts] = useState(props.writeDicts);
    const [readDicts, setReadDicts] = useState(props.readDicts);


    const rootPath = `/chainlettersstories/${userid}/`;


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
            <UserContext.Provider value={userid}>
                <Routes>
                    <Route path={rootPath} element={<UniversalHeader displayname={displayname} />}>
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
            </UserContext.Provider>
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

    let arrayOfStoryIDs = props.dicts.map(dict => dict.id);

    const addNewStory = (storyID) => props.setDicts(storyID, props.readOrWrite, "add");

    return (
        <div className={props.readOrWrite + "-dashboard-container"}>
            <Sidebar readOrWrite={props.readOrWrite} addNewStory={addNewStory} />

            <nav className="tabs">
                {arrayOfStoryIDs.map((storyID, index) =>
                    <Link to={storyID + "/"} key={index + storyID}>
                        <button className="story-tab-button"
                            onClick={() => console.log("link button clicked", storyID)}
                        >{index}</button>
                    </Link>
                )}
            </nav>
            <Outlet />
        </div >
    )

}

function Sidebar(props) {

    switch (props.readOrWrite) {
        case "write":
            return (
                <div className="sidebar">
                    {/* <NewButton addNewStory={props.addNewStory} />
                    <JoinButton addNewStory={props.addNewStory} /> */}
                    <ModalNewButton addNewStory={props.addNewStory} />
                    <ModalButton addNewStory={props.addNewStory} />
                </div>
            )
        default:
            return (
                <div className="sidebar">
                    <NewModerationButton addNewStory={props.addNewStory} />
                </div>
            )
    }
}


function Story(props) {

    const { storyID } = useParams();

    function getStoryByID(storyDictArray, id) {
        const idMatch = (storyDict) => storyDict.id == id;
        return storyDictArray.find(idMatch);
    }
    console.log(props.dicts, storyID);
    let storyDict = getStoryByID(props.dicts, storyID);

    console.log(storyDict);
    let readOrWrite = props.readOrWrite;
    let storySoFar = storyDict.sectiontrace.slice(0, -1);
    let presavedCurrentContent = storyDict.sectiontrace.slice(-1);

    const [currentContent, setCurrentContent] = useState(presavedCurrentContent.earliersectioncontent);

    function handleChange(e) {
        setCurrentContent(e.target.value);
    }

    const removeCurrentStory = (storyDict) => props.setDicts(storyDict, readOrWrite, "remove");


    let storySoFarElement = storySoFar.map(sectionDict =>
        <textarea readOnly key={sectionDict.earliersectionid} value={sectionDict.earliersectioncontent}></ textarea>
    )

    let currentSectionElement = <input type="text" value={currentContent} onChange={handleChange}></input>

    return (
        <div className="writeStoryContainer" id={"writeStoryContainer" + { storyID }}>
            Hello!
            {storySoFarElement}
            {currentSectionElement}
            <SubmissionButtons readOrWrite={readOrWrite} currentContent={currentContent} sectionid={storyID} removeCurrentStory={removeCurrentStory} />
            <Comments />
        </div>
    )
}

function SubmissionButtons(props) {

    // console.log(props.passRef);
    return (
        <div className="submit-buttons-container">
            <SubmissionButton currentContent={props.currentContent} submissionType="SAVE" sectionid={props.sectionid} removeCurrentStory={props.removeCurrentStory} />
            <SubmissionButton currentContent={props.currentContent} submissionType="SUBMIT" sectionid={props.sectionid} removeCurrentStory={props.removeCurrentStory} />
            <SubmissionButton currentContent={props.currentContent} submissionType="ABANDON" sectionid={props.sectionid} removeCurrentStory={props.removeCurrentStory} />
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

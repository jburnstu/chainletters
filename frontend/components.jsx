
import React, { StrictMode, useState, authoref, useEffect, createContext, useContext } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Outlet, NavLink, useParams, useOutletContext, useOutlet, useNavigate } from 'react-router-dom';
import { SubmissionButton, ModalSelectSegmentFromOptionsButton, ModalNewButton } from './storyButtons.jsx';
import { AuthorContext, DictsContext } from "./context.jsx";
import { AuthorProfile, AuthorListDisplayButton } from "./authorProfileComponents.jsx";
import { Comments } from "./comments.jsx";
import { getArrayObjByID } from "./utilityFuncs";


function AppByAuthor(props) {


    const [authorID, setAuthorID] = useState(props.authorID);
    const [displayName, setDisplayName] = useState(props.displayName);
    const [writeDicts, setWriteDicts] = useState(props.writeDicts);
    const [readDicts, setReadDicts] = useState(props.readDicts);

    const [authorDicts, setAuthorDicts] = useState([]);



    const rootPath = `/chainlettersstories/${authorID}/`;


    const startingReadOrWrite = props.startingURLDict.read_or_write;
    let startingStoryID = props.startingURLDict.story_id;
    // console.log(startingReadOrWrite, typeof (startingReadOrWrite))
    // console.log(getArrayObjByID(writeDicts, startingStoryID));

    let startingURL;
    if (startingReadOrWrite == null) {
        startingURL = "";
    }
    else if (
        (startingReadOrWrite == "write" &&
            getArrayObjByID(writeDicts, startingStoryID) == undefined)
        ||
        (startingReadOrWrite == "read" &&
            getArrayObjByID(readDicts, startingStoryID) == undefined)
    ) {
        startingURL = `${startingReadOrWrite}`;
    }
    else {
        startingURL = `${startingReadOrWrite}/${startingStoryID}`;
    }
    // console.log(startingURL);



    async function changeStoryDicts(storyDict, readOrWrite = "write", addOrRemove = "add") {

        let dictArrayToChange, setFunction;

        switch (readOrWrite) {
            case "write":
                dictArrayToChange = writeDicts;
                setFunction = setWriteDicts;
                break;
            case "read":
                dictArrayToChange = readDicts;
                setFunction = setReadDicts;
                break;
            case "author":
                dictArrayToChange = authorDicts;
                setFunction = setAuthorDicts;
                break;
        }

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
        setFunction(newDictArray, function () {
            if (newDictArray == dictArrayToChange) {
                console.warn("WARNING: ", storyDict, " was not successfully added to / removed from ", dictArrayToChange)
            }
            else { console.log("Successfully changed ", dictArrayToChange, " to ", dictArrayToChange, "via", newDictArray) };

            return dictArrayToChange;
        }
        )
    }


    return (
        <StrictMode>
            <BrowserRouter>
                <AuthorContext.Provider value={authorID}>
                    <Routes>
                        <Route path={rootPath} element={<UniversalHeader displayName={displayName} />}>
                            <Route path="" relative element={<Home startingURL={startingURL} />}
                                index />
                            <Route path="write/" element={<Dashboard readOrWrite="write" dicts={writeDicts} setDicts={changeStoryDicts} />}
                            >
                                <Route path=":storyID/"
                                    element={<Story readOrWrite="write" dicts={writeDicts} setDicts={changeStoryDicts} />}
                                />
                            </Route>
                            <Route path="read/" element={<Dashboard readOrWrite="read" dicts={readDicts}
                                setDicts={changeStoryDicts} />}
                            >
                                <Route path=":storyID/"
                                    element={<Story readOrWrite="read" dicts={readDicts} setDicts={changeStoryDicts} />}
                                />
                            </Route>
                            <Route path="author/"
                                element={<Dashboard readOrWrite="author" dicts={authorDicts} setDicts={changeStoryDicts}
                                />}
                            >
                                <Route path=":tabID/"
                                    element={<AuthorProfile readOrWrite="author" dicts={authorDicts} setDicts={changeStoryDicts} />} />
                            </Route>
                        </Route>
                        <Route path="*" element={<NoMatch />} />
                    </Routes>
                </AuthorContext.Provider>
            </BrowserRouter>
        </StrictMode >
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

    let navigate = useNavigate();

    useEffect(() => {
        console.log("initital navigate")
        navigate(props.startingURL);
    }, [navigate])

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
                    <Link to="author"><button type="button">AUTHORS</button></Link>
                </nav>
            </header >
            <Outlet></Outlet>
        </>
    )
}



function Dashboard(props) {

    let arrayOfTabIDs = props.dicts.map(dict => dict.id);
    const addNewTab = (tabID) => props.setDicts(tabID, props.readOrWrite, "add");
    let getTabName;
    let presavedCurrentContentByStory = {};

    if (props.readOrWrite == "author") {
        console.log(props.dicts)
        getTabName = (id, index) =>
            getArrayObjByID(props.dicts, id).display_name ?? `${index}.`
    }
    else {
        getTabName = (id, index) =>
            getArrayObjByID(props.dicts, id).story_data.title ?? index + " .";

        props.dicts.forEach(dictInArray => {
            presavedCurrentContentByStory[dictInArray.id] =
                dictInArray.segment_trace.slice(-1)[0]["earlier_segment_content"];
        })

    }

    const [currentContentByStory, setCurrentContentByStory] = useState(presavedCurrentContentByStory);
    const outlet = useOutlet([currentContentByStory, setCurrentContentByStory]);

    return (
        <div className={props.readOrWrite + "DashboardContainer" + " dashboardContainer"}>
            <Sidebar readOrWrite={props.readOrWrite} addNewTab={addNewTab} />
            <nav className="tabs">
                {arrayOfTabIDs.map((tabID, index) =>
                    <Link to={tabID + "/"} key={index + tabID} className="tabLink">
                        <button className="tabButton">{getTabName(tabID, index)}</button>
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
        case "author":
            return (
                <div className="sidebar">
                    <AuthorListDisplayButton addAuthorTab={props.addNewTab} />
                </div>
            )
        case "write":
            return (
                <div className="sidebar">
                    <ModalNewButton addNewStory={props.addNewTab} />
                    <ModalSelectSegmentFromOptionsButton type="JOIN" addNewStory={props.addNewTab} />
                </div>
            )
        case "read":
        default:
            return (
                <div className="sidebar">
                    <ModalSelectSegmentFromOptionsButton type="MODERATE" addNewStory={props.addNewTab} />
                </div>
            )
    }
}


function Story(props) {

    let readOrWrite = props.readOrWrite;
    const { storyID } = useParams();
    const [wordCount, setWordCount] = useState(0);
    const [currentContentByStory, setCurrentContentByStory] = useOutletContext();


    let storyDict = getArrayObjByID(props.dicts, storyID);
    let presavedCurrentContent = storyDict.segment_trace.slice(-1)[0]["earlier_segment_content"];
    let currentContent = currentContentByStory[storyID];

    let noSelections = {};
    storyDict.segment_trace.forEach(dictInArray =>
        noSelections[dictInArray["earlier_segment_id"]] = false)
    const [selectedSegmentDict, setSelectedSegmentDict] = useState(noSelections);

    // console.log(storyDict);

    function changeSegmentSelection(segmentID) {
        setSelectedSegmentDict({ ...selectedSegmentDict, [segmentID]: !selectedSegmentDict[segmentID] })
    }

    function handleChange(e) {
        setCurrentContentByStory({ ...currentContentByStory, [storyID]: e.target.value });
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
        <div>{"Section : " + length + (storyData.max_number_of_segments ? " / " + storyData.max_number_of_segments : null)}</div>
        <div>{"Word Count :" + props.wordCount + (storyData.max_segment_length ? " / " + storyData.max_segment_length : null)}</div>
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
const STARTINGURLDICT = JSON.parse(document.getElementById('starting_url_dict').textContent);

createRoot(document.getElementById('myAppContainer')).render(
    <AppByAuthor authorID={AUTHORID} displayName={DISPLAYNAME} readDicts={READDICTS} writeDicts={WRITEDICTS} startingURLDict={STARTINGURLDICT} />
);


document.querySelectorAll("textarea").forEach(function (textarea) {
    textarea.style.height = textarea.scrollHeight + "px";
    textarea.style.overflowY = "hidden";

    textarea.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    });
});
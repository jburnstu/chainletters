
import React, { useState, useEffect, useContext } from "react";
import { createPortal } from 'react-dom';
export default { SubmissionButton, ModalNewButton, ModalJoinButton, NewModerationModalButton };
import { AuthorContext } from "./context.jsx";
import { useNavigate, useLocation, redirect } from "react-router";

function getRandomItem(array, numberOfResults = 1, arrayOfOne = false) {
    console.log("started getRandomItem");
    if ((numberOfResults == 1 || array.length == 1) && !(arrayOfOne)) {
        return array[Math.floor(Math.random() * array.length)];
    }

    let set = new Set();
    while (set.size < numberOfResults && set.size < array.length) {
        console.log("Inside the while");
        var randomIndex = Math.floor(Math.random() * array.length);
        set.add(randomIndex);
    }
    let randomIndexArray = Array.from(set);
    console.log("finished getrandomitem");

    return randomIndexArray.map(index => array[index]);
}

async function contactAPI(urlTarget, method, bodyDict = {}) {

    const urlStub = "http://127.0.0.1:8000/api/";
    let fetchData;
    switch (method) {
        case "get":
            fetchData = {
                method: method
            }
            break;
        default:
            fetchData = {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyDict)
            }
    }

    let response = await fetch(`${urlStub}${urlTarget}`,
        fetchData
    )

    if ((method == "get" && response.status != 200) || !response.ok) {
        console.log("HTTP Error ", response.status, "at url ", `${urlStub}${urlTarget}`);
        return {};
    }

    return response.json();
};


async function uploadNewSegment(previousSegmentID, authorID) {
    let updatePreviousSegmentData = await contactAPI(`segment/${previousSegmentID}/`,
        "patch",
        { 'segmentstatusid': 5 }
    );

    let createSegmentData = await contactAPI("segment/",
        "post",
        {
            'storyid': updatePreviousSegmentData.storyid,
            'authorid': authorID,
            'segmentstatusid': 1,
            'previoussegmentid': previousSegmentID
        }
    );

    let getNewSegmentTraceData = await contactAPI(`segmenttrace/${createSegmentData.id}`, "get");
    console.log(getNewSegmentTraceData);
    return getNewSegmentTraceData;
}

async function uploadNewStoryAndSegment(authorid, storyParameters) {

    let storyCreationData = await contactAPI("story/", "post",
        {
            'authorid': authorid,
            ...storyParameters
        }
    )

    let segmentCreationData = await contactAPI("segment/", "post",
        {
            'storyid': storyCreationData.id,
            'authorid': authorid,
            'segmentstatusid': 1,
        }
    )
    return segmentCreationData;

}

async function uploadNewModerationAssignment(previoussegmentid, authorid) {

    let updateSegmentStatusData = await contactAPI("segment/", "patch",
        { "segmentstatusid": 3 }
    )

    let moderationAssignmentCreationData = await contactAPI("moderationassignment/", "post",
        {
            'segmentid': previoussegmentid,
            'authorid': authorid
        }
    )
    return moderationAssignmentCreationData;
}


export function ModalNewButton(props) {
    const authorid = useContext(AuthorContext);

    const [isOpen, setIsOpen] = useState(false);
    function createModal() {
        setIsOpen(true);
    }

    return (
        <>
            <button onClick={createModal}> ModalNew
            </ button >
            <ModalWindow isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="allDisplayStoriesContainer">
                    <NewStoryOptionspanel addNewStory={props.addNewStory} />
                </div>
            </ModalWindow >
        </>
    )
}

export function NewStoryOptionspanel(props) {
    const authorid = useContext(AuthorContext);

    const [storyParameters, setStoryParameters] = useState({});
    const [parameterChecks, setParameterChecks] = useState({});

    const handleValueChange = (e) => {
        const name = e.target.name;
        const value = (e.target.type == "checkbox") ? e.target.checked : e.target.value;
        setStoryParameters(values => ({ ...values, [name]: value }))
    }

    const handleCheckChange = (e) => {
        const name = e.target.name;
        const checked = e.target.checked;
        setParameterChecks(values => ({ ...values, [name]: checked }))
    }

    function createNewStoryAndSegment() {
        uploadNewStoryAndSegment(authorid, storyParameters)
            .then(function (value) {
                props.addNewStory(value);
            }
            )
    }

    return (
        <form>
            <fieldset>
                <input type="text" name="storyTitle"
                    value={storyParameters.storyTitle}
                    defaultValue="Title"
                    onChange={handleValueChange}></input >
                <label>Min. Segment Length
                    <input label="Min. Segment Length" type="checkbox" name="checkMinSegmentLength"
                        checked={parameterChecks.checkMinSegmentLength}
                        onChange={handleCheckChange}>
                    </input>
                    <input defaultValue="200" type="number" name="minSegmentLength"
                        disabled={!parameterChecks.checkMinSegmentLength}
                        value={storyParameters.minSegmentLength}
                        onChange={handleValueChange}>
                    </input>Words
                </label>
                <label>Max. Segment Length<input type="checkbox" name="checkMaxSegmentLength"
                    checked={storyParameters.checkMaxSegmentLength}
                    onChange={handleCheckChange}></input>
                    <input defaultValue="200" type="number" name="maxSegmentLength"
                        value={storyParameters.maxSegmentLength}
                        disabled={!parameterChecks.checkMaxSegmentLength}
                        onChange={handleValueChange}></input>
                    Words</label>
                <label >Max. Number of Segments?<input type="checkbox" name="checkMaxNumberOfSegments"
                    checked={storyParameters.checkMaxNumberOfSegments}
                    onChange={handleCheckChange}></input>
                    <input defaultValue="200" type="number" name="maxNumberOfSegments"
                        value={storyParameters.maxNumberOfSegments}
                        disabled={!parameterChecks.checkMaxNumberOfSegments}
                        onChange={handleValueChange}></input>
                    Segments</label>
                <label>Max. Number of Branches?<input type="checkbox" name="checkMaxNumberOfBranches"
                    checked={storyParameters.checkMaxNumberOfBranches}
                    onChange={handleCheckChange}></input>
                    <input defaultValue="200" type="number" name="maxNumberOfBranches"
                        disabled={!parameterChecks.checkMaxNumberOfBranches}
                        value={storyParameters.maxNumberOfBranches}
                        onChange={handleValueChange}></input>
                    Branches</label>
                <label>Mature<input type="checkbox"
                    checked="isItMature"
                    onChange={handleValueChange}></input>
                </label>
            </fieldset>
            <button type="submit" onClick={createNewStoryAndSegment}>CREATE NEW STORY</button>
        </form >
    )
}


export function SubmissionButton(props) {
    let navigate = useNavigate();
    let location = useLocation();

    let segmentstatusid;
    switch (props.submissionType) {
        case "SAVE":
            segmentstatusid = 1;
            break;
        case "SUBMIT":
            segmentstatusid = 2;
            break;
        case "APPROVE":
            segmentstatusid = 4;
            break;
        case "ABANDON":
            segmentstatusid = 6;
            break;
    }

    async function handleSubmit(e) {

        let getNewSegmentTraceData = await contactAPI(`segmenttrace/${props.segmentid}/`, "get");

        console.log(getNewSegmentTraceData);
        if (props.submissionType != "SAVE") {
            props.removeCurrentStory(getNewSegmentTraceData);
        }

        let currentContent = (typeof (props.currentContent) == "undefined") ? "" : props.currentContent;

        contactAPI(`segment/${props.segmentid}/`, "patch",
            {
                'segmentstatusid': segmentstatusid,
                'content': currentContent
            }
        )
            .then(
                function (value) {
                    if (props.submissionType == "ABANDON") {
                        if (value.previoussegmentid != null) {
                            console.log("second conditional!");
                            contactAPI(`segment/${value.previoussegmentid}/`, "patch",
                                {
                                    'segmentstatusid': 4
                                }
                            )
                        }
                        console.log(location.pathname);
                        return redirect('/write');
                    }
                })
    }

    return (
        <button onClick={handleSubmit}>{props.submissionType}</button>
    )
}


export function ModalJoinButton(props) {
    const authorid = useContext(AuthorContext);
    const storiesInModal = 3;

    async function getSegmentsForModal() {
        let availabilityData = await contactAPI(`authorincludingavailability/${authorid}/`, "get")
        let randomSegmentIDArray = await getRandomItem(availabilityData.availablesegment, storiesInModal);
        let segmentTraceDataArray = [];
        let segmentTraceData;
        await Promise.all(randomSegmentIDArray.map(async (segmentID) => {
            segmentTraceData = await contactAPI(`segmenttrace/${segmentID}`, "get");
            segmentTraceDataArray.push(segmentTraceData);
        }
        )
        )
        await setArrayOfAvailableStories(segmentTraceDataArray);
        return segmentTraceDataArray;
    }


    const [isOpen, setIsOpen] = useState(false);

    const [arrayOfAvailableStories, setArrayOfAvailableStories] = useState([]);

    console.log(arrayOfAvailableStories);

    function createModal() {
        getSegmentsForModal()
            .then(function (value) {
                setIsOpen(true);
            })

    }

    function selectStory(previoussegmentid) {
        setIsOpen(false);
        uploadNewSegment(previoussegmentid, authorid)
            .then(function (value) { props.addNewStory(value) });
    }

    useEffect(() => console.log("STATESET"));

    return (
        <>
            <button onClick={createModal}> ModalJoin
            </ button >
            <ModalWindow isOpen={isOpen} arrayOfStoryOptions={arrayOfAvailableStories} onClose={() => setIsOpen(false)}>
                <div className="allDisplayStoriesContainer">
                    {arrayOfAvailableStories.map(availableStory =>
                        <StoryDisplayInModal key={availableStory.id} selectStory={selectStory} storyDict={availableStory} />
                    )}
                </div>
            </ModalWindow >
        </>
    )
}

function StoryDisplayInModal(props) {
    console.log(props.storyDict);
    let firstSegment = props.storyDict.segmenttrace[0]
    let finalSegment = props.storyDict.segmenttrace.slice(-1)[0]
    finalSegment = (finalSegment == firstSegment) ? null : finalSegment



    const selectStory = () => props.selectStory(finalSegment.earlier_segmentid);

    return (
        <button onClick={selectStory} className="displayStoryContainer">
            <textarea value={firstSegment.earlier_segment_content} readOnly />
            {(finalSegment != null) ? <textarea value={finalSegment.earlier_segment_content} readOnly /> : null}
        </button>
    )
}

function ModalWindow(props) {

    if (!(props.isOpen)) return null;

    return (
        createPortal(
            <div className="modalPortal">
                {props.children}
                <div className="modalButtonContainer">
                    <button onClick={props.onClose}>Close</button>
                </div>
            </div>,
            document.body
        )
    )
}


export function NewModerationModalButton(props) {
    const authorid = useContext(AuthorContext);
    const storiesInModal = 3;

    async function getSegmentsForModal() {
        let moderatabilityData = await contactAPI(`authorincludingavailability/${authorid}/`, "get");
        let randomSegmentIDArray = await getRandomItem(moderatabilityData.moderatablesegment, storiesInModal);
        let segmentTraceDataArray = [];
        let segmentTraceData;
        await Promise.all(randomSegmentIDArray.map(async (segmentID) => {
            segmentTraceData = await contactAPI(`segmenttrace/${segmentID}`, "get");
            segmentTraceDataArray.push(segmentTraceData);
        }
        )
        )
        await setArrayOfModeratableStories(segmentTraceDataArray);
        return segmentTraceDataArray;
    }


    const [isOpen, setIsOpen] = useState(false);

    const [arrayOfModeratableStories, setArrayOfModeratableStories] = useState([]);

    console.log(arrayOfModeratableStories);

    function createModal() {
        getSegmentsForModal()
            .then(function (value) {
                setIsOpen(true);
            })

    }

    function selectStory(previoussegmentid) {
        setIsOpen(false);
        uploadNewModerationAssignment(previoussegmentid, authorid)
            .then(function (value) { props.addNewStory(value) });
    }

    return (
        <>
            <button onClick={createModal}> ModalNewModeration
            </ button >
            <ModalWindow isOpen={isOpen} arrayOfStoryOptions={arrayOfModeratableStories} onClose={() => setIsOpen(false)}>
                <div className="allDisplayStoriesContainer">
                    {arrayOfModeratableStories.map(moderatableStory =>
                        <NewModerationOptionsPanel key={moderatableStory.id} selectStory={selectStory} storyDict={moderatableStory} />
                    )}
                </div>
            </ModalWindow >
        </>
    )
}

function NewModerationOptionsPanel(props) {
    let firstSegment = props.storyDict.segmenttrace[0]
    let finalSegment = props.storyDict.segmenttrace.slice(-1)[0]
    finalSegment = (finalSegment == firstSegment) ? null : finalSegment

    const selectStory = () => props.selectStory(finalSegment.earlier_segmentid);

    return (
        <button onClick={selectStory} className="displayStoryContainer">
            <textarea value={firstSegment.earlier_segment_content} readOnly />
            {(finalSegment != null) ? <textarea value={finalSegment.earlier_segment_content} readOnly /> : null}
        </button>
    )
}
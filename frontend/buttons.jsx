
import React, { useState, useEffect, useContext } from "react";
import { createPortal } from 'react-dom';
export default { SubmissionButton, ModalNewButton, ModalJoinButton, NewModerationModalButton };
import { AuthorContext } from "./context.jsx";
import { useNavigate, useLocation, redirect } from "react-router";
import { getRandomItem, contactAPI } from "./utilityFuncs.jsx";


async function uploadNewSegment(previousSegmentID, authorID) {


    let updatePreviousSegmentData = await contactAPI(`segment/${previousSegmentID}/`,
        "patch",
        { 'segment_status_id': 5 }
    );

    await console.log(updatePreviousSegmentData);
    let createSegmentData = await contactAPI("segment/",
        "post",
        {
            'story': updatePreviousSegmentData.story,
            'author': authorID,
            'segment_status': 1,
            'previous_segment': previousSegmentID
        }
    );

    let getNewFullStoryInfoData = await contactAPI(`full_story_info/${createSegmentData.id}`, "get");
    console.log("FULL STORY INFO", getNewFullStoryInfoData)

    return getNewFullStoryInfoData
}

async function uploadNewStoryAndSegment(authorID, storyParameters) {

    console.log("calling uploadNewStoryAndSegment")
    console.log(storyParameters)

    contactAPI(`story/2`, "get")
        .then(function (value) { console.log("storyGet, ", value) })


    let storyCreationData = await contactAPI("story/", "post",
        {
            'author': authorID,
            ...storyParameters
        }
    )

    let createSegmentData = await contactAPI("segment/", "post",
        {
            'story': storyCreationData.id,
            'author': authorID,
            'segment_status': 1,
        }
    )
    let getNewFullStoryInfoData = await contactAPI(`full_story_info/${createSegmentData.id}`, "get");

    return getNewFullStoryInfoData

}

async function uploadNewModerationAssignment(previousSegmentID, authorID) {

    let updateSegmentStatusData = await contactAPI("segment/", "patch",
        { "segment_status_": 3 }
    )

    let moderationAssignmentCreationData = await contactAPI("moderation_assignment/", "post",
        {
            'segment': previousSegmentID,
            'author': authorID
        }
    )
    return moderationAssignmentCreationData;
}

export function ModalNewButton(props) {


    const [isOpen, setIsOpen] = useState(false);

    function createModal() {
        setIsOpen(true);
        console.log("modal clicked")
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

function NewStoryOptionspanel(props) {
    const authorID = useContext(AuthorContext);

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
        console.log("Creating new story/seg");
        uploadNewStoryAndSegment(authorID, storyParameters)
            .then(function (value) {
                console.log("inside then function", value)
                props.addNewStory(value);
            }
            )
    }

    return (
        <form>
            <fieldset className="newStoryModalFieldset">
                <input type="text" name="title"
                    value={storyParameters.storyTitle}
                    defaultValue="Title"
                    onChange={handleValueChange}></input >
                <label>Min. Segment Length
                    <input label="Min. Segment Length" type="checkbox" name="checkMinSegmentLength"
                        checked={parameterChecks.checkMinSegmentLength}
                        onChange={handleCheckChange}>
                    </input>
                    <input defaultValue="200" type="number" name="min_segment_length"
                        disabled={!parameterChecks.checkMinSegmentLength}
                        value={storyParameters.minSegmentLength}
                        onChange={handleValueChange}>
                    </input>Words
                </label>
                <label>Max. Segment Length<input type="checkbox" name="checkMaxSegmentLength"
                    checked={storyParameters.checkMaxSegmentLength}
                    onChange={handleCheckChange}></input>
                    <input defaultValue="200" type="number" name="max_segment_length"
                        value={storyParameters.max_segment_length}
                        disabled={!parameterChecks.checkMaxSegmentLength}
                        onChange={handleValueChange}></input>
                    Words</label>
                <label >Max. Number of Segments?<input type="checkbox" name="checkMaxNumberOfSegments"
                    checked={storyParameters.checkMaxNumberOfSegments}
                    onChange={handleCheckChange}></input>
                    <input defaultValue="200" type="number" name="max_number_of_segments"
                        value={storyParameters.max_number_of_segments}
                        disabled={!parameterChecks.checkMaxNumberOfSegments}
                        onChange={handleValueChange}></input>
                    Segments</label>
                <label>Max. Number of Branches?<input type="checkbox" name="checkMaxNumberOfBranches"
                    checked={storyParameters.checkMaxNumberOfBranches}
                    onChange={handleCheckChange}></input>
                    <input defaultValue="200" type="number" name="max_number_of_branches"
                        disabled={!parameterChecks.checkMaxNumberOfBranches}
                        value={storyParameters.max_number_of_branches}
                        onChange={handleValueChange}></input>
                    Branches</label>
                <label>Mature<input type="checkbox"
                    name="is_it_mature"
                    checked={storyParameters.is_it_mature}
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

    let segmentStatusID;
    switch (props.submissionType) {
        case "SAVE":
            segmentStatusID = 1;
            break;
        case "SUBMIT":
            segmentStatusID = 2;
            break;
        case "APPROVE":
            segmentStatusID = 4;
            break;
        case "ABANDON":
            segmentStatusID = 6;
            break;
    }

    async function handleSubmit(e) {
        console.log(props.segmentID);
        let getNewFullStoryInfoData = await contactAPI(`full_story_info/${props.segmentID}`, "get");

        if (props.submissionType != "SAVE") {
            props.removeCurrentStory(getNewFullStoryInfoData);
        }

        let currentContent = (typeof (props.currentContent) == "undefined") ? "" : props.currentContent;

        contactAPI(`segment/${props.segmentID}/`, "patch",
            {
                'segment_status': segmentStatusID,
                'content': currentContent
            }
        )
            .then(
                function (value) {
                    if (props.submissionType == "ABANDON") {
                        if (value.previous_segment_id != null) {
                            console.log("second conditional!");
                            contactAPI(`segment/${value.previous_segment_id}/`, "patch",
                                {
                                    'segment_status': 4
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
    const authorID = useContext(AuthorContext);
    const storiesInModal = 3;

    async function getSegmentsForModal() {
        let availabilityData = await contactAPI(`author_including_availability/${authorID}/`, "get")
        let randomSegmentIDArray = await getRandomItem(availabilityData.available_segments, storiesInModal);

        let segmentTraceDataArray = [];
        let segmentTraceData;
        await Promise.all(randomSegmentIDArray.map(async (segmentID) => {
            segmentTraceData = await contactAPI(`segment_trace/${segmentID}`, "get");
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

    function selectStory(previousSegmentID) {
        setIsOpen(false);
        uploadNewSegment(previousSegmentID, authorID)
            .then(function (value) {
                console.log(value);
                props.addNewStory(value);
            });
    }

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
    let firstSegment = props.storyDict.segment_trace[0]
    let finalSegment = props.storyDict.segment_trace.slice(-1)[0]
    finalSegment = (finalSegment == firstSegment) ? null : finalSegment



    const selectStory = () => props.selectStory(finalSegment.earlier_segment_id);

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
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
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
    const authorID = useContext(AuthorContext);
    const storiesInModal = 3;

    async function getSegmentsForModal() {
        let moderatabilityData = await contactAPI(`author_including_availability/${authorID}/`, "get");
        let randomSegmentIDArray = await getRandomItem(moderatabilityData.moderatable_segments, storiesInModal);
        let segmentTraceDataArray = [];
        let segmentTraceData;
        await Promise.all(randomSegmentIDArray.map(async (segmentID) => {
            segmentTraceData = await contactAPI(`segment_trace/${segmentID}`, "get");
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

    function selectStory(previousSegmentID) {
        setIsOpen(false);
        uploadNewModerationAssignment(previousSegmentID, authorID)
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
    let firstSegment = props.storyDict.segment_trace[0]
    let finalSegment = props.storyDict.segment_trace.slice(-1)[0]
    finalSegment = (finalSegment == firstSegment) ? null : finalSegment

    const selectStory = () => props.selectStory(finalSegment.earlier_segment_id);

    return (
        <button onClick={selectStory} className="displayStoryContainer">
            <textarea value={firstSegment.earlier_segment_content} readOnly />
            {(finalSegment != null) ? <textarea value={finalSegment.earlier_segment_content} readOnly /> : null}
        </button>
    )
}
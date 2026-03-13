export function JoinButton(props) {
    const author_id = useContext(AuthorContext);


    async function handleSubmit(e) {

        let availabilityData = await contactAPI(`authorincludingavailability/${author_id}/`,
            "get");

        let randomSegmentID = await getRandomItem(availabilityData.availablesegment);
        let updatePreviousSegmentData = await contactAPI(`segment/${randomSegmentID}/`,
            "patch",
            { 'segmentstatusid': 5 }
        );

        let createSegmentData = await contactAPI("segment/",
            "post",
            {
                'storyid': updatePreviousSegmentData.storyid,
                'author_id': author_id,
                'segmentstatusid': 1,
                'previoussegmentid': randomSegmentID
            }
        );

        let getNewSegmentTraceData = await contactAPI(`segment_trace/${createSegmentData.id}`, "get");
        console.log(getNewSegmentTraceData);
        props.addNewStory(getNewSegmentTraceData);
    }

    return (
        <button onClick={handleSubmit}>JOIN</button>
    )
}

export function NewButton(props) {
    const author_id = useContext(AuthorContext);

    async function handleSubmit(e) {

        let storyCreationData = await contactAPI("story/", "post",
            {
                'author_id': author_id
            }
        )

        let segmentCreationData = await contactAPI("segment/", "post",
            {
                'storyid': storyCreationData.id,
                'author_id': author_id,
                'segmentstatusid': 1,
            }
        )

        let newSegmentID = await segmentCreationData.id;
        console.log(newSegmentID);
        let newStoryDict = await {
            "id": newSegmentID, "segment_trace": [{ newSegmentID: "" }],
        }
        console.log("NEWSTORYDICT", newStoryDict);
        props.addNewStory(newStoryDict);
    }



    return (
        <button onClick={handleSubmit}>NEW</button>
    )
}
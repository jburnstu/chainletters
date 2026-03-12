export function JoinButton(props) {
    const authorid = useContext(AuthorContext);


    async function handleSubmit(e) {

        let availabilityData = await contactAPI(`authorincludingavailability/${authorid}/`,
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
                'authorid': authorid,
                'segmentstatusid': 1,
                'previoussegmentid': randomSegmentID
            }
        );

        let getNewSegmentTraceData = await contactAPI(`segmenttrace/${createSegmentData.id}`, "get");
        console.log(getNewSegmentTraceData);
        props.addNewStory(getNewSegmentTraceData);
    }

    return (
        <button onClick={handleSubmit}>JOIN</button>
    )
}

export function NewButton(props) {
    const authorid = useContext(AuthorContext);

    async function handleSubmit(e) {

        let storyCreationData = await contactAPI("story/", "post",
            {
                'authorid': authorid
            }
        )

        let segmentCreationData = await contactAPI("segment/", "post",
            {
                'storyid': storyCreationData.id,
                'authorid': authorid,
                'segmentstatusid': 1,
            }
        )

        let newSegmentID = await segmentCreationData.id;
        console.log(newSegmentID);
        let newStoryDict = await {
            "id": newSegmentID, "segmenttrace": [{ newSegmentID: "" }],
        }
        console.log("NEWSTORYDICT", newStoryDict);
        props.addNewStory(newStoryDict);
    }



    return (
        <button onClick={handleSubmit}>NEW</button>
    )
}
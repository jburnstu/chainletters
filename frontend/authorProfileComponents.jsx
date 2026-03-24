import { getRandomItem, contactAPI } from "./utilityFuncs";


export function AuthorProfile(props) {
    let readOrWrite = props.readOrWrite;
    const { tabID } = useParams();



    let storyDict = getArrayObjByID(props.dicts, storyID);
    let presavedCurrentContent = storyDict.segment_trace.slice(-1)[0]["earlier_segment_content"];
    let currentContent = currentContentByStory[storyID];

    async function getArrayOfRecentSegments() {
        const numberOfSegments = 3;
        segmentByAuthorData = await contactAPI(`segment_by_author/${authorID}/`, "get");
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

    const arrayOfRecentSegments = getArrayOfRecentSegments();

    const removeCurrentStory = (storyDict) => props.setDicts(storyDict, readOrWrite, "remove");


    return (
        <div className="authorProfileContainer" id={"authorProfileContainer" + { storyID }}>
            <StoryHeader storyDict={storyDict} wordCount={wordCount} />
        </div>
    )
}
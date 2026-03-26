import { getRandomItem, contactAPI } from "./utilityFuncs";

export default { AuthorProfile, AuthorListDisplayButton };

export function AuthorProfile(props) {

    let readOrWrite = props.readOrWrite;
    const { tabID } = useParams();

    let authorDict = getArrayObjByID(props.dicts, tabID);

    async function getArrayOfRecentSegmentTraces() {
        const numberOfSegments = 3;
        segmentByAuthorData = await contactAPI(`completed_segment_by_author/${authorDict.id}/`, "get");
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

    const arrayOfRecentSegmentTraces = getArrayOfRecentSegmentTraces();

    const removeCurrentStory = (storyDict) => props.setDicts(storyDict, readOrWrite, "remove");


    return (
        <div className="authorProfileContainer" id={"authorProfileContainer" + { storyID }}>
            <StoryHeader storyDict={storyDict} wordCount={wordCount} />
            <div className="recentSegmentsContainer">
                {getArrayOfRecentSegments.map(recentSegmentTrace =>
                    <RecentSegmentDisplay segmentTraceInfo={recentSegmentTrace} />)
                }
            </div>
            <div className="recentActivity"></div>
            {/* Comments, likes, reviews, etc? */}
        </div>
    )
}

function RecentSegmentDisplay() {

    let finalSegmentInfo = props.segmentTraceInfo.segment_trace.slice(-1)[0]
    let penultimateSegment = props.segmentTraceInfo.segment_trace.slice(-2)[0]

    return (
        <div>
            <textarea value={penultimateSegment.content}></textarea>
            <textarea value={finalSegment.content}></textarea>
        </div>
    )
}



export function AuthorListDisplayButton(props) {

    authorDicts = props.authorDicts

    const [threeMostRecentAuthors, setThreeMostRecentAuthors] = useState([])

    let arrayOfFriendDicts = contactAPI(`author_relation_by_author/${authorID}/`, "get");
    const [authorArray, setAuthorArray] = useState(arrayOfFriendDicts.related_authors)

    return (
        <div className="friendSearchContainer">
            {authorArray.map(authorDict =>
                <FriendProfileButton addAuthorTab={props.addAuthorTab} authorInfo={authorDict} />)}
        </div>
    )
}

function FriendProfileButton(props) {

    const onClick = () => { props.addAuthorTab(props.authorDict, "author", "add") }

    return (
        <button onClick={onClick}>
            {props.authorDict.display_name}
        </button>)
}


```
        So, regardless of backend, we still need frontend to have a "friends" dict.
        As not coming from the top, can put in the dashboard object *IF* we like

        [{authorID::,
        displayName::,

}]



        ```
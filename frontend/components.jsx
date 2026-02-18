
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Outlet, NavLink } from 'react-router-dom';

const slashFollowedByString = (myString) => "/" + myString;

function AppByUser(props) {

    let userid = props.userid;
    let displayname = props.displayname;
    let writeDicts = props.writeDicts;
    let readDicts = props.readDicts;
    let rootPath = `/chainlettersstories/${userid}/`;

    Object.keys(writeDicts).forEach(key =>
        console.log(key));


    return (

        <BrowserRouter>
            <Routes>
                <Route path={rootPath} element={<UniversalHeader displayname={displayname} />}>
                    <Route index path="" relative element={<Home />} />
                    <Route index path="write/" element={<Dashboard dashboardType="write" dicts={writeDicts} userid={userid} />}>
                        {Object.keys(writeDicts).forEach(key =>
                            <Route index path={key + "/"} key={key}
                                element={<Story type={"write"} dict={writeDicts[key]} />} />)}
                    </Route>
                    <Route index path="read/" element={<Dashboard dashboardType="read" dicts={readDicts} userid={userid} />}>
                        {Object.keys(readDicts).forEach(key =>
                            <Route index path={key + "/"} key={key}
                                element={<Story type={"read"} dict={readDicts[key]} />} />)}
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

    let arrayOfStoryIDs = Object.keys(props.dicts);

    arrayOfStoryIDs.forEach(storyID => console.log(storyID));

    return (
        <div className={props.dashboardType + "-dashboard-container"}>
            <Sidebar userid={props.userid} sidebarType={props.dashboardType} />

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

    switch (props.sidebarType) {
        case "write":
            return (
                <div className="sidebar">
                    <GetButton userid={props.userid} link='chainlettersstories:create_new_story' name="NEW" />
                    <GetButton userid={props.userid} link='chainlettersstories:get_random_available_section' name="JOIN" />
                </div>
            )
        default:
            return (
                <div className="sidebar">
                    <GetButton userid={props.userid} link='chainlettersstories:create_new_story' name="NEW" />
                    <GetButton userid={props.userid} link='chainlettersstories:get_random_available_section' name="JOIN" />
                </div>
            )
    }
}


function Story(props) {

    storyType = props.storyType

    let storySoFar = props.dict["previous"];
    let currentSection = props.dict["current"];

    storySoFarElement = storySoFar.map(storySection =>
        <textarea key={storySection.content}>{storySection.content}</ textarea>
    )


    currentSectionElement = <input>{currentSection}</input>

    return (
        <div className="writeStoryContainer" id="writeStoryContainer{currentSection}">
            {storySoFarElement}
            <SubmitButtons />
            <Comments />
        </div>
    )
}


function SubmitButtons(props) {

    return (
        <div className="submit-buttons-container">
            <PostButton userid={props.userid} link='chainlettersstories:create_new_story' name="SAVE" />
            <PostButton userid={props.userid} link='chainlettersstories:create_new_story' name="SUBMIT" />
            <PostButton userid={props.userid} link='chainlettersstories:create_new_story' name="ABANDON" />
        </div>
    )
}



function LinkButton(props) {
    return (
        <form action="{props.link} {props.userid}">
            <button type="submit">{props.name}</button>
        </form>
    )
}

function GetButton(props) {
    return (
        <form action="{props.link} {props.userid}">
            <button type="submit">{props.name}</button>
        </form>
    )
}

function PostButton(props) {
    return (
        <form action="{props.link} {props.userid}">
            <button type="submit">{props.name}</button>
        </form>
    )
}


const READ_DICTS = JSON.parse(document.getElementById('read-dicts').textContent);
const WRITE_DICTS = JSON.parse(document.getElementById('write-dicts').textContent);
const USERID = JSON.parse(document.getElementById('userid').textContent);
const DISPLAYNAME = JSON.parse(document.getElementById('displayname').textContent);
createRoot(document.getElementById('myappcontainer')).render(
    <AppByUser userid={USERID} displayname={DISPLAYNAME} readDicts={READ_DICTS} writeDicts={WRITE_DICTS} />
);



// console.log(document.getElementById('write-dicts'));
// console.log(WRITE_DICTS);
// console.log(USERID);
// console.log(DISPLAYNAME);
// console.dir(<AppByUser userid={USERID} displayname={DISPLAYNAME} readDicts={READ_DICTS} writeDicts={WRITE_DICTS} />)

// function Tabs(props) {

//     let stories = props.stories;
//     console.log(stories)

//     return (
//         <>
//             {stories.map((story, index) =>
//                 <Link to={story}>
//                     <button className="story-tab-button"
//                         key={story}
//                         id={'story-tab-button-' + story}>{index}</button>
//                 </Link>
//             )}
//         </>
//     )
// }

// function WriteStory(props) {

//     let storySoFar = props.dict["previous"];
//     let currentSection = props.dict["current"];

//     storySoFarElement = storySoFar.map(storySection =>
//         <textarea key={storySection.content}>{storySection.content}</ textarea>
//     )

//     currentSectionElement = <input>{currentSection}</input>

//     return (
//         <div className="writeStoryContainer" id="writeStoryContainer{currentSection}">
//             {storySoFarElement}
//             <SubmitButtons />
//             <Comments />
//         </div>
//     )
// }


// function WriteSidebar(props) {
//     return (
//         <div className="sidebar">
//             <GetButton userid={props.userid} link='chainlettersstories:create_new_story' name="NEW" />
//             <GetButton userid={props.userid} link='chainlettersstories:get_random_available_section' name="JOIN" />
//         </div>
//     )
// }

// function ReadSidebar(props) {
//     return (
//         <div className="sidebar">
//             <GetButton userid={props.userid} link='chainlettersstories:create_new_story' name="NEW FOR MODERATION" />
//         </div>
//     )
// }

// function StorySoFarSplitOut() {

//     storySoFar = [{ "sectionid": 12, "content": "First Section" },
//     { "sectionid": 13, "content": "Second Section" },
//     { "sectionid": 1, "content": "Third Section" },
//     { "sectionid": 9, "content": "Fourth Section" }
//     ] // list holding all the story sections, of format {"sectionid":sectionid, "content":content}

//     return storySoFar.map(storySection =>
//         <textarea key={storySection.sectionid}>{storySection.content}</ textarea>
//     )


// }



// function WriteDashboard(props) {

//     let arrayOfStoryIDs = Object.keys(props.dicts);

//     return (
//         <div className={props.dashboardType + "-dashboard-container"}>
//             <Sidebar userid={props.userid} sidebarType={props.dashboardType} />
//             <Tabs stories={Object.keys(props.dicts)} />

//             <div className="tabs">
//                 {stories.map((story, index) =>
//                     <Link to={story}>
//                         <button className="story-tab-button"
//                             key={story}
//                             id={'story-tab-button-' + story}>{index}</button>
//                     </Link>
//                 )}
//             </div>

//             <Outlet />
//         </div>
//     )

// }

// function ReadDashboard(props) {


//     return (
//         <div className="read-dashboard-container">
//             <ReadSidebar userid={props.userid} />
//             <Tabs stories={Object.keys(props.dicts)} />
//             <Outlet />
//         </div>
//     )
// }

// function ReadStory(props) { }


// <div class="container">
//     <header>
//         <h1>CHAIN MATES</h1>
//         <h1>Hi, {{ displayname }}!</h1>
//         <form action="{% url 'chainlettersstories:dashboard' userid %}">
//             <button type="submit">DASHBOARD</button>
//         </form>
//         <form action="{% url 'chainlettersstories:write_dashboard' userid %}">
//             <button type="submit">WRITE</button>
//         </form>
//         <form action="{% url 'chainlettersstories:read_dashboard' userid %}">
//             <button type="submit">READ</button>
//         </form>
//         <form action="{% url 'chainlettersstories:login_or_signup_page'%}">
//             <button type="submit">LOG OUT</button>
//         </form>
//     </header>

//     <div class="sidebar">
//         <form action="{% url 'chainlettersstories:create_new_story' userid %}">
//             <button type="submit">New</button>
//         </form>
//         <form action="{% url 'chainlettersstories:get_random_available_section' userid %}">
//             <button type="submit">Join</button>
//         </form>
//     </div>

//     <div class="tabs">
//         {% for story_dict in story_dicts %}
//         <button class="story-tab-button"
//             id="story-tab-button-{{forloop.counter}}">{{ forloop.counter }}</button>
//         {% endfor %}
//     </div>

//     {% for sectionid, story_dict in story_dicts.items %}
//     <div class="content-submissions-comments"
//         id="content-submissions-comments-{{forloop.counter}}">
//         <form class="content-submissions"
//             id="content-submissions-{{forloop.counter}}"
//             action="{% url 'chainlettersstories:submit_section_to_story' userid sectionid %}" method="post">
//             {% csrf_token %}
//             <input class="read-only-content"
//                 id="read-only-content-{{forloop.counter}}"
//                 type="text"
//                 value="{{story_dict.previous}}"
//                 readonly>
//                 <div id="react-read-only-content"></div>
//                 {% vite_asset 'assets/write_dashboard_components.jsx' %}
//                 <input class="input-content"
//                     id="input-content-{{forloop.counter}}"
//                     type="text"
//                     placeholder="Enter Story Here"
//                     name="content"
//                     value="{{story_dict.current}}">
//                     <div class="submissions">
//                         <button type="submit" name="save-or-submit" value="save">Save</button>
//                         <button type="submit" name="save-or-submit" value="submit">Submit</button>
//                         <button type="submit" name="save-or-submit" value="abandon">Abandon</button>
//                     </div>
//                 </form>
//                 <div class="comments">Hello</div>
//             </div>
//             {% endfor %}
//     </div>
// </div>
// </body >

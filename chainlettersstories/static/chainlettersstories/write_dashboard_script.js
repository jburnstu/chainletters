// const story_list = JSON.parse(document.getElementById('story-data').textContent);

const storiesHeaderPanel = document.querySelector(".stories-header-panel");
const storiesMainPanel = document.querySelector(".stories-main-panel");
const joinNewStoryButton = document.querySelector(".join-button");
const tabButtons = document.querySelectorAll("tab-button");

var stories;
var story_excluding_last_section;
var last_section;
var storyButtonHTML;
var storyTabHTML;
// var storiesHeaderPanel;
// var storiesMainPanel;

$(".story-tab-button").click(function () {
    $(".container-story-tab").hide();
    id = $(this).attr("id").slice(-1);
    thisPanelId = "#container-story-tab-" + id
    console.log(thisPanelId)
    console.log()
    $(thisPanelId).show();
}
)
// if (story_list) {
//     console.log("story_list found");


// }
console.log("page loaded");
// }




// const createStoryTabsAndButtons = function (stories) {
//     storiesHeaderPanel.innerHTML = '';
//     storiesMainPanel.innerHTML = '';

//     console.log(stories);
//     console.log(typeof (stories));

//     stories.forEach(function (story, i) {

//         story_excluding_last_section = story[1].slice(0, -1).join(" ");
//         last_section = story[1].slice(-1).join(" ");

//         console.log(last_section);
//         console.log(typeof (last_section))


//         storyButtonHTML = `
//         <button class="story-tab-button" id="story-tab-button-${i}">${i}</button>
//         `;

//         storyTabHTML = `
//         <div class="container-story-tab" id = "container-story-tab-${i}">
//             <div class="read-only-div" id="read-only-div-${i}">${story_excluding_last_section}.</div>
//             <form action= "????" method="post"
//                 <fieldset>
//                     <input class=section-input id="section-input-${i}"
//                     type="text" placeholder="Enter Story Here" name="content"
//                     value= "${last_section}">
//                 </fieldset>
//                 <input type="submit" value="Submit">
//             </form>
//         </div>
//         `;


//         storiesHeaderPanel.insertAdjacentHTML('afterbegin', storyButtonHTML);
//         storiesMainPanel.insertAdjacentHTML('afterbegin', storyTabHTML);
//     });

// }
// const story_list = JSON.parse(document.getElementById('story-data').textContent);

storiesHeaderPanel = document.querySelector(".stories-header-panel");
storiesMainPanel = document.querySelector(".stories-main-panel");
joinNewStoryButton = document.querySelector(".join-button");


var stories;
var story_excluding_last_section;
var last_section;
var storyButtonHTML;
var storyTabHTML;
// var storiesHeaderPanel;
// var storiesMainPanel;


const createStoryTabsAndButtons = function (stories) {
    storiesHeaderPanel.innerHTML = '';
    storiesMainPanel.innerHTML = '';

    console.log(stories);
    console.log(typeof (stories));

    stories.forEach(function (story, i) {

        story_excluding_last_section = story[1].slice(0, -1).join(" ");
        last_section = story[1].slice(-1).join(" ");

        console.log(last_section);
        console.log(typeof (last_section))


        storyButtonHTML = `
        <button class="story-tab-button" id="story-tab-button-${i}">${i}</button>
        `;

        storyTabHTML = `
        <div class="container-story-tab" id = "container-story-tab-${i}">
            <div class="read-only-div" id="read-only-div-${i}">${story_excluding_last_section}.</div> 
            <form action= "????" method="post"
                <fieldset>
                    <input class=section-input id="section-input-${i}" 
                    type="text" placeholder="Enter Story Here" name="content" 
                    value= "${last_section}"> 
                </fieldset>
                <input type="submit" value="Submit">
            </form>
        </div>
        `;


        storiesHeaderPanel.insertAdjacentHTML('afterbegin', storyButtonHTML);
        storiesMainPanel.insertAdjacentHTML('afterbegin', storyTabHTML);
    });

}




if (story_list) {
    console.log("story_list found");
    // createStoryTabsAndButtons(story_list);
    // $(".read-only-div").click(function () {
    //     $.post()
    // })

}
console.log("page loaded");
// }
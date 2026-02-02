

const writeButton = document.querySelector(".write-button");
const sectionInput = document.querySelector(".");

const containerStories = document.querySelector(".stories");



let arrayStories;


function loadStoryFromLatestSection(target) {
    $.ajax("get",

}


function

    writeButton.addEventListener("click", function () {
        document.getElementById("").innerHTML = new HTML
    });

let writeTabHTMLObject;

function onPageLoaded() {
    // Write your javascript code here

    console.log("page loaded");
}

const displayStories = function (stories) {
    containerStories.innerHTML = '';

    stories.forEach(function (story, i) {


        html = `
        <div class="read-only-div" id="read-only-div-${i}">Please load a story.</div> 
            <form action="{% url "chainlettersstories:submit_story_to_section"  %}" method="post"> 
            <fieldset>
                <input class=section-input id="section-input-${i}" type="text" placeholder="Enter Story Here." name="content"> 
                </fieldset>
            <input type="submit" value="Submit">
        </form>
        `;

        containerStories.insertAdjacentHTML('afterbegin', html);
    });



}


// <!--for active-story in active-stories-->
{/* <div class="read-only-div" id="read-only-div-{i}">Please load a story.</div>
<form action="{% url 'chainlettersstories:submit_story_to_section'  %}" method="post">
    <input class=story-input-{i} type="text" placeholder="Enter Story Here." name="content">
</form> */}
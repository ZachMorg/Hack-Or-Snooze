"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDelete = false) {
 // console.debug("generateStoryMarkup", story);

  const showStar = Boolean(currentUser);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${showStar ? starIconStatus(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <br>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        ${showDelete ? deleteButtonHTML() : ''}
      </li>
    `);
}


function starIconStatus(story, user) {
  console.debug('starIconStatus');
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

function deleteButtonHTML(){
  return`
    <span class='trash-can'>
      <i class='fas fa-trash-alt'></i>
    </span>`
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h4>You haven't added any stories!</h4>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

function putFavoriteStoriesOnPage(){

  $favStories.empty();

  if(currentUser.favorites.length === 0){
    $favStories.append('<h4>You have no favorite stories!</h4>');
  }
  else{
    for(let story of currentUser.favorites){
      let $story = generateStoryMarkup(story);
      $favStories.append($story);
    }
  }
  $favStories.show();
}

$('#sub-form').on('submit',async function(e){
  e.preventDefault();
  let storyAuthor = document.querySelector`#author`.value;
  let storyTitle = document.querySelector`#title`.value;
  let storyUrl = document.querySelector`#url`.value;
  let currentUsername = currentUser.username;
  let storyInfo = {'title': storyTitle, 'url': storyUrl, 'author': storyAuthor};
  const story = await storyList.addStory(currentUser,storyInfo);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
})

async function favoriteStory(e){
  console.debug('favoriteStory');
  const $tgt = $(e.target);
  const $tgtParent = $tgt.closest('li');
  const storyId = $tgtParent.attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId);

  if($tgt.hasClass('fas')){
    await currentUser.removeFavorite(story);
    $tgt.closest('i').toggleClass('fas far');
  }
  else{
    await currentUser.addFavorite(story);
    $tgt.closest('i').toggleClass('fas far');
  }
}

$storiesLists.on('click', '.star', favoriteStory);

async function deleteStory(e){
  console.debug('deleteStory');
  const $closestLi = $(e.target).closest('li');
  const storyId = $closestLi.attr('id');
  await storyList.removeStory(currentUser,storyId);

  await putUserStoriesOnPage();
}

$ownStories.on('click', '.trash-can', deleteStory);
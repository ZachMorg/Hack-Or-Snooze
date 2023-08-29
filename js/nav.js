"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmission(){
  console.debug('navSubmission');
  $('#submissions').show();
}

$('#nav-submit').on('click', navSubmission);


function navOwn(){
  console.debug('navOwn');
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$('#nav-own').on('click', navOwn);


function navFav(){
  hidePageComponents();
  putFavoriteStoriesOnPage();
  $favStories.show();
}

$('#nav-fav').on('click', navFav);


function navProfile(){
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on('click', navProfile);
// let api_key = "AIzaSyCmLhASSz82amuby1nky44Eu6Hw042i630"
// let video_http = "https://www.googleapis.com/youtube/v3/videos?api_key"

var menuIcon = document.querySelector(".menu-icon")
var sidebar = document.querySelector(".sidebar")
var container = document.querySelector(".container")

menuIcon.onclick = () => {
    sidebar.classList.toggle("small-sidebar")
    container.classList.toggle("large-container")
}
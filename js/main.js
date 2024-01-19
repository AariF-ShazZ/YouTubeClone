var menuIcon = document.querySelector(".menu-icon")
var sidebar = document.querySelector(".sidebar")
var container = document.querySelector(".list-container")

menuIcon.onclick = () => {
    sidebar.classList.toggle("small-sidebar")
    container.classList.toggle("large-container")
}

let search_btn = document.querySelector("#searchBtn");
let search_input = document.querySelector("#query");
// let selectSort = document.querySelector("#video-sorting");

//event for searching events
search_btn.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission or page reload
    let query = search_input.value;
    console.log("searchBtn", query);
    searchFunc(query);
});

search_input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        let query = search_input.value;
        searchFunc(query);
    }
});

//get search data
let searchFunc = async (query) => {
    let data = await getYoutubeData(query);
    sortData = data;
};

const api_key = "AIzaSyB61dCiMiNQ0njfW4uUCORhE2P96oQrMs0";
const video_url = "https://www.googleapis.com/youtube/v3/videos?";
const search_url = "https://www.googleapis.com/youtube/v3/search?";
const channel_http = "https://www.googleapis.com/youtube/v3/channels?";

const getYoutubeData = async (query) => {
    try {
        // let data
        // if(!query){
            const response = await fetch(video_url + new URLSearchParams({
                key: api_key,
                part: 'snippet, statistics, contentDetails',
                chart: 'mostPopular',
                maxResults: 50,
                regionCode: 'TR'
            }));
      

        const  data = await response.json();
        console.log("getYoutubeData =>", data);
        if (data && data.items) {
            const promises = data.items.map(async (item) => {
                const channelData = await getChannelIcon(item);
                return channelData;
            });
            const allData = await Promise.all(promises);
            appendData(allData);
        } else {
            console.log('No data or items found in the response:', data);
        }
        return data; // Return data for potential further handling
    } catch (error) {
        console.log(error);
    }
};
getYoutubeData()

const getChannelIcon = async (video_Data) => {
    try {
        let res = await fetch(channel_http + new URLSearchParams({
            key: api_key,
            part: 'snippet',
            id: video_Data.snippet.channelId
        }))
        let data = await res.json()

        video_Data.channelThumbnail = data.items[0].snippet.thumbnails.high.url
        return video_Data
    } catch (error) {
        console.log(error);
    }
}

async function getChannel(video) {
    const channel = await fetch(channel_url + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: video.snippet.channelId,
    }));

    const data = await channel.json();
    video.channelThumbnail = data.items[0].snippet.thumbnails.high.url
    return video
}

const appendData = (videoData) => {
    // console.log("videoData =>", videoData);
    var container = document.querySelector(".list-container")
    container.innerHTML = null
    videoData.forEach((data) => {
        // Create main container div
        const vidListDiv = document.createElement('div');
        vidListDiv.setAttribute("class", 'vid-list');

        // Create thumbnail image
        const thumbnailImg = document.createElement('img');
        thumbnailImg.setAttribute('src', data.snippet.thumbnails.high.url);
        thumbnailImg.setAttribute('alt', '');
        thumbnailImg.classList.add('thumbnail');

        // Create flex-div container
        const flexDiv = document.createElement('div');
        flexDiv.classList.add('flex-div');

        // Create channel thumbnail image
        const channelThumbnailImg = document.createElement('img');
        channelThumbnailImg.setAttribute('src', data.channelThumbnail);
        channelThumbnailImg.setAttribute('alt', '');

        // Create vid-info container
        const vidInfoDiv = document.createElement('div');
        vidInfoDiv.classList.add('vid-info');

        // Create title link
        const titleLink = document.createElement('a');
        titleLink.setAttribute('href', '');
        titleLink.textContent = data.snippet.title;

        // Create channel title paragraph
        const channelTitlePara = document.createElement('p');
        channelTitlePara.textContent = data.snippet.channelTitle;

        // Create views info paragraph
        const viewsPara = document.createElement('p');
        viewsPara.textContent = data.statistics.viewCount + "Views • 5 days";

        // Appending elements together
        vidInfoDiv.appendChild(titleLink);
        vidInfoDiv.appendChild(channelTitlePara);
        vidInfoDiv.appendChild(viewsPara);

        flexDiv.appendChild(channelThumbnailImg);
        flexDiv.appendChild(vidInfoDiv);

        vidListDiv.appendChild(thumbnailImg);
        vidListDiv.appendChild(flexDiv);
        vidListDiv.onclick = () => {
            playVideo(data);
        };
        container.appendChild(vidListDiv);
    })
};

let playVideo = (single_Video) => {
    // console.log("ele =>", single_Video);
    localStorage.setItem("singleVideo", JSON.stringify(single_Video))
    window.location.href = "../pages/video.html";
}
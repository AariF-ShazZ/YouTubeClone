let getVideo = JSON.parse(localStorage.getItem("singleVideo")) || {}
// console.log(getVideo)
let iframe = document.createElement("iframe");
// Set attributes for the iframe
iframe.src = `https://www.youtube.com/embed/${getVideo.id}?si=eerW9uRoYJUEwekH`;
iframe.title = "YouTube video player";
iframe.frameBorder = "0";
iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
iframe.allowFullscreen = true;
let h3 = document.createElement("h3");
h3.innerText = getVideo.snippet.title;


document.querySelector(".video_control").append(iframe)

// var menuIcon = document.querySelector(".menu-icon")
// var sidebar = document.querySelector(".sidebar")
var container = document.querySelector(".list-container")

// menuIcon.onclick = () => {
//     sidebar.classList.toggle("small-sidebar")
//     container.classList.toggle("large-container")
// }

// let search_btn = document.querySelector("#searchBtn");
// let search_input = document.querySelector("#query");
// // let selectSort = document.querySelector("#video-sorting");

// //event for searching events
// search_btn.addEventListener("click", function (event) {
//     event.preventDefault(); // Prevent form submission or page reload
//     let query = search_input.value;
//     console.log("searchBtn", query);
//     searchFunc(query);
// });

// search_input.addEventListener("keypress", function (event) {
//     if (event.key === "Enter") {
//         event.preventDefault();
//         let query = search_input.value;
//         searchFunc(query);
//     }
// });

// //get search data
// let searchFunc = async (query) => {
//     let data = await getYoutubeData(query);
//     sortData = data;
// };

const api_key = "AIzaSyB61dCiMiNQ0njfW4uUCORhE2P96oQrMs0";
const video_url = "https://www.googleapis.com/youtube/v3/videos?";
const search_url = "https://www.googleapis.com/youtube/v3/search?";
const channel_http = "https://www.googleapis.com/youtube/v3/channels?";

const getYoutubeData = async () => {
    try {
      
        const response = await fetch(video_url + new URLSearchParams({
            key: api_key,
            part: 'snippet, statistics, contentDetails',
            chart: 'mostPopular',
            maxResults: 50,
            regionCode: 'TR'
        }));
      

        const data = await response.json();
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
    var container = document.querySelector(".right-sidebar");
    container.innerHTML = null;

    videoData.forEach((data) => {
        const sideVideoListDiv = document.createElement('div');
        sideVideoListDiv.setAttribute('class', 'side-video-list');

        const thumbnailLink = document.createElement('a');
        thumbnailLink.setAttribute('href', ''); 
        thumbnailLink.setAttribute('class', 'small-thumbnail');

        const thumbnailImg = document.createElement('img');
        thumbnailImg.setAttribute('src', data.snippet.thumbnails.high.url); 
        thumbnailImg.setAttribute('alt', '');
        thumbnailLink.appendChild(thumbnailImg);

        const vidInfoDiv = document.createElement('div');
        vidInfoDiv.setAttribute("class", 'vid-info');
        vidInfoDiv.style.cursor = "pointer";

        const titleLink = document.createElement('a');
        titleLink.setAttribute('href', ''); 
        titleLink.textContent = 'Best app to learn new things and increase the knowledge';

        const channelNamePara = document.createElement('p');
        channelNamePara.textContent = 'Tech Bro';

        const viewsPara = document.createElement('p');
        viewsPara.textContent = data.statistics.viewCount + "Views • 5 days";

        vidInfoDiv.appendChild(titleLink);
        vidInfoDiv.appendChild(channelNamePara);
        vidInfoDiv.appendChild(viewsPara);

        sideVideoListDiv.appendChild(thumbnailLink);
        sideVideoListDiv.appendChild(vidInfoDiv);

        container.appendChild(sideVideoListDiv);

        // Event delegation to handle click on vid-info elements
        vidInfoDiv.addEventListener('click', function() {
            playVideo(data);
        });
    });
};

let playVideo = (singleVideo) => {
    console.log("video data =>", singleVideo);
    localStorage.clear();
    localStorage.setItem("singleVideo", JSON.stringify(singleVideo));
    // Perform other operations here if needed
    // For example: load the video or trigger UI changes
};

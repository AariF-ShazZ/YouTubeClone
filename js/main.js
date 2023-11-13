var menuIcon = document.querySelector(".menu-icon")
var sidebar = document.querySelector(".sidebar")
var container = document.querySelector(".list-container")
// 9661697649
menuIcon.onclick = () => {
    sidebar.classList.toggle("small-sidebar")
    container.classList.toggle("large-container")
}


let api_key = "AIzaSyBfmBinc3dGnkcVgWnB852p114kSRMHe-I";
let url = `https://www.googleapis.com/youtube/v3/search?`
let channel_http = `https://www.googleapis.com/youtube/v3/channels?`
// let url = `https://youtube.googleapis.com/youtube/v3/search?part=%20snippet&chart=mostPopular&maxResults=100&q=${query}&key=${api_key}`

const getYoutubeData = async (query) => {
    let search = query.value.target
    try{
        let res = await fetch(url + new URLSearchParams({
            key:api_key,
            part:'snippet',
            chart:'mostPopular',
            maxResults:500,
            q:search,
            regionCode:'IN'
        }))
        let data = await res.json()
        console.log("data =>",data);
        data.items.forEach((item) => {
            getChannelIcon(item)
        })
    }catch(error){
        console.log(error);
    }
}
getYoutubeData()

const getChannelIcon = async (video_Data) => {
    try{
        let res = await fetch(channel_http + new URLSearchParams({
            key:api_key,
            part:'snippet',
            id:video_Data.snippet.channelId
        }))
        let data = await res.json()
        video_Data.channelThumbnail = data.items[0].snippet.thumbnails.high.url
        // console.log("video_data =>",data)
        // console.log("video_data thumbnail=>",video_Data)
        appendData(video_Data)
    }catch(error){
        console.log(error);
    }
   
}
const appendData = (data) => {
    // console.log("data =>", data);
    container.innerHTML+=`
    <div class="vid-list" onclick ="location.href = 'https://youtube.com/watch?v=${data.id}'">
                <a href="./pages/video.html">
                <img src=${data.snippet.thumbnails.high.url} alt="" class="thumbnail">
                </a>
                <div class="flex-div">
                    <img src=${data.channelThumbnail} alt="">
                    <div class="vid-info">
                        <a href="play.video.html">${data.snippet.title}</a>
                        <p>${data.snippet.channelTitle}</p>
                        <p>20M Views &bull; 5 days</p>
                    </div>
                </div>
            </div>
    `
};
let query = document.querySelector("#query")
let searchBtn = document.querySelector("#searchBtn")
let searchLink = "https://www.youtube.com/results?search_query="
searchBtn.addEventListener("click",() => {
    if(query.value.length){
        getYoutubeData(query)
    }
})

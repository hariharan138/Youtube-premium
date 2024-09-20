const apiKey = 'AIzaSyAN6iiDk4mm-uynhzQi66rZEA8Mnb3Pw5o';
const searchBtn = document.getElementById('search-btn');
const searchBar = document.getElementById('search-bar');
const videosContainer = document.getElementById('videos-container');
const loadMoreBtn = document.getElementById('load-more-btn');

let nextPageToken = '';
let searchQuery = '';

searchBtn.addEventListener('click', async function() {
    const query = searchBar.value.trim();
    if (query) {
        searchQuery = query;
        nextPageToken = '';
        await searchYouTube(query);
    } else {
        alert('Please enter a search query.');
    }
});

searchBar.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchBtn.click();
    }
});

loadMoreBtn.addEventListener('click', async function() {
    if (nextPageToken) {
        await searchYouTube(searchQuery, nextPageToken);
    }
});

async function searchYouTube(query, pageToken = '') {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&type=video&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items.length > 0) {
            displayVideos(data.items);
            nextPageToken = data.nextPageToken;
            loadMoreBtn.style.display = nextPageToken ? 'block' : 'none';
        } else {
            alert('No videos found for this query.');
        }
    } catch (error) {
        console.error('Error fetching videos:', error);
        alert('Failed to fetch videos.');
    }
}

function displayVideos(videos) {
    videosContainer.innerHTML = '';

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const videoTitle = video.snippet.title;
        const videoDescription = video.snippet.description;
        const videoThumbnail = video.snippet.thumbnails.high.url;

        const videoUrl = `https://www.yout-ube.com/watch?v=${videoId}`;

        const videoCard = document.createElement('div');
        videoCard.classList.add('video-card');

        const img = document.createElement('img');
        img.src = videoThumbnail;
        img.alt = videoTitle;

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('video-info');

        const title = document.createElement('p');
        title.textContent = videoTitle;
        title.classList.add('video-title');

        const description = document.createElement('p');
        description.textContent = videoDescription;
        description.classList.add('video-description');

        infoDiv.appendChild(title);
        infoDiv.appendChild(description);

        videoCard.appendChild(img);
        videoCard.appendChild(infoDiv);

        videoCard.onclick = () => window.open(videoUrl, '_blank');

        videosContainer.appendChild(videoCard);
    });
}

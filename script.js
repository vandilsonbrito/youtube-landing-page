(function() {
    const searchBtn = document.getElementById('search-btn');
    let searchQuery = document.getElementById('searchQuery').value;
    const videoContainer = document.getElementById('wrapper-contents-container');
    

    function searchVideosMostPopular() {
        const apiKey = "AIzaSyDxoDC-gcdR3js4c9hye0SijsYG6YukZX8";
        const baseApiUrl = 'https://www.googleapis.com/youtube/v3'
    
        // Limpe o conteúdo anterior
        //videoContainer.innerHTML = '';
    
    
        axios.get(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyDxoDC-gcdR3js4c9hye0SijsYG6YukZX8&type=video&part=snippet&chart=mostPopular`)
        .then(response => {
    
            const videoIds = response.data.items;
            console.log(videoIds)
            
            videoIds.forEach(videoId => {
            // Crie um contêiner para cada vídeo
            const videoDiv = document.createElement('div');
            videoDiv.classList.add('videoWrapper');
    
            // Crie um iframe para incorporar o vídeo
            const videoPlayer = document.createElement('iframe');
            videoPlayer.src = `https://www.youtube.com/embed/${videoId}`;
            
            if(videoPlayer.src.status === 'unavailable') {
                console.log('vídeo indisponível')
            }
            else {
                videoDiv.appendChild(videoPlayer);
                videoContainer.appendChild(videoDiv);
            }
            });
        })
        .catch(error => {
            console.error(error);
        });
    }

    console.log(searchQuery.value)
    if(!searchQuery.value) {
        console.log("EEEEEE")
        searchVideosMostPopular();
    }
    

    function searchVideosByQuery() {
        const apiKey = "AIzaSyDxoDC-gcdR3js4c9hye0SijsYG6YukZX8";
        const baseApiUrl = 'https://www.googleapis.com/youtube/v3'

        // Limpe o conteúdo anterior
        videoContainer.innerHTML = '';
        

        // Fazer uma solicitação ao seu backend para buscar vídeos
        axios.get(`${baseApiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}`, { timeout: 5000 })
        .then(response => {
            const videoIds = response.data.items.map((item) => item.id.videoId)
            const titles = response.data.items.map((item) => item.snippet.title)
            console.log(videoIds)
            console.log(titles)

            videoIds.forEach(videoId => {
            // Crie um contêiner para cada vídeo
            const videoDiv = document.createElement('div');
            videoDiv.classList.add('videoWrapper');
    
            // Crie um iframe para incorporar o vídeo
            const videoPlayer = document.createElement('iframe');
            videoPlayer.src = `https://www.youtube.com/embed/${videoId}`;
            
            if(videoPlayer.src.status === 'unavailable') {
                console.log('vídeo indisponível')
            }
            else {
                videoDiv.appendChild(videoPlayer);
                videoContainer.appendChild(videoDiv);
            }
            });
        })
        .catch(error => {
            console.error(error);
        });
    }
  
searchBtn.addEventListener('click', () => searchVideosByQuery());

})
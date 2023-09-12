(function() {
    
    const searchBtn = document.getElementById('search-btn');
    /* let searchQuery = document.getElementById('searchQuery'); */
    const videoContainer = document.getElementById('wrapper-contents-container');
    

    function searchVideosMostPopular() {
        const apiKey = "AIzaSyDxoDC-gcdR3js4c9hye0SijsYG6YukZX8";
        const baseApiUrl = 'https://www.googleapis.com/youtube/v3'
    
        // Limpe o conteúdo anterior
        //videoContainer.innerHTML = '';
    
    
        axios.get(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyDxoDC-gcdR3js4c9hye0SijsYG6YukZX8&type=video&part=snippet&chart=mostPopular`)
        .then(response => {
    
            const videoIds = response.data.items.map((items) => items.id.videoId);

            const channelsId = response.data.items.map((item) => item.snippet.channelId);
            

            videoIds.forEach((videoId, index) => {

                const videoPlayerSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&controls=0&modestbranding=1&allowfullscreen`;

                
                const titles = response.data.items.map((item) => item.snippet.title)


                console.log(channelsId[index])
                axios.get(`${baseApiUrl}/channels?part=snippet&id=${channelsId[index]}&key=${apiKey}`)
                .then(response => {
                const channelThumbnail = response.data.items.map((item) => item.snippet.thumbnails.default.url);
                

                videoContainer.innerHTML += `

                        <div class="w-[320px] h-fit bg-white mb-10">
                        <div class="w-[320px] h-[180px] bg-slate-400">
                            <iframe src="${videoPlayerSrc}"></iframe>
                        </div>
                        <div class="w-full h-full px-3 pt-2 ">
                            <div class="flex gap-3">
                                <div class="w-10 h-10 rounded-full "><img class="w-full h-full rounded-full" src="${channelThumbnail}" alt=""></div>
                                <div class="">
                                    <div class=""><p class="text-[#0f0f0fcb] text-lg font-bold">${titles[videoIds.indexOf(videoId)]}</p></div>
                                    <div class="mt-1  "><p class="text-sm text-[#606060]">Nome do canal</p></div>
                                    <div class=" "><p class="text-sm text-[#606060]">Postado há 50 min</p></div>
                                </div>
                                </div>
                            </div>
                        </div>
                
                `
                })
          
        });
            
        })
        .catch(error => {
            console.error(error);
        });

    }
    searchVideosMostPopular();
    

    function searchVideosByQuery() {
        const apiKey = "AIzaSyDxoDC-gcdR3js4c9hye0SijsYG6YukZX8";
        const baseApiUrl = 'https://www.googleapis.com/youtube/v3'
        let searchQuery = document.getElementById('searchQuery').value;
       

        console.log(searchQuery)
        // Limpe o conteúdo anterior
        videoContainer.innerHTML = '';
        

        // Fazer uma solicitação ao seu backend para buscar vídeos
        axios.get(`${baseApiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}`)
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
            
            const titleWrapper = document.createElement('div');
            const title = document.createElement('p');
            title.classList.add('title');
            title.textContent = titles[videoIds.indexOf(videoId)];

            
            videoDiv.appendChild(videoPlayer);
            titleWrapper.appendChild(title);
            videoDiv.appendChild(titleWrapper);
            videoContainer.appendChild(videoDiv);
            
            });
        })
        .catch(error => {
            console.error(error);
        });
    }
  
/* searchBtn.addEventListener('click', () => searchVideosByQuery()); */

})()
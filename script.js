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
            const channelTitle = response.data.items.map((item) => item.snippet.channelTitle)
            console.log(channelTitle)

            const videosPublishedTime = response.data.items.map((item) => item.snippet.publishedAt)
            console.log(videosPublishedTime)

            let formattedDate = [];

            videosPublishedTime.forEach((video) => {
              
                function formatarTempo(diferenca) {

                    const segundosPorMinuto = 60;
                    const minutosPorHora = 60;
                    const horasPorDia = 24;
                    const diasPorAno = 365.25; 
                    const diasPorMes = 30.44; 
                    const mesesPorAno = 12;
                  
                    if (diferenca < segundosPorMinuto) {
                      return `Publicado há ${Math.floor(diferenca)} segundos`;
                    } 
                    else if (diferenca < (segundosPorMinuto * minutosPorHora)) {
                      return formattedDate.push(`Publicado há ${Math.floor(diferenca / segundosPorMinuto)} minutos`);
                    } 
                    else if (diferenca < (segundosPorMinuto * minutosPorHora * horasPorDia)) {
                      return formattedDate.push(`Publicado há ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora))} ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora)) === 1? 'hora' : 'horas'}`);
                    } 
                      
                    else if (diferenca < (segundosPorMinuto * minutosPorHora * horasPorDia * diasPorMes * mesesPorAno)) {
                      return formattedDate.push(`Publicado há ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora * horasPorDia * diasPorMes))} ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora * horasPorDia * diasPorMes)) === 1 ? 'mês' : 'meses'}`);
                    }
                    else if (diferenca < (segundosPorMinuto * minutosPorHora * horasPorDia * diasPorAno)) {
                      return formattedDate.push(`Publicado há ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora * horasPorDia))} ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora * horasPorDia)) === 1 ? 'dia' : 'dias'}`);
                    }
                    else {
                      return formattedDate.push(`Publicado há ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora * horasPorDia * diasPorAno))} ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora * horasPorDia * diasPorAno)) === 1 ? 'ano' : 'anos'}`);
                    }
                }

                const currentDate = new Date();
                const dataPublicacao = new Date(video);
                const diferencaEmSegundos = (currentDate - dataPublicacao) / 1000; // Convertendo para segundos
                formatarTempo(diferencaEmSegundos);
              
                console.log(formattedDate);
                  
            })
            

            videoIds.forEach((videoId, index) => {

                const videoPlayerSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&controls=0&modestbranding=1&allowfullscreen`;

                
                const titles = response.data.items.map((item) => item.snippet.title)


                /* console.log(channelsId[index]) */
                axios.get(`${baseApiUrl}/channels?part=snippet&id=${channelsId[index]}&key=${apiKey}`)
                .then(response => {
                const channelThumbnail = response.data.items.map((item) => item.snippet.thumbnails.default.url);
                
                
                videoContainer.innerHTML += `

                    <div class="w-[300px] h-fit mb-10">
                        <div class="w-[300px] h-[155px]">
                            <iframe class="" src="${videoPlayerSrc}"></iframe>
                        </div>
                        <div class="w-full h-full pt-2 ">
                        <div class="w-full flex gap-3 " style="display: grid; grid-template-areas: 'image-container info-video-container'; grid-template-rows: 1; grid-template-columns: auto 2fr;">
                                <div class="rounded-full">
                                    <img class="w-10 h-10 rounded-full" src="${channelThumbnail}" alt="">
                                </div>
                                <div class="">
                                <div class="w-full max-h-[45px] overflow-hidden custom-text">
                                    <p class="text-[#0f0f0fcb] text-base font-bold">${titles[videoIds.indexOf(videoId)]}</p>
                                    </div>
                                    <div class="mt-2">
                                      <p class="text-sm text-[#606060]">${channelTitle[index]}</p>
                                    </div>
                                    <div class=" ">
                                      <p class="text-sm text-[#606060]">${formattedDate[index]}</p>
                                    </div>
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
    /* searchVideosMostPopular(); */
    

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
            
          /* const videoIds = response.data.items.map((item) => item.id.videoId)
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
            
            }); */


            const videoIds = response.data.items.map((items) => items.id.videoId);
            const channelsId = response.data.items.map((item) => item.snippet.channelId);
            const channelTitle = response.data.items.map((item) => item.snippet.channelTitle)
            console.log(channelTitle)

            const videosPublishedTime = response.data.items.map((item) => item.snippet.publishedAt)
            console.log(videosPublishedTime)

            let formattedDate = [];

            videosPublishedTime.forEach((video) => {
              
                function formatarTempo(diferenca) {

                    const segundosPorMinuto = 60;
                    const minutosPorHora = 60;
                    const horasPorDia = 24;
                    const diasPorAno = 365.25; 
                    const diasPorMes = 30.44; 
                    const mesesPorAno = 12;
                  
                    if (diferenca < segundosPorMinuto) {
                      return `Publicado há ${Math.floor(diferenca)} segundos`;
                    } 
                    else if (diferenca < (segundosPorMinuto * minutosPorHora)) {
                      return formattedDate.push(`Publicado há ${Math.floor(diferenca / segundosPorMinuto)} minutos`);
                    } 
                    else if (diferenca < (segundosPorMinuto * minutosPorHora * horasPorDia)) {
                      return formattedDate.push(`Publicado há ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora))} ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora)) === 1? 'hora' : 'horas'}`);
                    } 
                      
                    else if (diferenca < (segundosPorMinuto * minutosPorHora * horasPorDia * diasPorMes * mesesPorAno)) {
                      return formattedDate.push(`Publicado há ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora * horasPorDia * diasPorMes))} ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora * horasPorDia * diasPorMes)) === 1 ? 'mês' : 'meses'}`);
                    }
                    else if (diferenca < (segundosPorMinuto * minutosPorHora * horasPorDia * diasPorAno)) {
                      return formattedDate.push(`Publicado há ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora * horasPorDia))} ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora * horasPorDia)) === 1 ? 'dia' : 'dias'}`);
                    }
                    else {
                      return formattedDate.push(`Publicado há ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora * horasPorDia * diasPorAno))} ${Math.floor(diferenca / (segundosPorMinuto * minutosPorHora * horasPorDia * diasPorAno)) === 1 ? 'ano' : 'anos'}`);
                    }
                }

                const currentDate = new Date();
                const dataPublicacao = new Date(video);
                const diferencaEmSegundos = (currentDate - dataPublicacao) / 1000; // Convertendo para segundos
                formatarTempo(diferencaEmSegundos);
              
                console.log(formattedDate);
                  
            })
            

            videoIds.forEach((videoId, index) => {

                const videoPlayerSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&controls=0&modestbranding=1&allowfullscreen`;

                
                const titles = response.data.items.map((item) => item.snippet.title)


                /* console.log(channelsId[index]) */
                axios.get(`${baseApiUrl}/channels?part=snippet&id=${channelsId[index]}&key=${apiKey}`)
                .then(response => {
                const channelThumbnail = response.data.items.map((item) => item.snippet.thumbnails.default.url);
                
                
                videoContainer.innerHTML += `

                    <div class="w-[300px] h-fit mb-10">
                        <div class="w-[300px] h-[155px]">
                            <iframe class="" src="${videoPlayerSrc}"></iframe>
                        </div>
                        <div class="w-full h-full pt-2 ">
                        <div class="w-full flex gap-3 " style="display: grid; grid-template-areas: 'image-container info-video-container'; grid-template-rows: 1; grid-template-columns: auto 2fr;">
                                <div class="rounded-full">
                                    <img class="w-10 h-10 rounded-full" src="${channelThumbnail}" alt="">
                                </div>
                                <div class="">
                                <div class="w-full max-h-[45px] overflow-hidden custom-text">
                                    <p class="text-[#0f0f0fcb] text-base font-bold">${titles[videoIds.indexOf(videoId)]}</p>
                                    </div>
                                    <div class="mt-2">
                                      <p class="text-sm text-[#606060]">${channelTitle[index]}</p>
                                    </div>
                                    <div class=" ">
                                      <p class="text-sm text-[#606060]">${formattedDate[index]}</p>
                                    </div>
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
  
/* searchBtn.addEventListener('click', () => searchVideosByQuery()); */

})()
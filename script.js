;(function() {
    
    const youtubeLogo = document.getElementById('youtube-logo');
    const searchIcon = document.getElementById("search-icon");
    const arrowBack = document.getElementById("arrow-back");
    const searchBtn = document.getElementById("search-btn");
    const searchBtnMdLgScreens = document.getElementById('search-btn-md-lg-screens');
    const videoContainer = document.getElementById("wrapper-contents-container");
    const scrollSnapContainer = document.querySelector(".scroll-snap-container");
    const eraseIconSmallScreens = document.getElementById('close-icon-small-screens'); 
    const eraseIconBigScreens = document.getElementById('close-icon-big-screens');
    const settingsIcon = document.getElementById('settings-icon');
    const burgerMenuLandPage = document.getElementById('burger-menu-land-page');
    const burgerMenuSideNav = document.getElementById('burger-menu-side-nav');
    
    
    let formattedDate = [];

  // FUNCTIONS
  function searchMostPopularVideos(recentlyUploaded) {  
      
      const navItem = document.querySelectorAll('.nav-item');
      const sideNavWrapperItems = document.querySelectorAll('.side-nav-wrapper-icon');
      navItem[0].classList.add('nav-item-active');
      sideNavWrapperItems[0].classList.add('side-nav-text-active');
      sideNavWrapperItems[0].classList.add('side-nav-wrapper-items-active');

      const apiKey = "AIzaSyDxoDC-gcdR3js4c9hye0SijsYG6YukZX8";
      const baseApiUrl = 'https://www.googleapis.com/youtube/v3'

  
      axios.get(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyDxoDC-gcdR3js4c9hye0SijsYG6YukZX8&type=video&maxResults=20&part=snippet&${recentlyUploaded}chart=mostPopular`)
      .then(response => {
  
          const videoIds = response.data.items.map((items) => items.id.videoId);
          const channelsId = response.data.items.map((item) => item.snippet.channelId);
          const channelTitle = response.data.items.map((item) => item.snippet.channelTitle)
          const videosPublishedTime = response.data.items.map((item) => item.snippet.publishedAt)

          

          formattedDate = [];
          videosPublishedTime.forEach((video) => {
              const currentDate = new Date();
              const dataPublicacao = new Date(video);
              const diferencaEmSegundos = (currentDate - dataPublicacao) / 1000; // Convertendo para segundos
              treatingDateData(diferencaEmSegundos);
               
          });
          

          videoContainer.innerHTML = '';
          videoIds.forEach((videoId, index) => {

              const videoPlayerSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&controls=0&modestbranding=1&allowfullscreen`;

              const titles = response.data.items.map((item) => item.snippet.title);


              axios.get(`${baseApiUrl}/channels?part=snippet&id=${channelsId[index]}&key=${apiKey}`)
              .then(response => {
              const channelThumbnail = response.data.items.map((item) => item.snippet.thumbnails.medium.url);
              
              
              videoContainer.innerHTML += createVideoContainerHTML(
                videoPlayerSrc,
                channelThumbnail,
                videoIds,
                videoId,
                titles,
                channelTitle,
                formattedDate,
                index
              )
              })
        
      });
          
      })
      .catch(error => {
          console.error(error);
      });

  }
  
  
  function togglePrincipalNavAndQueryNav() {

    const principalNavHeader = document.getElementById('principal-nav');
    const queryNavHeader = document.getElementById('query-nav');


    principalNavHeader.classList.toggle('hidden');
    queryNavHeader.classList.toggle('hidden');
  }


  function searchVideosByQuery(searchQuery) {
      const apiKey = "AIzaSyDxoDC-gcdR3js4c9hye0SijsYG6YukZX8";
      const baseApiUrl = 'https://www.googleapis.com/youtube/v3';

   
     
      videoContainer.innerHTML = '';
      

      // Make a request to the backend to fetch videos
      axios.get(`${baseApiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}`)
      .then(response => {

          const videoIds = response.data.items.map((items) => items.id.videoId);
          const channelsId = response.data.items.map((item) => item.snippet.channelId);
          const channelTitle = response.data.items.map((item) => item.snippet.channelTitle);
          const videosPublishedTime = response.data.items.map((item) => item.snippet.publishedAt);

          
          formattedDate = [];
          videosPublishedTime.forEach((video) => {
            
            const currentDate = new Date();
            const dataPublicacao = new Date(video);
            const diferencaEmSegundos = (currentDate - dataPublicacao) / 1000; // Convertendo para segundos
            treatingDateData(diferencaEmSegundos)
  
            
          })
          

          videoIds.forEach((videoId, index) => {

              const videoPlayerSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&controls=0&modestbranding=1&allowfullscreen`;

              const titles = response.data.items.map((item) => item.snippet.title)


              axios.get(`${baseApiUrl}/channels?part=snippet&id=${channelsId[index]}&key=${apiKey}`)
              .then(response => {
              const channelThumbnail = response.data.items.map((item) => item.snippet.thumbnails.default.url);
              
              
              videoContainer.innerHTML += createVideoContainerHTML(
                videoPlayerSrc,
                channelThumbnail,
                videoIds,
                videoId,
                titles,
                channelTitle,
                formattedDate,
                index
              )
              })
        
      });

      })
      .catch(error => {
          console.error(error);
      });
  }

  let oldValueItem = null;
  function searchByScrollSnapContainer(e) {
    
    const navItem = document.querySelectorAll('.nav-item');
    navItem[0].classList.contains('nav-item-active') ? navItem[0].classList.remove('nav-item-active') : null;

    Array.from(navItem).forEach((item) => {
        if(e.target === item) {
            if(item !== oldValueItem) {

              item.classList.add('nav-item-active');
              oldValueItem?.classList.remove('nav-item-active');
              oldValueItem = item;
          
            }
            const itemName = item.firstElementChild.textContent;
            if(itemName === 'All') {
                searchMostPopularVideos()
            }
            else if(itemName === 'Recently Uploaded') {
                const recentlyUploaded = 'order=date&';
                searchMostPopularVideos(recentlyUploaded)   
            }
            else {
                searchVideosByQuery(itemName);
            }

          }
          
    })

  }

  function treatingDateData(time) {

    const segundosPorMinuto = 60;
    const minutosPorHora = 60;
    const horasPorDia = 24;
    const diasPorAno = 365.25;
    const diasPorMes = 30.44;
    const mesesPorAno = 12;

    let message = "";

    if (time < segundosPorMinuto) {
      message = `Publicado há ${Math.floor(time)} segundos`;
    } 
    else if (time < segundosPorMinuto * minutosPorHora) {
      message = `Publicado há ${Math.floor(time / segundosPorMinuto)} minutos`;
    } 
    else if (time < segundosPorMinuto * minutosPorHora * horasPorDia) {
      const horasAtras = Math.floor( time / (segundosPorMinuto * minutosPorHora));
      message = `Publicado há ${horasAtras} ${ horasAtras === 1 ? "hora" : "horas"}`;
    } 
    else if (time < segundosPorMinuto * minutosPorHora * horasPorDia * diasPorMes) {
      const diasAtras = Math.floor( time / (segundosPorMinuto * minutosPorHora * horasPorDia));
      message = `Publicado há ${diasAtras} ${diasAtras === 1 ? "dia" : "dias"}`;
    } 
    else if (time < segundosPorMinuto * minutosPorHora * horasPorDia * diasPorMes * mesesPorAno) {
      const mesesAtras = Math.floor( time / (segundosPorMinuto * minutosPorHora * horasPorDia * diasPorMes));
      message = `Publicado há ${mesesAtras} ${ mesesAtras === 1 ? "mês" : "meses" }`;
    } 
    else {
      const anosAtras = Math.floor( time / (segundosPorMinuto * minutosPorHora * horasPorDia * diasPorAno));
      message = `Publicado há ${anosAtras} ${anosAtras === 1 ? "ano" : "anos"}`;
    }

    formattedDate.push(message);
  }

  function createVideoContainerHTML(
    videoPlayerSrc,
    channelThumbnail,
    videoIds,
    videoId,
    titles,
    channelTitle,
    formattedDate,
    index
  ) {
    return `
      <div class="w-[300px] h-[256px] mb-10  md:w-[330px] md:h-[295px] md:mb-30 ">
          <div class="">
            <iframe class= "md:w-full md:h-[195px] bg-black" src="${videoPlayerSrc}"></iframe>
          </div>
          <div class="w-full h-full pt-2">
            <div class="w-full flex gap-3" style="display: grid; grid-template-areas: 'image-container info-video-container'; grid-template-rows: 1; grid-template-columns: auto 2fr;">
              <div class="rounded-full">
                <img class="w-10 h-10 rounded-full" src="${channelThumbnail}" alt="">
              </div>
              <div class="">
                <div class="w-full max-h-[45px] overflow-hidden custom-text">
                  <p class="text-[#0f0f0fcb] text-base font-bold">${
                    titles[videoIds.indexOf(videoId)]
                  }</p>
                </div>
                <div class="mt-2">
                  <p class="text-sm text-[#606060]">${channelTitle[index]}</p>
                </div>
                <div class="">
                  <p class="text-sm text-[#606060]">${formattedDate[index]}</p>
                </div>
              </div>
            </div>
          </div>
      </div>
      `;
  }

  function eraseSearchInput() {
      let searchQueryInput;
      window.innerWidth < 1020 ? searchQueryInput = document.getElementById('search-query') : searchQueryInput = document.getElementById('search-query-md-lg-screens');

      searchQueryInput.value = '';
      searchQueryInput.focus();
  }

  function toggleSideNav() {
    const overlay = document.querySelector('.overlay');
    const sideNav = document.getElementById('side-nav');
    
    if(window.innerWidth < 1020) {
        overlay.classList.toggle('hidden');
    }
    sideNav.classList.toggle('hidden');

    let isSideNavActived = null;
    if(!sideNav.classList.contains('hidden')) {
      limitingScrollBar(isSideNavActived = 1);
    }
    else {
      limitingScrollBar(isSideNavActived = 0);
    }

    const sideNavWrapperItems = document.querySelectorAll('.side-nav-wrapper-icon');

    function whichIconNavIsSelected() {
      const arrayNavItems = Array.from(sideNavWrapperItems);
      arrayNavItems[0].classList.add('active')
      document.querySelectorAll('.side-nav-wrapper-icon path');

    }
    whichIconNavIsSelected()
  }

  function limitingScrollBar(isSideNavActived) {
    if(isSideNavActived === 1) {
      window.addEventListener('scroll', scrollHandler);
    }
    else {
      window.removeEventListener('scroll', scrollHandler);
    }
    
  }
  function scrollHandler() {
    const scrollTop = document.documentElement.scrollTop;
    if(scrollTop > 520) {
      window.scrollTo(0, 520);
    }
  }
 

  

  // EVENTS
  /* searchMostPopularVideos(); */
  youtubeLogo.addEventListener('click', searchMostPopularVideos);
  searchIcon.addEventListener("click", togglePrincipalNavAndQueryNav);
  arrowBack.addEventListener("click", togglePrincipalNavAndQueryNav);
  arrowBack.addEventListener('click', searchMostPopularVideos);
  searchBtn.addEventListener("click", () => {
    const searchQuery = document.getElementById("search-query").value;
    searchVideosByQuery(searchQuery);
  });
  searchBtnMdLgScreens.addEventListener("click", () => {
    const searchQuery = document.getElementById("search-query-md-lg-screens").value;
    searchVideosByQuery(searchQuery);
  });
  scrollSnapContainer.addEventListener('click', searchByScrollSnapContainer);
  window.innerWidth < 1020 ?  eraseIconSmallScreens.addEventListener('click', eraseSearchInput) : eraseIconBigScreens.addEventListener('click', eraseSearchInput); 

  // Toggle Search ToolTip
  searchIcon.addEventListener('mouseover', () => {
     document.getElementById('search-tool-tip').classList.remove('hidden');
  });
  searchIcon.addEventListener('mouseleave', () => {
    document.getElementById('search-tool-tip').classList.add('hidden');
 });
  settingsIcon.addEventListener('mouseover', () => {
    document.getElementById('settings-tool-tip').classList.remove('hidden');
 });
 settingsIcon.addEventListener('mouseleave', () => {
    document.getElementById('settings-tool-tip').classList.add('hidden');
  });

  burgerMenuLandPage.addEventListener('click', toggleSideNav);
  burgerMenuSideNav.addEventListener('click', toggleSideNav);

})()
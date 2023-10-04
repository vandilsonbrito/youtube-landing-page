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
    const scrollContainer = document.querySelector('.scroll-snap-container');
    const scrollButtonLeft = document.querySelector('.btn-scroll-left');
    const scrollButtonRight = document.querySelector('.btn-scroll-right');

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

  
      axios.get(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyDxoDC-gcdR3js4c9hye0SijsYG6YukZX8&type=video&maxResults=10&part=snippet&${recentlyUploaded}chart=mostPopular`)
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

              const videoPlayerSrc = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&showinfo=0&controls=0&modestbranding=1&allowfullscreen`;

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

    if(queryNavHeader.classList.contains('hidden')) {
        queryNavHeader.classList.remove('hidden');
        queryNavHeader.classList.add('flex');
    }
    else {
      queryNavHeader.classList.add('hidden');
      queryNavHeader.classList.remove('flex');
    }
  }


  function searchVideosByQuery(searchQuery) {

      const apiKey = "AIzaSyDxoDC-gcdR3js4c9hye0SijsYG6YukZX8";
      const baseApiUrl = 'https://www.googleapis.com/youtube/v3';

   
      videoContainer.innerHTML = '';
      

      // Make a request to the backend to fetch videos
      axios.get(`${baseApiUrl}/search?key=${apiKey}&type=video&part=snippet&maxResults=10&q=${searchQuery}`)
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

              const videoPlayerSrc = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&showinfo=0&controls=0&modestbranding=1&allowfullscreen`;

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
  ) { /* <div class="w-full h-[256px] mb-10  md:w-[330px] md:h-[295px] md:mb-30 ">
  <div class="">
    <iframe class= "w-[screen] md:w-full md:h-[195px] bg-black" src="${videoPlayerSrc}"></iframe>
  </div> */
    return `
      <div class="w-full h-[330px] mb-10  md:w-[330px] md:h-[295px] md:mb-3 ">
          <div class="">
            <iframe class= "w-full h-[220px] md:w-full md:h-[195px] bg-black z-[100]" src="${videoPlayerSrc}"></iframe>
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
 
  let btnPosition = null;
  function eachBrakPoint() {
    const breakpoints = [370, 768, 1024, 1250, 1360, 1670];
    const values = [210, 600, 850, 1050, 1160, 1700];
    
    for(let i = 0; i < breakpoints.length; i++) {
      if((window.innerWidth >= breakpoints[i]) && (window.innerWidth < breakpoints[i + 1])) {
        btnPosition = values[i];
      }
    }

    return btnPosition
  }
  
  eachBrakPoint()
  
  function changeBtnPosition() {
  
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach((item) => {
        const itemRect = item.getBoundingClientRect();

        const btnScrollLeftAfter = document.getElementById('btn-scroll-left-after');
        const btnScrollRightBefore = document.getElementById('btn-scroll-right-before');
    
        
        let btnLeftPosition = null;
        window.innerWidth > 1020 ? btnLeftPosition = 270 : btnLeftPosition = 30;
        if (((parseFloat(itemRect.x) > btnLeftPosition) && (item.children[0].textContent === "All"))) {
            scrollButtonLeft.classList.remove('flex');
            btnScrollLeftAfter.classList.remove('flex');
            scrollButtonLeft.classList.add('hidden');
            btnScrollLeftAfter.classList.add('hidden');
         
        } 
        else if(((parseFloat(itemRect.x) < btnLeftPosition) && (item.children[0].textContent !== "All"))) {
            scrollButtonLeft.classList.remove('hidden');
            btnScrollLeftAfter.classList.remove('hidden');
            scrollButtonLeft.classList.add('flex');
            btnScrollLeftAfter.classList.add('flex');
  
        }
    
        if(parseFloat(itemRect.x) < btnPosition){
            scrollButtonRight.style.display = 'none';
            btnScrollRightBefore.style.display = 'none';
     
        }
        else {
          scrollButtonRight.style.display = 'flex';
          btnScrollRightBefore.style.display = 'flex';

        }
        
    });
  }

  function addStyleNavOnlyAtFirstItemActive() {
    const navItem = document.querySelectorAll('.nav-item');
    navItem.forEach((item) => {
      item.classList.remove('nav-item-active')
    })
    navItem[0].classList.add('nav-item-active');
  }
  

  // EVENTS
  searchMostPopularVideos();
  youtubeLogo.addEventListener('click', searchMostPopularVideos);
  searchIcon.addEventListener("click", togglePrincipalNavAndQueryNav);
  arrowBack.addEventListener("click", togglePrincipalNavAndQueryNav);
  searchBtn.addEventListener("click", () => {
    const searchQuery = document.getElementById("search-query").value;
    addStyleNavOnlyAtFirstItemActive();
    searchVideosByQuery(searchQuery);
  });
  searchBtnMdLgScreens.addEventListener("click", () => {
    const searchQuery = document.getElementById("search-query-md-lg-screens").value;
    addStyleNavOnlyAtFirstItemActive();
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


  window.addEventListener('resize', eachBrakPoint);
  scrollContainer.addEventListener('scroll', changeBtnPosition);
  

  scrollButtonLeft.addEventListener('click', () => scrollContainer.scrollLeft -= 170);
  scrollButtonRight.addEventListener('click', () => scrollContainer.scrollLeft += 170);

    
})()
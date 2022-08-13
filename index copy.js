const Base_URL = 'https://movie-list.alphacamp.io'
const index_URL = Base_URL + '/api/v1/movies/'
const posters_URL = Base_URL + '/posters/'

const dataPanel = document.querySelector('#data-panel')
const searchFrom = document.querySelector('#search-from')
const searchInput = document.querySelector('#search-input')
const searchSubmit = document.querySelector('#search-submit')
const paginator = document.querySelector('#paginator')
const iconContainer = document.querySelector('#icon-container')
const listGroup = document.querySelector('#list-group')

const movies_Per_Page = 12
let filteredMovieList = []
// 放置 API Data array的容器
const movies = []
const pageNumber = 0


// 取得分頁要顯示的電影
// 新增一個data放置可能有的兩種movies答案
function getMoviesByPage(page) {
  // movies? "movies" : "filteredMovieList"
  const data = filteredMovieList.length ? filteredMovieList : movies
  const startIndex = (page - 1) * movies_Per_Page
  return data.slice(startIndex, startIndex + movies_Per_Page)
}
// 印出分頁總數
function renderPaginator(amount) {
  const getPageCount = Math.ceil(amount / 12)
  let pageCountRaw = ''
  for (let page = 0; page < getPageCount; page++) {
    pageCountRaw += `
<li class="page-item"><a class="page-link" href="#" data-page=${page + 1}>${page + 1}</a></li>
`
    paginator.innerHTML = pageCountRaw
  }
}


// 跳出對應的modal，從click的按鈕傳入id參數
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalRelease = document.querySelector('#movie-modal-data')
  const modalDescription = document.querySelector('#movie-modal-description')
  const modalImage = document.querySelector('#movie-modal-image')

  // axios show API 
  axios.get(index_URL + id)
    .then(res => {
      let modalInfo = res.data.results
      console.log(modalInfo)
      // 將內容放上
      modalTitle.innerText = modalInfo.title
      modalRelease.innerText = modalInfo.release_date
      modalDescription.innerText = modalInfo.description
      modalImage.innerHTML = `<img src="${posters_URL + modalInfo.image}" alt="movie-poster"
                class="img-fuid">`
    })
}

// 新增收藏
function addToFavorite(id) {
  // 讀取localStorage list 有就回傳值 沒有就回傳空陣列
  const favList = JSON.parse(localStorage.getItem('myFavoriteList')) || []
  // 取得id對應的電影data 使用.find()
  const movie = movies.find((movie) => movie.id === id)
  // find()裡函式的原始寫法
  // function isMovieItemMatches(movie) {
  //   return movie.id === id
  // }
  if (favList.some((movie) => movie.id === id)) {
    return alert('已在收藏清單中')
  }
  favList.push(movie)

  localStorage.setItem('myFavoriteList', JSON.stringify(favList))
}

// 取得點擊頁碼
paginator.addEventListener('click',
  function onPaginatorClicked(event) {
    // 確認點擊到的是不是<a>元素
    if (event.target.tagName !== 'A') return
    let pageNumber = Number(event.target.dataset.page)
    renderMovieList(getMoviesByPage(pageNumber))
  })


// 點擊more按鈕事件
dataPanel.addEventListener('click',
  function onDataPanelClicked(event) {
    // 確認click的按鈕是否是對的
    if (event.target.matches('.btn-show-movie')) {
      showMovieModal(Number(event.target.dataset.id))
    } else if (event.target.matches('.btn-add-favorite')) {
      addToFavorite(Number(event.target.dataset.id))
    }
  })

// search bar submit 事件
searchFrom.addEventListener('submit',
  function onSearchSubmitted(event) {
    event.preventDefault()
    let inputValue = searchInput.value.trim().toLowerCase()
    // 原本若輸入空白要alert，後來不用了，若打出空白即render所有電影
    // if (!inputValue.length) {
    //   alert('請輸入搜尋文字')
    // }

    // 第一種方法 使用迴圈
    //   for (const movie of movies) {
    //     if (movie.title.toLowerCase().includes(inputValue)) {
    //       filterdMovieList.push(movie)
    //     }
    //   }
    //   renderMovieList(filteredMovieList)
    // })

    // 第二種方法 filter()
    filteredMovieList = movies.filter(
      movie => movie.title.toLowerCase().includes(inputValue))

    if (filteredMovieList.length === 0) {
      return alert('搜尋不到 : ' + inputValue)
    }
    renderPaginator(filteredMovieList.length)
    renderMovieList(getMoviesByPage(1))
  })



// render Movie List
function renderMovieList(data) {
  let rawHTML = ''
  // 將代入的陣列拆解
  data.forEach((item => {
    // 取得資料 image、title
    rawHTML += `
            <div class="col-sm-3 mt-3">
              <div class="mb-2">
                <div class="card">
                  <img
                    src="${posters_URL + item.image}"
                    class="card-img-top" alt="Movie Poster">
                  <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                  </div>
                  <div class="card-footer text-muted">
                    <!-- Button trigger modal -->
                    <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                      data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                    <button type="button" class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                  </div>
                </div>
              </div>
            </div>
    `
  }))
  // render 到 dataPanel
  dataPanel.innerHTML = rawHTML
}


function renderMovieList_LIST(data) {
  let rawHTML = `<ul class="list-group list-group-flush" id="list-group">`
  // 將代入的陣列拆解
  data.forEach((item => {
    // 取得資料 image、title
    rawHTML += `
          <li class="d-flex mb-3 list-group-item align-items-center justify-content-around">
            <div class="me-auto p-2">
              ${item.title}
            </div>
            <div class=" p-2 position-absolute top-50 start-50 translate-middle">
              <button type=" button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button type="button" class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </li>
    `
  }))
  rawHTML += `</ul>`
  // render 到 dataPanel
  dataPanel.innerHTML = rawHTML

}


// card list切換
iconContainer.addEventListener('click', function onClickIcon(e) {
  if (e.target.matches('#icon-list')) {
    // renderPaginator(movies.length)
    renderMovieList_LIST(getMoviesByPage(1))
  } else {
    renderMovieList(getMoviesByPage(1))
  }
})


// 取得API Data
axios.get(index_URL)
  .then((res) => {
    // 獲取展開response第一種方法
    // for (let movie of res.data.results) {
    //   movies.push(movie)
    // }

    // 第二種方法
    movies.push(...res.data.results)

    // 呼叫分頁總數
    renderPaginator(movies.length)

    // 呼叫render Movie List function
    renderMovieList(getMoviesByPage(1))
  })
  .catch((err) => {
    console.log('Error:' + err)
  })


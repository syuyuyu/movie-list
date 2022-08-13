const Base_URL = 'https://movie-list.alphacamp.io'
const index_URL = Base_URL + '/api/v1/movies/'
const posters_URL = Base_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('myFavoriteList'))
const dataPanel = document.querySelector('#data-panel')



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
// 刪除收藏電影
function removeFavoriteItem(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  console.log(movies)
  movies.splice(movieIndex, 1)
  localStorage.setItem('myFavoriteList', JSON.stringify(movies))
  renderMovieList(movies)
}


// 點擊more按鈕事件
dataPanel.addEventListener('click',
  function onDataPanelClicked(event) {
    // 確認click的按鈕是否是對的
    if (event.target.matches('.btn-show-movie')) {
      showMovieModal(Number(event.target.dataset.id))
    } else if (event.target.matches('.btn-remove-fav')) {
      removeFavoriteItem(Number(event.target.dataset.id))
    }
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
                    <button type="button" class="btn btn-info btn-remove-fav" data-id="${item.id}">X</button>
                  </div>
                </div>
              </div>
            </div>
    `
  }))
  // render 到 dataPanel
  dataPanel.innerHTML = rawHTML
}

renderMovieList(movies)
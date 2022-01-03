window.addEventListener('DOMContentLoaded', function () {

  const body = document.querySelector("body");
  const ul = document.querySelector(".news");
  const postItem = document.querySelector(".item-post");
  const commentsList = document.querySelector(".comments-list");
  const nowUrl = document.location.href;
  let url = "https://gorest.co.in/public-api/posts";
  let newUrl = url + "?page=";
  let numberLastPage;
  let arrNews = [];
  const next = document.querySelector('.next');
  const prev = document.querySelector('.prev');
  const pagesBtn = document.querySelectorAll('.page');
  const pageNumber = document.querySelector('.page-number');

  if (location.search && nowUrl.includes("index.html")) {
    requestNews(url + location.search);
    let pageNav;
    if (location.search.substring(location.search.length = 7)) {
      pageNav = location.search.substring(location.search.length - 2)
    } else {
      pageNav = location.search.substring(location.search.length - 1)
    }
    let pageNumber = document.querySelector('.page-number');
    pageNumber.innerText = `Страница: ${pageNav}`;
  } else if (nowUrl.includes("post.html")) {
    const postUrl = "https://gorest.co.in/public-api/posts/";
    const commentUrl = "https://gorest.co.in/public-api/comments?post_id=";
    const nowUrl = document.location.href;
    const newsIdUrl = nowUrl.split("=")[1];

    requestPost(`${postUrl + newsIdUrl}`, `${commentUrl + newsIdUrl}`);

    const returnBtn = document.querySelector("#return-btn");

    returnBtn.addEventListener('click', () => {
      window.history.go(-1);
      requestNews(url + location.search);
      pageNumber.innerText = `Страница: ${pageNav}`;
      console.log('lalalal');
    });

  }




  //Делаем запрос на сервер, получаем овтет и заполняем сайт
  function requestNews(url) {
    const request = fetch(url);
    request
      .then((response) => {
        return response.json();
      })
      .then((posts) =>
        posts.data.forEach((post) => {
          arrNews = posts.data.slice();
          appendNews(post.id, post.title, post.body);
          numberLastPage = posts.meta.pagination.pages;
        })
      )
      .then((allNews) => getNews());
  }


  //Делаем запрос на сервер, чтобы получить полный пост
  function requestPost(urlPost, urlComments) {
    const requestPost = fetch(urlPost);
    requestPost
      .then((response) => {
        return response.json();
      })
      .then((post) => {
        const itemTitle = document.createElement("h2");
        itemTitle.classList.add("item-title");
        const itemBody = document.createElement("p");
        itemBody.classList.add("item-body");

        itemTitle.innerText = post.data.title;
        itemBody.innerText = post.data.body;

        postItem.append(itemTitle, itemBody);
      });

    const requestComments = fetch(urlComments);
    requestComments
      .then((response) => {
        return response.json();
      })
      .then((comment) => {
        comment.data.forEach((comment) => {
          const commentItem = document.createElement("li");
          commentItem.classList.add("comment-item");
          const commentTitle = document.createElement("div");
          commentTitle.classList.add("comment-title");
          const commentAuthor = document.createElement("span");
          commentAuthor.classList.add("comment-author");
          const commentMail = document.createElement("span");
          commentMail.classList.add("comment-mail");
          const commentText = document.createElement("p");
          commentText.classList.add("comment-text");

          commentItem.append(commentTitle, commentText);
          commentTitle.append(commentAuthor, commentMail);

          commentAuthor.innerText = comment.name;
          commentMail.innerText = comment.email;
          commentText.innerText = comment.body;

          commentsList.append(commentItem);
        });
      });
  }


  function changePages() {
    if (prev) {
      prev.disabled = true;
      prev.addEventListener('click', () => {
        pagesBtn.forEach(btn => {
          btn.textContent = +btn.textContent - pagesBtn.length;
          prev.disabled = +btn.textContent === 3;
          next.disabled = btn.textContent > numberLastPage;
        })
      })
    }

    if (next) {
      next.addEventListener('click', () => {
        pagesBtn.forEach(btn => {
          btn.textContent = +btn.textContent + pagesBtn.length;
          next.disabled = btn.textContent > numberLastPage;
          prev.disabled = +btn.textContent === 3;
        })
      })
    }
  }

  changePages();


  //Пагинация
  pagesBtn.forEach((page) =>
    page.addEventListener("click", function () {
      const number = this.textContent;
      console.log(number);
      const nowUrl = newUrl + number;
      console.log(nowUrl);
      pageNumber.innerText = `Страница: ${number}`;

      deleteNews();
      requestNews(nowUrl);
      updateURL(number);

    })
  )

  //Добавляем номер страницы к URL
  function updateURL(numberPage) {
    if (history.pushState) {
      let baseUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      let newUrl = baseUrl + `?page=${numberPage}`;
      history.pushState(null, null, newUrl);
    } else {
      console.warn("History API не поддерживается");
    }
  }

  /////////////

  //Фунцкия создающая новость и добавляющая ее в HTML
  function appendNews(id, name, description) {
    const li = document.createElement("li");
    li.classList.add("news-item");
    li.setAttribute("data-id", id);
    const title = document.createElement("h2");
    title.classList.add("item-title");
    const text = document.createElement("p");
    text.classList.add("item-body");

    title.innerText = name;
    text.innerText = description;

    li.append(title, text);

    ul.append(li);
  }
  /////////////

  //Удалить все новости
  function deleteNews() {
    ul.textContent = "";
  }
  /////////////

  //Получить NodeList всех ноовстей
  function getNews() {
    const nodesNews = document.querySelectorAll("li");

    nodesNews.forEach((news) =>
      news.addEventListener("click", function () {
        const newsId = this.attributes[1].value;
        document.location.href = `./post.html?postid=${newsId}`;
      })
    );
  }


  const name = document.createElement("h1");
  name.innerText = "Aleksey";
});

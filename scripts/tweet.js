'use strict'

// window.onload = function () {
//     console.log('Hello friend');
// }

$(document).ready(function () {
    console.log('Hello friend');

    // Get URL params values
    const queryString = window.location.search;
    console.log(queryString);

    const ulrParams = new URLSearchParams(queryString);
    console.log(ulrParams)

    const idParam = ulrParams.get('id');
    console.log(idParam);

    if (idParam) {
        $.ajax({
            method: 'get',
            url: 'http://localhost:3000/tweet/' + idParam,
            datatype: 'json',
            success: processResponse,
            error: showError
        });
    }

    function processResponse(data) {
        console.log(data);

        if (data.tweet) {
            appendTweet(data.tweet)
        }
    }

    function showError(jqXHR, statusText, error) {
        alert('Error with AJAX request. Show console for more information');
        console.log(error, statusText);
    }

    function appendTweet(dades) {
        // Contenedor ref para append
        var articles = document.getElementById('articles');

        // Contenedor general del artículo
        var article = document.createElement('article');
        article.classList.add('tweet');
        article.classList.add(dades._id);

        // Primer bloque
        var div = document.createElement('div');
        div.classList.add('profile');
        var image = document.createElement('img');
        image.classList.add('self-img');
        image.setAttribute('src', '../assets/img/61ri1JvQEJL.png');
        image.setAttribute('alt', 'perfil');
        var userName = document.createElement('p');
        userName.classList.add('user-name');
        userName.textContent = dades.user;
        var span1 = document.createElement('span');
        span1.classList.add('subtext');
        span1.textContent = ' @' + dades.nickname + ' · ' + moment(dades.date).fromNow();
        var span2 = document.createElement('span');
        var i = document.createElement('i');
        i.classList.add('fas');
        i.classList.add('fa-times');
        span2.appendChild(i);
        // Apppend
        div.appendChild(image);
        div.appendChild(userName);
        div.appendChild(span1);
        div.appendChild(span2);


        // Tweet
        var tweetText = document.createElement('p');
        tweetText.classList.add('tweetted');
        tweetText.textContent = dades.tweet

        // Segundo bloque
        var ul = document.createElement('ul');
        var li1 = document.createElement('li');
        var li2 = document.createElement('li');
        var li3 = document.createElement('li');
        var li4 = document.createElement('li');
        var i1 = document.createElement('i');
        i1.classList.add('far');
        i1.classList.add('fa-comment');
        var i2 = document.createElement('i');
        i2.classList.add('fas');
        i2.classList.add('fa-retweet');
        var i3 = document.createElement('i');
        i3.classList.add('fas');
        i3.classList.add('fa-heart');
        var i4 = document.createElement('i');
        i4.classList.add('fas');
        i4.classList.add('fa-upload');
        // Append
        li1.appendChild(i1);
        li2.appendChild(i2);
        li3.appendChild(i3);
        li4.appendChild(i4);

        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);
        ul.appendChild(li4);

        article.appendChild(div);
        article.appendChild(tweetText);
        article.appendChild(ul);

        // Listeners
        span2.addEventListener('click', function () {
            deleteTweet(dades._id);
        });

        article.addEventListener('click', function () {
            redirectToTweet(dades);
        });

        // Final append
        articles.prepend(article);
    }

});

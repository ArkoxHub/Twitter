'use strict'

const tweet_MaxLength = 240;

// Load Moment JS
moment().format();
moment.locale('es')

window.onload = function () {
    console.log("Hi friend");

    loadTweets();

    /**
     * LOAD TWEETS OF USER LOGED
     */
    function loadTweets() {
        $.ajax({
            method: 'get',
            url: 'http://localhost:3000/tweets/Arkox',
            dataType: 'json',
            data: 'Arkox',
            success: loadTimeLine,
            error: showError
        });
    }

    function loadTimeLine(data) {
        data.tweets.forEach(element => {
            appendTweet(element)
        });
    }

    /**
     * =======================================
     * LISTENER AND FUNCTION FOR WINDOW SCROLL
     * =======================================
     */

    // Listener Scroll Window
    window.onscroll = function () {
        scrollFunction();
    }

    // Listener Scroll Button
    var button_top = document.getElementById("scroll-button");
    button_top.addEventListener('click', scrollToTop);

    /**
     * This functions checks if the window scroll under 40 to the top windows
     * If yes, the button scrolls is shown, else not
     */
    function scrollFunction() {
        if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
            button_top.style.display = "block";
        } else {
            button_top.style.display = "none";
        }
    }

    /**
     * Scroll the window to the top (0)
     */
    function scrollToTop() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    /**
     * =======================================
     * END LISTENERS AND FUNCTIONS FOR WINDOWS SCROLL
     * =======================================
     */


    /**
     * =======================================
     * LISTENERS AND FUNCTIONS FOR TWEET FORM
     * =======================================
     */
    $('#form-tweet').submit(function (event) {
        event.preventDefault();

        var $inputTweet = $('#write-tweet').val();
        var $inputNickname = $('#nickname').val();

        $.ajax({
            url: 'http://localhost:3000/tweet',
            dataType: 'json',
            method: 'post',
            data: {
                tweet: $inputTweet,
                nickname: $inputNickname,
                user: $inputNickname
            },
            success: processarResposta,
            error: showError
        });
    });

    function processarResposta(dades, statusText, jqXHR) {
        if (dades.status === 'Success') {
            console.log('Tweet saved');
            $('#write-tweet').val('');
            $('#tweetLength').hide();
            $('#submitTweet').prop('disabled', true);

            // Afegim el Tweet
            appendTweet(dades.tweet);
        }
    }

    function showError(jqXHR, statusText, error) {
        alert('Error with AJAX request. Show console for more information');
        console.log(error, statusText);
    }


    /**
     * TEXT AREA of TWEET events
     * Calcula el total de carácteres restantes que puede escribir el usuario y
     * activa o desactiva el botón para enviar el tweet
     */
    $('#write-tweet').on('keydown keyup', function (event) {
        var $totalWords = $('#write-tweet').val().length;

        if ($totalWords === 0) {
            $('#tweetLength').hide();
            $('#submitTweet').prop('disabled', true);
        } else {
            $('#submitTweet').prop('disabled', false);
            $('#tweetLength').show();
            $('#tweetLength').text($totalWords + " / " + tweet_MaxLength)
                .css({
                    'color': 'white'
                });
        }
    });

    /**
     * =======================================
     * END LISTENERS AND FUNCTIONS FOR TWEET FORM
     * =======================================
     */


    /**
     * Función que recibe por parámetro un mensaje 200 de un Tweet
     * correctamente guardado en la Base de Datos y lo inserta (prepend) al
     * principio del TimeLine del usuario
     * @param {*} dades 
     */
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
        image.setAttribute('src', './assets/img/61ri1JvQEJL.png');
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

    function redirectToTweet(dades) {
        var url = 'http://127.0.0.1:5500/Components/tweet.html' + '?id=' + dades._id;
        window.location = url;
    }

    function deleteTweet(id) {
        event.stopPropagation();

        var confirmDelete = confirm('Quieres eliminar el tweet?');

        if (confirmDelete) {
            $.ajax({
                method: 'delete',
                url: 'http://localhost:3000/tweet/' + id,
                dataType: 'json',
                success: showDeleteConfirmation,
                error: showError
            })
        }
    }

    /**
     * Muestra confirmación para que el usuario elimine o no un Tweet y
     * si acepta, lo elimina del documento
     * @param {*} data 
     */
    function showDeleteConfirmation(data) {
        var article = document.getElementsByClassName(data.tweet._id);
        article[0].parentNode.removeChild(article[0]);
    }

}
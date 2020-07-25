'use strict'

// Global variables
const tweet_MaxLength = 240;

// Guardamos el usuario logueado
var userLogged = {}

// Load Moment JS
moment().format();
moment.locale('es')

window.onload = function () {
    console.log("Hi friend");

    checkUser();
    function checkUser() {
        var username = localStorage.getItem('twitter-username');
        var pwd = localStorage.getItem('twitter-password');

        if (username && pwd) {
            $.ajax({
                method: 'post',
                url: 'http://localhost:3000/user/login',
                data: {
                    user: username,
                    password: pwd
                },
                datatype: 'json',
                success: userResponse,
                error: function () {
                    alert('Servidor caído. Inténtelo de nuevo más tarde.')
                }
            });
        } else {
            window.location = 'http://127.0.0.1:5500/Components/login.html';
        }

    }
}

function userResponse(data) {
    if (data.status === 'Success') {
        userLogged = data.user[0];
        start();
    } else {
        window.location = 'http://127.0.0.1:5500/Components/login.html';
    }
}

function start() {
    // Si tiene datos de login, cargaremos la web
    loadTweets();

    /**
     * LOAD TWEETS OF USER LOGED
     */
    function loadTweets() {
        $.ajax({
            method: 'get',
            url: 'http://localhost:3000/tweets/' + localStorage.getItem('twitter-username'),
            dataType: 'json',
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
     * This functions checks if the window scroll is under 40 to the top windows
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
    * LISTENERS AND FUNCTIONS FOR MENU
    * =======================================
    */
    var moreOptionsNode = document.querySelector('#menu ul li:nth-child(9)');
    moreOptionsNode.addEventListener('click', showSubMenu);

    /**
     * Change the icon when the submenu is shown
     * Show the submenu when user clicks on "Más opciones"
     */
    function showSubMenu() {
        var icon = moreOptionsNode.childNodes[1].childNodes[0];
        if (icon.classList.contains('fa-ellipsis-h')) {
            icon.classList.remove('fa-ellipsis-h')
            icon.classList.add('fa-chevron-up')
        } else {
            icon.classList.add('fa-ellipsis-h')
            icon.classList.remove('fa-chevron-up')
        }

        var subnav = document.getElementById('subnav');
        subnav.classList.toggle('active');
    }

    /**
    * =======================================
    * ENDLISTENERS AND FUNCTIONS FOR MENU
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
        var $inputNickname = localStorage.getItem('twitter-username')

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
        article.setAttribute('id', dades._id);

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
        i2.classList.add('tweet-retweet');
        if (dades.total_Retweets > 0) {
            i2.textContent = ' ' + dades.total_Retweets;
        }
        if (userLogged.tweets_Retweet.includes(dades._id)) {
            i2.classList.add('user-retweet');
        }

        var i3 = document.createElement('i');
        i3.classList.add('fas');
        i3.classList.add('fa-heart');
        i3.classList.add('tweet-like');
        if (dades.total_Likes > 0) {
            i3.textContent = ' ' + dades.total_Likes
        }
        if (userLogged.tweets_Likes.includes(dades._id)) {
            i3.classList.add('user-like');
        }

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

        i2.addEventListener('click', updateUserInteractivity);
        i3.addEventListener('click', updateUserInteractivity);


        // Final append
        articles.prepend(article);
    }

    function redirectToTweet(dades) {
        var url = 'http://127.0.0.1:5500/Components/tweet.html' + '?id=' + dades._id;
        window.location = url;
    }

    /**
     * Listener que pregunta si el usuario quiere eliminar el tweet
     * definitivamente o no.
     * Si es que sí, envía la petición al servidor
     * @param {*} id 
     */
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
            });
        }
    }

    /**
     * A través del ID obtiene el Tweet encontrado
     * 
     * @param {String} id_Tweet ID del Tweet a obtener
     */
    function getTweetByID(id_Tweet) {
        $.ajax({
            method: 'get',
            url: 'http://localhost:3000/tweet/' + id_Tweet,
            datatype: 'json',
            success: function (data) { return data },
            error: showError
        });
    }

    /**
     * Modify the tweet object of the param in backend
     * 
     * @param {Object} tweet 
     */
    function updateTweet(tweetToUpdate) {
        $.ajax({
            method: 'put',
            url: 'http://localhost:3000/tweet/update',
            datatype: 'json',
            data: {
                tweet: tweetToUpdate
            },
            success: updateTweetDOM,
            error: showError
        });
    }

    /**
     * Receive the Tweet object found in backend and update the Tweet in DOM
     * @param {Object} data Tweet Object
     */
    function updateTweetDOM(data) {
        let nodeRetweet = document.getElementById(data.tweet._id).getElementsByClassName('tweet-retweet')[0];
        let nodeLike = document.getElementById(data.tweet._id).getElementsByClassName('tweet-like')[0];
        let totalRetweets = data.tweet.total_Retweets;
        let totalLikes = data.tweet.total_Likes
        if (totalRetweets === 0) {
            nodeRetweet.textContent = ' ';
        } else {
            nodeRetweet.textContent = ' ' + totalRetweets;
        }
        if (totalLikes === 0) {
            nodeLike.textContent = ' ';
        } else {
            nodeLike.textContent = ' ' + totalLikes;
        }
    }

    /**
     * Call the server function to update an exist user through the param user
     * 
     * @param {*} user UserModel Object
     */
    function updateUser(userToUpdate) {
        $.ajax({
            method: 'put',
            url: 'http://localhost:3000/user/update',
            datatype: 'json',
            data: {
                user: userToUpdate
            },
            success: updateUserVar,
            error: showError
        });
    }

    /**
     * Receive the response 200 from the server with the user updated
     * and save it on this file
     * @param {Object} User 
     */
    function updateUserVar(data) {
        userLogged = data.user;
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

    /**
     * When user click the retweet or heart icon of a tweet
     * this function update the user and the tweet
     * @param {*} event 
     */
    function updateUserInteractivity(event) {
        event.preventDefault();
        event.stopPropagation();

        var tweet_ID = this.parentNode.parentNode.parentNode.id;

        // Check which class have the element clicked by user
        if (this.classList.contains('tweet-like')) {
            checkUserHasItem(tweet_ID, this, 'like');
        }
        if (this.classList.contains('tweet-retweet')) {
            checkUserHasItem(tweet_ID, this, 'retweet');
        }

        // Updates
        updateUser(userLogged);
    }


    /**
     * Check if the User Loged has already liked or retweeted the clicked event
     * then updating user and tweet depending on the result
     * 
     * @param {String} tweet_ID ID of Tweet
     * @param {Node} element Node element where user clicked
     * @param {String} action Substract of classlist action of Element
     */
    function checkUserHasItem(tweet_ID, element, action) {

        // Checks for Likes
        if (action === 'like') {
            if (userLogged.tweets_Likes.includes(tweet_ID)) {
                var index = userLogged.tweets_Likes.indexOf(tweet_ID);
                if (index > -1) {
                    userLogged.tweets_Likes.splice(index, 1);
                    element.classList.remove('user-like');
                }
                modifyTweet(tweet_ID, element, '-');
            } else {
                userLogged.tweets_Likes.push(tweet_ID);
                modifyTweet(tweet_ID, element, '+');
                element.classList.add('user-like');
            }
        }

        // Checks for Retweets
        if (action === 'retweet') {
            if (userLogged.tweets_Retweet.includes(tweet_ID)) {
                var index = userLogged.tweets_Retweet.indexOf(tweet_ID);
                if (index > -1) {
                    userLogged.tweets_Retweet.splice(index, 1);
                    modifyTweet(tweet_ID, element, '-');
                    element.classList.remove('user-retweet');
                }
            } else {
                userLogged.tweets_Retweet.push(tweet_ID);
                modifyTweet(tweet_ID, element, '+');
                element.classList.add('user-retweet');
            }
        }

    }

    /**
     * Update tweet increasing or decreasing quanity of likes or retweets
     * @param {String} tweetID String of the Tweet Document to update
     * @param {*} element Element of DOM with the class to change
     * @param {*} action '+' to increase, '-' to decrease
     */
    function modifyTweet(tweetID, element, action) {
        fetch('http://localhost:3000/tweet/' + tweetID)
            .then(function (response) {
                return response.json()
            })
            .then(function (myTweet) {
                if (element.classList.contains('tweet-like')) {
                    if (action === '+') {
                        myTweet.tweet.total_Likes++;
                    }
                    if (action === '-') {
                        myTweet.tweet.total_Likes--;
                    }
                }
                if (element.classList.contains('tweet-retweet')) {
                    if (action === '+') {
                        myTweet.tweet.total_Retweets++;
                    }
                    if (action === '-') {
                        myTweet.tweet.total_Retweets--;
                    }
                }

                // Update the tweet with the updated field
                updateTweet(myTweet.tweet);
            });
    }
}
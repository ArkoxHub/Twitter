window.onload = () => {
    
    // Indicates if the user who access in this URL is the user logged in or other
    var userProfile = false;

    /**
     * Get the user depending if the person who access is the user logged or other
     */
    if (localStorage.getItem('twitter-username')) {
        var userName = localStorage.getItem('twitter-username');
        getUser(userName);
        userProfile = true;
    } else {
        try {
            const queryString = window.location.search;
            const ulrParams = new URLSearchParams(queryString);
            const userParam = ulrParams.get('username');
            getUser(userParam)
        } catch (err) {
            alert('Error al realizar la consulta.', console.log(err));
        }
    }

    /**
     * API-REST call to get the object
     * @param {Object} user 
     */
    function getUser(user) {
        $.ajax({
            method: 'GET',
            url: 'http://localhost:3000/user/' + user,
            datatype: 'json',
            success: userResponse,
            error: function () {
                alert('Servidor caído. Inténtelo de nuevo más tarde.')
            }
        });
    }

    // Receive user from API Rest and print it to header of profile main page
    function userResponse(data) {
        var user = data.user;

        var nicknameNodes = document.getElementsByClassName("nickname");
        for (nick of nicknameNodes) {
            nick.textContent = user.nickname;
        }

        var userNode = document.getElementById('content-user');
        userNode.textContent = '@' + user.user;

        if (user.bio) {
            var bioNode = document.getElementById('content-bio');
            bioNode.textContent = user.bio;
        }

        if (user.birthday) {
            var birthdayNode = document.getElementById('content-birthday');
            var birthdayDateFormated = moment(user.birthday).format('DD/MM/YYYY');
            birthdayNode.textContent = 'Fecha de nacimiento: ' +  birthdayDateFormated;
        }

        var joinNode = document.getElementById('content-join');
        var joinDateFormated = moment(user.creation_date).format('DD/MM/YYYY')
        joinNode.textContent = 'Se unió el ' + joinDateFormated;
        
        if (user.followers.length > 0) {
            var followersNode = document.getElementById('followers');
            followersNode.textContent = 'Siguiendo: ' + user.followers.length;
        }
        
        if (user.following.length > 0) {
            var followingNode = document.getElementById('following');
            followingNode.textContent = 'Seguidores: ' + user.following.length;
        }

    }

    // Get all tweets user logged
    function getUserTweets() {
        $.ajax({
            method: 'get',
            url: 'http://localhost:3000/tweets/' + localStorage.getItem('twitter-username'),
            dataType: 'json',
            success: printTotalTweets,
            error: function () {
                alert('Servidor caído. Inténtelo de nuevo más tarde.')
            }
        });
    }

    function printTotalTweets(data) {
        var userTweets = document.getElementById('total-tweets');
        userTweets.textContent = data.tweets.length + ' Tweets';
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
    button_top.addEventListener('click', scrollTo(document.documentElement, 0, 1250));

    var toTop = document.getElementById("scroll-button");
    toTop.addEventListener("click", () => { scrollToTop(100) });

    /**
     * 
     * @param {Number} scrollDuration ms to scroll to top
     */
    function scrollToTop(scrollDuration) {
        var scrollStep = -window.scrollY / (scrollDuration / 15),
            scrollInterval = setInterval(function () {
                if (window.scrollY != 0) {
                    window.scrollBy(0, scrollStep);
                }
                else clearInterval(scrollInterval);
            }, 15);
    }

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
}
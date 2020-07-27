window.onload = () => {

    // Load profile of userLogged or other depending if url includes string profile or not
    if (isProfileWindow) {
        getUser(localStorage.getItem('twitter-username'))
    } else {
        // Via Tweet Object need to substract the user name and send it as param
        console.log('TO DO')
        // getUser()
    }

    getUserTweets();

    function getUser(user) {
            $.ajax({
                method: 'GET',
                url: 'http://localhost:3000/user/'+ user,
                datatype: 'json',
                success: userResponse,
                error: function () {
                    alert('Servidor caído. Inténtelo de nuevo más tarde.')
                }
            });
    }

    function isProfileWindow() {
        var url = window.location.href;
        if (url.includes('profile')) {
            return true;
        } else {
            return false;
        }
    }

    // Receive user from API Rest and print it to header
    function userResponse(data) {
        var userLogged = data.user;
        var userName = document.getElementById('userName');
        userName.innerHTML = userLogged.nickname
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
'use strict'

window.onload = function () {
    console.log("Hi friend");

    /**
     * LISTENERS
     */

    // Listener Scroll Window
    window.onscroll = function () {
        scrollFunction();
    }

    // // Resize listeners
    // window.onresize = function(event) {
    //     onResizeFunction();
    // }

    // END LISTENERS


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

    // function onResizeFunction(event) {
    //     var menu = document.getElementsByClassName('menu-link');
    //     if (window.innerWidth <= 1300) {
    //         console.log(menu);
    //         for (var i = 0; i < menu.length; i ++) {
    //             var child = menu[i].lastElementChild;
    //             child.style.display = 'none'
    //         }
    //     } else {
    //         for (var i = 0; i < menu.length; i ++) {
    //             var child = menu[i].lastElementChild;
    //             child.style.display = 'block'
    //         }
    //     } 
    // }
}



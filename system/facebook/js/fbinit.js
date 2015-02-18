window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
        appId      : '172436709579508',                        // App ID from the app dashboard
        status     : true                                 // Check Facebook Login status
    });
    fbApiInit = true;
// Additional initialization code such as adding Event Listeners goes here
};

// Load the SDK asynchronously
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

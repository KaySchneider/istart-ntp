/**
 *  connect the data from the weather api!
 *  this thing should be outsourced in an 
 *  background script so that this thing can 
 *  be perform much faster
 * 
 */


var app = function () {
    
    this.timerid = null;//timer id for the js timer
    
    
    /**
     * init at all
     */
    this.init = function () {
        this.ensureFBApiInitTimter();
    };
    
    /*
     *ensure that the facebook sdk is fully loaded
     *use an small timer!
     **/
    this.ensureFBApiInitTimter = function () {
       
        try {
            if(document.getElementById('FB').contentWindow.FB === undefined) {
            
       /*         setTimeout(function() {
                 
                    appO.ensureFBApiInitTimter()
                }, 100); */
            } else {
                this.afterFacebookInit();
            }
        } catch(e) {
            
            /* setTimeout(function() {
                appO.ensureFBApiInitTimter()
            }, 100); */
        }
        
        
    };
    
    /**
     * call this init method to start fetching new statuses from 
     * the facebook server
     */
    this.afterFacebookInit = function () {
        //console.log("FB", document.getElementById('FB').contentWindow.FB);
    };
    
    
};

/**
 
app.prototype.init = function () {
    
    FB.api('/me', function(response) {
        //console.log('Your name is ' + response.name);
    });
};
*  
 */






var appO = new app();
appO.init();


//var screen = new weatherDisplay();

var live = new livetile(document.getElementById('master'));

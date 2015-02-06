# istart-ntp
istart-ntp new tab page for chrome in version 2 with material design.     
This Software is OpenSource with the GPL license.     
More Information in  file LICENSE



# Install dependencies on your local machine

* switch to app/ directory and run "npm install"
* run in the same directory "bower isntall
* switch to app/backendScript and run "bower install"

# Create a build of iStart on your local machine
* switch to dir app/ and install local grunt
* switch to the main directory and run      

  ```  
    grunt ---gruntfile app/Gruntfile.js  --force
  ```       
     
* We need --force because the Gruntfile should be moved to the root dir of istartV2 ;)
* now you can load the extension in chrome    
   If you dont know how to load a local extension or app into chrome take a look at this help page:   
    
    https://developer.chrome.com/extensions/getstarted#unpacked


# Internal API Information

* rootScope events avaiable:     
    * broadcast: 'addNewTile':     
      Adds a new tile to the "Main Tile Desktop Controller". This event will be triggered from
      the addNewTile Directive.
        


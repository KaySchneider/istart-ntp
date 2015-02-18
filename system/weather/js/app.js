/**
 *  connect the data from the weather api!
 *  this thing should be outsourced in an 
 *  background script so that this thing can 
 *  be perform much faster
 *
 * now we use the weatherundergroundAPI for this method
 * and implement "chrome message passing system for sending message to chrome users from myself when something is happens to
 * the backend from the app"
 */


var app = function () {
    this.location = 'Stuttgart';
    this.apiEndpoint = "http://weather.service.msn.com/data.aspx?weadegreetype=C&culture=en-US&weasearchstr=Chicago,IL";
    this.weadegreetype = 'C'; //C =celsious or F=farenheit
    this.culture = 'en-US';
    this.weasearchstr= 'Chicago,IL'; //the location for the weather api
};



app.prototype.init = function () {
    this.getCurrentWeatherData();
};

/**
 * load the data from the local storage
 */
app.prototype.loadDataFromLocalStorage = function () {
    
    };

/**
 * parse the received data from msn
 */
app.prototype.parseData = function () {
    
    };

/**
 * set an value in the config
 */
app.prototype.setconfig = function (key, value) {
    
    };

app.prototype.setLang = function (value) {
    this.setconfig('culture',value);
};

/**
 * set the tempareture degree type
 */
app.prototype.setTemperature = function (value) {
    
    this.setconfig('weadegreetype',value);
};

/**
 * set the location and check it before it will be saved into the 
 * config. To check the location we makean lookupcall to the msn weeather api
 */
app.prototype.setLocation = function (value) {
    
    };

/**
 *
 */
app.prototype.checkLocation = function () {
    
    };

/**
 * 
 * the weather api caller
 * 
 */

app.prototype.getCurrentWeatherData = function () {
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.apiEndpoint, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // WARNING! Might be injecting a malicious script!
            //console.log(xhr.responseText);
            parser=new DOMParser();
            xmlDoc=parser.parseFromString(xhr.responseText,"text/xml");
            
            //if there is a 1 everything will be fine
            var checkSum = xmlDoc.getElementsByTagName('weather').length;
            
            
            var weather = xmlDoc.getElementsByTagName('weather');
            //loactionName get the encoded location name as string
            var locationName = weather[0].getAttribute('weatherlocationname');
            var image = weather[0].getAttribute('imagerelativeurl');
            var provider = weather[0].getAttribute('provider');
            var degreetype  = weather[0].getAttribute('degreetype');
            var alert = weather[0].getAttribute('alert');
            
            var current =xmlDoc.getElementsByTagName('current');
            var currentWeather = that.parseDay(current[0]);
            
            var nextdays  = that.parseforecast(xmlDoc.getElementsByTagName('forecast'));
            var save = {
                'dd':currentWeather, 
                'ww':nextdays
            };
            /**
             * save the weatherData in localStorage
             */
            //console.log(save, 'SAVE');
            localStorage.istartweather = JSON.stringify(save);
        // //console.log(currentWeather, nextdays);
            
        //  //console.log(checkSum,locationName,xmlDoc.getElementsByTagName('weather'));
        //  //console.log( xmlDoc.getElementsByTagName('weatherdata').length );
            
        }
    }
    xhr.send();
};

/**
 * parse the weather for the next comming days
 */
app.prototype.parseforecast = function (forecast) {
    var items = forecast.length;
    var nextdays = [];
    for(var i in forecast) {
        try {
            //console.log(forecast[i] );
            if(forecast[i] != undefined) {
                nextdays.push(this.parseDay(forecast[i]));
            }
        }catch(e) {
            
        }
    }
    
    return nextdays;
};

app.prototype.parselocation = function (weatherTag) {
    var location = weatherTag.getAttribute('');
};
/**
 * parse the weather of the day
 */
app.prototype.parseDay = function (daynode) {
    var weather = {};
    weather.ctemperature = daynode.getAttribute('temperature');
    weather.skycode = daynode.getAttribute('skycode');
    weather.skytext = daynode.getAttribute('skytext');
    weather.date = daynode.getAttribute('date');
    weather.day = daynode.getAttribute('day');
    weather.observationtime = daynode.getAttribute('observationtime');
    weather.observationpoint = daynode.getAttribute('observationpoint');
    weather.feelslike = daynode.getAttribute('feelslike');
    weather.winddisplay = daynode.getAttribute('winddisplay');
    weather.low = daynode.getAttribute('low');
    weather.high = daynode.getAttribute('high');
    weather.skycodeday = daynode.getAttribute('skycodeday');
    weather.skytextday = daynode.getAttribute('skytextday');

    return weather;
};

/**
 * object for manage the visulation of the 
 * weather data
 */
var weatherDisplay = function () {
    this.loadData();
};

/**
 * load the weatherdata from the local Storage
 */
weatherDisplay.prototype.loadData = function () {
    this.data = JSON.parse(localStorage.istartweather);
    this.buildView();
};

weatherDisplay.prototype.buildView = function () {
    var template = document.getElementById('wtemplate');
    this.buildToday();
    this.buildForecast();
};

/***
 * build the forecast weather template
 * for the next upcoming days
 */
weatherDisplay.prototype.buildForecast = function () {
    for(day in this.data.ww) {
        var forecast = this.data.ww[day];
        this.renderForecast(forecast);
    }
};

weatherDisplay.prototype.renderForecast = function(data) {
    var tmpl = document.getElementsByClassName('forecast')[0].cloneNode(true);
    tmpl.classList.remove('forecast');
    var inner = tmpl.innerHTML.replace('{{city}}',data.observationpoint)
                              .replace('{{cloudtext}}',data.skytextday)
                              .replace('{{low}}', data.low)
                              .replace('{{high}}', data.high)
                              .replace('{{date}}', data.date)
                              .replace('{{day}}', data.day)
    ;
    
    tmpl.innerHTML = inner;
    this.injectMaster(tmpl);
};

weatherDisplay.prototype.buildToday = function () {
   
    var todaytmpl = document.getElementsByClassName('today');
    var tc = todaytmpl[0].cloneNode(true);
    
    var dhtml =  tc.innerHTML.replace('{{city}}', this.data.dd.observationpoint )
    .replace('{{temperature}}',this.data.dd.ctemperature)
    .replace('{{date}}', this.data.dd.observationtime)
    ;
    tc.innerHTML = dhtml;
    this.injectMaster(tc);
//var html = tmpl.replace('{{city}}',this.data.location);
    
};

weatherDisplay.prototype.injectMaster = function (html) {
    document.getElementById('master').appendChild(html);
};


/**
 * support for the animations
 * i dont use jquery for better 
 * loading performance 
 */
var livetile = function (element) {
    this.element = element;
    this.step = 125;
    this.timerid = null;
    this.maxMove = this.element.childNodes.length;
    this.actMove = 0;
    this.direction = '-';
    this.startTimer();
};

/**
 * starts the timeout and the delay
 */
livetile.prototype.startTimer = function () {
    var that = this;
    this.timerid = setInterval(that.start, 4500,that);
};

/**
 * make the animation
 */
livetile.prototype.start = function (that) {
 
    switch(that.direction) {
        case '-':
            if(that.actMove < that.maxMove-2) {
                 that.element.style['top'] =  that.element.style['top'].replace('px','') - that.step  + 'px';
                that.actMove++;
            } else {
                that.direction = '+';
                that.start(that);
            }
            break;
        case '+':
              if(that.actMove != 0) {
                 that.element.style['top'] =  parseInt(that.element.style['top'].replace('px','')) + that.step  + 'px';
                 that.actMove--;
            } else {
                that.direction = '-';
                that.start(that);   
            }
            break;
    }
};



var appO = new app();
appO.init();
var screen = new weatherDisplay();

var live = new livetile(document.getElementById('master'));

'use strict';
var app  = angular.module('istart');
app.factory('matrix', ['$q', 'backgroundMessage',  '$window', '$http', '$rootScope',
    function ($q, backgroundMessage, $window, $http, $rootScope) {
    var useTinfoilShielding = false;
    var matrixCopy = null;
    var chrome = $window.chrome;
    var importTemp=[];
    var matrixService = function () {
        this.getMyLog = function() {
          console.log('YOu CALLED GET MY LOG');
        };

        this.saveFirstRun = function() {
            console.log("save first run");
          var istartd = [
                            [
                                    [{"name":"Welcome Tile","description":"Helps you save time during your first steps","iswidget":true,"extensionid":"welcomehey","fullscreen":"chrome-extension://lkgdlmlmcijgnglfcophfjhafiafhkae/system//instagram/html/instaWidget.html#/home","src":"chrome-extension://lkgdlmlmcijgnglfcophfjhafiafhkae/system/instagram/html/instaWidget.html","multiple":true,"min_width":2,"min_height":2,"color":"#00899e"}],[{"name":"topSites","description":"access fast and easy your topSites","iswidget":true,"extensionid":"topsites","fullscreen":"chrome-extension://lkgdlmlmcijgnglfcophfjhafiafhkae/system//topsites/html/fullscreen.html","src":"chrome-extension://lkgdlmlmcijgnglfcophfjhafiafhkae/system//topsites/html/widget.html","multiple":true,"min_width":1,"min_height":1,"w":2,"h":2,"color":"#00899e"}],[{"w":1,"h":1,"link":"http://maps.google.com","icon":"googleplaces","label":"Maps","color":"#00899e"}],[{"name":"youtube search","description":"Search facebook directly from the tile","iswidget":true,"issearch":true,"config":{"tld":["com"],"domain":"www.youtube","url":"/results?search_query={{search}}","defaultld":["com"],"color":"orange","label":"youtube","icon":"youtube","useredit":["color"],"link":"http://www.youtube.com?tag="},"extensionid":"youtubesearch","src":false,"multiple":false,"min_width":1,"min_height":1,"w":1,"h":1,"color":"orange"}],[{"w":1,"h":1,"color":"#b81c46","icon":"mail","link":"http://mail.google.com","label":"G-Mail"}],[{"name":"ebay search","description":"Search ebay directly from the tile","iswidget":true,"issearch":true,"config":{"tld":["com","de","ch"],"tag":{"com":"istarte-20","de":"istart-21"},"partnerid":{"com":{"url":"/rover/1/711-53200-19255-0/1","icep_vectorid":"229466"},"de":{"url":"/rover/1/5222-53480-19255-0/1","icep_vectorid":"229536"},"ch":{"url":"/rover/1/707-53477-19255-0/1","icep_vectorid":"229487"}},"domain":"rover.ebay.com/rover/1/711-53200-19255-0/1?icep_ff3=1&pub=5575038039&toolid=10001&campid=5337372289&customid=&ipn=psmain&icep_vectorid=229466&kwid=902099&mtid=824&kw=lg","domainSearch":"rover.ebay.com","url":"/s/?field-keywords={{search}}&tag={{tag}}","icon":"ebay","label":"ebay","color":"rgb(218, 83, 44)","useredit":["tld","color","cat"],"defaultld":["com"],"buildLink":[null],"link":"http://rover.ebay.com/rover/1/711-53200-19255-0/1?icep_ff3=1&pub=5575038039&toolid=10001&campid=5337372289&customid=&ipn=psmain&icep_vectorid=229466&kwid=902099&mtid=824&kw=lg.com?tag=istarte-20"},"extensionid":"ebaysearch","src":false,"multiple":false,"min_width":1,"min_height":1,"w":2,"h":1,"color":"rgb(218, 83, 44)"}],[{"name":"Amazon search","description":"Search Amazon directly from the tile","iswidget":true,"issearch":true,"config":{"tld":["com","de","fr","co.uk","it","cn","ca","es"],"tag":{"com":"istarte-20","de":"istart-21","co.uk":"istarte-21","it":"istarta-21","fr":"istartb-21","es":"istartes-21"},"domain":"www.amazon","url":"/s/?field-keywords={{search}}&tag={{tag}}","icon":"amazon","label":"amazon","color":"#008641","useredit":["tld","color"],"defaultld":"de","link":"http://www.amazon.de?tag=istart-21"},"extensionid":"amazonsearch","src":false,"multiple":false,"min_width":1,"min_height":1,"w":2,"h":2,"color":"#008641"}],[{"w":2,"h":1,"color":"#ba1d48","link":"http://www.deviantart.com/","label":"deviantArt"}],[{"w":1,"h":1,"color":"#95009d","icon":"wikipedia","link":"http://Wikipedia.com","label":"Wikipedia"}],[{"w":2,"h":1,"color":"#662D91","icon":"imagegoogledocs","link":"https://plus.google.com/u/0/photos","label":"G-Photos"}],[{"name":"Google search","description":"Search on Google :)","iswidget":true,"issearch":true,"config":{"tld":["com","de","it","co.uk","fr"],"domain":"www.google","url":"/search?q={{search}}","defaultld":["com"],"color":"#95009d","label":"Google","icon":"google","useredit":["color"],"link":"http://www.google.com?tag="},"extensionid":"googlesearch","src":false,"multiple":false,"min_width":1,"min_height":1,"w":2,"h":1,"color":"#95009d"}],[{"w":2,"h":1,"color":"#008641","icon":"googleplay","link":"https://play.google.com/store","label":"G-Play"}],[{"w":2,"h":1,"color":"#0072BC","icon":"googlecalendar","link":"https://www.google.com/calendar","label":"calendar"}],[{"w":2,"h":1,"color":"#662D91","icon":"chromewebstore","link":"https://chrome.google.com/webstore","label":"chrome webstore"}],[{"name":"facebook search","description":"Search facebook directly from the tile","iswidget":true,"issearch":true,"config":{"tld":["com"],"domain":"facebook","url":"/search/results.php?q={{search}}","defaultld":["com"],"color":"rgb(64, 67, 204)","label":"facebook","useredit":["color"],"link":"http://facebook.com?tag="},"extensionid":"facebooksearch","src":false,"multiple":false,"min_width":1,"min_height":1,"w":2,"h":1,"color":"rgb(64, 67, 204)"}],[{"name":"InstagramTopPictures","description":"live tile with instagram top pictures","iswidget":true,"fullscreen":"chrome-extension://dlblimgocfjjlehpaclefllmdiijjkfo/html/instaWidget.html","src":"chrome-extension://dlblimgocfjjlehpaclefllmdiijjkfo/html/instaWidget.html","sendClick":true,"multiple":true,"min_width":2,"min_height":2,"extensionid":"dlblimgocfjjlehpaclefllmdiijjkfo","color":"#00899e"}],[{"name":"Pinterest search","description":"Search pins on Pinterest","iswidget":true,"issearch":true,"config":{"tld":["com"],"domain":"www.pinterest","url":"/search/pins/?q={{search}}","defaultld":["com"],"color":"#cb2027","label":"Pinterest","icon":"pinterest","useredit":["color"],"link":"http://www.pinterest.com?tag="},"extensionid":"pinterestsearch","src":false,"multiple":false,"min_width":1,"min_height":1,"w":2,"h":1,"color":"#cb2027"}]],[[{"w":2,"h":2,"color":"#00a100","icon":"googleplus","link":"http://plus.google.com","label":"G+"}],[{"w":2,"h":1,"color":"#1C1C1C","icon":"googledrive","link":"https://drive.google.com/","label":"Gdrive"}],[{"w":2,"h":1,"color":"#1C1C1C","icon":"chartgoogledocs","link":"http://translate.google.de/","label":"G-translate"}],[{"w":2,"h":1,"color":"#da532c","link":"http://myspace.com","label":"myspace"}],[{"w":2,"h":1,"color":"#da532c","link":"http://tumblr.com","label":"tumblr"}],[{"w":2,"h":1,"color":"#d64e2a","link":"http://www.bbc.com/","label":"BBC"}],[{"w":2,"h":1,"link":"http://www.underarmour.com","label":"underarmour"}],[{"w":2,"h":1,"color":"#009900","link":"http://www.urbanoutfitters.com","label":"urbanoutfitters"}],[{"w":4,"h":2,"color":"#481bc4","icon":"ebay","link":"http://ebay.com","label":"ebay"}],[{"w":2,"h":1,"color":"#9900a1","link":"http://www.stumbleupon.com/","label":"stumbleupon"}]],[[{"w":2,"h":1,"color":"orange","link":"http://reddit.com","label":"reddit"}],[{"w":2,"h":1,"color":"#b31b42","link":"https://news.google.com/","label":"G-News"}],[{"w":2,"h":1,"color":"#d64e2a","link":"http://www.nytimes.com/","label":"New York times"}],[{"w":2,"h":1,"icon":"twitter","link":"http://www.twitter.com/","label":"twitter"}]],[[{"h":1,"w":2,"icon":"chrome://extension-icon/aciahcmjmecflokailenpkdchphgkefd/128/0","link":"http://entanglement.gopherwoodstudios.com/","label":"Entanglement Web App","app":true,"appid":"aciahcmjmecflokailenpkdchphgkefd"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/agdbnpodkgflemjpckmcdgabbmefpfnb/128/0","link":"chrome-extension://agdbnpodkgflemjpckmcdgabbmefpfnb/main.html","label":"mention","app":true,"appid":"agdbnpodkgflemjpckmcdgabbmefpfnb"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/aiahmijlpehemcpleichkcokhegllfjl/128/0","link":"https://www.duolingo.com/","label":"Duolingo","app":true,"appid":"aiahmijlpehemcpleichkcokhegllfjl"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/aohghmighlieiainnegkcijnfilokake/128/0","link":"chrome-extension://aohghmighlieiainnegkcijnfilokake/main.html","label":"Google Docs","app":true,"appid":"aohghmighlieiainnegkcijnfilokake"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/aojkhheioppkagakjfappppniaaglbjc/128/0","link":"","label":"iSnap Pro -inoffizieller client for snapchat™","app":true,"appid":"aojkhheioppkagakjfappppniaaglbjc"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/apboafhkiegglekeafbckfjldecefkhn/128/0","link":"https://www.lucidchart.com/documents/driveApp","label":"Lucidchart diagrammer – Online","app":true,"appid":"apboafhkiegglekeafbckfjldecefkhn"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/apdfllckaahabafndbhieahigkjlhalf/128/0","link":"https://drive.google.com/?usp=chrome_app","label":"Google Drive","app":true,"appid":"apdfllckaahabafndbhieahigkjlhalf"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/baijekkfedgoapgaafkbhoajfpaenpdb/128/0","link":"chrome-extension://baijekkfedgoapgaafkbhoajfpaenpdb/main.html","label":"Conveyor","app":true,"appid":"baijekkfedgoapgaafkbhoajfpaenpdb"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/bhdheahnajobgndecdbggfmcojekgdko/128/0","link":"https://www.desmos.com/calculator","label":"Desmos Graphing Calculator","app":true,"appid":"bhdheahnajobgndecdbggfmcojekgdko"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/blpcfgokakmgnkcojhhkbfbldkacnbeo/128/0","link":"http://www.youtube.com/?feature=ytca","label":"YouTube","app":true,"appid":"blpcfgokakmgnkcojhhkbfbldkacnbeo"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/boeajhmfdjldchidhphikilcgdacljfm/128/0","link":"http://www.facebook.com/?ref=cws","label":"Facebook","app":true,"appid":"boeajhmfdjldchidhphikilcgdacljfm"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/cjaibgdfaifnnjollpannioonpleckpj/128/0","link":"https://www.shoplocket.com/","label":"ShopLocket","app":true,"appid":"cjaibgdfaifnnjollpannioonpleckpj"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/cnkjkdjlofllcpbemipjbcpfnglbgieh/128/0","link":"https://play.spotify.com/?utm_source=google&utm_medium=bd_consumer&utm_campaign=acquisition_chromewebstore_gb&utm_content=gb500008","label":"Spotify - Music for every moment","app":true,"appid":"cnkjkdjlofllcpbemipjbcpfnglbgieh"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/coobgpohoikkiipiblmjeljniedjpjpf/128/0","link":"http://www.google.com/webhp?source=search_app","label":"Google-Suche","app":true,"appid":"coobgpohoikkiipiblmjeljniedjpjpf"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/deegloljmdbfbjhlimieancmcfombgjj/128/0","link":"http://chrome.goodnoows.com/","label":"Good News","app":true,"appid":"deegloljmdbfbjhlimieancmcfombgjj"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/dlppkpafhbajpcmmoheippocdidnckmm/128/0","link":"http://plus.google.com/?utm_source=chrome_ntp_icon&utm_medium=chrome_app&utm_campaign=chrome","label":"Google+","app":true,"appid":"dlppkpafhbajpcmmoheippocdidnckmm"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/dnfkmehkjocihlfmcjkmdiekloihfaog/128/0","link":"http://bestutilityapps.chromeosapps.org/Best-Utility-App.htm","label":"Best Utility Apps","app":true,"appid":"dnfkmehkjocihlfmcjkmdiekloihfaog"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/ehcibdjmpjlekgjhepbfmenfppliikcj/512/0","link":"http://pixlr.com/o-matic/","label":"Pixlr-o-matic","app":true,"appid":"ehcibdjmpjlekgjhepbfmenfppliikcj"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/ejcimlnjdmkgappmhhmefkloocbephjh/128/0","link":"http://app.cyfe.com/","label":"Cyfe","app":true,"appid":"ejcimlnjdmkgappmhhmefkloocbephjh"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/ejjicmeblgpmajnghnpcppodonldlgfn/128/0","link":"https://www.google.com/calendar/","label":"Google Kalender","app":true,"appid":"ejjicmeblgpmajnghnpcppodonldlgfn"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/fdmmgilgnpjigdojojpjoooidkmcomcm/128/0","link":"chrome-extension://fdmmgilgnpjigdojojpjoooidkmcomcm/index.html","label":"Postman - REST Client","app":true,"appid":"fdmmgilgnpjigdojojpjoooidkmcomcm"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/jcafjdhiidcpdgpdbpnllmpheogojkfl/128/0","link":"http://veryawesomeworld.com/awesomebook/","label":"An Awesome Book!","app":true,"appid":"jcafjdhiidcpdgpdbpnllmpheogojkfl"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/fehglckagmhgeakoppmlbpojlfcedgmk/128/0","link":"http://play.greenchiligames.com/FlappyWingsFlash/","label":"Flappy Wings","app":true,"appid":"fehglckagmhgeakoppmlbpojlfcedgmk"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/fgacgeibpdjllcjckbmgecpahipdjabe/128/0","link":"http://www.chromeweblab.com/","label":"Web Lab","app":true,"appid":"fgacgeibpdjllcjckbmgecpahipdjabe","color":"#00899e"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/fgdgokchhicmaiacmgegjnppjkgogdhm/128/0","link":"http://www.picmonkey.com/","label":"PicMonkey","app":true,"appid":"fgdgokchhicmaiacmgegjnppjkgogdhm"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/gbchcmhmhahfdphkhkmpfmihenigjmpp/128/0","link":"chrome-extension://gbchcmhmhahfdphkhkmpfmihenigjmpp/main.html","label":"Chrome Remote Desktop","app":true,"appid":"gbchcmhmhahfdphkhkmpfmihenigjmpp"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/fjliknjliaohjgjajlgolhijphojjdkc/128/0","link":"https://www.wunderlist.com/","label":"Wunderlist - To-do and Task list","app":true,"appid":"fjliknjliaohjgjajlgolhijphojjdkc"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/fkkaebihfmbofclegkcfkkemepfehibg/128/0","link":"http://www.wunderground.com/auto/wxmap/","label":"Full Screen Weather","app":true,"appid":"fkkaebihfmbofclegkcfkkemepfehibg"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/fkmopoamfjnmppabeaphohombnjcjgla/128/0","link":"http://www.springpad.com/chromestore.action?app_version=4","label":"Springpad","app":true,"appid":"fkmopoamfjnmppabeaphohombnjcjgla"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/fmedapekkakaehidplfhmblngkelolaj/128/0","link":"http://chrome.voodoofriends.com/","label":"Voodoo Friends","app":true,"appid":"fmedapekkakaehidplfhmblngkelolaj"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/gheikhdfflhlbemfmhcfpeblehemeklp/128/0","link":"http://neave.com/planetarium/app/","label":"Planetarium","app":true,"appid":"gheikhdfflhlbemfmhcfpeblehemeklp"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/gmcpblgjjcbhjdjhfbodifkopaigckel/128/0","link":"http://bestfreeappsweekly.chromeosapps.org/Free-Chrome-Apps-Weekly.htm","label":"Best Free Apps - Weekly","app":true,"appid":"gmcpblgjjcbhjdjhfbodifkopaigckel"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/gonbigodpnfghidmnphnadhepmbabhij/128/0","link":"chrome-extension://gonbigodpnfghidmnphnadhepmbabhij/index.html","label":"Cryptocat","app":true,"appid":"gonbigodpnfghidmnphnadhepmbabhij"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/hiigmadmngbpbmacbkfngpkjfmmpagfk/128/0","link":"http://jsfiddle.net/","label":"jsFiddle","app":true,"appid":"hiigmadmngbpbmacbkfngpkjfmmpagfk"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/hjkdhkejcnlmkfdodbkdkelefnkobfif/128/0","link":"http://vimeo.com/couchmode","label":"Vimeo Couch Mode","app":true,"appid":"hjkdhkejcnlmkfdodbkdkelefnkobfif"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/hkcinnjkbadjnadeikbfifiifppgebfo/128/0","link":"","label":"iSnap - inoffizieller client for snapchat™","app":true,"appid":"hkcinnjkbadjnadeikbfifiifppgebfo"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/hkpcelemhneoooapbbopolpjhmbfmnbf/128/0","link":"http://www.npr.org/infiniteplayer","label":"NPR Infinite Player","app":true,"appid":"hkpcelemhneoooapbbopolpjhmbfmnbf"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/hmjkmjkepdijhoojdojkdfohbdgmmhki/128/0","link":"","label":"Google Keep","app":true,"appid":"hmjkmjkepdijhoojdojkdfohbdgmmhki"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/hojmjpdlmjopaeginhldhiokeidchjid/128/0","link":"http://pixlr.com/express/","label":"Pixlr Express","app":true,"appid":"hojmjpdlmjopaeginhldhiokeidchjid"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/hpdhjbckboiopklnjmddaocbcmhlibej/256/0","link":"http://imovie.cloudcontrolled.com/","label":"kinoKino - ","app":true,"appid":"hpdhjbckboiopklnjmddaocbcmhlibej"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/iajlkcpgcnbhfhpdeooockfaincfkjjj/128/0","link":"http://www.isoball3game.com/","label":"Isoball 3","app":true,"appid":"iajlkcpgcnbhfhpdeooockfaincfkjjj"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/icdipabjmbhpdkjaihfjoikhjjeneebd/128/0","link":"https://read.amazon.com/?ref_=kcr_app_chrome_link","label":"Kindle Cloud Reader","app":true,"appid":"icdipabjmbhpdkjaihfjoikhjjeneebd"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/icppfcnhkcmnfdhfhphakoifcfokfdhg/128/0","link":"https://play.google.com/music/?utm_source=chrome_ntp_icon&utm_medium=chrome_app&utm_campaign=chrome","label":"Google Play Music","app":true,"appid":"icppfcnhkcmnfdhfhphakoifcfokfdhg"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/iflpcokdamgefbghpdipcibmhlkdopop/128/0","link":"http://dw.weather.com/services/chrome/chrome/index_f.html","label":"The Weather Channel for Chrome","app":true,"appid":"iflpcokdamgefbghpdipcibmhlkdopop"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/ignmpgkboobhglhhnkaaoajoknpadmon/128/0","link":"","label":"Flappy Bad","app":true,"appid":"ignmpgkboobhglhhnkaaoajoknpadmon"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/ilefapmpngkdnnllcnlcjffipbolhklf/128/0","link":"","label":"Camera Capture Sample","app":true,"appid":"ilefapmpngkdnnllcnlcjffipbolhklf"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/ioekoebejdcmnlefjiknokhhafglcjdl/128/0","link":"http://www.dropbox.com/at/cws","label":"Dropbox","app":true,"appid":"ioekoebejdcmnlefjiknokhhafglcjdl"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/iphcomljdfghbkdcfndaijbokpgddeno/128/0","link":"chrome-extension://iphcomljdfghbkdcfndaijbokpgddeno/editor.html","label":"Cookies","app":true,"appid":"iphcomljdfghbkdcfndaijbokpgddeno"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/jdhpjomiingppeefgnohkiapmnaeakoj/128/0","link":"http://www.worldtimebuddy.com/time-converter","label":"World Time Buddy","app":true,"appid":"jdhpjomiingppeefgnohkiapmnaeakoj"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/jedheaebdffklhgodepimamapjcjhgfl/128/0","link":"http://www.passgre.com/englishword1200/toeflword1200c.htm","label":"TOEFL 1200 Vokabular 30 Tage","app":true,"appid":"jedheaebdffklhgodepimamapjcjhgfl"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/jgfbjkfnffkhpnbnnkgaafipalhhblam/128/0","link":"http://streamie.org/","label":"Streamie","app":true,"appid":"jgfbjkfnffkhpnbnnkgaafipalhhblam"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/jghfknlgajlcihkhkhnlcoffhbohnlbg/128/0","link":"http://mybrowserpage.com/","label":"My Browser Page","app":true,"appid":"jghfknlgajlcihkhkhnlcoffhbohnlbg"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/jlehaidnnmjjkhgbbiombcdifogolhap/128/0","link":"http://skyrama.bigpoint.com/cws?aid=3306","label":"Skyrama","app":true,"appid":"jlehaidnnmjjkhgbbiombcdifogolhap"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/jmjbgcjbgmcfgbgikmbdioggjlhjegpp/128/0","link":"http://clipular.com/?Clipboard=a","label":"Clipular! Research, save & share screenshot","app":true,"appid":"jmjbgcjbgmcfgbgikmbdioggjlhjegpp"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/jnkffnoliaheoidfeejcmnidkkgilkja/128/0","link":"http://www.bbcgoodfood.com/chromeapp/","label":"BBC Good Food","app":true,"appid":"jnkffnoliaheoidfeejcmnidkkgilkja"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/jnpgcalemojfompgcdgbinecbeaelgob/128/0","link":"http://gamezidan.com/index.php?task=view&id=585","label":"Red Ball 1","app":true,"appid":"jnpgcalemojfompgcdgbinecbeaelgob"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/kajjckmbclbffbpecfbiecehkfgopppd/128/0","link":"https://www.hellosign.com/home/googleLanding/cwsapp/1","label":"HelloSign: Online signatures made easy","app":true,"appid":"kajjckmbclbffbpecfbiecehkfgopppd"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/mglmffkipgdhdkolbbkofkfhappinpin/128/0","link":"http://pursued.nemesys.hu/","label":"Pursued","app":true,"appid":"mglmffkipgdhdkolbbkofkfhappinpin"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/kdmmkfaghgcicheaimnpffeeekheafkb/128/0","link":"http://www.homestyler.com/designer","label":"Autodesk Homestyler","app":true,"appid":"kdmmkfaghgcicheaimnpffeeekheafkb"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/mcbkbpnkkkipelfledbfocopglifcfmi/128/0","link":"http://poppit.pogo.com/hd/PoppitHD.html","label":"Poppit","app":true,"appid":"mcbkbpnkkkipelfledbfocopglifcfmi"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/kjddpgbanjmmfjcihjihfdophkdecbmg/128/0","link":"http://www.mondowindow.com/?app=chrome","label":"MondoWindow","app":true,"appid":"kjddpgbanjmmfjcihjihfdophkdecbmg"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/komhbcfkdcgmcdoenjcjheifdiabikfi/128/0","link":"https://play.google.com/store/","label":"Google Play","app":true,"appid":"komhbcfkdcgmcdoenjcjheifdiabikfi"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/lbbbhbjeecagnlfgggogfclkdjamoapf/128/0","link":"http://buildwithchrome.appspot.com/","label":"Build with Chrome","app":true,"appid":"lbbbhbjeecagnlfgggogfclkdjamoapf"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/mgkjffcdjblaipglnmhanakilfbniihj/128/0","link":"http://www.earbits.com/?utm_campaign=web-store&utm_medium=referral&utm_source=chrome-web-store","label":"Earbits Radio - Gratis Musik für dich","app":true,"appid":"mgkjffcdjblaipglnmhanakilfbniihj"}],[{"h":2,"w":2,"icon":"chrome://extension-icon/cikibbmeocpalkpeeigjhliempbldkbf/128/0","link":"http://beta.locamat.de/","label":"locamat","app":true,"appid":"cikibbmeocpalkpeeigjhliempbldkbf","color":"#3b7b28"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/lbcoijfpdfchaihokncghkbplhiiehko/128/0","link":"http://www.playmapscube.com/","label":"Cube - A game about Google Maps","app":true,"appid":"lbcoijfpdfchaihokncghkbplhiiehko"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/lbfehkoinhhcknnbdgnnmjhiladcgbol/128/0","link":"https://www.evernote.com/Home.action?securityRegCode=chromestore","label":"Evernote Web","app":true,"appid":"lbfehkoinhhcknnbdgnnmjhiladcgbol"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/lbjiacdnbellpbhocabghholhnlboibg/128/0","link":"http://s1.daumcdn.net/editor/fp/service_nc/pix/","label":"Pix: Pixel Mixer","app":true,"appid":"lbjiacdnbellpbhocabghholhnlboibg"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/ljlieglfhapnokhlghnjbhlnkeehdgao/128/0","link":"","label":"Managed In App Payment Sample","app":true,"appid":"ljlieglfhapnokhlghnjbhlnkeehdgao"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/lkgdlmlmcijgnglfcophfjhafiafhkae/128/0","link":"chrome-extension://lkgdlmlmcijgnglfcophfjhafiafhkae/html/metro.html","label":"iStart - new tab in Metro Style","app":true,"appid":"lkgdlmlmcijgnglfcophfjhafiafhkae"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/lneaknkopdijkpnocmklfnjbeapigfbh/128/0","link":"http://maps.google.com/","label":"Google Maps","app":true,"appid":"lneaknkopdijkpnocmklfnjbeapigfbh"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/mkaakpdehdafacodkgkpghoibnmamcme/128/0","link":"chrome-extension://mkaakpdehdafacodkgkpghoibnmamcme/main.html","label":"Google Zeichnungen","app":true,"appid":"mkaakpdehdafacodkgkpghoibnmamcme"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/mmimngoggfoobjdlefbcabngfnmieonb/128/0","link":"http://books.google.com/ebooks/app","label":"Google Play Books","app":true,"appid":"mmimngoggfoobjdlefbcabngfnmieonb"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/mpbnpaonopfcidhkmpmfbjflikfafape/256/0","link":"","label":"Set App User Agent and Run JS in webview","app":true,"appid":"mpbnpaonopfcidhkmpmfbjflikfafape"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/npmfhebokhhbkonlgpjmknebojpncfhk/256/0","link":"","label":"iStart Simple Wetter","app":true,"appid":"npmfhebokhhbkonlgpjmknebojpncfhk"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/lfbgimoladefibpklnfmkpknadbklade/128/0","link":"http://webcamtoy.com/app/","label":"Webcam Toy","app":true,"appid":"lfbgimoladefibpklnfmkpknadbklade"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/okjefolamlhaiihnppgcdfcmphokifhd/128/0","link":"http://www.ps4em.com/snapchat","label":"Snapchat For PC","app":true,"appid":"okjefolamlhaiihnppgcdfcmphokifhd"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/onjblnjcaogpefajepegjnajhkehfmna/128/0","link":"","label":"In-App Payments Sample","app":true,"appid":"onjblnjcaogpefajepegjnajhkehfmna"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/pjkljhegncpnkpknbcohdijeoejaedia/128/0","link":"https://mail.google.com/mail/ca","label":"Google Mail","app":true,"appid":"pjkljhegncpnkpknbcohdijeoejaedia"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/appodegmlmgaaldckilidoiplddcdhni/128/0","link":"","label":"iSnap - inoffizieller client for snapchat™","app":true,"appid":"appodegmlmgaaldckilidoiplddcdhni"}],[{"h":1,"w":2,"icon":"chrome-extension://lkgdlmlmcijgnglfcophfjhafiafhkae/icon.png","link":"chrome-extension://gnfnpldhocjgacfohdognfggednnbdjc/html/empty.html","label":"One-click Kittens","app":true,"appid":"gnfnpldhocjgacfohdognfggednnbdjc"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/imoaidkbfidmlkbjgffphecliapccofg/128/0","link":"","label":"Notification Demo","app":true,"appid":"imoaidkbfidmlkbjgffphecliapccofg"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/kloekeckebhdcodeokigmefnalhjfcal/128/0","link":"","label":"iSnap - inoffizieller client for snapchat™","app":true,"appid":"kloekeckebhdcodeokigmefnalhjfcal"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/kpbejihpaggakbnchmkfolefcldjpnnc/128/0","link":"","label":"iSnap Pro -inoffizieller client for snapchat™","app":true,"appid":"kpbejihpaggakbnchmkfolefcldjpnnc"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/lmbagofbdbifohgjfbppckildimimcnj/128/0","link":"","label":"Notification Demo","app":true,"appid":"lmbagofbdbifohgjfbppckildimimcnj"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/ieicmdpibfnjbmjolkmohnelljmjomoj/128/0","link":"http://fwt.bumxu.com/","label":"Full Web Tetris","app":true,"appid":"ieicmdpibfnjbmjolkmohnelljmjomoj"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/anelkojiepicmcldgnmkplocifmegpfj/128/0","link":"http://from-dust.ubisoft.com/","label":"From Dust","app":true,"appid":"anelkojiepicmcldgnmkplocifmegpfj"}],[{"h":1,"w":2,"icon":"chrome://extension-icon/haijhjgfgmgemgjeoomhobpcfgekifcj/128/0","link":"http://www.livemans.com/Typo/index.html","label":"Typo Express","app":true,"appid":"haijhjgfgmgemgjeoomhobpcfgekifcj"}]
                            ]
                        ];
            var fo = this;
         chrome.storage.local.set({istart:JSON.stringify(istartd)}, function() {
            fo.getLocalData();
         });

        };
        this.loopCount=0;

        /**
         * walk through the matrix and generatesave
         */
        this.portMatrixUUID = function(matrix) {
            for(var item in matrix) {
                for(var entry in matrix[item]) {
                    if(matrix[item][entry] == null || typeof matrix[item][entry] == "undefined") {
                        //unset(matrix[item][entry]);
                        continue;
                    }
                    try {
                        console.log(matrix, item, entry, 'PORTED ITEM');
                        matrix[item][entry][0].uuid = $rootScope.getUniqueUUID();
                        $rootScope.addUUIDTOList(matrix[item][entry][0].uuid);
                    } catch(e) {
                        console.log(e, 'ERR');
                        return false;
                    }
                }
            }
            var store = true;
            //check the uuid
          /*  var founded = [];
            for(var item in matrix) {
                for(var entry in matrix[item]) {
                    if(founded.indexOf(matrix[item][entry][0].uuid) == -1) {
                        founded.push(matrix[item][entry][0].uuid);
                    } else {
                        console.debug('in Arr',founded, matrix[item][entry][0].uuid, founded.indexOf(matrix[item][entry][0].uuid));
                        var store = false;
                    }
                }
            }*/
            if(store != false) {
                console.log("SAVE PORTED COLLECTION");
                backgroundMessage.message.connect(
                    backgroundMessage.message.getMessageSkeleton('saveMatrix', {matrix:matrix})
                ).then(function(data) {
                        console.log('RELAOD THE PAGE???');
                        location.reload();
                });
            } else if(this.loopCount==0) {
                this.loopCount=1;
                this.portMatrixUUID(matrix);
            } else {
                console.log('RELAOD THE PAGE???');
                location.reload();
            }
        };

        /**
         * import matrix items by string.
         *
         * @param matrixString string
         */
        this.importMatrix = function(matrixString) {
            var matrix = false;
            try {
                matrix = JSON.parse(matrixString);
                console.log(matrix, "imprted matrix");
            } catch(e) {
                console.error(e);
                return false;
            }
            return matrix;//get the matrix and check if it contains an array
        };


        this.clearImportNulls = function(items) {
            var clearedArr =[];
            var newOuterIndex=0;
            var newInnerIndex=0;
            var seted;
            for(var outer in items ) {
                if(items[outer]==null) {
                    continue;
                }
                seted=false;
                newInnerIndex=0;
                for(var inner in items[outer]) {
                    if(items[outer][inner]!==null) {
                        if(!clearedArr[newOuterIndex]) {
                            clearedArr[newOuterIndex]=[];
                        }
                        clearedArr[newOuterIndex][newInnerIndex]=items[outer][inner];
                        newInnerIndex +=1;
                        seted=true;
                    }
                }
                if(seted===true)
                    newOuterIndex +=1;
            }
            console.log(clearedArr);
            return clearedArr;
        };

        this.writeBackImport = function(matrixArr) {
            //save item before import
            var deferred = $q.defer();
            chrome.storage.local.get('istart', function(data) {
                var tmp = data;
                chrome.storage.local.set({'istartbackup':data});
            });
            this.saveMatrix(matrixArr).
            then(function(result) {
                    deferred.resolve(result);
                });
            return deferred.promise;
        };

        this.checkImportMatrix = function(matrixString) {
            var result = this.importMatrix(matrixString);
            if(result==null) {
                return false;
            }
            if(result[0]) {
                if(result[0][0]) {
                    /**
                     * it did not check for an valid uuid!!!!
                     * So this would be later added to the tile during first load
                     */
                    importTemp = this.clearImportNulls(result);
                    return true;
                }
            }
            return false;
        };


        this.getImportTempMatrix = function() {
          return importTemp;
        };

        this.saveMatrix = function(matrix) {
            var deferred = $q.defer();
            backgroundMessage.message.connect(
                backgroundMessage.message.getMessageSkeleton('saveMatrix', {matrix:matrix})
            ).then(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        };

        this.loadDefaultMatrix = function() {
            var deferred = $q.defer();
            $http.get('../app/defaultTiles.json')
                .success(function(data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function(data, status, headers, config) {
                    console.error(data, status, headers, config, 'ERROR');
                    deferred.reject('error');
                });
            return deferred.promise;
        };

        this.getPagesMostTimeSpend = function() {
            var defer = $q.defer();
            chrome.storage.local.get('timespend', function(data) {
                var timespend = null;
                try {
                    timespend = JSON.parse(data.timespend);
                } catch(e) {
                    timespend = false;
                }
                defer.resolve(timespend);
            });
            return defer.promise;
        };

        /**
         * hard fix
         * @param defer
         */
        this.localToChrome = function (defer) {
            try {
                //parse the data from local Storage
                var migrateData = JSON.parse(localStorage.istart);
                //save the data in the local Storage
                localStorage.setItem('istartbackup', JSON.stringify(migrateData));
                var remove = localStorage.removeItem('istart');
                this.saveMatrix(migrateData);
                defer.resolve(migrateData);
            } catch (e) {
                alert("Error during porting the tiles into the new version. All youre settings are saved in localStorage.istartbackup :) ");
            }
        };

        /**
         * this is much better for the performance to call the items direct here from the localStorage
         * @returns {defer.promise|*}
         */
        this.getLocalData = function() {
            var defer = $q.defer();
            var that = this;
            /**
             * check if we have some old tiles there. If yes we port them to chrome
             * storage. Maybe the most bugs with the new Version based on this problem
             */
            if (localStorage.istart) {
                //console.log(localStorage.istart, 'localStorage is SET');
                this.localToChrome(defer);
                return false;
            }

            chrome.storage.local.get('istart',function( datas ) {
                var matrix = false;
                try {
                    matrix = JSON.parse(datas.istart);
                } catch(e) {
                    console.error(e);
                    matrix = false;
                }
                if(matrix===false || !datas.istart) {
                    //first load
                    that.loadDefaultMatrix()
                        .then(function(data) {
                            matrixCopy = data.matrix;
                            defer.resolve(data);
                        }, function(err) {
                            console.log(err, 'ERROR');
                            alert('critical error: defaultTiles.json not found, maybe this installation is broken. Please reinstall this software');
                        });
                } else {
                    matrixCopy = matrix;
                    console.log(matrix, 'RESOLVE');
                    defer.resolve(matrix);
                }
            });
            return defer.promise;
        };

        this.getLocalData2 = function() {
            var defer = $q.defer();
            var that = this;
            /**
             * TODO: fix this code segments to be tested
             */
            if(matrixCopy !== null) {
                console.log('return matrix copy');
                defer.resolve(matrixCopy);
            } else {
                console.log('start new matrix from backend');
                backgroundMessage.message.connect(
                    backgroundMessage.message.getMessageSkeleton('getMatrix')
                ).then(function(data) {

                        if(data.matrix===false) {
                            //first load
                            that.loadDefaultMatrix()
                                .then(function(data) {
                                    console.log(data, 'WORKS');
                                    defer.resolve(data);
                                }, function(err) {
                                    console.log(err, 'ERROR');
                                    alert('critical error: defaultTiles.json not found, maybe this installation is broken. Please reinstall this software');
                                });
                        } else {
                            matrixCopy = data.matrix;
                            defer.resolve(data.matrix);
                        }
                    });
            }
            return defer.promise;
        };

        this.useTinfoilShielding = function(value) {
            useTinfoilShielding = !!value;
        };
    };

    return new matrixService();
}]);
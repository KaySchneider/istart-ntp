'use strict';
(function() {
    var app  = angular.module('istart');
    app.factory('istartApi', ['$q', '$rootScope', '$timeout','$http', 'userStorage', 'matrix',
     function ($q, $rootScope, $timeout , $http, userStorage, matrix) {
         var gapiReady=false;
         var loopCount=0;
         var token = "";
         var timeToCacheUser= 1000000; //time in ms to cache the user data locally without checking it again from the server! 1000sec 1000000
         var lastSync = null;
         var lastLocalSetChanged=null;
         var istartObject=null;
         var lastUserResult=false; //boolean if true it indicates that the last call to the backend fetch the current user was success
         var upsyncTimeout = 2000;
         var lastUpSync=null;
         var checkRemoteTimeOut=1800000; //set timeout to 30minutes! before syncing again
       $rootScope.$on('backendReady', function() {
            /**
             * checks if the backend is ready
             */
            console.log('backendReady');
            gapiReady=true;
       });
       $rootScope.$on('itemsChanged', function() {
           istartObject.upSync();
       });


      /**
      * wie oft soll die API nach einer neuen Version angefragt werden?
      * Dadurch könnte meine Server time zu oft angefragt werden und extrme
      * Kosten verursachen! Am besten einmal nach jedem Start pro Tag!
      */
     var istartApiMethods = function() {

          var checkUpSync = function() {
              lastLocalSetChanged=Date.now();
              console.log((Date.now() - lastUpSync )<= upsyncTimeout , upsyncTimeout, Date.now() - lastUpSync);
              if((Date.now() - lastUpSync ) >= upsyncTimeout || lastUpSync === null) {
                  console.log('upsync');
                  lastUpSync=Date.now();
                  matrix.getLocalData()
                      .then(function(tiles) {
                          insertTilesRemote(tiles);
                      });
              }
          };

          var checkRemoteSync = function() {
              console.log('NOW WE START WITH THE CHEcK RMOTE BLAH');
              var now = Date.now();
              if (lastSync != null) {
                  console.log(lastSync, 'LAST SYNC');
                  if ( (Date.now() - lastSync) >= 1) {
                      console.log('start a sync time is over');
                      getRemoteTiles();
                  }
              } else {
                  getRemoteTiles();
                  console.log('sync is null, start a sync');
              }
          };
          /**
           * timestamp with the latest sync time
           */
          var loadChangedData = function () {
              chrome.storage.local.get('lastlocalchanged', function (ts) {
                  if(ts.lastlocalchanged)
                    lastLocalSetChanged = ts.lastlocalchanged;
              });
              chrome.storage.local.get('lastremotesync', function (ts) {
                  if(ts.lastremotesync)
                    lastSync = ts.lastremotesync;
              });
          };
          var setLastSync = function() {
              //set local sync to now
              chrome.storage.local.set({'lastremotesync': Date.now() }, function(ts) {

              });
          };
          loadChangedData();
          var setToken = function (token) {
              token = token;
              gapi.auth.setToken(createTokenObject(token));
          };

          var setLocalToken = function () {
              if (token != "" && token != null) {
                  try {
                      gapi.auth.setToken(JSON.parse(token));
                  } catch (e) {

                  }
              }
          };


          /**
           * check if an user exists and the navigator is online
           * @return boolean online & loggedin state
           */
          var getLoggedInAndBrowserStat = function () {
              if (window.navigator.onLine === true) {
                  if (lastUserResult === true) {
                      return true;
                  }
              }
              return false;
          };

          var loadSilent = function () {
              /*chrome.identity.getAuthToken({ 'interactive': false }, function(token) {
               // Use the token.
               console.log(token, 'CHROME AUTH');
               setToken(token);
               });*/

              token = window.localStorage.getItem('token');
              console.log(token, 'SERVER TOKEN');
          };

          /**
           *
           * @param loginData
           * var loginData = {
                 'username':""
                 'password': ""
             };
           */
          var login = function (loginData) {
              var defer = $q.defer();
              $http.post($rootScope.authEndpoints + '/api/login', {username: loginData.mail, password: loginData.password})
                  .success(function (data) {
                      gapi.auth.setToken(createTokenObject(data.id + '||' + data.token));
                      token = JSON.stringify(createTokenObject(data.id + '||' + data.token));
                      fetchMeRemote()
                          .then(function (data) {
                              defer.resolve(data);
                              lastUserResult = true;
                              checkRemoteSync();
                              $rootScope.$broadcast('userLoggedIn');
                          }, function (reject) {
                              lastUserResult = false;
                              defer.reject(reject);
                          });
                  })
                  .error(function (err) {
                      console.log('login Error', err);
                      defer.reject(err);
                  });
              return defer.promise;
          };

          var logout = function () {
              /**
               * TODO: destroy here the local scope and log the user out!
               */
              var defer = $q.defer();
              setLocalToken();
              $http.post($rootScope.authEndpoints + '/api/logout', {'t': gapi.auth.getToken()})
                  .success(function (data) {
                      console.log(data);
                      gapi.auth.setToken(null);
                      if (localStorage) {
                          localStorage.removeItem('token');
                      }
                      $rootScope.$broadcast('userLogout');
                      defer.resolve(data);
                  })
                  .error(function (err) {
                      defer.reject(err);
                  });
              return defer.promise;
          };

          /**
           * TODO:check here the last sync time
           */
          var getRemoteTiles = function () {

              setLocalToken();
              var doCall = function() {
                  gapi.client.istart.tiles.get.desktop()
                      .execute(function (res) {
                          console.log(res, "DATA");
                          if (res.code === 401 || res.code === 400)
                              return;
                          //build here the istart items array
                          var itemsArr = [];
                          for (var itemsIndex in res.tile_config) {
                              var item = res.tile_config[itemsIndex];
                              item.w = item.width;
                              item.h = item.height;
                              if (item.config) {
                                  try {
                                      item.config = JSON.parse(atob(item.config));
                                  } catch (e) {
                                      console.error(e);
                                  }
                              }
                              if (item.border_color) {
                                  item.borderColor = item.border_color;
                                  delete item.border_color;
                              }
                              var outerIndex = parseInt(item.outer_pos);
                              var innerIndex = parseInt(item.inner_pos);
                              if (!itemsArr[outerIndex]) {
                                  itemsArr[outerIndex] = [];
                              }
                              if (!itemsArr[outerIndex][innerIndex]) {
                                  itemsArr[outerIndex][innerIndex] = [];
                              }
                              itemsArr[outerIndex][innerIndex][0] = item;
                          }
                          console.log(itemsArr);
                          /**
                           * here we should chek if the tiles are different from the local ones!
                           */
                          matrix.getLocalData()
                              .then(function(items) {
                                    if(checkItems(items, itemsArr) === true) {
                                        matrix.writeBackImport(itemsArr);
                                        $rootScope.$broadcast('syncCloudChanges');
                                    }
                              });
                          });
                      setLastSync();// set the last sync to now!
              };
              var checkItems = function(items, itemsArr) {
                  var diff=false;
                  for(var itemO in items) {
                      for(var itemI in items[itemO]) {
                          if(items[itemO][itemI] == null) {
                              if(items[itemO][itemI]!=itemsArr[itemO][itemI]) {
                                  var diff=true;
                                  return true;
                              }
                          } else {
                              if(items[itemO][itemI][0].uuid != itemsArr[itemO][itemI][0].uuid){
                                  var diff=true;
                                  return true;
                              }
                          }
                      }
                  }
                  return false;
              };
              waitUntilGapiReady().then(function() {
                 doCall();
              });
          };

          var insertTilesRemote = function (items) {
              var transportArr = [];
              for (var outerIndex in  items) {
                  for (var innerIndex in items[outerIndex]) {
                      var transportTile = {};
                      if (items[outerIndex][innerIndex] == null)
                          continue;
                      var tile = items[outerIndex][innerIndex][0];//one item holds here
                      transportTile = tile;
                      if (transportTile.src === false)
                          delete transportTile.src;
                      if (transportTile.config) {
                          var tmp = btoa(JSON.stringify(transportTile.config))
                          transportTile.config = tmp;
                      }
                      if (transportTile.h) {
                          transportTile.height = transportTile.h;
                          delete transportTile.h
                      } else {
                          transportTile.height = 1;
                      }
                      if (transportTile.w) {
                          transportTile.width = transportTile.w;
                          delete transportTile.w
                      } else {
                          transportTile.width = 1;
                      }

                      if (transportTile.borderColor) {
                          transportTile.border_color = transportTile.borderColor;
                          delete transportTile.borderColor;
                      }

                      transportTile.outer_pos = outerIndex;
                      transportTile.inner_pos = innerIndex;
                      transportArr.push(transportTile);
                  }
              }
              setLocalToken();
              gapi.client.istart.tiles.insertd({'tile_config': transportArr})
                  .execute(function (res) {
                      console.log(res);
                      lastUpSync=Date.now();
                  });
          };

          /**
           * register new iStart user!
           */
          var registerNewUser = function (userRegisterObject) {
              var defer = $q.defer();
              gapi.client.istart.users.register({
                  username: userRegisterObject.username,
                  password: userRegisterObject.password,
                  email: userRegisterObject.email
              }).execute(function (res) {
                  console.log(res, 'RESULT');
                  console.log(res.id);
                  if (res.error) {
                      defer.reject(res);
                  }
                  if (res.id) {
                      defer.resolve(res);
                  }
              }, function (e) {
                  console.log(e);
              });

              return defer.promise;
          };

          var patchUserName = function (patchObject) {
              var defer = $q.defer();
              setLocalToken();
              gapi.client.istart.users.patch(patchObject).execute(function (resp) {
                  defer.resolve(resp);
                  userStorage.setMe(resp);
                  $rootScope.$broadcast('usernamechanged', {username: patchObject.username});
              }, function (err) {
                  $rootScope.$broadcast('userLogout');
              });
              return defer.promise;
          };

          var fetchListRemote = function () {
              var defer = $q.defer();
              var loadData = function () {
                  console.log('LOAD LOAD');
                  if (gapiReady == false) {
                      if (loopCount == 10) {
                          loopCount = 0;
                          defer.reject();//reject when offline
                          return;
                      } else {
                          loopCount++;
                          console.log('timeout');
                          $timeout(loadData, 500);
                      }
                      return;
                  }
                  console.log('load Data inside loader');
                  gapi.client.istart.tiles.list().execute(function (resp) {
                      console.log(resp);
                      defer.resolve(resp);
                  });
              };
              loadData();
              return defer.promise;
          };

          var waitUntilGapiReady = function() {
            var defer = $q.defer();
              var loopi = 0;
                var checkApi = function() {
                    console.log('CHECK');
                    if(gapiReady==false) {
                        console.log(loopi);
                        if(loopi==40) {
                            loopi=0;
                            console.log('REJEcT ME');
                            defer.reject();//reject when offline
                            return;
                        } else {
                            loopi++;
                            $timeout(checkApi, 800);
                        }
                        return;
                    }
                    console.log("RESOLVE ME START");
                    defer.resolve();
                };
              checkApi();
            return defer.promise;
          };
          /**
           * gets the current loggin user
           * @returns {defer.promise|*}
           */
          var fetchMeRemote = function() {
              console.log("INSIDE FETCH REMOTE !!!");
              var defer = $q.defer();
              var loadData = function() {
                  if(gapiReady==false) {
                      if(loopCount==20) {
                          loopCount=0;
                          defer.reject();//reject when offline
                          return;
                      } else {
                          loopCount++;
                          console.log('timeout');
                          $timeout(loadData, 800);
                      }
                      return;
                  }
                  console.log('load Data inside loader');
                  setLocalToken();
                  if(token==null || token == "") {
                      console.log('REJETED NULL TOKEN');
                      defer.reject(false);
                      return;
                  }
                  gapi.client.istart.users.get({id:'me'}).execute(function(resp) {
                      if(resp.code==401||resp.error) {
                          console.log('REJETED');
                          defer.reject(false);
                      } else {
                          userStorage.setMe(resp);//set the local user
                          checkRemoteSync();
                          /**
                           * broadcast login?
                           */
                          defer.resolve(resp);

                      }
                  });
              };

              /**
               * fetch the local user! use this instead of the remote User..
               */
              userStorage.getMe()
                  .then(function(user) {
                      console.log("WE HAVE AN USER FROM CACHE");
                      if(user.username) {
                          checkRemoteSync();
                          console.log("WE HAVE THE USERNAME AND STARTED CHEcK REMOTE");
                          defer.resolve(user);
                      } else {
                          loadData();
                      }
                  }, function() {
                      console.log("REJETED FROM USER STORAGE LOCAL");
                      loadData();
                  });
              return defer.promise;

          };

          var resendPassword = function(mail) {
              var defer=$q.defer();
              gapi.client.istart.users.resendpassword({'mail': mail})
                  .execute(function(resul) {
                      defer.resolve(resul);
                  });
              return defer.promise;
          };

          loadSilent();
          return {
              getFeed: fetchListRemote,
              getMe: fetchMeRemote,
              setToken:setToken,
              patchUser:patchUserName,
              recoverPassword: resendPassword,
              register:registerNewUser,
              login:login,
              logout:logout,
              insertTiles:insertTilesRemote,
              getRemoteTiles:getRemoteTiles,
              upSync:checkUpSync
          };
      };
         istartApiMethods.getInstance = function() {
             /*
             * super simple singleton... stuff like pattern
              */
           if($rootScope.istartApiInstace === null) {
                $rootScope.istartApiInstace = new istartApiMethods();
           }
           return $rootScope.istartApiInstace;
        };
        istartApiMethods.getInstance();
        istartObject = $rootScope.istartApiInstace;
        return {
            getFeed: istartObject.getFeed,
            getMe: istartObject.getMe,
            setToken:istartObject.setToken,
            patchUser:istartObject.patchUser,
            register:istartObject.register,
            login:istartObject.login,
            logout:istartObject.logout,
            insertTiles:istartObject.insertTiles,
            getRemoteTiles:istartObject.getRemoteTiles,
            recoverPassword:istartObject.recoverPassword,
            upSync:istartObject.upSync
        };
    }]);
    function createTokenObject(tokenString) {
        var token= {
            "access_token": tokenString,
            "token_type": "Sharer"
        };
        try {
            window.localStorage.setItem('token', JSON.stringify(token));
        } catch(e) {

        }
        return token;
    };
})();
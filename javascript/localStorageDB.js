/**
 * Created by syw on 2016/10/1.
 */
(function (global,factory) {
   typeof  exports === "object" && typeof module !=='undefined' ? module.exports =factory():
       typeof  define === "function" && define.amd ? define(factory):
           global.localStorageDB =factory()
}(this,function () {
    'use strict';

    return function (collectionName) {
        collectionName = collectionName ? collectionName:" default";
        let err;
        let cache =localStorage[collectionName]  ? JSON.parse(localStorage[collectionName]):[];
        return {
            add : function  (obj ,callback) {
                obj["_id"] = new Date().valueOf();
                cache.push(obj);
                localStorage.setItem(collectionName,JSON.stringify(cache));
                if(callback){
                    callback(err,obj);
                }
            },
            query: function  (obj,callback) {
                if(arguments.length ==0){
                      return cache;
                }else {
                    let result =[];
                    for(let key in obj){
                       for(let i = 0; i < cache.length ;i++ ){
                           if(cache[i][key] == obj[key]){
                               result.push(cache[i]);
                           }
                       }
                    }
                    if(callback){
                        callback(err,result);
                    }else{
                        return result;
                    }
                }
                
            },
            remove:function (obj,callback) {
                if(arguments.length ==0){
                    localStorage.removeItem(collectionName);
                }else {
                    for(let key in obj){
                        for(var i =cache.length -1; i>=0; i--){
                             if(cache[i][key] == obj[key]){
                                 cache.splice(i,1);
                             }
                        }
                    }
                    localStorage.setItem(collectionName,JSON.stringify(cache));

                }
                if(callback){
                    callback(err);
                }
            },
            update :function (obj,upsert, callback) {
                for(let key in obj){
                    for(let i =0 ; i< cache.length; i++){
                      if(cache[i][key]== obj[key]){
                          end_loops:
                          for(let upsrt in  upsert){
                             switch (upsrt){
                                 case "@inc":
                                     for(let nKey in upsert[upsrt]){
                                         cache[i][nKey] = parseInt(cache[i][nKey]) + parseInt(upsert[upsrt][nKey]);
                                     }
                                     break;
                                 case "@set":
                                     for(let nKey in upsert[upsrt]){
                                         cache[i][nKey] =upsert[upsrt][nKey];
                                     }
                                     break;
                                 case "@push":
                                     for(let nKey in upsert[upsrt]){
                                         cache[i][nKey].push(upsert[upsrt][nKey]);
                                     }
                                     break;
                                 default:
                                     upsert["_id"] =cache[i]["_id"];
                                     cache[i] =upsert;
                                     break end_loops;
                             }

                          }
                      }
                    }
                }
                localStorage.setItem(collectionName,JSON.stringify(cache));
                if(callback)
                callback(err);
            }

        }


    }
}));











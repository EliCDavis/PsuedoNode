/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * @stof 105034
 * @returns {String}
 */
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;

};


// Used in confirmAction and confirmActionCallback
var cacb

/// Conjures modal that asks user whether they want to perform or cancel an action.
function confirmAction(actionMessage, cb) {
    
//    Call modal
    $("#confirm-action").modal()
//    actionMessage
    $("#custom-Action-Message").text(actionMessage)
//    Changes function called in confirmActionCallBack()
    cacb = cb
}


/// Actived by clicking 'Perform Action' button


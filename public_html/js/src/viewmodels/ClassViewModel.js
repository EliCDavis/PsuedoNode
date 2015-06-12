/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ClassViewModel(name, description){
    
    this.id = Date.now();
    
    this.name = ko.observable(name );
    this.purposesItServes = ko.observableArray();
    
    this.description = ko.observable(description);
    
    this.closeTab = function(){
        closeTab(this.id);
    }
    
}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function DesignPatternTemplateViewModel(name, description){
    
    this.name = ko.observable(name);
    this.setName = function(name){
        this.name(name);
    }
    this.getName = function(){
        return this.name();
    }
    
    this.description = ko.observable(description);
    this.setDescription = function(description){
        this.description(description);
    }
    
    this.methodsThatComeWithPattern = ko.observableArray();
    
    
}
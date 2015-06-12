/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function SystemViewModel(name, description){
    
    this.id = Date.now();
    
    this.name = ko.observable(name);
    this.purposes = [];
    this.description = ko.observable(description);
    this.subSystems = ko.observableArray();
    
    this.classesAssociated = ko.observableArray();
    
    this.addNewClass = function(){
        this.classesAssociated.push(new ClassViewModel("Class Name", "Class Description, be thorough enough so people know what you mean"));
        console.log("new classes added!");
        openClassEditTab(this.classesAssociated()[this.classesAssociated().length-1]);
    }
    
    this.openInTabs = function(){
        
        openSystemEditTab(this);
    }
    
    this.closeTab = function(){
        closeTab(this.id);
    }
    
}
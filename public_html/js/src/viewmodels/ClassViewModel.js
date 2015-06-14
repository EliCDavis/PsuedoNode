/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ClassViewModel(name, description){
    
    this.id = Date.now();
    
    this.name = ko.observable(name );
    
    this.purposesItServes = ko.observableArray();
    this.purposesItDoesNotServe = function(){
        
        var purposesNotServing = this.system().purposes;
        
        
        return purposesNotServing;
    }
    
    //the system the class is apart of
    this.system = ko.observable();
    
    this.description = ko.observable(description);
    
    this.methods = ko.observableArray();
    this.createNewMethod = function(){
        console.log(this.id);
        this.methods.push(new ObjectMethodViewModel());
    };
    
    this.patternsImplementing = ko.observableArray();
    
    this.closeTab = function(){
        closeTab(this.id);
    }
    
}
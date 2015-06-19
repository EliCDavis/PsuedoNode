/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ClassViewModel(name, description){
    
    var self = this;
    
    self.id = Date.now();
    
    self.name = ko.observable(name );
    
    self.purposesItServes = ko.observableArray();

    self.addNewPurpose = function(purpose){
        self.purposesItServes.push(purpose);
    };
    
    self.removePurpose = function(purpose){
        self.purposesItServes.remove(purpose);
    };
    
    self.purposesItDoesNotServe = function(){
        
        var purposesNotServing = ko.observableArray();
        
        for(var s = 0; s < self.system().purposes().length; s++){
            if(self.purposesItServes().indexOf(self.system().purposes()[s]) === -1){
                purposesNotServing.push(self.system().purposes()[s]);
            }
        }
        
        return purposesNotServing;
        
    };
    
    //the system the class is apart of
    self.system = ko.observable();
    
    self.description = ko.observable(description);
    
    self.methods = ko.observableArray();
    
    self.createNewMethod = function(){
        self.methods.push(new ObjectMethodViewModel());
    };
    
    self.patternsImplementing = ko.observableArray();
    
    self.patternsItDoesNotImplement = function(){
        var purposesNotServing = ko.observableArray();
        
        for(var s = 0; s < self.system().application().defaultDesignPatterns().length; s++){
            if(self.patternsImplementing().indexOf(self.system().application().defaultDesignPatterns()[s]) === -1){
                purposesNotServing.push(self.system().application().defaultDesignPatterns()[s]);
            }
        }
        
        return purposesNotServing;
    }
    
    self.addNewPattern = function(pattern){
        self.patternsImplementing.push(pattern);
    };
    
    self.removePattern = function(pattern){
        self.patternsImplementing.remove(pattern);
    };
    
    self.getPatternMethods = function(){
        var allMethods = ko.observableArray();
        for(var i = 0; i < self.patternsImplementing().length; i ++){
            for(var m = 0; m < self.patternsImplementing()[i].methodsThatComeWithPattern().length; m ++){
                allMethods.push(self.patternsImplementing()[i].methodsThatComeWithPattern()[m]);
            }
            
        }
        return allMethods;
    }
    
    self.closeTab = function(){
        closeTab(self.id);
    };
    
    
    this.openInTabs = function(){
        openClassEditTab(this);
       
    };
    
}
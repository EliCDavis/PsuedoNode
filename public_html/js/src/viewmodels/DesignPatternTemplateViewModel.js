/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * Classes implement design patterns that aid in production and provide 
 * solutions that have been solved in the past.  This can set up variables
 * and methods in the class, or simply alter the description of the class.
 * Design Patterns must be flexible so they can adapt to other's code.
 * 
 * @param {String} name name of the design pattern we want to create
 * @param {String} description description of the design pattern we want to create
 * @returns {undefined}
 */
function DesignPatternTemplateViewModel(name, description){
    
    var self = this;
    
    self.id = generateUUID();
    
    self.name = ko.observable(name);
    
    self.setName = function(name){
        self.name(name);
    };
    
    self.getName = function(){
        return self.name();
    };
    
    self.description = ko.observable(description);
    
    self.setDescription = function(description){
        self.description(description);
    };
    
    
    self.methodsThatComeWithPattern = ko.observableArray();
    
    self.addNewMethod = function(){
        self.methodsThatComeWithPattern.push(new ObjectMethodViewModel());
    };
    
    self.removeMethod = function(method){
        
        var indexOfMethod = self.methodsThatComeWithPattern().indexOf(method);
        
        if(indexOfMethod !== -1){
            self.methodsThatComeWithPattern.remove(method);
        }
    };
    
    self.openInTabs = function(){
        openDesignPatternEditTab(self);
    };
    
    /**
     * Closes the settings tab if it is currentely open
     * 
     * @returns {undefined}
     */
    this.closeTab = function(){
        closeTab(self.id);
    };
    
}
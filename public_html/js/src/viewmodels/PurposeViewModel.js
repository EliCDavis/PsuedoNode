/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function PurposeViewModel(){
    
    var self = this;
    
    self.id = Date.now();
    
    self.name = ko.observable("Purpose");
    self.description = ko.observable("Description");
    self.isComplete = ko.observable(false);
    
    //@! make systems set seystem variable when creating a purpose
    self.system = ko.observable();
    
    
    self.classesAssociated = ko.observableArray();
    
    /**
     * Adds a class to the purpose so it know's it's associated with that class.
     * 
     * @param {type} classToAdd
     * @returns {undefined}
     */
    self.addAssociatedClass = function(classToAdd){
        
        //make sure they are trying to add a class that isn't null and we don't already have
        if(classToAdd != null && self.classesAssociated.indexOf(classToAdd) === -1){
           self.classesAssociated.push(classToAdd); 
        } 
    }
    
    self.removeClassFromAssociation = function(classToRemove){
        //make sure they are trying to remove a class that isn't null and we actually have
        if(classToRemove != null && self.classesAssociated.indexOf(classToRemove) !== -1){
           self.classesAssociated.remove(classToRemove); 
        }
    }
    
    self.closeTab = function(){
        closeTab(self.id);
    }
    
    self.openInTabs = function(){
        openPurposeEditTab(self);
    };
    
    self.removeSelfFromSystem = function(){
        if(self.system() != null){
            self.system().removePurpose(self);
        }
    };
    
}

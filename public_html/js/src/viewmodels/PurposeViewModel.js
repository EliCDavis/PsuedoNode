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
    
    self.closeTab = function(){
        closeTab(self.id);
    }
    
    self.openInTabs = function(){
        openPurposeEditTab(self);
    };
    
}

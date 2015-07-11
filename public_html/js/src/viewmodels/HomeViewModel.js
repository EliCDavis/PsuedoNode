/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function HomeViewModel(){
    
    var self = this;
    
     self.id = 100;
    
    self.openInTabs = function(){
        
        openHomeTab(self);  
       
    };
    
    self.closeTab = function(){
        closeTab(self.id)
    }
    
}
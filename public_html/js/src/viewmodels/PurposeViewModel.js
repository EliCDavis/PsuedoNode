/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function PurposeViewModel(){
    
    this.id = Date.now();
    
    this.name = ko.observable("Purpose");
    this.description = ko.observable("Description");
    
    this.closeTab = function(){
        closeTab(this.id);
    }
    
}

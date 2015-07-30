/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ObjectMethodViewModel(){
    
    var self = this;
    
    self.id = generateUUID();
    
    self.name = ko.observable("Method Name");
    self.description = ko.observable("Method Description");
    
    self.returnType = ko.observable("void");
    
    self.parameters = ko.observableArray();
    
    //this should include constructors.
    self.methodsItCalls = ko.observableArray();
    
}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ObjectMethodViewModel(){
    
    this.name = ko.observable("Method Name");
    this.description = ko.observable("Method Description");
    
    this.returnType = ko.observable("void");
    
    this.parameters = ko.observableArray();
    
    //this should include constructors.
    this.methodsItCalls = ko.observableArray();
    
}
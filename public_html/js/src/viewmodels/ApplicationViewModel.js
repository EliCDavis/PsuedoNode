/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ApplicationViewModel(){
    
    //type SystemViewModel
    this.rootSystems = ko.observableArray();
    
    //typeDesignPatternTemplateViewModel
    this.defaultDesignPatterns = ko.observableArray();
    
    this.start = function (){
        var factorDesignPattern = new DesignPatternTemplateViewModel();
        
        //http://www.oodesign.com/
        factorDesignPattern.setName("Factory");
        factorDesignPattern.setDescription("Creates objects without exposing the instantiation logic to the\
                                            client and Refers to the newly created object through a common interface.");
        
        var factoryDesignPatternMethod = new ObjectMethodViewModel();
        factoryDesignPatternMethod.name("BuildObject");
        factoryDesignPatternMethod.description("Builds the object this class specializes in");
        factoryDesignPatternMethod.returnType("Object");
        
        this.defaultDesignPatterns.push(factorDesignPattern);
    }

}
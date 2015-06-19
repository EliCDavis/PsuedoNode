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
    
    //http://www.oodesign.com/
    this.start = function (){
        
        var factorDesignPattern = new DesignPatternTemplateViewModel();
        factorDesignPattern.setName("Factory");
        factorDesignPattern.setDescription("Creates objects without exposing the instantiation logic to the\
                                            client and Refers to the newly created object through a common interface.");
        
        var factoryDesignPatternMethod = new ObjectMethodViewModel();
        factoryDesignPatternMethod.name("BuildObject");
        factoryDesignPatternMethod.description("Builds the object this class specializes in");
        factoryDesignPatternMethod.returnType("Object");
        factorDesignPattern.methodsThatComeWithPattern.push(factoryDesignPatternMethod);
        this.defaultDesignPatterns.push(factorDesignPattern);

        
        var singletonDesignPattern = new DesignPatternTemplateViewModel();
        singletonDesignPattern.setName("Singleton");
        singletonDesignPattern.setDescription("Ensure that only one instance of a class is created and Provide a global access point to the object");
        
        var singletonMethod = new ObjectMethodViewModel();
        singletonMethod.name("getInstance");
        singletonMethod.description("public static call that creates an instance of the object and stores in in memory for any future calls to this method.");
        singletonMethod.returnType("this object");
        singletonDesignPattern.methodsThatComeWithPattern.push(singletonMethod);
        this.defaultDesignPatterns.push(singletonDesignPattern);

    };

}
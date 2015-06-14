/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function SystemViewModel(name, description, isSubsystem){
    
    this.id = Date.now();
    
    this.isSubsystem = false;
    if(isSubsystem !== null && isSubsystem){
        this.isSubsystem = true;
    }
    
    this.application = ko.observable();
    
    this.name = ko.observable(name);
    this.purposes = ko.observableArray();
    this.description = ko.observable(description);
    this.subSystems = ko.observableArray();
    
    this.classesAssociated = ko.observableArray();
    
    this.addNewClass = function(){
        this.classesAssociated.push(new ClassViewModel("Class Name", "Class Description, be thorough enough so people know what you mean"));
        this.classesAssociated()[this.classesAssociated().length-1].system(this);

        //do this last once all changes to the class have been done
        openClassEditTab(this.classesAssociated()[this.classesAssociated().length-1]);
    };
    
    this.addNewSubsystem = function(){
        this.subSystems.push(new SystemViewModel("Subsystem","This is a subsystem of "+this.name(), true));
        openSystemEditTab(this.subSystems()[this.subSystems().length-1], true);
    };
    
    this.addNewPurpose = function(){
        this.purposes.push( new PurposeViewModel() );
        openPurposeEditTab(this.purposes()[this.purposes().length-1]);
    };
    
    this.openInTabs = function(){
        if(this.isSubsystem){
             openSystemEditTab(this, true);
        } else {
           openSystemEditTab(this);  
        }
       
    };
    
    this.closeTab = function(){
        closeTab(this.id);
    }
    
};
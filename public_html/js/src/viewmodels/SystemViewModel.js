/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function SystemViewModel(name, description, subSystemOf){
    
    var self = this;
    
    this.id = Date.now();
    
    self.systemRenderer = new SystemRenderer();
    self.systemRenderer.loadSystemToRender(self);
    
    //if the system is a sub system of another system, this is the system it is a subsystem of. XD
    self.subsystemOf = subSystemOf;
    
    this.application = ko.observable();
    
    this.name = ko.observable(name);
    this.purposes = ko.observableArray();
    this.description = ko.observable(description);
    this.subSystems = ko.observableArray();
    
    this.classesAssociated = ko.observableArray();
    
    
    /**
     * Creates a new class object and adds it to the system and then
     * opens it up in the edit tab view.
     * 
     * @returns {undefined}
     */
    this.addNewClass = function(){
        this.classesAssociated.push(new ClassViewModel("Class Name", "Class Description, be thorough enough so people know what you mean"));
        this.classesAssociated()[this.classesAssociated().length-1].system(this);

        //do this last once all changes to the class have been done
        openClassEditTab(this.classesAssociated()[this.classesAssociated().length-1]);
        
        self.updateRenderer();
    };
    
    
    /**
     * Creates an empty sub system to the current system and sets up any
     * needed connections it needs and opens it up in the tab view
     * 
     * @returns {undefined}
     */
    self.addNewSubsystem = function(){
        self.subSystems.push(new SystemViewModel("Subsystem","This is a subsystem of "+self.name(), self));
        self.subSystems()[self.subSystems().length-1].application(this.application());
        openSystemEditTab(self.subSystems()[self.subSystems().length-1], self);
        
        self.updateRenderer();
    };
    
    this.addNewPurpose = function(){
        this.purposes.push( new PurposeViewModel() );
        openPurposeEditTab(this.purposes()[this.purposes().length-1]);
    };
    
    this.openInTabs = function(){
        if(self.subsystemOf != null){
             openSystemEditTab(this, true);
        } else {
           openSystemEditTab(this);  
        }
       
    };
    
    this.closeTab = function(){
        closeTab(this.id);
    };
    
    self.updateRenderer = function(){
        
        if(self.subsystemOf != null){
            self.subsystemOf.updateRenderer();//needs to chain up.
        }
        
        self.systemRenderer.loadSystemToRender(self);
    };
    
};
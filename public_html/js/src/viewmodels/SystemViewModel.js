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
    //MAKE THIS AN OBSERVABLE
    self.subsystemOf = subSystemOf;
    
    this.application = ko.observable();
    
    this.name = ko.observable(name);
    
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
    
    
    /**
     * The purposes that this specific system defines.
     */
    this.purposes = ko.observableArray();
    
    this.addNewPurpose = function(){
        this.purposes.push( new PurposeViewModel() );
        openPurposeEditTab(this.purposes()[this.purposes().length-1]);
    };
    
    
    /**
     * Returns all purposes defined in this system and any parent system purposes.
     * Technically a recursive function because it chains up the sub systems.
     * 
     * @returns {PurposeViewModel[]}
     */
    this.getAllPurposesUpBranch = function(){
        var allPurposes = this.purposes();
        
        //if we don't have a parenet system then all purposes a class can have are in this single system.
        if(self.subsystemOf == null){
            return allPurposes;
        }
        
        for(var i = 0; i < self.subsystemOf.getAllPurposesUpBranch().length; i ++){
            allPurposes.push(self.subsystemOf.getAllPurposesUpBranch()[i]);
        }
        return allPurposes;
    }
    
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
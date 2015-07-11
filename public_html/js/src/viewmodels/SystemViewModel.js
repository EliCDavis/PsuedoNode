/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function SystemViewModel(name, description, subSystemOf){
    
    var self = this;
    
    this.id = Date.now();
    
    /**
     * A system is normalyy defined as a directory, and all the files in that directory are classes.
     * Any sub directories are sub systems.  At the moment I do not have any plans for changing how this works
     */
    self.rootFolderInProject = ko.observable();
    
    //if the system is a sub system of another system, this is the system it is a subsystem of. XD
    //MAKE THIS AN OBSERVABLE
    self.subsystemOf = subSystemOf;
    
    this.application = ko.observable();
    
    this.name = ko.observable(name);
    
    this.description = ko.observable(description);
    this.subSystems = ko.observableArray();
    
    this.classesAssociated = ko.observableArray();
    
    self.systemRenderer = new SystemRenderer();
    self.systemRenderer.loadSystemToRender(self);
    
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
        this.purposes()[this.purposes().length-1].system(this);
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
    
    
    /**
     * Removes itself from it's parent system if it has one.
     * 
     * @returns {undefined}
     */
    self.removeSelfFromSystem = function(){
        if(self.subsystemOf != null){
            this.subsystemOf.removeSubSystem(this);
        }
    }
    
    /**
     * 
     * @param {SystemViewModel} subsystem The subsystem to remove.
     * @returns {undefined}
     */
    self.removeSubSystem = function(subsystemToRemove){
        
        var indexOfSubsystem = self.subSystems.indexOf(subsystemToRemove);
        for(var i = 0; i < self.subSystems().length; i ++){
            //console.log(self.subSystems()[i].id);
        }
        
        //if we even contain the subsystem.
        if(indexOfSubsystem !== -1){
            
            //make sure the subsystem still doesn't think we're out parent.
            self.subSystems()[indexOfSubsystem].subsystemOf = null;
            
            //remove the subsystem
            self.subSystems.remove(subsystemToRemove);
            
            //reflect changes
            self.updateRenderer();
            
        } 
        
    }
    
    self.removeClass = function(classToRemove){
        
        var indexOfClass = self.classesAssociated.indexOf(classToRemove);

        //if we even contain the subsystem.
        if(indexOfClass !== -1){
            
            //make sure the class still doesn't think we're out parent.
            self.classesAssociated()[indexOfClass].system(null);
            
            //remove the subsystem
            self.classesAssociated.remove(classToRemove);
            
            //reflect changes
            self.updateRenderer();
            
        } 
        
    }
    
    self.removePurpose = function(purposesToRemove){
        
        var indexOfClass = self.purposes.indexOf(purposesToRemove);

        //if we even contain the subsystem.
        if(indexOfClass !== -1){
            
            //make sure the class still doesn't think we're out parent.
            self.purposes()[indexOfClass].system(null);
            
            //remove the subsystem
            self.purposes.remove(purposesToRemove);
            
        } 
        
    }
    
    /**
     * Counts all of this systems subsystems and any subsystems of it's subsystems and so on
     * Naturally recursive function.
     * 
     * @returns {int}
     */
    self.allSubsystemsCount = function(){
        
        var subsystemsFound =[];
        
        //iterate through all subsystems
        for(var i = 0; i < self.subSystems().length; i ++){
            
            //iterate though all of subsystems found subsystems ;)
            
            subsystemsFound.push();
        }
    }
    
    /**
     * Searches though every property that contains an ID (purposes, classes, subsystems)
     * and if the ID matches than it calls the appropriate open tab function in 
     * tab manager.
     * 
     * @param {type} id
     * @returns {undefined}
     */
    self.openInTabsByID = function(id){
        
        //do we have the id?
        if(self.id === parseInt(id)){
            self.openInTabs();
            return;
        } else {
            console.log(self.id + " != "+id);
        }
        
        
        //search puposes for id
        for(var i = 0; i < this.purposes().length; i ++){
            
            //see if purposes contains the correct ID
            if(this.purposes()[i].id === parseInt(id)){
                this.purposes()[i].openInTabs();
                return;
            }
        
        }
        
        //search classes for id
        for(var i = 0; i < this.classesAssociated().length; i ++){
            
            //see if purposes contains the correct ID
            if(this.classesAssociated()[i].id === parseInt(id)){
                this.classesAssociated()[i].openInTabs();
                return;
            }
        
        }
        
        //search subsystems
        for(var i = 0; i < this.subSystems().length; i ++){
            
            //see if purposes contains the correct ID
            if(this.subSystems()[i].id === parseInt(id)){
                this.subSystems()[i].openInTabs();
                return;
            }
        
        }
        
        console.log("Couldn't find anyone");
    }
    
    self.updateRenderer = function(){
        
        if(self.subsystemOf != null){
            self.subsystemOf.updateRenderer();//needs to chain up.
        }
        
        self.systemRenderer.loadSystemToRender(self);
    };
    
};
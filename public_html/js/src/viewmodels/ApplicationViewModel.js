/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ApplicationViewModel(){
    
    var self = this;
    
    self.id = 200;
    
    
    self.nameOfProjectLoaded = ko.observable("");
    
    
    self.editingNamingConventions = ko.observable(false);
    
    self.toggleEditingNamingConventions = function (){
        self.editingNamingConventions(!self.editingNamingConventions());
    };
    
    self.namingConventions = ko.observableArray();
    
    self.addNewNamingConvention = function(){
        self.namingConventions.push({property:"Thing to name",value:"How to name"});
    };
    
    self.removeNamingConvention = function(convention){
        self.namingConventions.remove(convention);
    };
    
    //type SystemViewModel
    self.rootSystems = ko.observableArray();
    
    //typeDesignPatternTemplateViewModel
    self.defaultDesignPatterns = ko.observableArray();
    
    
    self.createNewDesignPattern = function(){
        var newPattern = new DesignPatternTemplateViewModel("Name","Description");
        self.defaultDesignPatterns.push(newPattern);
        newPattern.openInTabs();
    };
    

    
    self.projectFileTree = ko.observable();
    
    self.flattenedProjectTree = null;
    
    self.directoriesAsRoot = ko.observableArray();
    
    self.directoriesHidden = ko.observableArray();
    
    self.directoriesUnassigned = ko.observableArray();
    
    self.loadProjectFiles = function(flattenedProjectTree){
        
        self.flattenedProjectTree = flattenedProjectTree;
        
        //Clear what we originally had
        self.directoriesAsRoot.removeAll();
        self.directoriesHidden.removeAll();
        self.directoriesUnassigned.removeAll();
        
        //Go through and add all directories as unassigned
        for(var i = 0; i < flattenedProjectTree.length; i ++){
            
            if(flattenedProjectTree[i].type === "tree"){
                self.directoriesUnassigned.push(flattenedProjectTree[i].path);
            }
        
        }
        
    };
    
    /**
     * When it comes to drag and drop, we need to keep up with what directory is going where.
     * Such as when some one drags a directory from un assigned to root, now we have to 
     * create a root system object and all that jazz,
     * 
     * There are 3 containers. 
     * Unassigned: All directories that we're not going to do anything special for
     * Assigned: All assigned directories are root nodes, and any sub directories are sub systems
     * Hidden: If the is a sub directory of a root node, then this won't appear under it.
     * 
     * @param {type} systemPath The directory we're dealing with
     * @param {type} to what container we're moving too 
     * @param {type} from
     * @returns {undefined}
     */
    self.swapSystemDirectoryLocations = function(systemPath, to, from){
        
        //They just dragged and dropped into the same container, don't worry about anything
        if(to === from){
            return;
        }
        
        if(from === "unacceptedSystems"){
            self.directoriesUnassigned.remove(systemPath);
        }

        if(to === "unacceptedSystems"){
            self.directoriesUnassigned.push(systemPath);
        }
        
        
        if(from === "hiddenSystems"){
            self.directoriesHidden.remove(systemPath);
        }

        if(to === "hiddenSystems"){
            self.directoriesHidden.push(systemPath);
        }
        
        
        if(from === "acceptedSystems"){
            self.directoriesAsRoot.remove(systemPath);
        }

        if(to === "acceptedSystems"){
            self.directoriesAsRoot.push(systemPath);
        }
        
        self.reloadAllSystemsAppropriately(self.projectFileTree);
    
    };
    

    /**
     * When the system structure of our project has changed, it's time to re evaluate what exacly is going on.
     * @returns {undefined}
     */
    self.reloadAllSystemsAppropriately = function(){
        
        self.rootSystems.removeAll();
                
        //Go through and add files from the project appropriately
        for(var d = 0; d <  self.flattenedProjectTree.length; d ++){
        
            //get some variables defined really quickly
            var currentFlattenedTreePath = self.flattenedProjectTree[d].path;
            var pathName = currentFlattenedTreePath.split("/")[currentFlattenedTreePath.split("/").length -1];
            
            var hidden = false;
            
            //Check and make sure it's not in a hidden directory.
            for(var i = 0; i < self.directoriesHidden().length; i ++){

                //If this should be hidden then lets just move onto the next file in the loop
                if( currentFlattenedTreePath.indexOf(self.directoriesHidden()[i]) !== -1 ){
                    hidden = true;
                }

            }
            
            //go to the next iteration, don't bother with this any further.
            if(hidden){
                continue;
            }
            
            //Check and see if it's a root system
            var isRootSystem = false;
            for(var i = 0; i < self.directoriesAsRoot().length; i ++){
                
                if(currentFlattenedTreePath === self.directoriesAsRoot()[i]){
                    
                    var systemPath = currentFlattenedTreePath;
                    
                    var nameSystemName = systemPath.split("/")[systemPath.split("/").length -1];
            
                    var newSystem = new SystemViewModel(nameSystemName);

                    newSystem.application(self);
                    
                    newSystem.rootFolderInProject(systemPath);

                    self.rootSystems.push(newSystem);

                    isRootSystem  = true;

                }
                
            }
            
            if(isRootSystem){
                continue;
            }
            
            var systemToAddTo = null;
                 
            //go through all the systems we have and figure out where it belongs.
            for (var i = 0; i < self.rootSystems().length;  i++) {

                //if the file is in the directory then we're going to use this system
                if( self.flattenedProjectTree[d].path.indexOf(self.rootSystems()[i].rootFolderInProject()) !== -1 ){

                    systemToAddTo  = self.findDeepestSubsystemMatchingPath(currentFlattenedTreePath, self.rootSystems()[i]);

                }

            }
            
            
            //add as subsystem if appropriate
            if(self.flattenedProjectTree[d].type === "tree"){
                
                //If we found a system we're going to add to lets do it.
                if(systemToAddTo !== null){
                    var newSystem = systemToAddTo.addNewSubsystem(false);
                    newSystem.rootFolderInProject(currentFlattenedTreePath);
                    newSystem.name(pathName);
                }
                
            }
            
            
            //If it's a file let's try adding it to a system.
            if(self.flattenedProjectTree[d].type === "blob"){
                 
                //If we found a system we're going to add to lets do it.
                if(systemToAddTo !== null){
                    var newClass = systemToAddTo.addNewClass(false);
                    newClass.name(pathName);
                }
                 
            }
            
            
        }
        
    };
    
    
    self.findDeepestSubsystemMatchingPath = function(path, system){
        
        if( path.indexOf( system.rootFolderInProject() ) === -1 ){
            return null;
        }
        
        var curSystem = system;
        
        for(var i = 0; i < system.subSystems().length; i ++){
            
            var systemForEval = self.findDeepestSubsystemMatchingPath( path, system.subSystems()[i] );
      
            if(systemForEval !== null){
                
                if(systemForEval.rootFolderInProject().length > curSystem.rootFolderInProject().length){
                    curSystem = systemForEval;
                }
                
            }
            
        }
        
        return curSystem;
        
    };
    
    
    /**
     * Closes the tab if it is currentely open
     * 
     * @returns {undefined}
     */
    this.closeTab = function(){
        closeTab(self.id);
    };

    self.openInTabs = function(){
        openApplicationSettingsTab(self);
    };
    
    

}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";

/**
 * 
 * @returns {SystemImportExport}
 */
function SystemImportExport(){
    
    var self = this;
    
    /**
     * Generates a JSON object meant to represent a SystemViewModel and any subsystems it may contain.
     * 
     * @param {SystemViewModel} systemToExport The view model we wish to be represented as JSON
     * @returns {SystemImportExport.exportSystemToJSON.systemJSON}
     */
    self.exportSystemToJSON = function(systemToExport){
        
        if(systemToExport === null){
            return {};
        }
        
        //JSON representation of our Systems View Model
        var systemJSON = {
            "name": systemToExport.name(),
            "rootFolderInProject": systemToExport.rootFolderInProject(),
            "description": systemToExport.description(),
            "id": systemToExport.id,
            "subsystems": [],
            "associatedClasses": [],
            "purposes": []
        };
        
        //add all subsystems
        for(var i = 0 ; i < systemToExport.subSystems().length; i ++){
            systemJSON.subsystems.push(self.exportSystemToJSON(systemToExport.subSystems()[i]));
        }
        
        //add all classes
        var classIO = new ClassImportExport();
        for(var i = 0; i < systemToExport.classesAssociated().length; i ++){
            systemJSON.associatedClasses.push(classIO.exportClassToJson(systemToExport.classesAssociated()[i]));
        }
        
        //add all purposes
        var purposeIO = new PurposeImportExport();
        for(var i = 0; i < systemToExport.purposes().length; i ++){
            systemJSON.purposes.push(purposeIO.exportPurposeToJson(systemToExport.purposes()[i]));
        }
    
        //Return resulting JSON object representing our system
        return systemJSON;
        
    };
    
    
    /**
     * Take JSON that was produced by SystemImportExport.exportSystemToJSON() and recunstructs it into a SystemViewModel
     * 
     * @param {SystemImportExport.exportSystemToJSON.systemJSON} systemJSON The JSON we're going to build a system from.
     * @param {DesignPatternTemplateViewModel} designPatterns Any patterns the classes might use
     * @param {PurposeViewModel[]} extraPurposes Any purposes the classes might use.
     * @returns {SystemImportExport.importSystemFromJSON.system|SystemViewModel} The system constructed from the JSON
     */
    self.importSystemFromJSON = function(systemJSON, application, designPatterns, extraPurposes){
        
        if(systemJSON === null || application === null){
            return null;
        }
        
        var system = new SystemViewModel();
        system.application(application);
        system.name(systemJSON.name);
        system.description(systemJSON.description);
        system.id = systemJSON.id;
        system.rootFolderInProject(systemJSON.rootFolderInProject);
        
        //import purposes before we import classes
        var purposeIO = new PurposeImportExport();
        var purposesParsed = [];
        for(var i = 0; i < systemJSON.purposes.length; i ++){
            purposesParsed.push(purposeIO.importPurposeFromJSON(systemJSON.purposes[i]));
        }
        system.purposes(purposesParsed);
        
        //import classes
        var classIO = new ClassImportExport();
        var classesParsed = [];
        if(extraPurposes != null){
            for(var i = 0; i < extraPurposes.length; i ++){
                purposesParsed.push(extraPurposes[i]);
            }  
        }
        for(var i = 0; i < systemJSON.associatedClasses.length; i ++){
            var newClass = classIO.importClassFromJSON( systemJSON.associatedClasses[i], designPatterns,  purposesParsed);
            newClass.system( system );
            classesParsed.push( newClass );
        }
        system.classesAssociated(classesParsed);
        
        //import sub systems.
        var systemsParsed = [];
        for(var i = 0; i < systemJSON.subsystems.length; i++){
            var systemParsed = self.importSystemFromJSON( systemJSON.subsystems[i], application, designPatterns, purposesParsed );
            systemParsed.subsystemOf = system ;
            systemsParsed.push( systemParsed );
        }
        system.subSystems( systemsParsed );
        
        return system;
        
    };
    
}
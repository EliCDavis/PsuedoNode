/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * At the end of the day, you need to have what changes you've made to be saved.
 * This takes care of saving those changes and loading what you have done previously.
 */



function Workspace(){
    
    var self = this;
    
    self.githubReference = null;
    
    self.saveToJSON = function(){
        
        console.log('Project loaded = '+applicationsViewModel.nameOfProjectLoaded());
        
        var workspaceData = {
            
            "definedRoots" : [],
            "hiddenPaths": [],
            "namingConventions": [],
            "designPatterns": []
            
        };
        
        workspaceData.definedRoots = applicationsViewModel.directoriesAsRoot();
        workspaceData.hiddenPaths = applicationsViewModel.directoriesHidden();

        
        if(homeViewModel.githubHandler != null){
            homeViewModel.githubHandler.commitWorspaceSettings(applicationsViewModel.nameOfProjectLoaded(), workspaceData);
        }
        
    };
    
    self.loadFromJSON = function(){
        
    };
    
    self.logInToGitHub = function(username, password){
        
    };
    
}
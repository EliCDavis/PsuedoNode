/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function HomeViewModel(){
    
    var self = this;
    
    /**
     * Used for creating tabs
     */
    self.id = 100;
    
    
    /**
     * General info on the user which is logged in.
     */
    self.basicGithubUserInfo = ko.observable(null);
    
    
    /**
     * Logic that decides whether or  not the user is currentely logged in to a Github account
     */
    self.loggedIn = ko.computed(function(){
        
        if(self.basicGithubUserInfo() === null){
            return false;
        }
        
        return true;
        
    },this);
    
    
    /**
     * A object containing basic information on the currentely loaded repo.
     */
    self.basicInfoOnLoadedRepo = ko.computed(function(){
        
        if(applicationsViewModel === undefined || applicationsViewModel.nameOfProjectLoaded() === undefined || applicationsViewModel.nameOfProjectLoaded() ===""){
            return null;
        }
        
        return {
            name: applicationsViewModel.nameOfProjectLoaded()
        };
        
    });
    
    
    self.usersRepos = ko.observableArray();
    
    
    self.openInTabs = function(){
        openHomeTab(self);  
    };
    
    
    self.closeTab = function(){
        closeTab(self.id);
    };
    
    
    self.loadRepo = function(repoToLoad){
        workspace.loadRepo(repoToLoad.name);
    };
    
}
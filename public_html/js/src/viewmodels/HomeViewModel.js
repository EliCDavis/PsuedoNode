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
     * Used to convert from markdown to html
     */
    self.showdown = new showdown.Converter();
    
    /**
     * The actual file contents of the README, in the markdown language.
     */
    self.repoReadMeRaw = ko.observable();
    
    /**
     * boolean flag keeping up with whether or not we are editing the readme file of the repo loaded in
     */
    self.currentelyEditingReadme = ko.observable(false);
    
    /**
     * The ReadMeRaw converted into HTML format using showdown
     */
    self.readMeHTML = ko.computed(function(){
        
        //using this function as a subscribe, 
        //if it changes while we're in edit mode we're assuming the user made the edit
        if(self.currentelyEditingReadme()){
            self.readMeHasChanged = true;
        }
        
        console.log(self.showdown.makeHtml(self.repoReadMeRaw()));
        
        return self.showdown.makeHtml(self.repoReadMeRaw());
        
    },self);
    
    
    self.readMeHasChanged = false;
    
    
    self.canEditReadMe = ko.computed(function(){
        if(self.repoReadMeRaw() != null && self.repoReadMeRaw() !== ""){
            return true;
        }
        return false;
    },this);
    
    
    /**
     * Toggles the editing mode of the readme file
     * @returns {undefined}
     */
    self.toggleEditingReadMe = function(){
        self.currentelyEditingReadme(!self.currentelyEditingReadme());
    };
    
    
    self.repoCommits = ko.observableArray();
    
    
    /**
     * Logic that decides whether or  not the user is currentely logged in to a Github account
     */
    self.loggedIn = ko.computed(function(){
        
        if(self.basicGithubUserInfo() === null){
            return false;
        }
        
        return true;
        
    },this);
    
    
    self.repoIsLoaded = ko.computed(function(){
        console.log();
        if(applicationsViewModel === undefined || applicationsViewModel.nameOfProjectLoaded() === undefined || applicationsViewModel.nameOfProjectLoaded() === ""){
            return false;
        }
        return true;
    });
    
    
    
    self.usersRepos = ko.observableArray();
    
    
    self.openInTabs = function(){
        openHomeTab(self);  
    };
    
    
    self.closeTab = function(){
        closeTab(self.id);
    };
    
    
    self.loadRepo = function(repoToLoad){
        workspace.loadRepo(repoToLoad);
    };
    
}
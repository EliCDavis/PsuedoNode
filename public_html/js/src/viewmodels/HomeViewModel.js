/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function HomeViewModel(){
    
    var self = this;
    
    
    self.id = 100;
    
    /**
     * GitHubUserViewModel
     */
    self.githubUserViewModel = ko.observable(new GitHubUserViewModel());
    
    
    /**
     * In an attempt to seperate functionality from the interface, we have a handler meant for interfacing 
     * with our Github object
     */
    self.githubHandler;
    
    
    /**
     * Sets the github obj 
     * @param {type} reference
     * @param {String} username 
     * @returns {undefined}
     */
    self.setGithubReference = function(reference, username){
        self.githubHandler = new GithubHandler(reference, username);  
        self.loadGithubUser();
    };
    
    
    /**
     * Logic that decides whether or  not the user is currentely logged in to a Github account
     */
    self.loggedIn = ko.computed(function(){
        
        if(self.githubUserViewModel().userName() === undefined){
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
        console.log(repoToLoad);
        
        var newRoot = new SystemViewModel(repoToLoad.name, repoToLoad.description);
        newRoot.application(self);
        
        //self.rootSystems.push(newRoot);
        
        self.githubHandler.loadRepo(repoToLoad.name);

    };
    
    
    self.loadGithubUser = function(githubUser){
        
        self.githubUserViewModel().githubUser = githubUser;
        
        self.githubHandler.getUserBasicData(function(userData){
            if(userData !== undefined){
                self.githubUserViewModel().profilePicURL(userData.avatar_url);
                self.githubUserViewModel().profileUrl(userData.html_url);
                self.githubUserViewModel().userName(userData.login);
                self.githubUserViewModel().displayName(userData.name);
                console.log(userData);
            }
        });
        
        
        self.usersRepos.removeAll();
        
        
        self.githubHandler.getUserReposOverview(function(repos){
            if(repos !== undefined){
                for(var i = 0; i < repos.length; i ++){
                    self.usersRepos.push({
                        "name":repos[i].name,
                        "description":repos[i].description,
                        "url":repos[i].url
                    });
            }
            }
        });
  
    };
    
}
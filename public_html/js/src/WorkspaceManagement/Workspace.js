/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * At the end of the day, you need to have what changes you've made to be saved.
 * This takes care of saving those changes and loading what you have done previously.
 */

'use strict';

function Workspace(homeViewmodel, applicationViewmodel){
    
    var self = this;
    
    /**
     * @type HomeViewModel
     */
    self.homeViewModel = homeViewmodel;
    
    
    /**
     * @type ApplicationViewModel
     */
    self.applicationViewModel = applicationViewmodel;
    
    
    /**
     * The object we use for getting information in github
     * Created once we are logged in.
     * 
     * @type GithubHandler
     */
    self.githubHandler;
    
    
    /**
     * Builds a JSON representation of our workplace.
     * Then commits the json to the user's repository
     * 
     * @returns {undefined}
     */
    self.saveToJSON = function(){
                
        //JSON we're going to be filling out to be eventually commited to the repo
        var workspaceData = {
            "definedRoots" : [],
            "hiddenPaths": [],
            "namingConventions": [],
            "designPatterns": [],
            "systems": []
        };
        
        //Setting paths we have defined as roots and 
        workspaceData.definedRoots = self.applicationViewModel.directoriesAsRoot();
        workspaceData.hiddenPaths = self.applicationViewModel.directoriesHidden();

        //add in naming conventions
        workspaceData.namingConventions = self.applicationViewModel.namingConventions();

        //Put all systems in JSON format
        var io = new SystemImportExport();
        for(var i = 0; i < self.applicationViewModel.rootSystems().length; i ++){
            workspaceData.systems.push(io.exportSystemToJSON(self.applicationViewModel.rootSystems()[i]));
        }
        
        //put all design patterns into JSON
        var patternIO = new DesignPatternImportExport();
        for(var i = 0; i < self.applicationViewModel.defaultDesignPatterns().length; i ++){
            workspaceData.designPatterns.push( patternIO.exportDesignPatternToJSON(self.applicationViewModel.defaultDesignPatterns()[i]) );
        }
        
        console.log(workspaceData);
        
        //commit the changes
        if(self.githubHandler !== null){
            self.githubHandler.commitWorspaceSettings(self.applicationViewModel.nameOfProjectLoaded(), workspaceData);
        }
        
    };
    
    
    self.loadFromJSON = function(repoName, config, tree, flattened){
        
        self.applicationViewModel.nameOfProjectLoaded(repoName);
        self.applicationViewModel.projectFileTree(tree);
        self.applicationViewModel.loadProjectFiles(flattened);
        
        for(var i = 0; i < config.definedRoots.length; i ++){
            self.applicationViewModel.directoriesAsRoot.push(config.definedRoots[i]);
            self.applicationViewModel.directoriesUnassigned.remove(config.definedRoots[i]);
        }
        
        for(var i = 0; i < config.hiddenPaths.length; i ++){
            self.applicationViewModel.directoriesHidden.push(config.hiddenPaths[i]);
            self.applicationViewModel.directoriesUnassigned.remove(config.hiddenPaths[i]);
        }
        
        //makes the application dump all view models and recreate them based on the new folder structure
        //self.applicationViewModel.reloadAllSystemsAppropriately();
        
        //load in naming conventions
        self.applicationViewModel.namingConventions(config.namingConventions);
        
        //load in design patterns.
        var desionPatternIO = new DesignPatternImportExport();
        var patternsParsed = [];
        for(var i = 0 ; i < config.designPatterns.length; i ++){
            patternsParsed.push(desionPatternIO.importDesignPatternFromJSON(config.designPatterns[i]));
        }
        self.applicationViewModel.defaultDesignPatterns(patternsParsed);
        
        //load in the systems
        var systemIO = new SystemImportExport();
        var systemsParsed = [];
        for(var i = 0; i < config.systems.length; i ++){
            systemsParsed.push(systemIO.importSystemFromJSON(config.systems[i], self.applicationViewModel, patternsParsed));
        }
        
        console.log("Systems Parsed", systemsParsed);
        
        self.applicationViewModel.rootSystems(systemsParsed);
        
    };
    
    
    /**
     * Attempts to log into Github.com with the given credentials.
     * On success, the home page is updated with the user profile they have logged in as.
     * 
     * @param {type} username The github username
     * @param {type} password The github password
     * @returns {undefined}
     */
    self.logInToGitHub = function(username, password){
        
        //create a reference to github
        var github = new Github({
            username: username,
            password: password,
            auth: "basic"
        });
        
        //create our handler for github operations
        self.githubHandler = new GithubHandler(github, username);

        //load in some basic info about the user who has logged in.
        var basicUserData = null;
        self.githubHandler.getUserBasicData(function(userData){
            if(userData !== undefined){
                
                basicUserData = {
                    profilePicURL: userData.avatar_url,
                    profileUrl: userData.html_url,
                    userName:userData.login,
                    displayName: ko.observable(userData.name)
                };
                
                
                self.homeViewModel.basicGithubUserInfo(basicUserData);
            }
        });
        
        
        //Load in what repositories the user has.
        self.homeViewModel.usersRepos.removeAll();
        self.githubHandler.getUserReposOverview(function(repos){
            if(repos !== undefined){
                for(var i = 0; i < repos.length; i ++){
                    self.homeViewModel.usersRepos.push({
                        "name":repos[i].name,
                        "description":repos[i].description,
                        "url":repos[i].url
                    });
                }
            }
        });
        
        
    };
    
    
    self.loadRepo = function(repoToLoad){
        self.githubHandler.loadRepo(repoToLoad);
    };
    
}
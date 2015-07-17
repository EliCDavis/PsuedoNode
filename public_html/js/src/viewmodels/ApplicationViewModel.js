/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ApplicationViewModel(){
    
    var self = this;
    
    self.id = 200;
    
    /**
     * GitHubUserViewModel
     */
    self.githubUserViewModel = ko.observable();
    
    
    
    /**
     * In an attempt to seperate functionality from the interface, we have a handler meant for interfacing 
     * with our Github object
     */
    self.githubHandler;
    
    
    /**
     * Sets the github obj 
     * @param {type} reference
     * @returns {undefined}
     */
    self.setGithubReference = function(reference, username){
        self.githubHandler = new GithubHandler(reference, username);
        
        self.loadGithubUser();
    }
    
    
    
    self.usersRepos = ko.observableArray();
    
    this.namingConventions = ko.observableArray([{property:"Global Vairables",value:"LIKE_THIS"},{property:"Private Methods",value:"_likeThis()"}]);
    this.caseConventions;
    
    //type SystemViewModel
    this.rootSystems = ko.observableArray();
    
    //typeDesignPatternTemplateViewModel
    this.defaultDesignPatterns = ko.observableArray();
    
    self.createNewDesignPattern = function(){
        var newPattern = new DesignPatternTemplateViewModel("Name","Description");
        self.defaultDesignPatterns.push(newPattern);
        newPattern.openInTabs()
    }
    
    //http://www.oodesign.com/
    this.start = function (){
        
        var factorDesignPattern = new DesignPatternTemplateViewModel();
        factorDesignPattern.setName("Factory");
        factorDesignPattern.setDescription("Creates objects without exposing the instantiation logic to the\
                                            client and Refers to the newly created object through a common interface.");
        
        var factoryDesignPatternMethod = new ObjectMethodViewModel();
        factoryDesignPatternMethod.name("BuildObject");
        factoryDesignPatternMethod.description("Builds the object this class specializes in");
        factoryDesignPatternMethod.returnType("Object");
        factorDesignPattern.methodsThatComeWithPattern.push(factoryDesignPatternMethod);
        this.defaultDesignPatterns.push(factorDesignPattern);

        
        var singletonDesignPattern = new DesignPatternTemplateViewModel();
        singletonDesignPattern.id += 10;
        singletonDesignPattern.setName("Singleton");
        singletonDesignPattern.setDescription("Ensure that only one instance of a class is created and Provide a global access point to the object");
        
        var singletonMethod = new ObjectMethodViewModel();
        singletonMethod.name("getInstance");
        singletonMethod.description("public static call that creates an instance of the object and stores in in memory for any future calls to this method.");
        singletonMethod.returnType("this object");
        singletonDesignPattern.methodsThatComeWithPattern.push(singletonMethod);
        this.defaultDesignPatterns.push(singletonDesignPattern);

    };
    
    /**
     * Closes the tab if it is currentely open
     * 
     * @returns {undefined}
     */
    this.closeTab = function(){
        closeTab(self.id);
    }

    self.openInTabs = function(){
        openApplicationSettingsTab(self);
    };
    
    self.loadRepo = function(repoToLoad){
        console.log(repoToLoad);
        
        self.rootSystems.push(new SystemViewModel(repoToLoad.name, repoToLoad.description));
        
        self.githubHandler.loadRepo(repoToLoad.name, self.rootSystems()[self.rootSystems().length -1]);
        
//        var repo = self.githubHandler.githubReference.getRepo(self.githubUserViewModel().userName(), repoToLoad.name);
//        
//        repo.show(function(err, repoResults) {
//            console.log(repoResults);
//        });
//        
//        var root;
//        
//        repo.getTree('master?recursive=true', function(err, tree) {
//            console.log(tree);
//            root = tree;
//            
//            repo.read('master', root[0].path, function(err, data) {
//                console.log(data);
//            });
//            
//        });
//        
    }
    
    self.loadGithubUser = function(githubUser){
        
        self.githubUserViewModel(new GitHubUserViewModel(githubUser));
        
        
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

        
        self.openInTabs();
        
    }

}
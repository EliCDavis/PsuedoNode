/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function GithubHandler(reference,username){
 
    var self = this;
    
    self.githubReference = reference;
    
    self.githubUsername = username;
    
    
    
    
    self.getUserBasicData = function(callback){
        
        var user = self.githubReference.getUser();
        
        user.show(self.githubUsername, function(err, userData) {
            
            if(err !== null){
                alert("Error Grabbing User Information");
                console.log(err);
                return null;
            }
            
            if(callback != null){
                callback(userData);
            }
            
            
            return userData;
            
        });
        
    };
    
    self.getUserReposOverview = function(callback){
        
        self.githubReference.getUser().repos(function(err, repos) {
            
            if(err !== null){
                alert("Error Grabbing Repo Information");
                console.log(err);
                return null;
            }
            
            if(callback != null){
                callback(repos);
            }
            
            return repos;
            
        });
        
    }
    
    
    self.loadRepo = function(repoName, rootToLoadInto){
        
        if(self.githubReference === null){
            console.error("The reference to github is null!");
        }
        
        if(repoName === null || repoName === ""){
            console.error("The repo to load is invalid! Repo:",repoName);
        }
        
        var repo = self.githubReference.getRepo(self.githubUsername, repoName);
        
        //Go through and get entire tree.
        var root = {
            name: "root",
            files: [],
            subDirectories: []
        };
        
        repo.getTree('master?recursive=true', function(err, tree) {
            
            if(err !== null){
                alert("Error Grabbing Repo Information");
                console.log(err);
                return;
            }
            
            console.log(tree);
            
            for(var treeIndex = 0; treeIndex < tree.length; treeIndex ++){
                
                var path = tree[treeIndex].path.split("/");
                
                var curDir = root;
                
                for(var pathIndex = 0; pathIndex < path.length; pathIndex ++){
                    
                    //if we've reaches the end
                    if(pathIndex === path.length -1 ){
                        
                        if(tree[treeIndex].type === "blob"){
                            curDir.files.push({
                                name: path[pathIndex]
                            });
                        }
                        
                        if(tree[treeIndex].type === "tree"){
                            curDir.subDirectories.push({
                                name: path[pathIndex],
                                files: [],
                                subDirectories: []
                            });
                        }
   
                    } else {
                        
                        for(var i = 0; i < curDir.subDirectories.length; i ++){
                            if(curDir.subDirectories[i].name === path[pathIndex]){
                                curDir = curDir.subDirectories[i];
                                break;
                            }
                        }
                        
                    }
                    
                }
                
            }
            
            console.log(root);
            
            self.contructProject(root, rootToLoadInto);
            
        });
        
        
    }
    
    self.contructProject = function(rootJson, system){
        for(var i = 0; i < rootJson.subDirectories.length; i ++){
            var subSystem = system.addNewSubsystem(false);
            
            subSystem.name(rootJson.subDirectories[i].name);
            
            self.contructProject(rootJson.subDirectories[i], subSystem);
        }
        
        for(var i = 0; i < rootJson.files.length; i ++){
            var node = system.addNewClass(false);
            
            node.name(rootJson.files[i].name);
            
            
        }
    }
    
}
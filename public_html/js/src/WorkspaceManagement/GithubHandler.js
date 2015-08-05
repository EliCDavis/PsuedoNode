/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function GithubHandler(reference,username){
 
    var self = this;
    
    
    /**
     * The github reference, where we logged in with a username and password
     */
    self.githubReference = reference;
    
    
    /**
     * The github username used with the github reference
     */
    self.githubUsername = username;
        
    /**
     * Grabs JSON associated with the basic info of the user logged in.
     * Because these calls run assynchrosouly there is a provided call back parameter.
     * It also returns with the user data, so providing a callback is not nessicary if
     * the data is not needed immeidiately
     * 
     * @param {function} callback the function we will call with the userdata when we finnally have data on the user
     * @returns {JSON} The user data.
     */
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
        
    };
    
    
    self.startNewPseudonodeProjectWithRepo = function(root, repoName, flatRoot){
        applicationsViewModel.nameOfProjectLoaded(repoName);
        applicationsViewModel.projectFileTree(root);
        applicationsViewModel.loadProjectFiles(flatRoot)
        applicationsViewModel.openInTabs();
    };
    
    
    self.loadRepo = function(repoName, rootToLoadInto){
        
        if(self.githubReference === null){
            console.error("The reference to github is null!");
        }
        
        if(repoName === null || repoName === ""){
            console.error("The repo to load is invalid! Repo:",repoName);
        }
        
        var repo = self.githubReference.getRepo(self.githubUsername, repoName);
        
        //repo.show(function(err, repoResults) {console.log(repoResults);});
        
        repo.getCommits(null, function(err, commit) {
            console.log(commit);
            workspace.loadInRepoCommits(commit);
        });
        
        //Go through and get entire tree.
        var root = {
            name: "root",
            path: "",
            files: [],
            subDirectories: []
        };
        
        var rootFlattened;
        
        repo.getTree('master?recursive=true', function(err, tree) {
            
            if(err !== null){
                alert("Error Grabbing Repo Information");
                console.log(err);
                return null;
            }
            
            rootFlattened = tree;
            
            //console.log(tree);
            
            //parse tree into a json object.
            for(var treeIndex = 0; treeIndex < tree.length; treeIndex ++){
                
                var path = tree[treeIndex].path.split("/");
                
                var curDir = root;
                
                for(var pathIndex = 0; pathIndex < path.length; pathIndex ++){
                    
                    //if we've reaches the end
                    if(pathIndex === path.length -1 ){
                        
                        if(tree[treeIndex].type === "blob"){
                            curDir.files.push({
                                path: tree[treeIndex].path,
                                name: path[pathIndex]
                            });
                        }
                        
                        if(tree[treeIndex].type === "tree"){
                            curDir.subDirectories.push({
                                name: path[pathIndex],
                                path: tree[treeIndex].path,
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
            
            var configFound = false;
            
            //look for if a psuedonode.json file exhists. If it does load it, if it doesn't go to new settings with tree.
            for(var i = 0; i < root.files.length; i ++){
                if(root.files[i].name === "pseudonode.json"){
                    
                    //json found! Load project
                    configFound = true;
                    
                    repo.read('master', root.files[i].path, function(err, data) {
                        
                        if(err !== null){
                            console.log("Error retriving config file!");
                        }
                        
                        self.loadProjectFromConfigFile(repoName, data, root, rootFlattened);
                        
                    });
                    
                }
                
                if(root.files[i].name === "README.md"){
                    
                    repo.read('master', root.files[i].path, function(err, data) {
                        
                        if(err !== null){
                            console.log("Error retriving Readme file!");
                        }
                        
                        workspace.loadReadMeFile(data);
                        
                    });
                    
                }
            }
            
            if(!configFound){
                self.startNewPseudonodeProjectWithRepo(root, repoName, rootFlattened);
            }
            
        });
        
        return repo;
        
    };
    
    
    self.loadProjectFromConfigFile = function(repoName, data, tree, flattened){
           
        var config = JSON.parse(data);
        
        workspace.loadFromJSON(repoName, config, tree, flattened);
        
    };
    
    self.commitWorspaceSettings = function(repoName, data){
        var repo = self.githubReference.getRepo(self.githubUsername, repoName);
        
        repo.write('master', "pseudonode.json", JSON.stringify(data), "Saving of workspace from the webapplication PseudoNode", function(err){
            
            if(err !== null){
                alert("Error saving changes to repo!");
                console.log(err);
            }
            
        });
    };
    
    
    
    self.getCommitInformation = function(repo, sha, cb){
        
        repo.getCommit('master', sha, function(err, commit) {
            
            if(err !== null){
                alert("Error grabbing commit info!");
                console.log(err);
            }
            
            cb(commit);
        });
        
    };
    
    
    /**
     * Recursively builds all systems and classes from the json inside of the system
     * 
     * @param {JSON} rootJson The structure we're going to build out of
     * @param {SystemViewModel} system The system view model we're
     * @returns {undefined}
     */
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
    };
    
}
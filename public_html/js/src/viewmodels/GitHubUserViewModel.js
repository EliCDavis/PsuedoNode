/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function GitHubUserViewModel(githubUser){
    
    var self = this;
    
    self.githubUser = githubUser;
    
    self.profilePicURL = ko.observable();
    
    self.profileUrl = ko.observable();
    
    self.displayName = ko.observable();
    
    self.userName = ko.observable();
    
}
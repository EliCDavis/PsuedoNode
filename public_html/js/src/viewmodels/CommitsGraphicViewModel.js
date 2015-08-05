/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * A view model meant to represent the view for all commits of the project and how they effect it
 * 
 * @returns {CommitsGraphicViewModel}
 */
function CommitsGraphicViewModel(){
    
    var self = this;
    
    /*
     * The id of the model for when being opened in a tab
     */
    self.id = 300;
    
    
    /**
     * The list of commits in the project.
     */
    self.commits = ko.observableArray();
    
    
    /**
     * Our calculator used for generating information about commits inside the repo
     */
    self.commitsCalculator = null;
    
    
    /**
     * Only create a calculator when we need it.
     * @returns {Window.commitsCalculator|CommitCalculator}
     */
    self.getCommitsCalculator = function(){
        if(self.commitsCalculator === null){
            self.commitsCalculator = new CommitCalculator(workspace);
        }
        return self.commitsCalculator;
    };
    
    
    self.chart = null;
    
    /**
     * Displays the commit passed in for better analysis of what it did to the project
     * 
     * @param {CommitJSON} commitToLoad The commit we want to be
     * @returns {undefined}
     */
    self.loadCommit = function(commitToLoad){
        self.getCommitsCalculator().getCommitDataForRadarGraph(commitToLoad.sha,function(data){
           
            var ctx = document.getElementById("purposesChart").getContext("2d");
            
            if(self.chart === null){
                self.chart = new Chart(ctx).Radar(data);
            } else {
                console.log(self.chart);
                self.chart.destroy();
                self.chart = new Chart(ctx).Radar(data);
//                self.chart.datasets[0].points = data.datasets[0].data;
//                self.chart.datasets[1].points = data.datasets[1].data;
//                self.chart.scale.labels = data.labels;
//                self.chart.update();
            }
           
        });
    };
    
    /**
     * Opens the commit overview model in the edit tabs
     * @returns {undefined}
     */
    self.openInTabs = function(){
        openCommitsGraphicTab(self);  
    };
    
    /**
     * Closes the tab if one is open.
     * @returns {undefined}
     */
    self.closeTab = function(){
        closeTab(self.id);
    };
    
}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



function CommitCalculator(workspace){
   
    var self = this;
   
    /**
     * 
     */
    self.workspace = workspace;
    
    
    self.getCommitDataForRadarGraphByPurpose = function(sha, cb){
        
        self.workspace.getCommit(sha, function(commitInfo){
            
            var data = {
                "labels":["Other"],
                "datasets":[
                    {
                        "label": "additions",
                        fillColor: "rgba(0,220,0,0.2)",
                        strokeColor: "rgba(0,220,0,.8)",
                        pointColor: "rgba(0,220,0,.8)",
                        pointStrokeColor: "rgba(0,220,0,.8)",
                        pointHighlightFill: "rgba(0,220,0,.8)",
                        pointHighlightStroke: "rgba(0,220,0,.8)",
                        data: [0]
                    }
                    ,
                    {
                       "label": "deletions",
                       fillColor: "rgba(220,0,0,0.2)",
                        strokeColor: "rgba(220,0,0,1)",
                        pointColor: "rgba(220,0,0,1)",
                        pointStrokeColor: "#ff0000",
                        pointHighlightFill: "#ff0000",
                        pointHighlightStroke: "rgba(220,0,0,1)",
                        data: [0] 
                    }
                ]
            };
            
            
            for(var i = 0; i < commitInfo.filesModified.length; i ++){
                
                for(var c = 0; c < commitInfo.filesModified[i].purposes.length; c ++){
                    
                    
                    var indexOfPurpose = data.labels.indexOf( commitInfo.filesModified[i].purposes[c].name );
                    console.log(indexOfPurpose);
                    
                    //If we've already started adding to that purpose
                    if(indexOfPurpose !== -1){
                        data.datasets[0].data[indexOfPurpose] += commitInfo.filesModified[i].additions;
                        data.datasets[1].data[indexOfPurpose] += commitInfo.filesModified[i].deletions;
                    } else {
                        data.datasets[0].data.push( commitInfo.filesModified[i].additions );
                        data.datasets[1].data.push( commitInfo.filesModified[i].deletions );
                        data.labels.push(commitInfo.filesModified[i].purposes[c].name);
                        console.log(data.labels);
                    }
                    
                }
                
                if(commitInfo.filesModified[i].purposes.length === 0){
                    data.datasets[0].data[0] += commitInfo.filesModified[i].additions;
                    data.datasets[1].data[0] += commitInfo.filesModified[i].deletions;
                }
                
            }
            
            
            cb(data);
            
        });
        
    };
    
    self.getCommitDataForRadarGraphByFile = function(sha, cb){
        
        self.workspace.getCommit(sha, function(commitInfo){
            
            var data = {
                "labels":[],
                "datasets":[
                    {
                        "label": "additions",
                        fillColor: "rgba(0,220,0,0.2)",
                        strokeColor: "rgba(0,220,0,.8)",
                        pointColor: "rgba(0,220,0,.8)",
                        pointStrokeColor: "rgba(0,220,0,.8)",
                        pointHighlightFill: "rgba(0,220,0,.8)",
                        pointHighlightStroke: "rgba(0,220,0,.8)",
                        data: []
                    }
                    ,
                    {
                       "label": "deletions",
                       fillColor: "rgba(220,0,0,0.2)",
                        strokeColor: "rgba(220,0,0,1)",
                        pointColor: "rgba(220,0,0,1)",
                        pointStrokeColor: "#ff0000",
                        pointHighlightFill: "#ff0000",
                        pointHighlightStroke: "rgba(220,0,0,1)",
                        data: [] 
                    }
                ]
            };
            
            for(var i = 0; i < commitInfo.filesModified.length; i ++){
                data.labels.push(commitInfo.filesModified[i].name.split("/")[commitInfo.filesModified[i].name.split("/").length-1]);
                data.datasets[0].data.push(commitInfo.filesModified[i].additions);
                data.datasets[1].data.push(commitInfo.filesModified[i].deletions);
            }
            
            cb(data);
            
        });
        
    };
    
}
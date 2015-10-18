/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ClassImportExport(){
    
    var self = this;
    
    self.exportClassToJson = function(classToExport){
        
        if(classToExport === null){
            return {};
        }
        
        //Outline of our class JSON
        var classJSON = {
            "id": classToExport.id,
            "name": classToExport.name(),
            "description": classToExport.description(),
            "purposes": [],
            "patterns": []
        };
        
        //Add all purposes
        for(var i = 0; i < classToExport.purposesItServes().length; i ++){
            classJSON.purposes.push(classToExport.purposesItServes()[i].id);
        }
        
        //Add all patterns
        for(var i = 0; i < classToExport.patternsImplementing().length; i ++){
            classJSON.patterns.push(classToExport.patternsImplementing()[i].id);
        }
        
        return classJSON;
        
    };
    
    
    
    self.importClassFromJSON = function(classJSON, patterns, purposes){
        
        if(classJSON === null){
            return null;
        }
        
        var classModel = new ClassViewModel();
        
        //basics
        classModel.id = classJSON.id;
        classModel.name(classJSON.name);
        classModel.description(classJSON.description);
        
        //if we have design patterns to load then let's do it.
        if(patterns !== null && classJSON.patterns !== null && classJSON.patterns.length > 0){
            
            for( var jsonIter = 0; jsonIter < classJSON.patterns.length; jsonIter ++){
                
                for(var i = 0; i < patterns.length; i ++){
                    if( parseInt( classJSON.patterns[jsonIter] ) === parseInt( patterns[i].id ) ){
                        classModel.patternsImplementing.push(patterns[i]);
                    }
                }
                
            }
            
        }
        
        //if we have purposes to load then do it
        if(purposes !== null && classJSON.purposes !== null && classJSON.purposes.length > 0 ){
            
            for( var jsonIter = 0; jsonIter < classJSON.purposes.length; jsonIter ++){
                
                for(var i = 0; i < purposes.length; i ++){
                    if( parseInt( classJSON.purposes[jsonIter] ) === parseInt( purposes[i].id ) ){
                        classModel.purposesItServes.push( purposes[i] );
                        purposes[i].classesAssociated.push(classModel );
                    }
                }
                
            }
            
        }
        
        //return our finalized object
        return classModel;
        
    };
    
}
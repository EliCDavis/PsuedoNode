/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function DesignPatternImportExport(){
    
    var self = this;
    
    self.exportDesignPatternToJSON = function(patternToExport){
        
        if(patternToExport === null){
            return {};
        }
        
        var patternJSON = {
            "id": patternToExport.id,
            "name": patternToExport.name(),
            "description": patternToExport.description(),
            "methods": []
        };
        
        //add in all methods defined within the pattern
        for(var i = 0; i < patternToExport.methodsThatComeWithPattern().length; i ++){
            
            var method = {
                "id" : patternToExport.methodsThatComeWithPattern()[i].id,
                "name" : patternToExport.methodsThatComeWithPattern()[i].name(),
                "description" : patternToExport.methodsThatComeWithPattern()[i].description()
            };
            
            patternJSON.methods.push(method);
            
        }
        
        return patternJSON;
        
    };
    
    self.importDesignPatternFromJSON = function(patternJSON){
        
        var designPattern = new DesignPatternTemplateViewModel();
        
        designPattern.id = patternJSON.id;
        designPattern.name(patternJSON.name);
        designPattern.description(patternJSON.description);

        for(var m = 0; m < patternJSON.methods.length; m ++ ){
            var method = new ObjectMethodViewModel();
            method.name(patternJSON.methods[m].name);
            method.description(patternJSON.methods[m].description);
            method.id = patternJSON.methods[m].id;
            designPattern.methodsThatComeWithPattern.push(method);
        }
        
        return designPattern;
        
    };
    
}
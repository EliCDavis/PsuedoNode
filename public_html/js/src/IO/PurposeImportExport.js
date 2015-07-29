/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function PurposeImportExport(){
    
    var self = this;
    
    self.exportPurposeToJson = function(purposeToExport){
        
        if(purposeToExport === null){
            return {};
        }
        
        var purposeJSON = {
            "id": purposeToExport.id,
            "name" : purposeToExport.name(),
            "description" : purposeToExport.description(),
            "isComplete" : purposeToExport.isComplete()
        };
        
        return purposeJSON;
        
    };
    
    self.importPurposeFromJSON = function(purposeJSON){
        
        if(purposeJSON === null){
            return null;
        }
        
        var purpose = new PurposeViewModel();
        
        purpose.name(purposeJSON.name);
        purpose.id = purposeJSON.id;
        purpose.description(purposeJSON.description);
        purpose.isComplete(purposeJSON.isComplete);
        
        return purpose;
        
    };
    
}
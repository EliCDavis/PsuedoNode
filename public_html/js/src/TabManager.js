/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function closeTab(id){
    if(tabManager.tabIsOpen(id)){
        tabManager.closeTab(id);
        document.getElementById(id).remove();
        document.getElementById("edit"+id).remove();
    }
}

function activateTab(tab){
    $('.nav-tabs a[href="#edit' + tab + '"]').tab('show');
};

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

var tabManager = new TabManager();
function TabManager(){
    this.tabsOpen = [];
    
    this.tabIsOpen = function(id){
        for(var i = 0; i < this.tabsOpen.length; i ++){
            if(this.tabsOpen[i] === id){
                return true;
            }
            
        }
        return false;
    };
    
    this.openNewTab = function(id){
        if(!this.tabIsOpen()){
            this.tabsOpen.push(id);
        } else {
            console.log("That tab already exists!");
            activateTab(id);
        }
    };
    
    this.closeTab = function(id){
        if(this.tabIsOpen(id)){
            var indexClosing = this.tabsOpen.indexOf(id);
            this.tabsOpen.splice(indexClosing,1);
            
            if(indexClosing > 0){
                activateTab(this.tabsOpen[indexClosing-1]);
            } else if (this.tabsOpen.length > 0){
                
            }
            
        }
    };
}


function openPurposeEditTab(purposeView){
    
    if(tabManager.tabIsOpen(purposeView.id)){
        activateTab(purposeView.id);
        return;
    } 
    
    require([
       "dojo/dom", 
       "dojo/dom-construct",
       "dojo/domReady!"
    ], function(dom, domConstruct){
        
        var tabsParent = dom.byId("EditTabs");
        var navTabHtml = "";
        var closeButton = "<button type='button' class='btn btn-default btn-sm' data-bind='click: closeTab'>"+
                             "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> </button>";
        var systemsIcon = "<span class='glyphicon glyphicon-file' aria-hidden='true'></span>";
        navTabHtml += "<a data-toggle='tab' href='#edit"+purposeView.id+"' >"+systemsIcon+" <span data-bind='text: name'></span><span class='dividerSpace'></span>  "+closeButton+"</a>";
        var tabsNode = domConstruct.create('li' , {  innerHTML:  navTabHtml, id: purposeView.id}, tabsParent);

        $(tabsNode).ready(function() {
            ko.applyBindings(purposeView, tabsNode);
        });
        
        var tabsContentParent = dom.byId("EditTabsContent");
        var tabContentHtml = "<br>";
        tabContentHtml+= "<div class='row'>";
        tabContentHtml+= "<div class='col-md-4'>";
        
        tabContentHtml += "<h4>Basic Info:</h4>";
        
        
        tabContentHtml += '<div class="input-group">';
        tabContentHtml += '<div class="input-group-addon">Name</div>';
        tabContentHtml += "<input type='text' class='form-control' data-bind='value: name'></input></div>";
        tabContentHtml += "<textarea class='form-control' style='width:100%;' rows='3' data-bind='value: description' placeholder='Description of Class'></textarea><br>";
        
        tabContentHtml+= "</div>";
        tabContentHtml+= "</div>";
        
        var contentNode = domConstruct.create('div' , 
                {  
                    innerHTML:  tabContentHtml,
                    class: 'tab-pane fade',
                    id: "edit"+purposeView.id
                }, 
                tabsContentParent);

        $(contentNode).ready(function() {
            ko.applyBindings(purposeView, contentNode);
            tabManager.openNewTab(purposeView.id);
            activateTab(purposeView.id);
        });
        
    });
}

function openClassEditTab(classView){
    
    if(tabManager.tabIsOpen(classView.id)){
        activateTab(classView.id);
        return;
    } 
    
    require([
       "dojo/dom", 
       "dojo/dom-construct",
       "dojo/domReady!"
    ], function(dom, domConstruct){
        
        var tabsParent = dom.byId("EditTabs");
        var navTabHtml = "";
        var closeButton = "<button type='button' class='btn btn-default btn-sm' data-bind='click: closeTab'>"+
                             "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> </button>";
        var systemsIcon = "<span class='glyphicon glyphicon-file' aria-hidden='true'></span>";
        navTabHtml += "<a data-toggle='tab' href='#edit"+classView.id+"' >"+systemsIcon+" <span data-bind='text: name'></span><span class='dividerSpace'></span>  "+closeButton+"</a>";
        var tabsNode = domConstruct.create('li' , {  innerHTML:  navTabHtml, id: classView.id}, tabsParent);

        $(tabsNode).ready(function() {
            ko.applyBindings(classView, tabsNode);
        });

        var tabsContentParent = dom.byId("EditTabsContent");
        var tabContentHtml = "<br>";
        tabContentHtml+= "<div class='row'>";
        tabContentHtml+= "<div class='col-xs-12 col-sm-6 col-md-4'>";
        
        tabContentHtml += "<h4>Basic Info:</h4>";
        tabContentHtml += "<h5 data-bind='with: system'>System:<span data-bind='text: name'></span></h5>";
        tabContentHtml += '<div class="input-group">';
        tabContentHtml += '<div class="input-group-addon">Name</div>';
        tabContentHtml += "<input type='text' class='form-control' data-bind='value: name'></input></div>";
        tabContentHtml += "<textarea class='form-control' style='width:100%;' rows='3' data-bind='value: description' placeholder='Description of Class'></textarea><br>";
        
        /**
         * Need to fix purposes!
         */
        var selectButton = "<div class='btn-group'>";
        selectButton += "<button type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>"+
                            "<span class='glyphicon glyphicon-plus-sign' aria-hidden='true'></span><span class='caret'></span></button>";
        selectButton += "<ul class='dropdown-menu' role='menu' data-bind='foreach: purposesItDoesNotServe()'>";
        selectButton += "<li><a href='#' data-bind='text: name, click: $parent.createNewMethod'></a></li>";
        selectButton += "</ul>";
        selectButton += "</div>";
        
        tabContentHtml += "<h4>"+selectButton+" Purposes This Class Serves:</h4>";
        tabContentHtml += "<dl data-bind='foreach: purposesItServes'>";
        tabContentHtml += "<dt><button data-bind='text: name(), click: openInTabs'></button></dt><dd data-bind='text: description()'></dd></dl>";
        
        tabContentHtml += "<h4>Design Patterns Implementing:</h4>";
        
        tabContentHtml += "<dl data-bind='foreach: patternsImplementing'>";
        tabContentHtml += "<dt><button data-bind='text: name(), click: openInTabs'></button></dt><dd data-bind='text: description()'></dd><.dl>";
        
        
        
        tabContentHtml+= "</div>";
        
        tabContentHtml += "<div class='col-sm-12 col-md-8'>";
        
        tabContentHtml += "<h4>Methods:</h4>";
        
 
        tabContentHtml += "<div class='panel panel-default'>";
        tabContentHtml += "<div class='panel-heading'>Class Specific</div>";
        tabContentHtml += "<div class='panel-body'>";
        
        tabContentHtml+= "<div class='row'>";
        
        //populate with other methods
        tabContentHtml += "<span data-bind='foreach: methods'>";
        
        tabContentHtml += "<div class='col-xs-12 col-sm-6 col-md-4'>";
        tabContentHtml += "<div class='panel panel-default'>";
        tabContentHtml += "<div class='panel-heading' data-bind='text: name'></div>";
        tabContentHtml += "<div class='panel-body'>";
        
        //Exhisting Method Form
        tabContentHtml += '<div class="input-group">';
        tabContentHtml += '<div class="input-group-addon">Name</div>';
        tabContentHtml += "<input type='text' class='form-control' data-bind='value: name'></input></div>";
        tabContentHtml += "<textarea class='form-control' style='width:100%;' rows='3' data-bind='value: description' placeholder='Description of Class'></textarea><br>";
        tabContentHtml += '<div class="input-group">';
        tabContentHtml += '<div class="input-group-addon">Parameters</div>';
        tabContentHtml += "<input type='text' class='form-control' data-bind='value: name'></input></div>";
        tabContentHtml += '<div class="input-group">';
        tabContentHtml += '<div class="input-group-addon">Returns</div>';
        tabContentHtml += "<input type='text' class='form-control' data-bind='value: name'></input></div>";
    
        //ending echisting panel
        tabContentHtml += "</div>";
        tabContentHtml += "</div>";
        tabContentHtml += "</div>";
        tabContentHtml += "</span>";
        
        tabContentHtml += "<div class='col-xs-12 col-sm-6 col-md-4'>";
        tabContentHtml += "<div class='panel panel-info'>";
        tabContentHtml += "<div class='panel-heading'>New Method</div>";
        tabContentHtml += "<div class='panel-body'>";
        
        //new Method form
        tabContentHtml += "<button class='btn btn-default btn-block' data-bind='click: createNewMethod'>Create New Method</button>";
    
        //ending new method panel
        tabContentHtml += "</div>";
        tabContentHtml += "</div>";
        tabContentHtml += "</div>";
        
        //ending parent panel
        tabContentHtml += "</div>";//ending row inside panel
        tabContentHtml += "</div>";
        tabContentHtml += "</div>";
        
        tabContentHtml += "</div>";
        
        //closing first row
        tabContentHtml+= "</div>";
        
       
        
        /*
         * <div class="btn-group">
  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
    Action <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" role="menu">
    <li><a href="#">Action</a></li>
    <li><a href="#">Another action</a></li>
    <li><a href="#">Something else here</a></li>
    <li class="divider"></li>
    <li><a href="#">Separated link</a></li>
  </ul>
</div>
         */
        
        
        
        var contentNode = domConstruct.create('div' , 
                {  
                    innerHTML:  tabContentHtml,
                    class: 'tab-pane fade',
                    id: "edit"+classView.id
                }, 
                tabsContentParent);

        $(contentNode).ready(function() {
            ko.applyBindings(classView, contentNode);
            tabManager.openNewTab(classView.id);
            activateTab(classView.id);
        });
    });
}

 function openSystemEditTab(systemView, isSubsytem){
     
    if(tabManager.tabIsOpen(systemView.id)){
        activateTab(systemView.id);
        return;
    } else {
        
    }
     
    require([
       "dojo/dom", 
       "dojo/dom-construct",
       "dojo/domReady!"
    ], function(dom, domConstruct){

        var tabsParent = dom.byId("EditTabs");
        var navTabHtml = "";
        var closeButton = "<button type='button' class='btn btn-default btn-sm' data-bind='click: closeTab'>"+
                             "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> </button>";
        var systemsIcon = "<span class='glyphicon glyphicon-cog' aria-hidden='true'></span>";
        if(isSubsytem !== null && isSubsytem){
            systemsIcon = "<span class='glyphicon glyphicon-align-left' aria-hidden='true'></span>";
        }
        navTabHtml += "<a data-toggle='tab' href=#edit"+systemView.id+" >"+systemsIcon+" <span data-bind='text: name'></span><span class='dividerSpace'></span>  "+closeButton+"</a>";
        var tabsNode = domConstruct.create('li' , {  innerHTML:  navTabHtml, id: systemView.id}, tabsParent);

        $(tabsNode).ready(function() {
            ko.applyBindings(systemView, tabsNode);
        });

        var tabsContentParent = dom.byId("EditTabsContent");
        var tabContentHtml = "<br>";
        tabContentHtml+= "<div class='row'><div class='col-md-4'>";

        tabContentHtml += "<h4>Basic Info:</h4>";
        tabContentHtml += '<div class="input-group">';
        tabContentHtml += '<div class="input-group-addon">Name</div>';
        tabContentHtml += "<input type='text' class='form-control' data-bind='value: name'></input></div>";
        tabContentHtml += "<textarea class='form-control' style='width:100%;' rows='3' data-bind='value: description' placeholder='Description of System'></textarea><br>";

        tabContentHtml += "</div><div class='col-md-5'>";
        
        var addPurposeButton = "<button type='button' class='btn btn-default' data-bind='click: addNewPurpose'>"+
                             "<span class='glyphicon glyphicon-plus-sign' aria-hidden='true'></span> </button>";
        tabContentHtml += "<h4>Purposes    "+addPurposeButton +"</h4>";

        if(systemView.purposes.length > 0){
            tabContentHtml +="<ul>";
            for(var p = 0; p < systemView.purposes.length; p ++){
                tabContentHtml +="<li>"+systemView.purposes[p]+"</li>";
            }
            tabContentHtml+="</ul>";
        } else {
             tabContentHtml+="<p>None</p>";
        }
        tabContentHtml += "</div>";

        tabContentHtml += "<div class='col-md-3'>";
        var addSubsystemButton = "<button type='button' class='btn btn-default' data-bind='click: addNewSubsystem'>"+
                             "<span class='glyphicon glyphicon-plus-sign' aria-hidden='true'></span> </button>";
        tabContentHtml += "<h4>Subsystems    "+addSubsystemButton+"</h4>";
        
        
        tabContentHtml += "<dl data-bind='foreach: subSystems'>";
        tabContentHtml += "<dt><button data-bind='text: name(), click: openInTabs'></button></dt><dd data-bind='text: description()'></dd>";
        
    
        tabContentHtml += "</div>";
        tabContentHtml += "</div>";


        tabContentHtml += "<div class='row'>";  

        tabContentHtml += "<div class='col-xs-12 col-md-9'>";
        tabContentHtml += '<canvas id="NodeCanvas"></canvas>';
        tabContentHtml += "</div>";

        tabContentHtml += "<div class='col-xs-12 col-md-3'>";
        
        
        
        var addClassButton =  "<div class='btn-group'>";
        addClassButton+= "<button type='button' class='btn btn-default' data-bind='click: addNewClass' >"+
                         "<span class='glyphicon glyphicon-plus-sign' aria-hidden='true'></span> </button>";
        addClassButton += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>";
        addClassButton += "<span class='caret'></span>";
        addClassButton += "<span class='sr-only'>Toggle Dropdown</span>";
        addClassButton += "</button>";
        addClassButton += "<ul class='dropdown-menu' role='menu'>";
        addClassButton += "<li><a href='#'>Add New Pattern...</a></li>";
        addClassButton += "<li class='divider'></li>";
        addClassButton += "<span data-bind='foreach:application.defaultDesignPatterns'>";
        addClassButton += "<li><a href='#' data-bind=''>C'mon</a></li>";
        addClassButton += "</span>";
        addClassButton += "<li><a href='#'>Factory</a></li>";
        addClassButton += "<li><a href='#'>Wrapper</a></li>";
        addClassButton += "<li><a href='#'>Pool</a></li>";
        addClassButton += "<li><a href='#'>Inherit</a></li>";
        addClassButton += "</ul>";
        addClassButton += "</div>";
                     
        tabContentHtml += "<h4>Classes   "+addClassButton+"</h4>";
        tabContentHtml += "<dl data-bind='foreach: classesAssociated'>";
        
        tabContentHtml += "<dt data-bind='text: name()'></dt><dd data-bind='text: description()'></dd>";
        
        tabContentHtml += "</dl>";
        
        tabContentHtml += "</div>";

        tabContentHtml += "</div>";

        tabContentHtml += "";

        var contentNode = domConstruct.create('div' , 
                {  
                    innerHTML:  tabContentHtml,
                    class: 'tab-pane fade',
                    id: "edit"+systemView.id
                }, 
                tabsContentParent);

        $(contentNode).ready(function() {
            ko.applyBindings(systemView, contentNode);
            tabManager.openNewTab(systemView.id);
            activateTab(systemView.id);
        });

    });

}
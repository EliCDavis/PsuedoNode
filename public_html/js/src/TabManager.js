/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
             console.log(this.tabsOpen);
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
        navTabHtml += "<a data-toggle='tab' href='#edit"+classView.id+"' >"+systemsIcon+" <span data-bind='text: name'></span><span class='divider'></span>  "+closeButton+"</a>";
        var tabsNode = domConstruct.create('li' , {  innerHTML:  navTabHtml, id: classView.id}, tabsParent);

        $(tabsNode).ready(function() {
            ko.applyBindings(classView, tabsNode);
        });

        var tabsContentParent = dom.byId("EditTabsContent");
        var tabContentHtml = "<br>";
        tabContentHtml+= "<div class='row'>";
        tabContentHtml+= "<div class='col-md-4'>";
        
        tabContentHtml += "<h3>Basic Info:</h3>";
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

 function openSystemEditTab(systemView){
     
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
        navTabHtml += "<a data-toggle='tab' href=#edit"+systemView.id+" >"+systemsIcon+" <span data-bind='text: name'></span><span class='divider'></span>  "+closeButton+"</a>";
        var tabsNode = domConstruct.create('li' , {  innerHTML:  navTabHtml, id: systemView.id}, tabsParent);

        $(tabsNode).ready(function() {
            ko.applyBindings(systemView, tabsNode);
        });

        var tabsContentParent = dom.byId("EditTabsContent");
        var tabContentHtml = "<br>";
        tabContentHtml+= "<div class='row'><div class='col-md-4'>";

        tabContentHtml += "<h3>Basic Info:</h3>";
        tabContentHtml += '<div class="input-group">';
        tabContentHtml += '<div class="input-group-addon">Name</div>';
        tabContentHtml += "<input type='text' class='form-control' data-bind='value: name'></input></div>";
        tabContentHtml += "<textarea class='form-control' style='width:100%;' rows='3' data-bind='value: description' placeholder='Description of System'></textarea><br>";

        tabContentHtml += "</div><div class='col-md-5'>";
        
        var addPurposeButton = "<button type='button' class='btn btn-default' onclick='alert()'>"+
                             "<span class='glyphicon glyphicon-plus-sign' aria-hidden='true'></span> </button>";
        tabContentHtml += "<h3>Purposes    "+addPurposeButton +"</h3>";

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
        var addSubsystemButton = "<button type='button' class='btn btn-default' onclick='alert()'>"+
                             "<span class='glyphicon glyphicon-plus-sign' aria-hidden='true'></span> </button>";
        tabContentHtml += "<h3>Subsystems    "+addSubsystemButton+"</h3>";
        tabContentHtml += "</div>";

        tabContentHtml += "</div>";



        tabContentHtml += "<div class='row'>";  

        tabContentHtml += "<div class='col-xs-12 col-md-9'>";
        tabContentHtml += '<canvas id="NodeCanvas"></canvas>';
        tabContentHtml += "</div>";

        tabContentHtml += "<div class='col-xs-12 col-md-3'>";
        var addClassButton = "<button type='button' class='btn btn-default' data-bind='click: addNewClass' >"+
                             "<span class='glyphicon glyphicon-plus-sign' aria-hidden='true'></span> </button>";
        tabContentHtml += "<h3>Classes   "+addClassButton+"</h3>";
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
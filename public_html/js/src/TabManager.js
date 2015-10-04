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
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

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


function openCommitsGraphicTab(viewModel){

    if(tabManager.tabIsOpen(viewModel.id)){
        activateTab(viewModel.id);
        return;
    } 
    
    var navTabHtml = "";
    var closeButton = "<button type='button' class='btn btn-default btn-sm' data-bind='click: closeTab'>"+
                         "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> </button>";
    var homeIcon = "<span class='glyphicon glyphicon-check' aria-hidden='true'></span>";
    navTabHtml += "<a data-toggle='tab' href='#edit"+viewModel.id+"' >"+homeIcon+" <span>Commits Overview</span><span class='dividerSpace'></span>  "+closeButton+"</a>";
    
    var tabToggle = $('<li />',
        {
            'id':viewModel.id,
            'html':navTabHtml
        }    
        ).appendTo('#EditTabs');

    ko.applyBindings(viewModel, tabToggle[0]);
    
    var tabContent = $('<div />', {
        "class": 'tab-pane fade',
        'id':'edit'+viewModel.id
    }).appendTo('#EditTabsContent').load("components/commit_stats.html", function(){
        ko.applyBindings(viewModel, tabContent[0]);
    });
    
    tabContent.ready(function(){
        tabManager.openNewTab(viewModel.id);
        activateTab(viewModel.id);
    });
    
}

/**
 * Opens the Pseudo Node Home tab by loading in html with jqeury
 *   
 * @param {type} homeViewModel
 * @returns {undefined}
 */
function openHomeTab(homeViewModel){

    if(tabManager.tabIsOpen(homeViewModel.id)){
        activateTab(homeViewModel.id);
        return;
    } 
    
    var navTabHtml = "";
    var closeButton = "<button type='button' class='btn btn-default btn-sm' data-bind='click: closeTab'>"+
                         "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> </button>";
    var homeIcon = "<span class='glyphicon glyphicon-home' aria-hidden='true'></span>";
    navTabHtml += "<a data-toggle='tab' href='#edit"+homeViewModel.id+"' >"+homeIcon+" <span>Home</span><span class='dividerSpace'></span>  "+closeButton+"</a>";
    
    var tabToggle = $('<li />',
        {
            'id':homeViewModel.id,
            'html':navTabHtml
        }    
        ).appendTo('#EditTabs');

    ko.applyBindings(homeViewModel, tabToggle[0]);
    
    var tabContent = $('<div />', {
        "class": 'tab-pane fade',
        'id':'edit'+homeViewModel.id
    }).appendTo('#EditTabsContent').load("components/home_tab.html", function(){
        ko.applyBindings(homeViewModel, tabContent[0]);
    });
    
    tabContent.ready(function(){
        tabManager.openNewTab(homeViewModel.id);
        activateTab(homeViewModel.id);
    });
    
}

/**
 * Design Patterns need a tab for editing.  Here is where you define what methods the 
 * design pattern provides, pattern description, and can see statistics about the pattern.
 * 
 * @param {DesignPatternTemplateViewModel} designPattern
 * @returns {undefined}
 */
function openDesignPatternEditTab(designPattern){
    
    if(tabManager.tabIsOpen(designPattern.id)){
        activateTab(designPattern.id);
        return;
    } 
    
    var navTabHtml = "";
    var closeButton = "<button type='button' class='btn btn-default btn-sm' data-bind='click: closeTab'>"+
                        "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> </button>";
    var systemsIcon = "<span class='glyphicon glyphicon-wrench' aria-hidden='true'></span>";
    navTabHtml += "<a data-toggle='tab' href='#edit"+designPattern.id+"' >"+systemsIcon+" <span data-bind='text: name'></span><span class='dividerSpace'></span>  "+closeButton+"</a>";

    var tabToggle = $('<li />',
        {
            'id':designPattern.id,
            'html':navTabHtml
        }    
        ).appendTo('#EditTabs');
        
    tabToggle.ready(function(){
        ko.applyBindings(designPattern, tabToggle[0]);
    });

    
    var tabContent = $('<div />', {
        "class": 'tab-pane fade',
        'id':'edit'+designPattern.id
    }).appendTo('#EditTabsContent').load("components/design_pattern_edit.html",function (){
        ko.applyBindings(designPattern, tabContent[0]);
    });
    
    
    tabContent.ready(function(){
        console.log(tabContent[0]);
        tabManager.openNewTab(designPattern.id);
        activateTab(designPattern.id);
    });
    
}


/**
 * Opens the appplication settings tab up for editing things like the naming conventions of your
 * project, different design patterns your using, etc.
 * 
 * This specific tab will have ID of 2
 * 
 * @param {ApplicationViewModel} appView The settings view model we want to open the tab for.
 * Any changes made in the tab are reflected in the view model
 * @returns {undefined}
 */
function openApplicationSettingsTab(appView){
    
    var applicationSettingsTabID = appView.id;
    
    if(tabManager.tabIsOpen(applicationSettingsTabID)){
        activateTab(applicationSettingsTabID);
        return;
    }
    
    var navTabHtml = "";
    var closeButton = "<button type='button' class='btn btn-default btn-sm' data-bind='click: closeTab'>"+
                        "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> </button>";
    var systemsIcon = "<span class='glyphicon glyphicon-wrench' aria-hidden='true'></span>";
    navTabHtml += "<a data-toggle='tab' href='#edit"+appView.id+"' >"+systemsIcon+" <span>Project Settings</span><span class='dividerSpace'></span>  "+closeButton+"</a>";

    var tabToggle = $('<li />',
        {
            'id':appView.id,
            'html':navTabHtml
        }    
        ).appendTo('#EditTabs');
        
    tabToggle.ready(function(){
        ko.applyBindings(appView, tabToggle[0]);
    });

    
    var tabContent = $('<div />', {
        "class": 'tab-pane fade',
        'id':'edit'+appView.id
    }).appendTo('#EditTabsContent').load("components/application_settings.html",function (){
        ko.applyBindings(appView, tabContent[0]);
    });
    
    
    tabContent.ready(function(){
        console.log(tabContent[0]);
        tabManager.openNewTab(appView.id);
        activateTab(appView.id);
    });
    
    
}

function openPurposeEditTab(purposeView){
    
    if(tabManager.tabIsOpen(purposeView.id)){
        activateTab(purposeView.id);
        return;
    } 
    
    var navTabHtml = "";
    var closeButton = "<button type='button' class='btn btn-default btn-sm' data-bind='click: closeTab'>"+
                        "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> </button>";
    var systemsIcon = "<span class='glyphicon glyphicon-star-empty' aria-hidden='true'></span>";
    navTabHtml += "<a data-toggle='tab' href='#edit"+purposeView.id+"' >"+systemsIcon+" <span data-bind='text: name'></span><span class='dividerSpace'></span>  "+closeButton+"</a>";

    var tabToggle = $('<li />',
        {
            'id':purposeView.id,
            'html':navTabHtml
        }    
        ).appendTo('#EditTabs');
        
    tabToggle.ready(function(){
        ko.applyBindings(purposeView, tabToggle[0]);
    });
    
    var tabContent = $('<div />', {
        "class": 'tab-pane fade',
        'id':'edit'+purposeView.id
    }).appendTo('#EditTabsContent').load("components/purpose_edit.html",function (){
        ko.applyBindings(purposeView, tabContent[0]);
    });
    
    
    tabContent.ready(function(){
        tabManager.openNewTab(purposeView.id);
        activateTab(purposeView.id);
    });
    

}

function openClassEditTab(classView){
    
    if(tabManager.tabIsOpen(classView.id)){
        activateTab(classView.id);
        return;
    } 
    console.log(classView.id);
    var navTabHtml = "";
    var closeButton = "<button type='button' class='btn btn-default btn-sm' data-bind='click: closeTab'>"+
                        "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> </button>";
    var systemsIcon = "<span class='glyphicon glyphicon-file' aria-hidden='true'></span>";
    navTabHtml += "<a data-toggle='tab' href='#edit"+classView.id+"' >"+systemsIcon+" <span data-bind='text: name'></span><span class='dividerSpace'></span>  "+closeButton+"</a>";

    var tabToggle = $('<li />',
        {
            'id':classView.id,
            'html':navTabHtml
        }    
        ).appendTo('#EditTabs');
        
    tabToggle.ready(function(){
        ko.applyBindings(classView, tabToggle[0]);
    });
    
    var tabContent = $('<div />', {
        "class": 'tab-pane fade',
        'id':'edit'+classView.id
    }).appendTo('#EditTabsContent').load("components/class_edit.html",function (){
        ko.applyBindings(classView, tabContent[0]);
    });
    
    
    tabContent.ready(function(){
        tabManager.openNewTab(classView.id);
        activateTab(classView.id);
    });
    
}

 function openSystemEditTab(systemView, isSubsytem){
     
    if(tabManager.tabIsOpen(systemView.id)){
        activateTab(systemView.id);
        return;
    }
    
    var navTabHtml = "";
    var closeButton = "<button type='button' class='btn btn-default btn-sm' data-bind='click: closeTab'>"+
                        "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> </button>";
    var systemsIcon = "<span class='glyphicon glyphicon-cog' aria-hidden='true'></span>";
    if(isSubsytem !== null && isSubsytem){
        systemsIcon = "<span class='glyphicon glyphicon-align-left' aria-hidden='true'></span>";
    }
     
     navTabHtml += "<a data-toggle='tab' href='#edit"+systemView.id+"' >"+systemsIcon+" <span data-bind='text: name'></span><span class='dividerSpace'></span>  "+closeButton+"</a>";

    var tabToggle = $('<li />',
        {
            'id':systemView.id,
            'html':navTabHtml
        }    
        ).appendTo('#EditTabs');
        
    tabToggle.ready(function(){
        ko.applyBindings(systemView, tabToggle[0]);
    });
    
    
    var tabContent = $('<div />', {
        "class": 'tab-pane fade',
        'id':'edit'+systemView.id
    }).appendTo('#EditTabsContent').load("components/system_edit.html",function (){
        ko.applyBindings(systemView, tabContent[0]);
        console.log(tabContent[0]);
        console.log(tabContent.find("canvas")[0]);
        systemView.systemRenderer.loadCanvas(tabContent.find("canvas")[0]);
    });
    
    
    tabContent.ready(function(){
        tabManager.openNewTab(systemView.id);
        activateTab(systemView.id);
       
    });
     
}

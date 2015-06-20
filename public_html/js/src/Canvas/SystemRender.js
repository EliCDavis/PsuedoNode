/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function SystemRenderer(){
    
    var self = this;
    
    this.systemToRender;
    
    this.testNodes = {
        "collectionName": "Test Collection",
        "nodes":
        [
            {
                "id": 100,
                "minimized": false,
                "position" : [10,10],
                "size": [30,30],
                "links": [],
                "children" : 
                    [{
                        "id": 101,
                        "minimized": false,
                        "position" : [51,10],
                        "size": [20,20],
                        "links": [102],
                        "children" : []
                    },{
                        "id": 102,
                        "minimized": false,
                        "position" : [51,51],
                        "size": [20,20],
                        "links": [102],
                        "children" : []
                    },{
                        "id": 103,
                        "minimized": false,
                        "position" : [10,51],
                        "size": [20,20],
                        "links": [102],
                        "children" : []
                    }]
            }
        ]
    };
    
    //think about having this generated once when you load in a system.
    this.getAllNodes = function(systemsRoot){
        var nodes = [];
        for(var n = 0; n < systemsRoot.nodes.length; n ++){
            var curNodes = this.recurseNodes(systemsRoot.nodes[n]);
            for(var i = 0; i < curNodes.length; i ++){
                nodes.push(curNodes[i]);
            }
        }
        return nodes;
    };
    
    this.recurseNodes = function(root){
        var nodes = [];
        nodes.push(root);
        for(var i = 0; i < root.children.length; i ++){
            var curNodes = this.recurseNodes(root.children[i]);
            
            for(var n = 0; n < curNodes.length; n ++){
                nodes.push(curNodes[n]);
            }
        }
        return nodes;
    };
    
    this.canvas;
    
    this.loadCanvas = function(canvas){
        this.canvas = canvas;
        canvas.addEventListener('mouseup',function(e){
            self.mouseUpCalled(e);
        });
        canvas.addEventListener('mousedown',function(e){
            self.mouseDownCalled(e);
        });
        canvas.addEventListener('mouseout',function(e){
            self.mouseOutCalled(e);
        });
        canvas.addEventListener('mousemove',function(e){
            self.updateDrag(e);
        });
    };
    
    
    this.mouseDownCalled = function(e){
        
        console.log('click: ' + e.offsetX + '/' + e.offsetY);
        var nodes = this.getAllNodes(this.testNodes);
        for(var i = 0; i < nodes.length; i ++){
            //determined if node got clicked.
            if(e.offsetX >= nodes[i].position[0] && e.offsetX <= nodes[i].position[0]+nodes[i].size[0] &&
                    e.offsetY >= nodes[i].position[1] && e.offsetY <= nodes[i].position[1]+nodes[i].size[1]){ // if within bounds
                
                console.log("node got clicked!");
                
                this.nodeDragging = nodes[i];
                this.positionOnNodeDragging = [e.offsetX - nodes[i].position[0], e.offsetY - nodes[i].position[1]];
                
                return;
            }
        }
        
    };
    
    
    
    //--------------------------------------------Drag System (insert pun here)-----------------------
    this.nodeDragging = null;
    this.positionOnNodeDragging = null;
    
    this.loadSystemToRender = function(system){
        this.systemToRender = system;
    };
    
    this.mouseOutCalled = function(e){
        this.nodeDragging  = null;
    };
    
    this.mouseUpCalled = function(e){
        this.nodeDragging  = null;
    };
    
    this.updateDrag = function(e){
        if(self.nodeDragging != null){
            self.nodeDragging.position = [e.offsetX - self.positionOnNodeDragging[0], e.offsetY - self.positionOnNodeDragging[1]];
        }
    };
    
    //--------------------------------------------Render System--------------------------------------
    this.fitToContainer = function(){
        // Make it visually fill the positioned parent
        this.canvas.style.width ='100%';
        this.canvas.style.height='100%';
        // ...then set the internal size to match
        this.canvas.width  = this.canvas.offsetWidth;
        //this.canvas.height = window.innerHeight*.5; 
        
        //this.canvas.height = this.canvas.parentNode.parentNode.parentNode.getChild.childNodes[0].offsetHeight;
        //console.log(this.canvas.parentNode.parentNode.parentNode.getElementsByClassName("row")[0].offsetHeight);
        this.canvas.height = this.canvas.parentNode.parentNode.parentNode.offsetHeight - this.canvas.parentNode.parentNode.parentNode.getElementsByClassName("row")[0].offsetHeight-150;
        
    }
    
    this.renderSystem = function(){
        
        if(this.canvas === null){
            return;
        }
        
        
        
        this.fitToContainer();
        
        var ctx = this.canvas.getContext('2d');
        
        ctx.beginPath();
        ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = 'Black';
        ctx.fill();
        
        ctx.beginPath();
        ctx.rect(1, 1, this.canvas.width-2, this.canvas.height-2);
        ctx.fillStyle = 'White';
        ctx.fill();
        
        this.drawNode(ctx, this.testNodes.nodes[0]);
        
    };
    
    this.drawNode = function(ctx, nodeToDraw){
        
        if(nodeToDraw == null){
            return;
        }
               
        
        //draw lines linking to other aspects of the program ( class referencing another class in a method )
        
        
        for(var i = 0; i < nodeToDraw.children.length; i ++){
            
            //draw lines linking to children
            ctx.beginPath();
            ctx.moveTo(nodeToDraw.position[0] + (nodeToDraw.size[0]/2), nodeToDraw.position[1] + (nodeToDraw.size[1]/2));
            ctx.lineTo(nodeToDraw.children[i].position[0] + (nodeToDraw.children[i].size[0]/2), nodeToDraw.children[i].position[1] + (nodeToDraw.children[i].size[1]/2));
            ctx.lineWidth = 2;
            ctx.strokeStyle = "Blue";
            ctx.stroke();
            
            //draw actual nodes
            this.drawNode( ctx, nodeToDraw.children[i]);
        }
        
        ctx.beginPath();
        ctx.rect(nodeToDraw.position[0], nodeToDraw.position[1], nodeToDraw.size[0], nodeToDraw.size[1]);
        ctx.fillStyle = 'Black';
        ctx.fill();
        
    };
    
}

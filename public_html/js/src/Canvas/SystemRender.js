/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function SystemRenderer(){
    
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
    
    this.loadSystemToRender = function(system){
        this.systemToRender = system;
    };
    
    this.fitToContainer = function(canvas){
        // Make it visually fill the positioned parent
        canvas.style.width ='100%';
        canvas.style.height='100%';
        // ...then set the internal size to match
        canvas.width  = canvas.offsetWidth;
        //canvas.height = window.innerHeight*.5; 
        
        //canvas.height = canvas.parentNode.parentNode.parentNode.getChild.childNodes[0].offsetHeight;
        //console.log(canvas.parentNode.parentNode.parentNode.getElementsByClassName("row")[0].offsetHeight);
        canvas.height = canvas.parentNode.parentNode.parentNode.offsetHeight - canvas.parentNode.parentNode.parentNode.getElementsByClassName("row")[0].offsetHeight-150;
        
    }
    
    this.renderSystem = function(canvas){
        
        if(canvas === null){
            return;
        }
        
        this.fitToContainer(canvas);
        
        var ctx = canvas.getContext('2d');
        
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'Black';
        ctx.fill();
        
        ctx.beginPath();
        ctx.rect(1, 1, canvas.width-2, canvas.height-2);
        ctx.fillStyle = 'White';
        ctx.fill();
        
        this.drawNode(canvas, ctx, this.testNodes.nodes[0]);
        
    };
    
    this.drawNode = function(canvas, ctx, nodeToDraw){
        
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
            this.drawNode(canvas, ctx, nodeToDraw.children[i]);
        }
        
        ctx.beginPath();
        ctx.rect(nodeToDraw.position[0], nodeToDraw.position[1], nodeToDraw.size[0], nodeToDraw.size[1]);
        ctx.fillStyle = 'Black';
        ctx.fill();
        
    };
    
}

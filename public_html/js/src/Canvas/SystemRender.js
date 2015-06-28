/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function SystemRenderer() {

    var self = this;

    /**
     * How magnified the nodes will appear on the canvas relative to their defined size
     * A positive zoom makes nodes appear bigger, a negate zoom makes the appear smaller.
     */
    self.curZoom = 0;

    this.systemToRender = null;

    this.colorSelector = new ColorSelector();

    this.testNodes = {
        "collectionName": "Test Collection",
        "nodes":
                [
                    {
                        "id": 100,
                        "minimized": false,
                        "position": [10, 10],
                        "size": [30, 30],
                        "links": [],
                        "children":
                                [{
                                        "id": 101,
                                        "minimized": false,
                                        "position": [51, 10],
                                        "size": [20, 20],
                                        "links": [102],
                                        "children": []
                                    }, {
                                        "id": 102,
                                        "minimized": false,
                                        "position": [51, 51],
                                        "size": [20, 20],
                                        "links": [102],
                                        "children": []
                                    }, {
                                        "id": 103,
                                        "minimized": false,
                                        "position": [10, 51],
                                        "size": [20, 20],
                                        "links": [102],
                                        "children": []
                                    }]
                    }
                ]
    };

    //think about having this generated once when you load in a system.
    this.getAllNodes = function (systemsRoot) {
        var nodes = [];
        for (var n = 0; n < systemsRoot.nodes.length; n++) {
            var curNodes = this.recurseNodes(systemsRoot.nodes[n]);
            for (var i = 0; i < curNodes.length; i++) {
                nodes.push(curNodes[i]);
            }
        }
        return nodes;
    };

    this.recurseNodes = function (root) {
        var nodes = [];
        nodes.push(root);
        for (var i = 0; i < root.children.length; i++) {
            var curNodes = this.recurseNodes(root.children[i]);

            for (var n = 0; n < curNodes.length; n++) {
                nodes.push(curNodes[n]);
            }
        }
        return nodes;
    };

    this.canvas;

    this.loadCanvas = function (canvas) {

        if (canvas == null) {
            return;
        }

        this.canvas = canvas;

        canvas.addEventListener('mouseup', function (e) {
            self.mouseUpCalled(e);
        });
        canvas.addEventListener('mousedown', function (e) {
            self.mouseDownCalled(e);
        });
        canvas.addEventListener('mouseout', function (e) {
            self.mouseOutCalled(e);
        });
        canvas.addEventListener('mousemove', function (e) {
            self.updateDrag(e);
        });
        canvas.addEventListener('mousewheel', function (e) {
            self.mousewheelCalled(e);
        });
        canvas.addEventListener('dblclick',function(e){
            self.doubleClickCalled(e);
        });

        this.renderSystem();

    };


    /**
     * 
     * 
     * @param {type} e the mouse event received from the double click event
     * @returns {undefined}
     */
    this.doubleClickCalled = function (e){
        
        var nodes = this.getAllNodes(this.testNodes);
        for (var i = 0; i < nodes.length; i++) {

            var pos = this.getPositionToZoomPosition(nodes[i].position);
            var endPos = this.getPositionToZoomPosition([nodes[i].position[0] + nodes[i].size[0], nodes[i].position[1] + nodes[i].size[1]])

            //determined if node got clicked.
            if (e.offsetX >= pos[0] && e.offsetX <= endPos[0] &&
                    e.offsetY >= pos[1] && e.offsetY <= endPos[1]) { // if within bounds
                                
                console.log("Node we're opening opentab for: "+nodes[i].id);
                
                this.systemToRender.openInTabsByID(nodes[i].id);
                
                return;
            }
        }
        
    }


    this.mousewheelCalled = function (e) {
        this.curZoom += (e.deltaY / 100) * -1;
        console.log(this.curZoom);
    }

    this.mouseDownCalled = function (e) {

        var nodes = this.getAllNodes(this.testNodes);
        for (var i = 0; i < nodes.length; i++) {

            var pos = this.getPositionToZoomPosition(nodes[i].position);
            var endPos = this.getPositionToZoomPosition([nodes[i].position[0] + nodes[i].size[0], nodes[i].position[1] + nodes[i].size[1]])

            //determined if node got clicked.
            if (e.offsetX >= pos[0] && e.offsetX <= endPos[0] &&
                    e.offsetY >= pos[1] && e.offsetY <= endPos[1]) { // if within bounds
                
                this.nodeDragging = nodes[i];
                this.positionOnNodeDragging = [e.offsetX - pos[0], e.offsetY - pos[1]];
                this.updateDrag(e);
                
                return;
            }
        }

    };


    this.nodeDragging = null;
    this.positionOnNodeDragging = null;

    this.mouseOutCalled = function (e) {
        this.nodeDragging = null;
    };

    this.mouseUpCalled = function (e) {
        this.nodeDragging = null;
    };

    this.updateDrag = function (e) {
        if (self.nodeDragging != null) {
            
            self.nodeDragging.position = this.getZoomPositionToRegular([e.offsetX - self.positionOnNodeDragging[0], 
                e.offsetY - self.positionOnNodeDragging[1]]);
        }
        self.displayNodeNameUpdate(e);
        
    };

    this.loadSystemToRender = function (system) {

        this.systemToRender = system;

        //build nodes off of system needed to render.
        var newNodes = {
            "collectionName": system.name,
            "nodes": []
        };

        newNodes.nodes.push(this.createSystemNode(system, null, true));
        this.colorSelector = new ColorSelector();

        this.testNodes = newNodes;
    };
    
    /**
     * When a user mouses over a node, we want to display it's name for a certain period of time.
     * This shows the time of the last mouse over of a node.
     */
    self.lastNameDisplayUpdate = -1;
    
    /**
     * The name we want to display for hovering over a node.
     */
    self.nameToBeDisplaying = "";
    
    /**
     * We want to display the name of the node whenever we mouse over it
     * for the sake of convienience.
     * 
     * @param {type} e The mouse drag event
     * @returns {undefined}
     */
    self.displayNodeNameUpdate = function(e){
        
        var nodes = this.getAllNodes(this.testNodes);
        for (var i = 0; i < nodes.length; i++) {

            var pos = this.getPositionToZoomPosition(nodes[i].position);
            var endPos = this.getPositionToZoomPosition([nodes[i].position[0] + nodes[i].size[0], nodes[i].position[1] + nodes[i].size[1]])

            //determined if node got clicked.
            if (e.offsetX >= pos[0] && e.offsetX <= endPos[0] &&
                    e.offsetY >= pos[1] && e.offsetY <= endPos[1]) { // if within bounds
                
                self.nameToBeDisplaying = nodes[i].name;
                self.lastNameDisplayUpdate = Date.now();
                
                return;
            }
        }
    };

    /**
     * Recursive function that calls itself when creating sub systems
     * Adds all subsiquent recursive calls to child property of the JSON
     * Children can also be put on the same level as system
     * 
     * @param {type} systemArg The system we want to parse into a node.
     * @param {type} parent Parent of the system, if we have a parent that means this node is a subsystem
     * @param {bool} isBase If this is the base of our system then it will be a bigger node
     * than other system nodes
     * @returns {SystemRenderer.createSystemNode.systemNode}
     */
    this.createSystemNode = function (systemArg, parent, isBase) {

        var size = [50, 50];

        if (systemArg.subsystemOf != null && isBase != null && isBase == false) {
            size = [35, 35];
        }

        var position = [10, 10];
        if (this.canvas != null) {
            position = [this.canvas.width * Math.random(), this.canvas.height * Math.random()];
        }

        var systemNode = {
            "id": systemArg.id,
            "name": systemArg.name,
            "description": systemArg.description,
            "color": this.colorSelector.getRandomColor(),
            "minimized": false,
            "position": position,
            "size": size,
            "links": [],
            "parent": parent,
            "children": []
        };

        if (systemArg.subSystems != null) {
            for (var i = 0; i < systemArg.subSystems().length; i++) {
                systemNode.children.push(this.createSystemNode(systemArg.subSystems()[i], systemNode, false));
            }
        }

        if (systemArg.classesAssociated != null) {
            for (var i = 0; i < systemArg.classesAssociated().length; i++) {
                systemNode.children.push(this.createClassNode(systemArg.classesAssociated()[i], systemNode));
            }
        }
        return systemNode;
    };

    this.createClassNode = function (classView, systemNode) {

        var classNode = {
            "id": classView.id,
            "name": classView.name,
            "description": classView.description,
            "color": this.colorSelector.getClassColor(systemNode.color),
            "minimized": false,
            "position": [10, 10],
            "size": [20, 20],
            "links": [],
            "parent": systemNode,
            "children": []
        };

        return classNode;

    };



    //--------------------------------------------Render System--------------------------------------
    this.fitToContainer = function () {
        // Make it visually fill the positioned parent
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        // ...then set the internal size to match
        this.canvas.width = this.canvas.offsetWidth;
        //this.canvas.height = window.innerHeight*.5; 

        //this.canvas.height = this.canvas.parentNode.parentNode.parentNode.getChild.childNodes[0].offsetHeight;
        //console.log(this.canvas.parentNode.parentNode.parentNode.getElementsByClassName("row")[0].offsetHeight);
        this.canvas.height = this.canvas.parentNode.parentNode.parentNode.offsetHeight - this.canvas.parentNode.parentNode.parentNode.getElementsByClassName("row")[0].offsetHeight - 150;

    };


    /**
     * When a user mouses over a node let's give them some information of that node
     * in a friendely not in your face manor.
     * 
     * @param {type} ctx Context of the canvas we will be drawing too.
     * @returns {undefined}
     */
    self.drawNodePreviewDisplay = function(ctx){
        
        if(Date.now() - self.lastNameDisplayUpdate > 1000){
            return;
        }
        
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.font = "12px Georgia";
        ctx.fillText(self.nameToBeDisplaying(),10,20);
    }

    /**
     * Simulates different forces nodes emit on eachother.  Children want to be close to their parent
     * All nodes want to keep a certain distance from eachother.
     * Based on node distance we determine their next frames position.
     * 
     * @returns {undefined}
     */
    this.gravitate = function () {

        var nodes = this.getAllNodes(this.testNodes);
        var nodesDirections = [];

        var desiredLengthToParent = 80;//around how many pixels close does it want to be to the parent
        var desiredDistanceFromOtherNodes = 50;

        for (var i = 0; i < nodes.length; i++) {

            var curID = nodes[i].id;
            var curNodePosition = [nodes[i].position[0] + (nodes[i].size[0] / 2),
                nodes[i].position[1] + (nodes[i].size[1] / 2)];

            var thisNodesDirection = [0, 0];

            for (var nc = 0; nc < nodes.length; nc++) {
                if (nodes[nc].id !== curID) {//make sure we're not looking at ourself.

                    var nodeIsParent = false;

                    //do we have a parent?
                    if (nodes[i].parent != null) {
                        //is this our parent?
                        if (nodes[i].parent.id === nodes[nc].id) {
                            nodeIsParent = true;
                        }
                    }


                    //actual center position of node
                    var nodeEvalPos = [nodes[nc].position[0] + (nodes[nc].size[0] / 2),
                        nodes[nc].position[1] + (nodes[nc].size[1] / 2)];

                    var distanceFromNode = Math.sqrt(Math.pow(curNodePosition[0] - nodeEvalPos[0], 2) +
                            Math.pow(curNodePosition[1] - nodeEvalPos[1], 2));

                    //determine the maginitude we need to move
                    var magnitudeWeShouldTravel = 0;

                    if (nodeIsParent) {
                        //if we have a parent, try making it at the specific distance
                        if (distanceFromNode > desiredLengthToParent) {
                            magnitudeWeShouldTravel = Math.pow(distanceFromNode / desiredLengthToParent, 2);
                        } else {
                            magnitudeWeShouldTravel = Math.pow((desiredLengthToParent - distanceFromNode) / desiredLengthToParent, 1);
                        }

                        //likely will never exactly be the desired length, so we settle for a range.
                        if (distanceFromNode < desiredLengthToParent + 1 && distanceFromNode > desiredLengthToParent - 1) {
                            magnitudeWeShouldTravel = 0;
                        }

                    } else {
                        //if not a parent then just make sure we're not too close to other nodes.
                        if (distanceFromNode < desiredDistanceFromOtherNodes) {
                            magnitudeWeShouldTravel = Math.pow(((desiredDistanceFromOtherNodes * 2) - distanceFromNode) / desiredDistanceFromOtherNodes, 2);
                        }
                    }

                    if (nodes[i].parent == null) {
                        magnitudeWeShouldTravel = 0;
                    }

                    //now figure out the direction we need to move in.
                    var directionToMoveIn = [0, 0];

                    if (nodeIsParent) {
                        directionToMoveIn = [nodeEvalPos[0] - curNodePosition[0], nodeEvalPos[1] - curNodePosition[1]];
                        var divideBy = Math.max(Math.abs(directionToMoveIn[0]), Math.abs(directionToMoveIn[1]));
                        directionToMoveIn = [directionToMoveIn[0] / divideBy, directionToMoveIn[1] / divideBy];

                        if (distanceFromNode < desiredLengthToParent) {
                            directionToMoveIn = [directionToMoveIn[0] * -1, directionToMoveIn[1] * -1];
                        }
                    } else {
                        directionToMoveIn = [nodeEvalPos[0] - curNodePosition[0], nodeEvalPos[1] - curNodePosition[1]];
                        var divideBy = Math.max(Math.abs(directionToMoveIn[0]), Math.abs(directionToMoveIn[1]));
                        if (divideBy !== 0) {
                            directionToMoveIn = [directionToMoveIn[0] / divideBy, directionToMoveIn[1] / divideBy];
                            directionToMoveIn = [directionToMoveIn[0] * -1, directionToMoveIn[1] * -1];
                        } else {
                            directionToMoveIn = [Math.random(), Math.random()];
                        }

                    }

                    //formulate actual movement
                    directionToMoveIn = [directionToMoveIn[0] * magnitudeWeShouldTravel, directionToMoveIn[1] * magnitudeWeShouldTravel];
                    thisNodesDirection = [thisNodesDirection[0] + directionToMoveIn[0], thisNodesDirection[1] + directionToMoveIn[1]];
                }

            }
            nodesDirections.push(thisNodesDirection);
        }

        //move all nodes
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].position[0] = nodes[i].position[0] + nodesDirections[i][0];
            nodes[i].position[1] = nodes[i].position[1] + nodesDirections[i][1];
        }

    };

    /**
     * Can be thought of as an entire system render update. Rendering starts here.
     * If the canvas isn't null then whatever nodes are loaded have their positions
     * updated and then drawn.
     * 
     * @returns {undefined}
     */
    this.renderSystem = function () {

        if (this.canvas == null) {
            return;
        }

        this.fitToContainer();

        this.gravitate();

        var ctx = this.canvas.getContext('2d');
        
        //drawing border
        ctx.beginPath();
        ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = 'Black';
        ctx.fill();
        ctx.beginPath();
        ctx.rect(1, 1, this.canvas.width - 2, this.canvas.height - 2);
        ctx.fillStyle = 'White';
        ctx.fill();

        //drawing all nodes.
        for (var i = 0; i < this.testNodes.nodes.length; i++) {
            this.drawNode(ctx, this.testNodes.nodes[i]);
        }

        self.drawNodePreviewDisplay(ctx);

        //window.requestAnimationFrame(this.renderSystem());
    };

    /**
     * A recursive function that draws the node passed in and any children listed 
     * in the childrens property of the node passed in. Draws any lines connecting children
     * with parents
     * 
     * @param {type} ctx
     * @param {JSON} nodeToDraw
     * @returns {undefined}
     */
    this.drawNode = function (ctx, nodeToDraw) {

        if (nodeToDraw == null) {
            return;
        }

        //draw lines linking to other aspects of the program ( class referencing another class in a method )

        for (var i = 0; i < nodeToDraw.children.length; i++) {

            //draw lines linking to children
            ctx.beginPath();
            var startingPos = this.getPositionToZoomPosition([nodeToDraw.position[0] + (nodeToDraw.size[0] / 2), nodeToDraw.position[1] + (nodeToDraw.size[1] / 2)]);
            var endingPos = this.getPositionToZoomPosition([nodeToDraw.children[i].position[0] + (nodeToDraw.children[i].size[0] / 2), nodeToDraw.children[i].position[1] + (nodeToDraw.children[i].size[1] / 2)]);
            ctx.moveTo(startingPos[0], startingPos[1]);
            ctx.lineTo(endingPos[0], endingPos[1]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "Black";
            ctx.stroke();

            //draw actual nodes
            this.drawNode(ctx, nodeToDraw.children[i]);
        }

        //Drawing single node we're on
        ctx.beginPath();
        var outerBorder = this.getPositionToZoomPosition(nodeToDraw.position);
        var outerBorderSize = this.getPositionToZoomPosition([nodeToDraw.size[0] + nodeToDraw.position[0], nodeToDraw.size[1] + nodeToDraw.position[1]]);
        ctx.rect(outerBorder[0], outerBorder[1], outerBorderSize[0] - outerBorder[0], outerBorderSize[1] - outerBorder[1]);
        ctx.fillStyle = this.colorSelector.getBorder(nodeToDraw.color);
        ctx.fill();

        ctx.beginPath();
        outerBorder = this.getPositionToZoomPosition([nodeToDraw.position[0] + 2, nodeToDraw.position[1] + 2]);
        outerBorderSize = this.getPositionToZoomPosition([nodeToDraw.size[0] + nodeToDraw.position[0] - 2, nodeToDraw.size[1] + nodeToDraw.position[1] - 2]);
        ctx.rect(outerBorder[0], outerBorder[1], outerBorderSize[0] - outerBorder[0], outerBorderSize[1] - outerBorder[1]);
        ctx.fillStyle = (nodeToDraw.color);
        ctx.fill();

    };

    /**
     * Depending on the zoom of the render, things can appear in different positions.
     * Much simpler math than gravitate, but not as intuitive.
     * 
     * @param {type} positionArg
     * @returns {Array}
     */
    this.getPositionToZoomPosition = function (positionArg) {

        //don't bother doing anything if the zoom isn't changing anything
        if (this.curZoom === 0 || positionArg == null) {
            return positionArg;
        }

        //declare a new obj like this, other wise it's referencing the obj passed in.
        var position = [positionArg[0], positionArg[1]];

        //take into account the zoome of everything :(((
        var originalWidth = this.canvas.width;
        var originalHeight = this.canvas.height;

        var newWidth = originalWidth;
        var newHeight = originalHeight;

        //getting the new width and height.
        if (this.curZoom > 0) {
            newWidth = originalWidth / (1 + (this.curZoom) / 10);
            newHeight = originalHeight / (1 + (this.curZoom) / 10);
        } else if (this.curZoom < 0) {
            newWidth = originalWidth * (1 + (Math.abs(this.curZoom) / 10));
            newHeight = originalHeight * (1 + (Math.abs(this.curZoom) / 10));
        }

        position[0] += (newWidth - originalWidth) / 2;
        position[1] += (newHeight - originalHeight) / 2;

        position[0] = (position[0] / newWidth) * originalWidth;
        position[1] = (position[1] / newHeight) * originalHeight;

        return position;
    }
    
    this.getZoomPositionToRegular = function(positionArg){
        
        //don't bother doing anything if the zoom isn't changing anything
        if (this.curZoom === 0 || positionArg == null) {
            return positionArg;
        }

        //declare a new obj like this, other wise it's referencing the obj passed in.
        var position = [positionArg[0], positionArg[1]];

        //take into account the zoome of everything :(((
        var originalWidth = this.canvas.width;
        var originalHeight = this.canvas.height;

        var newWidth = originalWidth;
        var newHeight = originalHeight;

        //getting the new width and height.
        if (this.curZoom > 0) {
            newWidth = originalWidth / (1 + (this.curZoom) / 10);
            newHeight = originalHeight / (1 + (this.curZoom) / 10);
        } else if (this.curZoom < 0) {
            newWidth = originalWidth * (1 + (Math.abs(this.curZoom) / 10));
            newHeight = originalHeight * (1 + (Math.abs(this.curZoom) / 10));
        }

        position[0] = (position[0] * newWidth) / originalWidth;
        position[1] = (position[1] * newHeight) / originalHeight;

        position[0] -= (newWidth - originalWidth) / 2;
        position[1] -= (newHeight - originalHeight) / 2;

        return position;
        
    }

}


/**
 * An object that has a predifined list of colors.  Getting a color from it removes it from the list so
 * you never get that same color again from the object.  If you go through all the colors in the object
 * it will start over.
 * 
 * @returns {ColorSelector}
 */
function ColorSelector() {

    this.colorsForSelection = ['#F94F48', '#FF6A41', '#B4B4B4', '#D5D5D5', '#E973F5', '#237FEA',
        '#F2B838', '#19EC5A', '#2395DE', '#D4B57F', '#FFD700'];
    this.colorsAlreadySelected = [];

    this.getRandomColor = function () {

        //find a color that hasn't been taken yet.
        var index = Math.floor((Math.random() * this.colorsForSelection.length));
        var indexHasBeenFound = false;
        while (!indexHasBeenFound) {

            if (this.colorsAlreadySelected.indexOf(index) === -1) {
                indexHasBeenFound = true;
            } else {
                index = Math.floor((Math.random() * this.colorsForSelection.length));
            }

        }

        this.colorsAlreadySelected.push(index);

        if (this.colorsAlreadySelected.length == this.colorsForSelection.length) {
            this.colorsAlreadySelected = [];
        }

        return this.colorsForSelection[index];
    };


    this.getBorder = function (curColor) {
        return '#' + new Values(curColor).shade(25).hex;
    };

    this.getClassColor = function (systemColor) {
        return '#' + new Values(systemColor).tint(25).hex;
    };

}
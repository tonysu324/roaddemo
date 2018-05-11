
'use strict';

var roadObject = {
    width: $("body").width() > 420 ? 280 : 140,
    height: $("body").width() > 420 ? 100 : 50
}
var verticalRoadObject = {
    width: $("body").width() > 420 ? 100 : 50,
    height: $("body").width() > 420 ? 280 : 140,
}
class MainPanel extends React.Component {
    constructor(props) {
        super(props);
        this.movingType = '';

        this.state = { renderRoad: false, point: { x: 0, y: 0 } };

        //to make sure 'this' can be used in other funcitons, in ES6 this just can be used in constructor
        this.addRoad = this.addRoad.bind(this);
        this.renderRoad = this.renderRoad.bind(this);
    }

    renderRoad() {
        if (this.state.renderRoad) {
            return <Road point={this.state.point} movingType={this.movingType} tellParentRoadhaveBeenClicked={() => this.onRoadClicked()} tellParentLine1RighthaveBeenClicked={() => this.onLine1RightControllerPointClicked()} tellParentTopMidHaveBeenClicked={() => this.onTopMidContollerPointClicked()} tellParentLine2RightHaveBeenClicked={() => this.onLine2RightContollerPointClicked()} tellParentLine2LeftHaveBeenClicked={() => this.onLine2LeftContollerPointClicked()} tellParentLine2MidHaveBeenClicked={() => this.onLine2MidContollerPointClicked()} tellParentline3Point2M3HaveBeenClicked={() => this.online3Point2M3HaveBeenClicked()} tellParentline3Point2M1HaveBeenClicked={() => this.online3Point2M1HaveBeenClicked()} tellParentline3Point2M2HaveBeenClicked={() => this.online3Point2M2HaveBeenClicked()} />;
        } else {
            return "";
        }
    }

    onRoadClicked() {
        this.movingType = 'Road';
    }

    onLine1RightControllerPointClicked() {
        this.movingType = 'Line1Right';
    }

    onTopMidContollerPointClicked() {
        this.movingType = 'TopMid';
    }

    onLine2RightContollerPointClicked() {
        this.movingType = 'Line2Right';
    }

    onLine2LeftContollerPointClicked() {
        this.movingType = 'Line2Left';
    }

    onLine2MidContollerPointClicked() {
        this.movingType = 'Line2Mid';
    }

    online3Point2M3HaveBeenClicked() {
        this.movingType = 'line3Point2M3';
    }

    online3Point2M1HaveBeenClicked() {
        this.movingType = 'line3Point2M1';
    }

    online3Point2M2HaveBeenClicked() {
        this.movingType = 'line3Point2M2';
    }

    addRoad(event) {
        var e;
        var leftWidth = $(".nav-panel").width();
        if (event.type == "touchmove") {
            e = event.touches[0];
        } else {
            e = event;
        }
        this.setState({ renderRoad: true, point: { x: e.clientX - leftWidth, y: e.clientY } });
    }

    addVerticalRoad = (event) => {
        event.stopPropagation();
        event.preventDefault();
        var e;
        var leftWidth = $(".nav-panel").width();
        if (event.type == "touchmove") {
            e = event.touches[0];
        } else {
            e = event;
        }
        this.movingType = 'VerticalRoad';
        this.setState({ renderRoad: true, point: { x: e.clientX - leftWidth, y: e.clientY } });
    }

    startMove = (event) => {
        var e;
        var leftWidth = $(".nav-panel").width();
        if (event.type == "touchmove") {
            e = event.touches[0];
        } else {
            e = event;
        }
        if (this.state.renderRoad && this.movingType != '') {
            this.setState({ point: { x: e.clientX - leftWidth, y: e.clientY} });
        }
    }

    stopMove = (event) => {
        this.movingType = '';
    }
 

    render() {
        return (

            <div id="editorPanel" className="editor-panel">

                {/* The left navigation component panel */}
                <div className="nav-panel">
                    <div style={{ margin: 7 }}>
                        <div className="nav" title="Drag and drop the Paved 1 tool on the drawing to add a vertical street.">
                            <div>
                                <div className="symbol-item form-group" draggable="true" id="paved1" className="cursor-pointer" onTouchMove={this.addVerticalRoad}  onDragEnd={this.addVerticalRoad}>
                                    <div alt="Paved 1" className="symbol-item-svg fl">
                                        <img src="../svg/Paved_1.png"/>
                                    </div>
                                    <div className="symbol-item-text fl">&nbsp;Paved 1</div>
                                </div>
                            </div>
                        </div>

                        <div className="nav" title="Drag and drop the Paved 2 tool on the drawing to add a horizontal street.">
                            <div>
                                <div className="symbol-item form-group" draggable="true" id="paved2" className="cursor-pointer" onTouchMove={this.addRoad} onDragEnd={this.addRoad}>
                                    <div className="symbol-item-svg fl" alt="Paved 2">
                                        <img src="../svg/Paved_2.png" />
                                    </div>
                                    <div className="symbol-item-text fl">&nbsp;Paved 2</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* The right main drawing panel */}
                <div id="mainContent" className="drawing-panel">
                    <svg id="svgroot" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" overflow="hidden" height="600" width="100%" onMouseMove={this.startMove} onMouseUp={this.stopMove} onTouchMove={this.startMove} onTouchEnd={this.stopMove}>

                        <g id="svgroot-main-panel">
                            {this.renderRoad()}
                        </g>
                    </svg>
                </div >


            </div>
        );
    }
}

class Road extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topMidMoving: false,
            reRender: 0
        };

        this.commonParam = {
            distance:40,
            triangle: {
                width: 12,
                height: 12,
                halfWidth: 6,
                halfHeight: 6,
            },
            square: {
                width: 10,
                height: 10
            },
            rhombi: {
                width: 12,
                height: 12,
                halfHeight: 6
            },
        }

        this.horizontalRoadParam = {
            width: roadObject.width,
            height: roadObject.height,
            rightY: 0,
            topMidX: 0,
            fixedWidthRatio: 1.02,
            fixedHeightRatio: 2.36,
            centrePoint: {
                x: roadObject.width / 2,
                y: roadObject.height / 2
            },
            rightText: {
                text: "",
                textLength: 0
            },
            maskLayerPaths: {
                path1: "M0," + roadObject.height / 2 + " L" + roadObject.width + "," + roadObject.height / 2,
            }
        };

        this.coordinatePath = {
            roadMatrix: "",
            topleftPointPath: "",
            streetLine1: "M0,0 L" + this.horizontalRoadParam.width + ",0",
            streetLine2: this.getLine2Path(),
            streetLine3: "M0," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height,
            streetLine1RightRampPath: "",
            pavedFillPath: "M0,0 L" + this.horizontalRoadParam.width + ",0 L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height + " L0," + this.horizontalRoadParam.height,
            rotate: ""
        };

        this.verticalRoadCoordinates = {
            startPoint: { x: (roadObject.width / 2 - roadObject.height / 2), y : roadObject.width / 2 + roadObject.height / 2},
            endPoint: { x: (roadObject.width / 2 - roadObject.height / 2), y: (-roadObject.width / 2 + roadObject.height / 2) },
            line3Point2: {
                MQ1XSpace: this.commonParam.distance,
                MQ1YSpace: this.commonParam.distance,
            }
        }

        
        this.verticalRoadParam = {
            width: verticalRoadObject.width,
            height: verticalRoadObject.height,
            maskLayerStrokeWidth: verticalRoadObject.width - 2,
            line2Point1: { x: 0, y: 0, transform:""},
            line2Point2: { x: 0, y: 0, transform: "" },
            line3Point2M1: { x: 0, y: 0 },
            line3Point2M2: { x: 0, y: 0 },
            line3Point2M3: { x: 0, y: 0 },
            line3Point2LPath: "",
            line3Point2QPath:"",
            streetLine1: "M" + (roadObject.width / 2 - roadObject.height / 2) + "," + (-roadObject.width / 2 + roadObject.height / 2) + " L" + (roadObject.width / 2 - roadObject.height / 2) + "," + (roadObject.width / 2 + roadObject.height / 2),
            streetLine2: "M" + roadObject.width / 2 + "," + (-roadObject.width / 2 + roadObject.height / 2) + " L" + (roadObject.width / 2) + "," + (roadObject.width / 2 + roadObject.height / 2),
            streetLine3: "M" + (roadObject.width / 2 + roadObject.height / 2) + "," + (-roadObject.width / 2 + roadObject.height / 2) + " L" + (roadObject.width / 2 + roadObject.height / 2) + "," + (roadObject.width / 2 + roadObject.height / 2),
            maskLayerPath1 : "M" + (roadObject.width / 2) + "," + (-roadObject.width / 2 + roadObject.height / 2) + " L" + (roadObject.width / 2 ) + "," + (roadObject.width / 2 + roadObject.height / 2)
        };

        this.lastRoadPoint = {
            x: this.props.point.x,
            y: this.props.point.y
        }
        this.lastVerticalRoadPoint = {
            x: this.props.point.x,
            y: this.props.point.y
        }
        this.rememberRoad = false;
        this.rememberLine1Right = false;

        this.drawControllerPointPaths();
    }

    renderRoad() {
        this.drawControllerPointPaths();
        this.drawRoadPaths();
    }

    //draw controller points in this road component
    drawControllerPointPaths() {
        if (this.props.movingType == 'Road' || this.props.movingType == '') {
            this.rememberRoad = true;
            this.lastRoadPoint = {
                x: this.props.point.x,
                y: this.props.point.y
            }
           
            this.coordinatePath.roadMatrix = "matrix(1 0 0 1 " + (this.props.point.x - this.horizontalRoadParam.width / 2) + " " + (this.props.point.y - this.horizontalRoadParam.height / 2) + ")";
            this.coordinatePath.roadPoint = { x: (this.props.point.x - this.horizontalRoadParam.width / 2), y: (this.props.point.y - this.horizontalRoadParam.height / 2) };
            this.coordinatePath.transform = "translate(" + this.coordinatePath.roadPoint.x + "," + this.coordinatePath.roadPoint.y + ")";
        }
        else if (this.props.movingType == 'VerticalRoad') {
            this.lastVerticalRoadPoint = {
                x: this.props.point.x,
                y: this.props.point.y
            }
        }

        this.coordinatePath.topleftPointPath = this.getTriangle({ x: 0, y: 0 }, "up");

        if (!this.rememberLine1Right) {
            this.coordinatePath.topRightPointPath = this.getTriangle({ x: this.horizontalRoadParam.width - this.commonParam.triangle.width, y: 0 }, "up");
        }

        this.coordinatePath.bottomleftPointPath = this.getTriangle({ x: 0, y: this.horizontalRoadParam.height }, "down");
        this.coordinatePath.bottomrightPointPath = this.getTriangle({ x: this.horizontalRoadParam.width - this.commonParam.triangle.width, y: this.horizontalRoadParam.height }, "down");
        this.coordinatePath.midleftPoint = { x: -this.commonParam.square.width * 3, y: this.horizontalRoadParam.centrePoint.y - this.commonParam.rhombi.halfHeight, width: this.commonParam.square.width, height: this.commonParam.square.height };
        this.coordinatePath.midrightPoint = { x: this.horizontalRoadParam.width + this.commonParam.square.width * 2, y: this.horizontalRoadParam.centrePoint.y - this.commonParam.rhombi.halfHeight, transform: "", width: this.commonParam.square.width, height: this.commonParam.square.height };

        this.coordinatePath.midmidBigPointPath = { x: this.horizontalRoadParam.width / 2 - this.commonParam.rhombi.halfHeight, y: this.horizontalRoadParam.height / 2 - this.commonParam.rhombi.halfHeight }
        this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);
        
    }

    //draw all line,symbol,text path of this road component
    drawRoadPaths() {

        var movePointY = - (this.lastRoadPoint.y - this.props.point.y - this.horizontalRoadParam.height / 2);// Y mouse moving distance
        var movePointX = (this.props.point.x - this.lastRoadPoint.x);// X mouse moving distance
        
        var maxY = 0;
        var minY = -this.horizontalRoadParam.height;// restrict move min, max height
        if (movePointY > maxY) movePointY = maxY;
        if (movePointY < minY) movePointY = minY;

        var minX = -40;
        var maxX = this.horizontalRoadParam.width / 4;// restrict move min, max width
        if (movePointX > maxX) movePointX = maxX;
        if (movePointX < minX) movePointX = minX;

        var fixHeight = this.horizontalRoadParam.height;
        var fixWidth = this.horizontalRoadParam.width;
        if (this.props.movingType == 'Line1Right') {
            this.rememberLine1Right = true;
            this.horizontalRoadParam.rightY = movePointY;

            var lPoint = { x: fixWidth / 2 + movePointY * this.horizontalRoadParam.fixedWidthRatio, y: 0 };
            var cPoint3 = { x: lPoint.x + (-movePointY) * this.horizontalRoadParam.fixedHeightRatio, y: movePointY };
            var cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: 0 };
            var cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: movePointY };
            this.horizontalRoadParam.Line1RightLPoint1 = lPoint;
            this.horizontalRoadParam.Line1RightCPoint3 = cPoint3;

            this.coordinatePath.streetLine1RightRampPath = "M0,0  L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + "," + movePointY;
            this.horizontalRoadParam.rightY = movePointY;

            if (movePointY != 0) {
                this.coordinatePath.line1RightRampTrianglePath = this.getTriangle({ x: (cPoint1.x + 3 + (cPoint2.x - cPoint1.x) / 2), y: (movePointY / 2 + 3) }, "right");
            } else {
                this.coordinatePath.line1RightRampTrianglePath = "";
            }
            this.coordinatePath.streetLine1 = "M0,0 L" + lPoint.x + ",0 M" + cPoint3.x + ",0 L" + this.horizontalRoadParam.width + ",0";

            this.coordinatePath.topRightPointPath = this.getTriangle({ x: this.horizontalRoadParam.width - this.commonParam.triangle.width, y: movePointY }, "up");
            this.coordinatePath.midmidBigPointPath = { x: this.horizontalRoadParam.width / 2 - this.commonParam.rhombi.halfHeight, y: this.horizontalRoadParam.height / 2 - this.commonParam.rhombi.halfHeight }
            this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);

            this.drawLine1RightText();//change text 


        }
        else if (this.props.movingType == 'TopMid') {
            this.moveToDrawLine1RightRamp(movePointX);// move line1 right ramp
        }
        else if (this.props.movingType == 'Line2Right') {
            this.moveToDrawByLine2RightRect();
        }
        else if (this.props.movingType == 'Line2Left') {
            this.moveToDrawByLine2LeftRect();
        }
        else if (this.props.movingType == 'Line2Mid') {
            this.moveToDrawLine2MidControllerPoint();
        }
        else if (this.props.movingType == 'VerticalRoad') {
            this.moveToDrawVerticalRoad();
        }
        else if (this.props.movingType == "line3Point2M3") {
            this.moveToLine3Point2M3();
        }
        else if (this.props.movingType == "line3Point2M1") {
            this.moveToLine3Point2M1();
        }
        else if (this.props.movingType == "line3Point2M2") {
            this.moveToLine3Point2M2();
        }
    }

    //draw line 1 right text
    drawLine1RightText() {
        var text = (this.horizontalRoadParam.rightY * -1) / 4 + "";
        if (text.length > 4) text = text.substring(0, text.indexOf("."));
        this.horizontalRoadParam.rightText.text = text + "'";

        var y = (this.horizontalRoadParam.rightY * -1);
        this.horizontalRoadParam.rightText.textLength = this.horizontalRoadParam.rightText.text.length * 8;

        this.horizontalRoadParam.rightText.x = this.horizontalRoadParam.width - (y / 2 + this.horizontalRoadParam.rightText.textLength / 2) + 15;
        if (this.horizontalRoadParam.rightText.textLength > y || y < 25) {
            this.horizontalRoadParam.rightText.text = "";
            this.coordinatePath.textLine = "";
        }
        else {
            var textLineHeight = -30;
            var space = 6;
            this.coordinatePath.textLine = "M" + (this.horizontalRoadParam.width - y) + " ," + textLineHeight + " L" + this.horizontalRoadParam.width + " ," + textLineHeight + " M" + (this.horizontalRoadParam.width - space) + " " + (textLineHeight - space) + ",L " + this.horizontalRoadParam.width + " " + textLineHeight + " M " + this.horizontalRoadParam.width + "," + textLineHeight + " L " + (this.horizontalRoadParam.width - space) + " " + (textLineHeight + space) + " M" + (this.horizontalRoadParam.width - y + space) + " " + (textLineHeight - space) + ",L " + (this.horizontalRoadParam.width - y) + " " + textLineHeight + " M " + (this.horizontalRoadParam.width - y) + "," + textLineHeight + " L " + (this.horizontalRoadParam.width - y + space) + " " + (textLineHeight + space);

            this.coordinatePath.textRoate = "rotate(90, " + (this.horizontalRoadParam.width - 20) + ", -20)";
        }
    }

    //-------------READY MOVE EVENTS DEFINE--------------------
    readyMoveRoad = (event) => {
        this.props.tellParentRoadhaveBeenClicked();
        event.stopPropagation();
        event.preventDefault();
    }

    readyMoveLine1Right = (event) => {
        this.props.tellParentLine1RighthaveBeenClicked();
        event.stopPropagation();
        event.preventDefault();
    }

    readyLine1RightRampMove = (event) => {
        this.props.tellParentTopMidHaveBeenClicked();
        event.stopPropagation();
        event.preventDefault();
    }

    readyLine2RightMove = (event) => {
        this.props.tellParentLine2RightHaveBeenClicked();
        event.stopPropagation();
        event.preventDefault();
    }

    readyLine2LeftMove = (event) => {
        this.props.tellParentLine2LeftHaveBeenClicked();
        event.stopPropagation();
        event.preventDefault();
    }

    readyLine2MidMove = (event) => {
        this.props.tellParentLine2MidHaveBeenClicked();
        event.stopPropagation();
        event.preventDefault();
    }

    readyline3Point2M3Move = (event) => {
       
        this.props.tellParentline3Point2M3HaveBeenClicked();
        event.stopPropagation();
        event.preventDefault();
    }

    readyline3Point2M1Move = (event) => {
        this.props.tellParentline3Point2M1HaveBeenClicked();
        event.stopPropagation();
        event.preventDefault();
    }

    readyline3Point2M2Move = (event) => {
        this.props.tellParentline3Point2M2HaveBeenClicked();
        event.stopPropagation();
        event.preventDefault();
    }
    //-------------READY MOVE EVENTS DEFINE END----------------

    //-------------DRAWING WHEN MOVING DEFINE------------------
    moveToDrawByLine2RightRect() {
        var movePointX = this.props.point.x - this.lastRoadPoint.x - roadObject.width / 2;// X mouse moving distance
        var movePointY = this.props.point.y - this.lastRoadPoint.y;
     
        this.horizontalRoadParam.width = roadObject.width + movePointX;

        this.coordinatePath.streetLine1 = "M0,0 L" + this.horizontalRoadParam.width + ",0 ";
        this.coordinatePath.streetLine2 = this.getLine2Path();
        this.coordinatePath.streetLine3 = "M0," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height + "";

        this.horizontalRoadParam.maskLayerPaths.path1 = "M0," + this.horizontalRoadParam.height / 2 + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height / 2;

        this.coordinatePath.midmidBigPointPath = { x: this.horizontalRoadParam.width / 2 - this.commonParam.rhombi.halfHeight, y: this.horizontalRoadParam.height / 2 - this.commonParam.rhombi.halfHeight }
        this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);

        this.getLine1RightRampPath();

        this.coordinatePath.topRightPointPath = this.getTriangle({ x: this.horizontalRoadParam.width - this.commonParam.triangle.width, y: this.horizontalRoadParam.rightY }, "up");
        this.drawLine1RightText();

        if (movePointY != 0) {
            var x = this.props.point.x;
            var y = this.props.point.y;
            var a = y - this.coordinatePath.roadPoint.y - this.horizontalRoadParam.height / 2;
            var b = x - this.coordinatePath.roadPoint.x;
            var deg = Math.atan(a / b) * 180 / Math.PI;

            this.coordinatePath.transform = "translate(" + this.coordinatePath.roadPoint.x + "," + this.coordinatePath.roadPoint.y + ") rotate(" + deg + ", 0," + this.horizontalRoadParam.height / 2 + ")";
        }
    }

    moveToDrawByLine2LeftRect() {
        var movePointX = this.lastRoadPoint.x - this.props.point.x - roadObject.width / 2;// X mouse moving distance
        var movePointY = (this.props.point.y - this.lastRoadPoint.y);
        this.horizontalRoadParam.width = roadObject.width + movePointX;

        this.coordinatePath.streetLine1 = "M0,0 L" + this.horizontalRoadParam.width + ",0 ";
        this.coordinatePath.streetLine2 = this.getLine2Path();
        this.coordinatePath.streetLine3 = "M0," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height + "";

        this.horizontalRoadParam.maskLayerPaths.path1 = "M0," + this.horizontalRoadParam.height / 2 + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height / 2;

     
        this.coordinatePath.midmidBigPointPath = { x: this.horizontalRoadParam.width / 2 - this.commonParam.rhombi.halfHeight, y: this.horizontalRoadParam.height / 2 - this.commonParam.rhombi.halfHeight }
        this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);

        this.getLine1RightRampPath();

        this.coordinatePath.topRightPointPath = this.getTriangle({ x: this.horizontalRoadParam.width - this.commonParam.triangle.width, y: this.horizontalRoadParam.rightY }, "up");
        this.drawLine1RightText();

        var x = this.props.point.x;
        var y = this.props.point.y;
        var a = y - this.coordinatePath.roadPoint.y - this.horizontalRoadParam.height / 2;
        var b = this.coordinatePath.roadPoint.x + this.horizontalRoadParam.width - x;
        var deg = - Math.atan(a / b) * 180 / Math.PI;

        this.coordinatePath.roadPoint.x = this.props.point.x;
        this.coordinatePath.transform = "translate(" + (this.props.point.x) + "," + this.coordinatePath.roadPoint.y + ") rotate(" + deg + ", " + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height / 2 + ")";
    }

    moveToDrawLine2MidControllerPoint() {
        var movePointX = Math.abs(this.lastRoadPoint.x - this.props.point.x - roadObject.width / 2);// X mouse moving distance
        var movePointY = (this.props.point.y - this.coordinatePath.roadPoint.y);
        var midMovePointY = movePointY - this.horizontalRoadParam.height / 2;
        var toward = midMovePointY > 0 ? 0 : 1;
        var c = Math.sqrt(Math.pow(this.horizontalRoadParam.width / 2, 2) + Math.pow(midMovePointY, 2));

        var tempB = c / 2;
        var deg = 90 - Math.atan(Math.abs(midMovePointY) / (this.horizontalRoadParam.width / 2)) * 180 / Math.PI;

        var cosvalue = Math.cos(deg * Math.PI / 180);
        var r = tempB / cosvalue;

        var isInside = midMovePointY > 0 ? true : false;
        var line1R = isInside ? (r - this.horizontalRoadParam.height / 2) : (r + this.horizontalRoadParam.height / 2);
        var line3R = isInside ? (r + this.horizontalRoadParam.height / 2) : (r - this.horizontalRoadParam.height / 2);

        var isBigCircle = Math.abs(midMovePointY) > this.horizontalRoadParam.width / 2 ? 1 : 0;

        var line1LeftPoint = this.getLine1LeftControllerPoint(midMovePointY, deg, c, 1);

        var line1RightPoint = this.getLine1RightControllerPoint(line1LeftPoint, midMovePointY, 1);
        this.coordinatePath.topleftPointPath = this.getTriangle(line1LeftPoint, "up");
        this.coordinatePath.topRightPointPath = this.getTriangle(line1RightPoint, "up");

        //console.log("deg:" + deg + " ;r:" + r + " ;isBigCircle:" + isBigCircle + " ;midMovePointY:" + midMovePointY + " ;line1LeftPoint.x:" + line1LeftPoint.x + " line1LeftPoint.y:" + line1LeftPoint.y + " line1R:" + line1R);

        var line3LeftPoint = this.getLine3LeftControllerPoint(midMovePointY, deg, c, 1);

        var line3RightPoint = this.getLine1RightControllerPoint(line3LeftPoint, midMovePointY, 3);

        this.coordinatePath.streetLine1 = "M" + line1LeftPoint.x + "," + line1LeftPoint.y + " A" + line1R + "," + line1R + " 0 " + isBigCircle + " " + toward + " " + line1RightPoint.x + "," + line1RightPoint.y;
        this.coordinatePath.streetLine2 = "";
        this.coordinatePath.streetLine3 = "";
        this.coordinatePath.bottomleftPointPath = "";
        this.coordinatePath.bottomrightPointPath = "";

        this.horizontalRoadParam.maskLayerPaths.path1 = "M0," + this.horizontalRoadParam.height / 2 + " A" + r + "," + r + " 0 " + isBigCircle + " " + toward + " " + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height / 2;

        this.coordinatePath.midmidBigPointPath = { x: this.horizontalRoadParam.width / 2, y: movePointY };
        this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);

 
        var x = this.horizontalRoadParam.width / 2;
        var y = movePointY / 2 + this.commonParam.square.height * 2;

        var totateDeg = - Math.atan(x / y) * 180 / Math.PI;
        this.coordinatePath.midrightPoint.width = this.coordinatePath.midrightPoint.height = 0;
        this.coordinatePath.midleftPoint.width = this.coordinatePath.midleftPoint.height = 0;

        this.coordinatePath.midrightPoint.transform = "rotate(" + totateDeg + "," + (this.horizontalRoadParam.width + this.commonParam.square.width * 2) + "," + (this.horizontalRoadParam.height / 2 + this.commonParam.square.height) + ")";
    }

    moveToDrawLine1RightRamp(movePointX) {
        var fixHeight = this.horizontalRoadParam.height;
        var fixWidth = this.horizontalRoadParam.width;
        var lx = fixWidth / 2 + this.horizontalRoadParam.rightY * this.horizontalRoadParam.fixedWidthRatio + movePointX;
        if (lx < 0) lx = 0;
        var lPoint = { x: lx, y: 0 };
        var c3X = lPoint.x + (-this.horizontalRoadParam.rightY) * this.horizontalRoadParam.fixedHeightRatio;
        if (c3X > this.horizontalRoadParam.width) c3X = this.horizontalRoadParam.width;
        var cPoint3 = { x: c3X, y: this.horizontalRoadParam.Line1RightCPoint3.y };
        var cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: 0 };
        var cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: this.horizontalRoadParam.rightY };

        this.coordinatePath.streetLine1RightRampPath = "M0,0 L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.rightY;
        this.coordinatePath.line1RightRampTrianglePath = this.getTriangle({ x: (cPoint1.x + 3 + (cPoint2.x - cPoint1.x) / 2), y: (this.horizontalRoadParam.rightY / 2 + 3) }, "right");
        this.coordinatePath.streetLine1 = "M0,0 L" + lPoint.x + ",0 M" + cPoint3.x + ",0 L" + this.horizontalRoadParam.width + ",0";
    }

    moveToDrawVerticalRoad() {
        var movePointX = this.props.point.x - this.lastRoadPoint.x - roadObject.height / 2;// X mouse moving distance
        var movePointY = this.props.point.y - this.lastRoadPoint.y;
        this.verticalRoadCoordinates.startPoint = { x: (roadObject.width / 2 - roadObject.height / 2 + movePointX), y: -roadObject.width / 2 + roadObject.height / 2 + movePointY };

        this.verticalRoadCoordinates.endPoint = { x: (roadObject.width / 2 - roadObject.height / 2 + movePointX), y: (roadObject.width / 2 + roadObject.height / 2 + movePointY) };
        
        var line1Intersection = { x: 0, y: 0 };
        var space = 40;
        if (this.verticalRoadCoordinates.startPoint.x < roadObject.width)
        {
            line1Intersection.x = this.verticalRoadCoordinates.startPoint.x;
            line1Intersection.y = 0;
        }

        this.verticalRoadParam.maskLayerPath1 = "";
        $("#paved2MaskLayer").addClass("display-none");
        $("#paved2Point").addClass("display-none");
        $("#mainpaved1").removeClass("display-none");
        $("#paved1MaskLayer").removeClass("display-none");
        $("#paved1Point").removeClass("display-none");


        this.verticalRoadParam.streetLine1 = "M" + this.verticalRoadCoordinates.startPoint.x + "," + this.verticalRoadCoordinates.startPoint.y + " L" + this.verticalRoadCoordinates.startPoint.x + "," + (line1Intersection.y - space) + " Q " + line1Intersection.x + "," + line1Intersection.y + " " + (line1Intersection.x - space) + ",0  M" + this.verticalRoadCoordinates.startPoint.x + "," + (line1Intersection.y + roadObject.height + space) + " Q " + line1Intersection.x + "," + (line1Intersection.y + roadObject.height) + " " + (line1Intersection.x - space) + "," + (line1Intersection.y + roadObject.height) + "  M" + this.verticalRoadCoordinates.startPoint.x  + "," + (line1Intersection.y + roadObject.height + space) + " L" + this.verticalRoadCoordinates.endPoint.x + "," + this.verticalRoadCoordinates.endPoint.y;

        this.verticalRoadParam.streetLine2 = "M" + (this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width / 2) + "," + this.verticalRoadCoordinates.startPoint.y + " L" + (this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width / 2) + "," + (line1Intersection.y - space) + " M" + (this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width / 2) + "," + (line1Intersection.y + roadObject.height + space) + " L" + (this.verticalRoadCoordinates.endPoint.x + verticalRoadObject.width /2 ) + "," + this.verticalRoadCoordinates.endPoint.y;
        ;
        var line3MQ2 = { x: this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width, y: line1Intersection.y + roadObject.height + space};
        var line3Q2_1 = { x: line1Intersection.x + verticalRoadObject.width, y: line1Intersection.y + roadObject.height };
        var line3Q2_2 = { x: line1Intersection.x + verticalRoadObject.width + space, y: line1Intersection.y + roadObject.height };

        this.verticalRoadParam.streetLine3 = "M" + (this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width) + "," + this.verticalRoadCoordinates.startPoint.y + " L" + (this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width) + "," + (line1Intersection.y - space) + " Q " + (line1Intersection.x + verticalRoadObject.width) + "," + line1Intersection.y + " " + (line1Intersection.x + verticalRoadObject.width + space) + ",0  M" + line3MQ2.x + "," + line3MQ2.y + " Q " + line3Q2_1.x + "," + line3Q2_1.y + " " + line3Q2_2.x + "," + line3Q2_2.y + "  M" + (this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width) + "," + (line1Intersection.y + roadObject.height + space) + " L" + (this.verticalRoadCoordinates.endPoint.x + verticalRoadObject.width) + "," + this.verticalRoadCoordinates.endPoint.y;

        this.coordinatePath.streetLine1 = "M0,0 L" + (line1Intersection.x - space) + ",0 M" + (line1Intersection.x + verticalRoadObject.width + space) + ",0 L" + roadObject.width + ",0";

        this.coordinatePath.streetLine2 = "M0," + roadObject.height / 2 + " L" + (line1Intersection.x - space) + "," + roadObject.height / 2 + " M" + (line1Intersection.x + verticalRoadObject.width + space) + "," + roadObject.height / 2 + " L" + roadObject.width + "," + roadObject.height / 2;

        this.coordinatePath.streetLine3 = "M0," + roadObject.height + " L" + (line1Intersection.x - space) + "," + roadObject.height + " M" + (line1Intersection.x + verticalRoadObject.width + space) + "," + roadObject.height + " L" + roadObject.width + "," + roadObject.height;

        this.verticalRoadParam.line3Point2M1 = { x: line3MQ2.x - this.commonParam.square.width / 2, y: line3MQ2.y - this.commonParam.square.height};
        this.verticalRoadParam.line3Point2M2 = { x: line3Q2_2.x - this.commonParam.square.width, y: line3Q2_2.y - this.commonParam.square.height / 2 };
        this.verticalRoadParam.line3Point2M3 = { x: line3MQ2.x + (line3Q2_2.x - line3MQ2.x) / 2 - this.commonParam.square.width / 2, y: line3Q2_2.y + (line3MQ2.y - line3Q2_2.y) / 2 - this.commonParam.square.height };

        this.verticalRoadParam.line3Point2LPath = "M" + (this.verticalRoadParam.line3Point2M1.x + this.commonParam.square.width) + "," + this.verticalRoadParam.line3Point2M1.y + " L" + (this.verticalRoadParam.line3Point2M3.x) + "," + (this.verticalRoadParam.line3Point2M3.y + this.commonParam.square.height) + " M" + (this.verticalRoadParam.line3Point2M3.x + this.commonParam.square.width) + "," + this.verticalRoadParam.line3Point2M3.y + " L" + (this.verticalRoadParam.line3Point2M2.x) + "," + (this.verticalRoadParam.line3Point2M2.y + this.commonParam.square.height);

       
        this.verticalRoadParam.line3Point2QPath = "M" + line3MQ2.x + ", " + line3MQ2.y + " Q " + line3Q2_1.x + ", " + line3Q2_1.y + " " + line3Q2_2.x + ", " + line3Q2_2.y;
 
        this.verticalRoadParam.maskLayerPath1 = "M" + (this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width / 2) + "," + this.verticalRoadCoordinates.startPoint.y + " L" + (this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width / 2) + "," + this.verticalRoadCoordinates.endPoint.y;

        this.verticalRoadParam.line1Point1Path = this.getTriangle({ x: this.verticalRoadCoordinates.startPoint.x, y: this.verticalRoadCoordinates.startPoint.y + this.commonParam.triangle.width }, "left");
        this.verticalRoadParam.line1Point2Path = this.getTriangle(this.verticalRoadCoordinates.endPoint, "left");
        this.verticalRoadParam.line3Point1Path = this.getTriangle({ x: this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width, y: this.verticalRoadCoordinates.startPoint.y + this.commonParam.triangle.width }, "right");
        this.verticalRoadParam.line3Point2Path = this.getTriangle({ x: this.verticalRoadCoordinates.endPoint.x + this.verticalRoadParam.width, y: this.verticalRoadCoordinates.endPoint.y }, "right");

        this.verticalRoadParam.line2Point1Path = this.getRhombi({ x: this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width / 2, y: this.horizontalRoadParam.height / 2 - this.commonParam.rhombi.halfHeight });

        this.verticalRoadParam.line2Point1 = { x: this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width / 2 - this.commonParam.square.width /2, y: this.verticalRoadCoordinates.startPoint.y - this.commonParam.square.height * 2, transform: "" };
        this.verticalRoadParam.line2Point2 = { x: this.verticalRoadCoordinates.endPoint.x + verticalRoadObject.width / 2 - this.commonParam.square.width / 2, y: this.verticalRoadCoordinates.endPoint.y + this.commonParam.square.height * 2, transform:"" };
    }

    moveToLine3Point2M3() {
    
        var movePointX = this.props.point.x - this.lastRoadPoint.x - roadObject.height / 2;// X mouse moving distance
        var movePointY = this.props.point.y - this.lastRoadPoint.y;
        var line1Intersection = { x: 0, y: 0 };
     
        var line3MQ1XSpace = this.verticalRoadCoordinates.line3Point2.MQ1XSpace + movePointX;
        var line3MQ1YSpace = this.verticalRoadCoordinates.line3Point2.MQ1YSpace + movePointX;
        if (line3MQ1YSpace < 0) line3MQ1YSpace = 0;
        if (line3MQ1XSpace < 0) line3MQ1XSpace = 0;
        var moveDistance = line3MQ1YSpace > line3MQ1XSpace ? line3MQ1XSpace : line3MQ1YSpace;
        var vWidth = this.verticalRoadCoordinates.endPoint.y - (line1Intersection.y + roadObject.height);
        var hWidth = this.verticalRoadParam.width - line1Intersection.x;
        var maxDistance = vWidth > hWidth ? hWidth : vWidth;
        if (moveDistance > maxDistance) moveDistance = maxDistance;

        this.verticalRoadCoordinates.line3Point2.MQ1XSpace = moveDistance;
        this.verticalRoadCoordinates.line3Point2.MQ1YSpace = moveDistance;

        if (this.verticalRoadCoordinates.startPoint.x < roadObject.width) {
            line1Intersection.x = this.verticalRoadCoordinates.startPoint.x;
            line1Intersection.y = 0;
        }
        var line3MQ2 = { x: this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width, y: line1Intersection.y + roadObject.height + moveDistance };
        var line3Q2_1 = { x: line1Intersection.x + verticalRoadObject.width, y: line1Intersection.y + roadObject.height };
        var line3Q2_2 = { x: line1Intersection.x + verticalRoadObject.width + moveDistance, y: line1Intersection.y + roadObject.height };

        this.verticalRoadParam.line3Point2M1 = { x: line3MQ2.x - this.commonParam.square.width / 2, y: line3MQ2.y - this.commonParam.square.height };
        this.verticalRoadParam.line3Point2M2 = { x: line3Q2_2.x - this.commonParam.square.width, y: line3Q2_2.y - this.commonParam.square.height / 2 };
        this.verticalRoadParam.line3Point2M3 = { x: line3MQ2.x + moveDistance / 2 - this.commonParam.square.width / 2, y: line3Q2_2.y + (line3MQ2.y - line3Q2_2.y) / 2 };

        this.verticalRoadParam.streetLine3 = "M" + (this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width) + "," + this.verticalRoadCoordinates.startPoint.y + " L" + (this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width) + "," + (line1Intersection.y - this.commonParam.distance) + " Q " + (line1Intersection.x + verticalRoadObject.width) + "," + line1Intersection.y + " " + (line1Intersection.x + verticalRoadObject.width + this.commonParam.distance) + ",0  M" + line3MQ2.x + "," + line3MQ2.y + " Q " + line3Q2_1.x + "," + line3Q2_1.y + " " + line3Q2_2.x + "," + line3Q2_2.y + "  M" + (this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width) + "," + (line1Intersection.y + roadObject.height + moveDistance) + " L" + (this.verticalRoadCoordinates.endPoint.x + verticalRoadObject.width) + "," + this.verticalRoadCoordinates.endPoint.y;


        this.coordinatePath.streetLine3 = "M0," + roadObject.height + " L" + (line1Intersection.x - this.commonParam.distance) + "," + roadObject.height + " M" + (line1Intersection.x + verticalRoadObject.width + moveDistance) + "," + roadObject.height + " L" + roadObject.width + "," + roadObject.height;

        this.verticalRoadParam.line3Point2M1 = { x: line3MQ2.x - this.commonParam.square.width / 2, y: line3MQ2.y - this.commonParam.square.height };
        this.verticalRoadParam.line3Point2M2 = { x: line3Q2_2.x - this.commonParam.square.width, y: line3Q2_2.y - this.commonParam.square.height / 2 };
        this.verticalRoadParam.line3Point2M3 = { x: line3MQ2.x + (line3Q2_2.x - line3MQ2.x) / 2 - this.commonParam.square.width / 2, y: line3Q2_2.y + (line3MQ2.y - line3Q2_2.y) / 2 - this.commonParam.square.height };

        this.verticalRoadParam.line3Point2LPath = "M" + (this.verticalRoadParam.line3Point2M1.x + this.commonParam.square.width) + "," + this.verticalRoadParam.line3Point2M1.y + " L" + (this.verticalRoadParam.line3Point2M3.x) + "," + (this.verticalRoadParam.line3Point2M3.y + this.commonParam.square.height) + " M" + (this.verticalRoadParam.line3Point2M3.x + this.commonParam.square.width) + "," + this.verticalRoadParam.line3Point2M3.y + " L" + (this.verticalRoadParam.line3Point2M2.x) + "," + (this.verticalRoadParam.line3Point2M2.y + this.commonParam.square.height);
        this.verticalRoadParam.line3Point2QPath = "M" + line3MQ2.x + ", " + line3MQ2.y + " Q " + line3Q2_1.x + ", " + line3Q2_1.y + " " + line3Q2_2.x + ", " + line3Q2_2.y;

    }

    selectedPaved1 = (event) => {
       // this.verticalRoadParam.maskLayerPath1 = "M" + (roadObject.width / 2) + "," + (-roadObject.width / 2 + roadObject.height / 2) + " L" + (roadObject.width / 2) + "," + (roadObject.width / 2 + roadObject.height / 2);
    }

    //-------------DRAWING WHEN MOVING DEFINE END--------------

    //-------------GET POINTS OR PATHS DEFINE------------------
    getTriangle(point, toward) {
        var width = 0;
        var height = 0;
        if (toward == "up") {
            width = this.commonParam.triangle.halfWidth;
            height = this.commonParam.triangle.height;
        } else if (toward == "down") {
            width = this.commonParam.triangle.halfWidth;
            height = this.commonParam.triangle.height * -1;
        }
        else if (toward == "right") {
            width = this.commonParam.triangle.halfWidth;
            height = this.commonParam.triangle.height * -1;

            return "M " + point.x + " " + point.y + " L " + point.x + " " + (point.y + height) + " L " + (point.x + this.commonParam.triangle.width) + " " + (point.y + this.commonParam.triangle.halfHeight * -1) + " L " + point.x + " " + point.y;
        }
        else if (toward == "left") {
            width = this.commonParam.triangle.halfWidth;
            height = this.commonParam.triangle.height * -1;

            return "M " + point.x + " " + point.y + " L " + point.x + " " + (point.y + height) + " L " + (point.x - this.commonParam.triangle.width) + " " + (point.y + this.commonParam.triangle.halfHeight * -1) + " L " + point.x + " " + point.y;
        }
        return "M " + point.x + " " + point.y + " L " + (point.x + width) + " " + (point.y - height) + " L " + (point.x + this.commonParam.triangle.width) + " " + point.y + " L " + point.x + " " + point.y;
    }

    getRhombi(point) {
        return "M " + point.x + " " + point.y + " L " + (point.x - 7) + " " + (point.y + 7) + " L " + point.x + " " + (point.y + 13) + " L " + (point.x + 6) + " " + (point.y + 7) + " L " + point.x + " " + point.y;
    }

    getLine2Path() {
        return "M0," + this.horizontalRoadParam.height / 2 + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height / 2;
    }

    getLine1RightRampPath() {
        if (this.horizontalRoadParam.rightY != 0) {
            var lPoint = { x: this.horizontalRoadParam.width / 2 + this.horizontalRoadParam.rightY * this.horizontalRoadParam.fixedWidthRatio, y: 0 };
            var cPoint3 = { x: lPoint.x + (-this.horizontalRoadParam.rightY) * this.horizontalRoadParam.fixedHeightRatio, y: this.horizontalRoadParam.rightY };
            var cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: 0 };
            var cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: this.horizontalRoadParam.rightY };

            this.horizontalRoadParam.Line1RightLPoint1 = lPoint;
            this.horizontalRoadParam.Line1RightCPoint3 = cPoint3;

            this.coordinatePath.streetLine1RightRampPath = "M0,0  L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.rightY;
            this.coordinatePath.line1RightRampTrianglePath = this.getTriangle({
                x: (cPoint1.x + this.commonParam.triangle.halfWidth / 2 + (cPoint2.x - cPoint1.x) / 2), y: (this.horizontalRoadParam.rightY / 2 + this.commonParam.triangle.halfHeight / 2)
        }, "right");
        }
        else {
            this.coordinatePath.streetLine1RightRampPath = "";
        }
    }

    getLine1LeftControllerPoint(midMovePointY, deg, c, lineNumber) {
        var isBigCircle = Math.abs(midMovePointY) > this.horizontalRoadParam.width / 2 ? 1 : 0;
        var tempA = Math.cos(deg * Math.PI / 180) * (this.horizontalRoadParam.height / 2);
        var b = Math.abs(midMovePointY);
        var a = this.horizontalRoadParam.width / 2;
        var isInside = false;
        if (lineNumber == 1) {
            isInside = isBigCircle ? 0 : 1;
        } else if (lineNumber == 3) {
            isInside = isBigCircle ? 1 : 0;
        }
        var c1 = 0;
        if (isInside)
            c1 = c - 2 * tempA;
        else
            c1 = 2 * tempA + c;
        var a1 = Math.sin(deg * Math.PI / 180) * c1;
        var b1 = Math.cos(deg * Math.PI / 180) * c1;

        var x = isBigCircle ? a - a1 : a1 - a;
        var y = isBigCircle ? b1 - b : b - b1;

        return { x: midMovePointY > 0 ? Math.abs(a - a1) : x, y: y };
    }

    getLine1RightControllerPoint(line1LeftControllerPoint, midMovePointY, lineNumber) {
        var isBigCircle = Math.abs(midMovePointY) > this.horizontalRoadParam.width / 2 ? 1 : 0;
        var isInside = false;
        if (lineNumber == 1) {
            isInside = isBigCircle ? 0 : 1;
        } else if (lineNumber == 3) {
            isInside = isBigCircle ? 1 : 0;
        }
        return { x: this.horizontalRoadParam.width - line1LeftControllerPoint.x, y: line1LeftControllerPoint.y };
    }

    getLine3LeftControllerPoint(midMovePointY, deg, c, lineNumber) {
        var isBigCircle = Math.abs(midMovePointY) > this.horizontalRoadParam.width / 2 ? 1 : 0;
        var tempA = Math.cos(deg * Math.PI / 180) * (this.horizontalRoadParam.height / 2);
        var b = Math.abs(midMovePointY);
        var a = this.horizontalRoadParam.width / 2;
        var isInside = false;
        if (lineNumber == 1) {
            isInside = isBigCircle ? 0 : 1;
        } else if (lineNumber == 3) {
            isInside = isBigCircle ? 1 : 0;
        }
        var c1 = 0;
        if (isInside)
            c1 = c - 2 * tempA;
        else
            c1 = 2 * tempA + c;
        var a1 = Math.sin(deg * Math.PI / 180) * c1;
        var b1 = Math.cos(deg * Math.PI / 180) * c1;

        var x = isBigCircle ? a - a1 : a1 - a;
        var y = isBigCircle ? b1 - b : b - b1;

        return { x: midMovePointY < 0 ? Math.abs(a - a1) : x, y: y };
    }
    //-------------GET POINTS OR PATHS DEFINE END--------------

  
    render() {
        this.renderRoad();

       // $('#console').text("svgroot height:" + $("#svgroot").height() + ",body: width" + $('body').width() + ", height" + $('body').height());

        return (
            <g transform={this.coordinatePath.transform}  >
                <defs>
                    <marker id='markerArrow' markerWidth='13' markerHeight="13" refX="2" refY="6" orient="auto">
                        <path d="M2,2 L2,11 L10,6 L2,2" style={{ fill: 'lime' }} />
                    </marker>
                </defs>

                <g id="mainpaved1" onClick={this.selectedPaved1} className="display-none">
                    <g fill="#FFFFFF" fillOpacity="1.0" fillRule="evenodd" stroke="#000000" strokeWidth="1" strokeOpacity="1.0" strokeLinecap="round" strokeLinejoin="round" textAnchor="middle" fontWeight="normal">
                        <g strokeWidth="1" >
                            <g>
                                <path fill="none" d={this.verticalRoadParam.streetLine1}></path>
                            </g>

                            <g>
                                <path fill="none" d={this.verticalRoadParam.streetLine1}></path>
                            </g>
                            <g>
                               
                                <path fill="none" d={this.verticalRoadParam.streetLine2} strokeDasharray="20,20,20,20,10,20"  fill="none" ></path>
                            </g>
                            <g>
                                <path fill="none" d={this.verticalRoadParam.streetLine3}></path>
                            </g>
                        </g>
                        <g className="display-none">
                            <g fill="#FFFFFF" fillOpacity="0" strokeOpacity="0" strokeWidth="0">
                                <path d={this.pavedFillPath}></path>
                            </g>
                        </g>
                    </g>
                    <g id="paved1MaskLayer" stroke="lime" strokeWidth="2" strokeDasharray="12 7" strokeOpacity="1" fill="none">
                        <path d={this.verticalRoadParam.maskLayerPath1} strokeWidth={this.verticalRoadParam.maskLayerStrokeWidth} strokeOpacity="1" strokeLinecap="butt" strokeDasharray="none" stroke="#808080"></path>
                        <path d={this.verticalRoadParam.maskLayerPath1}></path>
                        <path d={this.verticalRoadParam.maskLayerPath1} fill="none" strokeLinecap="butt"></path>
                    </g>
                </g>
              
                <g id="paved1Point" className="display-none">
                    <g stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime">
                        <path d={this.verticalRoadParam.line2Point1Path} cursor="crosshair"></path>
                    </g>
                    {/*
                    <g stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime"  >
                        <path d={this.verticalRoadParam.line1Point1Path} cursor="crosshair" ></path>
                    </g>
                   <g  stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" >
                        <path d={this.verticalRoadParam.line1Point2Path} cursor="crosshair" ></path>
                    </g>
                   

                    <g  stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime">
                        <rect x={this.verticalRoadParam.line2Point1.x} y={this.verticalRoadParam.line2Point1.y} width={this.commonParam.square.width} height={this.commonParam.square.height} cursor="crosshair"></rect>
                    </g>
                   
                 
                    <g  stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime">
                        <rect x={this.verticalRoadParam.line2Point2.x} y={this.verticalRoadParam.line2Point2.y} transform={this.verticalRoadParam.line2Point2.transform} width={this.commonParam.square.width} height={this.commonParam.square.height} cursor="crosshair" ></rect>
                    </g>
                   
                    <g  stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime">
                        <path d={this.verticalRoadParam.line3Point1Path} cursor="crosshair"></path>
                    </g>
                    <g stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime">
                        <path d={this.verticalRoadParam.line3Point2Path} cursor="crosshair" ></path>
                    </g>
                    */}
                    <g stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime">
                        <rect x={this.verticalRoadParam.line3Point2M1.x} y={this.verticalRoadParam.line3Point2M1.y} width={this.commonParam.square.width} height={this.commonParam.square.height} cursor="crosshair" onMouseDown={this.readyline3Point2M1Move}></rect>
                        <rect x={this.verticalRoadParam.line3Point2M2.x} y={this.verticalRoadParam.line3Point2M2.y} width={this.commonParam.square.width} height={this.commonParam.square.height} cursor="crosshair" onMouseDown={this.readyline3Point2M2Move}></rect>
                        <rect x={this.verticalRoadParam.line3Point2M3.x} y={this.verticalRoadParam.line3Point2M3.y} width={this.commonParam.square.width} height={this.commonParam.square.height} cursor="crosshair" onMouseDown={this.readyline3Point2M3Move}></rect>
                        <path d={this.verticalRoadParam.line3Point2LPath} strokeDasharray="3,3" fill="lime" strokeLinecap="butt"></path>

                        <path d={this.verticalRoadParam.line3Point2QPath} strokeDasharray="3,3" fill="none" stroke="lime" strokeLinecap="butt"></path>
                    </g>
                   
                </g>
                
                <g id="mainpaved2" onMouseDown={this.readyMoveRoad} onTouchStart={this.readyMoveRoad} >
                    <g fill="#FFFFFF" fillOpacity="1.0" fillRule="evenodd" stroke="#000000" strokeWidth="1" strokeOpacity="1.0" strokeLinecap="round" strokeLinejoin="round" textAnchor="middle" fontWeight="normal">
                        <g strokeWidth="2" >
                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine1RightRampPath}></path>
                            </g>

                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine1}></path>
                            </g>
                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine2} strokeDasharray="20,20,20,20,10,20"  strokeLinecap="butt"></path>
                            </g>
                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine3}></path>
                            </g>
                        </g>
                        <g>
                            <g fill="#FFFFFF" fillOpacity="0" strokeOpacity="0" strokeWidth="0">
                                <path d={this.pavedFillPath}></path>
                            </g>
                        </g>
                    </g>
                    <g id="paved2MaskLayer" stroke="lime" strokeWidth="2" strokeDasharray="20,20,20,20,10,20" strokeOpacity="1" fill="none">
                        <path d={this.horizontalRoadParam.maskLayerPaths.path1} strokeWidth={this.horizontalRoadParam.height} strokeOpacity="1" strokeLinecap="butt" strokeDasharray="none" stroke="#808080"></path>
                        <path d={this.horizontalRoadParam.maskLayerPaths.path1}></path>
                        <path d={this.horizontalRoadParam.maskLayerPaths.path1} fill="none" strokeLinecap="butt"></path>
                    </g>


                </g>
                <g id="paved2Point">
                    <g fill="#0000FF" strokeOpacity="0" strokeWidth="0" transform={this.coordinatePath.textRoate} fontSize="13" className="userSelect">
                        <g stroke="blue" strokeWidth="1" strokeOpacity="1">
                            <path d={this.coordinatePath.textLine} ></path>
                        </g>
                        <text x={this.horizontalRoadParam.rightText.x} y="-10" textAnchor="middle" textLength={this.horizontalRoadParam.rightText.textLength}>{this.horizontalRoadParam.rightText.text}</text>
                    </g>
                    <g id="topleft-arrow" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime"  >
                        <path d={this.coordinatePath.topleftPointPath} cursor="crosshair" ></path>
                    </g>
                    <g id="topright-arrow" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onTouchStart={this.readyMoveLine1Right} onMouseDown={this.readyMoveLine1Right}>
                        <path d={this.coordinatePath.topRightPointPath} cursor="crosshair" ></path>
                    </g>
                    <g id="midleft" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onTouchStart={this.readyLine2LeftMove} onMouseDown={this.readyLine2LeftMove}>
                        <rect x={this.coordinatePath.midleftPoint.x} y={this.coordinatePath.midleftPoint.y} width={this.coordinatePath.midrightPoint.width} height={this.coordinatePath.midrightPoint.height} cursor="crosshair"></rect>
                    </g>
                    <g id="midmid" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onMouseDown={this.readyLine2MidMove} onTouchStart={this.readyLine2MidMove}>
                        <path d={this.coordinatePath.midmidPointPath} cursor="crosshair"></path>
                    </g>
                    <g id="midright" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onTouchStart={this.readyLine2RightMove} onMouseDown={this.readyLine2RightMove}>
                        <rect x={this.coordinatePath.midrightPoint.x} y={this.coordinatePath.midrightPoint.y} transform={this.coordinatePath.midrightPoint.transform} width={this.coordinatePath.midrightPoint.width} height={this.coordinatePath.midrightPoint.height} cursor="crosshair" ></rect>
                    </g>
                    <g id="bottomleft-arrow" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime">
                        <path d={this.coordinatePath.bottomleftPointPath} cursor="crosshair"></path>
                    </g>
                    <g id="bottomright-arrow" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime">
                        <path d={this.coordinatePath.bottomrightPointPath} cursor="crosshair" ></path>
                    </g>
                    <g stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onTouchStart={this.readyLine1RightRampMove}  onMouseDown={this.readyLine1RightRampMove}>
                        <path d={this.coordinatePath.line1RightRampTrianglePath} cursor="crosshair" ></path>
                    </g>
                </g>
            </g>
        );
    }
}

ReactDOM.render(
    <MainPanel />,
    document.getElementById('main')
);
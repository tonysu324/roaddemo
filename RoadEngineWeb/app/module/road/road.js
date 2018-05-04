
'use strict';

var roadObject = {
    width: 280,
    height: 100
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
            return <Road point={this.state.point} movingType={this.movingType} tellParentRoadhaveBeenClicked={() => this.onRoadClicked()} tellParentLine1RighthaveBeenClicked={() => this.onLine1RightControllerPointClicked()} tellParentTopMidHaveBeenClicked={() => this.onTopMidContollerPointClicked()} tellParentLine2RightHaveBeenClicked={() => this.onLine2RightContollerPointClicked()} tellParentLine2LeftHaveBeenClicked={() => this.onLine2LeftContollerPointClicked()} tellParentLine2MidHaveBeenClicked={() => this.onLine2MidContollerPointClicked()} />;
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

    addRoad(event) {
        this.setState({ renderRoad: true, point: { x: event.clientX - 200, y: event.clientY } });
    }

    startMove = (event) => {
        if (this.state.renderRoad && this.movingType != '') {
            this.setState({ point: { x: event.clientX - 200, y: event.clientY } });
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
                                <div className="symbol-item form-group" draggable="true" id="paved1" className="cursor-pointer" onDragEnd={this.addRoad}>
                                    <div alt="Paved 1" className="symbol-item-svg fl">
                                        <object type="image/svg+xml" width="20" height="26" data="../svg/Paved_1.svg" style={{ marginTop: 5 }}></object>
                                    </div>
                                    <div className="symbol-item-text fl">Paved 1</div>
                                </div>
                            </div>
                        </div>

                        <div className="nav" title="Drag and drop the Paved 2 tool on the drawing to add a horizontal street.">
                            <div>
                                <div className="symbol-item form-group" draggable="true" id="paved2" className="cursor-pointer" onDragEnd={this.addRoad}>
                                    <div className="symbol-item-svg fl" alt="Paved 2">
                                        <object type="image/svg+xml" width="40" data="../svg/Paved_2.svg"></object>
                                    </div>
                                    <div className="symbol-item-text fl">Paved 2</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* The right main drawing panel */}
                <div id="mainContent" className="drawing-panel">
                    <svg id="svgroot" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" overflow="hidden" height="100%" width="100%" onMouseMove={this.startMove} onMouseUp={this.stopMove}>

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

        this.object = {
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
            streetLine1: "M0,0 L280,0",
            streetLine2: this.getLine2Path(),
            streetLine3: "M0,100 L280,100",
            streetLine1RightRampPath: "",
            pavedFillPath: "M0,0 L" + this.object.width + ",0 L" + this.object.width + "," + this.object.height + " L0," + this.object.height,
            rotate: ""
        };

        this.lastRoadPoint = {
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
            this.coordinatePath.roadMatrix = "matrix(1 0 0 1 " + (this.props.point.x - this.object.width / 2) + " " + (this.props.point.y - this.object.height / 2) + ")";
            this.coordinatePath.roadPoint = { x: (this.props.point.x - this.object.width / 2), y: (this.props.point.y - this.object.height / 2) };
            this.coordinatePath.transform = "translate(" + this.coordinatePath.roadPoint.x + "," + this.coordinatePath.roadPoint.y + ")";
        }

        this.coordinatePath.topleftPointPath = this.getTriangle({ x: 0, y: 0 }, "up");

        if (!this.rememberLine1Right) {
            this.coordinatePath.topRightPointPath = this.getTriangle({ x: this.object.width - this.object.triangle.width, y: 0 }, "up");
        }

        this.coordinatePath.bottomleftPointPath = this.getTriangle({ x: 0, y: this.object.height }, "down");
        this.coordinatePath.bottomrightPointPath = this.getTriangle({ x: this.object.width - this.object.triangle.width, y: this.object.height }, "down");
        this.coordinatePath.midleftPoint = { x: -30, y: this.object.centrePoint.y - this.object.rhombi.halfHeight, width: 10, height: 10 };
        this.coordinatePath.midrightPoint = { x: this.object.width + 20, y: this.object.centrePoint.y - this.object.rhombi.halfHeight, transform: "", width: 10, height: 10 };

        this.coordinatePath.midmidPointPath = this.getRhombi({ x: this.object.width / 2 - this.object.rhombi.halfHeight, y: this.object.height / 2 - this.object.rhombi.halfHeight });


    }

    //draw all line,symbol,text path of this road component
    drawRoadPaths() {

        var movePointY = - (this.lastRoadPoint.y - this.props.point.y - this.object.height / 2);// Y mouse moving distance
        var movePointX = (this.props.point.x - this.lastRoadPoint.x);// X mouse moving distance

        var maxY = 0;
        var minY = -this.object.height;// restrict move min, max height
        if (movePointY > maxY) movePointY = maxY;
        if (movePointY < minY) movePointY = minY;

        var minX = -40;
        var maxX = this.object.width / 4;// restrict move min, max width
        if (movePointX > maxX) movePointX = maxX;
        if (movePointX < minX) movePointX = minX;

        var fixHeight = this.object.height;
        var fixWidth = this.object.width;
        if (this.props.movingType == 'Line1Right') {
            this.rememberLine1Right = true;
            this.object.rightY = movePointY;

            var lPoint = { x: fixWidth / 2 + movePointY * this.object.fixedWidthRatio, y: 0 };
            var cPoint3 = { x: lPoint.x + (-movePointY) * this.object.fixedHeightRatio, y: movePointY };
            var cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: 0 };
            var cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: movePointY };
            this.object.Line1RightLPoint1 = lPoint;
            this.object.Line1RightCPoint3 = cPoint3;

            this.coordinatePath.streetLine1RightRampPath = "M0,0  L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.object.width + "," + movePointY;
            this.object.rightY = movePointY;

            if (movePointY != 0) {
                this.coordinatePath.line1RightRampTrianglePath = this.getTriangle({ x: (cPoint1.x + 3 + (cPoint2.x - cPoint1.x) / 2), y: (movePointY / 2 + 3) }, "right");
            } else {
                this.coordinatePath.line1RightRampTrianglePath = "";
            }
            this.coordinatePath.streetLine1 = "M0,0 L" + lPoint.x + ",0 M" + cPoint3.x + ",0 L" + this.object.width + ",0";

            this.coordinatePath.topRightPointPath = this.getTriangle({ x: this.object.width - this.object.triangle.width, y: movePointY }, "up");
            this.coordinatePath.midmidPointPath = this.getRhombi({ x: this.object.width / 2 - this.object.rhombi.halfHeight, y: this.object.height / 2 - this.object.rhombi.halfHeight });

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
    }

    //draw line 1 right text
    drawLine1RightText() {
        var text = (this.object.rightY * -1) / 4 + "";
        if (text.length > 4) text = text.substring(0, text.indexOf("."));
        this.object.rightText.text = text + "'";

        var y = (this.object.rightY * -1);
        this.object.rightText.textLength = this.object.rightText.text.length * 8;

        this.object.rightText.x = this.object.width - (y / 2 + this.object.rightText.textLength / 2) + 15;
        if (this.object.rightText.textLength > y || y < 25) {
            this.object.rightText.text = "";
            this.coordinatePath.textLine = "";
        }
        else {
            var textLineHeight = -30;
            var space = 6;
            this.coordinatePath.textLine = "M" + (this.object.width - y) + " ," + textLineHeight + " L" + this.object.width + " ," + textLineHeight + " M" + (this.object.width - space) + " " + (textLineHeight - space) + ",L " + this.object.width + " " + textLineHeight + " M " + this.object.width + "," + textLineHeight + " L " + (this.object.width - space) + " " + (textLineHeight + space) + " M" + (this.object.width - y + space) + " " + (textLineHeight - space) + ",L " + (this.object.width - y) + " " + textLineHeight + " M " + (this.object.width - y) + "," + textLineHeight + " L " + (this.object.width - y + space) + " " + (textLineHeight + space);

            this.coordinatePath.textRoate = "rotate(90, " + (this.object.width - 20) + ", -20)";
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
    //-------------READY MOVE EVENTS DEFINE END----------------

    //-------------DRAWING WHEN MOVING DEFINE------------------
    moveToDrawByLine2RightRect() {
        var movePointX = this.props.point.x - this.lastRoadPoint.x - roadObject.width / 2;// X mouse moving distance
        var movePointY = this.props.point.y - this.lastRoadPoint.y;
        this.object.width = roadObject.width + movePointX;

        this.coordinatePath.streetLine1 = "M0,0 L" + this.object.width + ",0 ";
        this.coordinatePath.streetLine2 = this.getLine2Path();
        this.coordinatePath.streetLine3 = "M0," + this.object.height + " L" + this.object.width + "," + this.object.height + "";

        this.object.maskLayerPaths.path1 = "M0," + this.object.height / 2 + " L" + this.object.width + "," + this.object.height / 2;

        this.coordinatePath.midmidPointPath = this.getRhombi({ x: this.object.width / 2 - this.object.rhombi.halfHeight, y: this.object.height / 2 - this.object.rhombi.halfHeight });

        this.getLine1RightRampPath();

        this.coordinatePath.topRightPointPath = this.getTriangle({ x: this.object.width - this.object.triangle.width, y: this.object.rightY }, "up");
        this.drawLine1RightText();

        if (movePointY != 0) {
            var x = this.props.point.x;
            var y = this.props.point.y;
            var a = y - this.coordinatePath.roadPoint.y - this.object.height / 2;
            var b = x - this.coordinatePath.roadPoint.x;
            var deg = Math.atan(a / b) * 180 / Math.PI;

            this.coordinatePath.transform = "translate(" + this.coordinatePath.roadPoint.x + "," + this.coordinatePath.roadPoint.y + ") rotate(" + deg + ", 0," + this.object.height / 2 + ")";
        }
    }

    moveToDrawByLine2LeftRect() {
        var movePointX = this.lastRoadPoint.x - this.props.point.x - roadObject.width / 2;// X mouse moving distance
        var movePointY = (this.props.point.y - this.lastRoadPoint.y);
        this.object.width = roadObject.width + movePointX;

        this.coordinatePath.streetLine1 = "M0,0 L" + this.object.width + ",0 ";
        this.coordinatePath.streetLine2 = this.getLine2Path();
        this.coordinatePath.streetLine3 = "M0," + this.object.height + " L" + this.object.width + "," + this.object.height + "";

        this.object.maskLayerPaths.path1 = "M0," + this.object.height / 2 + " L" + this.object.width + "," + this.object.height / 2;

        this.coordinatePath.midmidPointPath = this.getRhombi({ x: this.object.width / 2 - this.object.rhombi.halfHeight, y: this.object.height / 2 - this.object.rhombi.halfHeight });

        this.getLine1RightRampPath();

        this.coordinatePath.topRightPointPath = this.getTriangle({ x: this.object.width - this.object.triangle.width, y: this.object.rightY }, "up");
        this.drawLine1RightText();

        var x = this.props.point.x;
        var y = this.props.point.y;
        var a = y - this.coordinatePath.roadPoint.y - this.object.height / 2;
        var b = this.coordinatePath.roadPoint.x + this.object.width - x;
        var deg = - Math.atan(a / b) * 180 / Math.PI;

        this.coordinatePath.roadPoint.x = this.props.point.x;
        this.coordinatePath.transform = "translate(" + (this.props.point.x) + "," + this.coordinatePath.roadPoint.y + ") rotate(" + deg + ", " + this.object.width + "," + this.object.height / 2 + ")";
    }

    moveToDrawLine2MidControllerPoint() {
        var movePointX = Math.abs(this.lastRoadPoint.x - this.props.point.x - roadObject.width / 2);// X mouse moving distance
        var movePointY = (this.props.point.y - this.coordinatePath.roadPoint.y);
        var midMovePointY = movePointY - this.object.height / 2;
        var toward = midMovePointY > 0 ? 0 : 1;
        var c = Math.sqrt(Math.pow(this.object.width / 2, 2) + Math.pow(midMovePointY, 2));

        var tempB = c / 2;
        var deg = 90 - Math.atan(Math.abs(midMovePointY) / (this.object.width / 2)) * 180 / Math.PI;

        var cosvalue = Math.cos(deg * Math.PI / 180);
        var r = tempB / cosvalue;

        var isInside = midMovePointY > 0 ? true : false;
        var line1R = isInside ? (r - this.object.height / 2) : (r + this.object.height / 2);
        var line3R = isInside ? (r + this.object.height / 2) : (r - this.object.height / 2);

        var isBigCircle = Math.abs(midMovePointY) > this.object.width / 2 ? 1 : 0;

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

        this.object.maskLayerPaths.path1 = "M0," + this.object.height / 2 + " A" + r + "," + r + " 0 " + isBigCircle + " " + toward + " " + this.object.width + "," + this.object.height / 2;

        this.coordinatePath.midmidPointPath = this.getRhombi({ x: this.object.width / 2, y: movePointY });

        var x = this.object.width / 2;
        var y = movePointY / 2 + 20;

        var totateDeg = - Math.atan(x / y) * 180 / Math.PI;
        this.coordinatePath.midrightPoint.width = this.coordinatePath.midrightPoint.height = 0;
        this.coordinatePath.midleftPoint.width = this.coordinatePath.midleftPoint.height = 0;

        this.coordinatePath.midrightPoint.transform = "rotate(" + totateDeg + "," + (this.object.width + 20) + "," + (this.object.height / 2 + 10) + ")";
    }

    moveToDrawLine1RightRamp(movePointX) {
        var fixHeight = this.object.height;
        var fixWidth = this.object.width;
        var lx = fixWidth / 2 + this.object.rightY * this.object.fixedWidthRatio + movePointX;
        if (lx < 0) lx = 0;
        var lPoint = { x: lx, y: 0 };
        var c3X = lPoint.x + (-this.object.rightY) * this.object.fixedHeightRatio;
        if (c3X > this.object.width) c3X = this.object.width;
        var cPoint3 = { x: c3X, y: this.object.Line1RightCPoint3.y };
        var cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: 0 };
        var cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: this.object.rightY };

        this.coordinatePath.streetLine1RightRampPath = "M0,0 L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.object.width + "," + this.object.rightY;
        this.coordinatePath.line1RightRampTrianglePath = this.getTriangle({ x: (cPoint1.x + 3 + (cPoint2.x - cPoint1.x) / 2), y: (this.object.rightY / 2 + 3) }, "right");
        this.coordinatePath.streetLine1 = "M0,0 L" + lPoint.x + ",0 M" + cPoint3.x + ",0 L" + this.object.width + ",0";
    }
    //-------------DRAWING WHEN MOVING DEFINE END--------------

    //-------------GET POINTS OR PATHS DEFINE------------------
    getTriangle(point, toward) {
        var width = 0;
        var height = 0;
        if (toward == "up") {
            width = this.object.triangle.halfWidth;
            height = this.object.triangle.height;
        } else if (toward == "down") {
            width = this.object.triangle.halfWidth;
            height = this.object.triangle.height * -1;
        }
        else if (toward == "right") {
            width = this.object.triangle.halfWidth;
            height = this.object.triangle.height * -1;

            return "M " + point.x + " " + point.y + " L " + point.x + " " + (point.y + height) + " L " + (point.x + this.object.triangle.width) + " " + (point.y + this.object.triangle.halfHeight * -1) + " L " + point.x + " " + point.y;
        }
        return "M " + point.x + " " + point.y + " L " + (point.x + width) + " " + (point.y - height) + " L " + (point.x + this.object.triangle.width) + " " + point.y + " L " + point.x + " " + point.y;
    }

    getRhombi(point) {
        return "M " + point.x + " " + point.y + " L " + (point.x - 7) + " " + (point.y + 7) + " L " + point.x + " " + (point.y + 13) + " L " + (point.x + 6) + " " + (point.y + 7) + " L " + point.x + " " + point.y;
    }

    getLine2Path() {
        return "M0," + this.object.height / 2 + " L" + this.object.width + "," + this.object.height / 2;
    }

    getLine1RightRampPath() {
        if (this.object.rightY != 0) {
            var lPoint = { x: this.object.width / 2 + this.object.rightY * this.object.fixedWidthRatio, y: 0 };
            var cPoint3 = { x: lPoint.x + (-this.object.rightY) * this.object.fixedHeightRatio, y: this.object.rightY };
            var cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: 0 };
            var cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: this.object.rightY };

            this.object.Line1RightLPoint1 = lPoint;
            this.object.Line1RightCPoint3 = cPoint3;

            this.coordinatePath.streetLine1RightRampPath = "M0,0  L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.object.width + "," + this.object.rightY;
            this.coordinatePath.line1RightRampTrianglePath = this.getTriangle({ x: (cPoint1.x + 3 + (cPoint2.x - cPoint1.x) / 2), y: (this.object.rightY / 2 + 3) }, "right");
        }
        else {
            this.coordinatePath.streetLine1RightRampPath = "";
        }
    }

    getLine1LeftControllerPoint(midMovePointY, deg, c, lineNumber) {
        var isBigCircle = Math.abs(midMovePointY) > this.object.width / 2 ? 1 : 0;
        var tempA = Math.cos(deg * Math.PI / 180) * (this.object.height / 2);
        var b = Math.abs(midMovePointY);
        var a = this.object.width / 2;
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
        var isBigCircle = Math.abs(midMovePointY) > this.object.width / 2 ? 1 : 0;
        var isInside = false;
        if (lineNumber == 1) {
            isInside = isBigCircle ? 0 : 1;
        } else if (lineNumber == 3) {
            isInside = isBigCircle ? 1 : 0;
        }
        return { x: this.object.width - line1LeftControllerPoint.x, y: line1LeftControllerPoint.y };
    }

    getLine3LeftControllerPoint(midMovePointY, deg, c, lineNumber) {
        var isBigCircle = Math.abs(midMovePointY) > this.object.width / 2 ? 1 : 0;
        var tempA = Math.cos(deg * Math.PI / 180) * (this.object.height / 2);
        var b = Math.abs(midMovePointY);
        var a = this.object.width / 2;
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

        return (
            <g transform={this.coordinatePath.transform}  >
                <defs>
                    <marker id='markerArrow' markerWidth='13' markerHeight="13" refX="2" refY="6" orient="auto">
                        <path d="M2,2 L2,11 L10,6 L2,2" style={{ fill: 'lime' }} />
                    </marker>
                </defs>
                <g id="mainpaved2" onMouseDown={this.readyMoveRoad} >
                    <g fill="#FFFFFF" fillOpacity="1.0" fillRule="evenodd" stroke="#000000" strokeWidth="1" strokeOpacity="1.0" strokeLinecap="round" strokeLinejoin="round" textAnchor="middle" fontWeight="normal">
                        <g strokeWidth="2" >
                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine1RightRampPath}></path>
                            </g>

                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine1}></path>
                            </g>
                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine2} strokeLinecap="butt"></path>
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
                    <g stroke="lime" strokeWidth="2" strokeDasharray="12 7" strokeOpacity="1" fill="none">
                        <path d={this.object.maskLayerPaths.path1} strokeWidth={this.object.height} strokeOpacity="1" strokeLinecap="butt" strokeDasharray="none" stroke="#808080"></path>
                        <path d={this.object.maskLayerPaths.path1}></path>
                        <path d={this.object.maskLayerPaths.path1} fill="none" strokeLinecap="butt"></path>
                    </g>


                </g>
                <g>
                    <g fill="#0000FF" strokeOpacity="0" strokeWidth="0" transform={this.coordinatePath.textRoate} fontSize="13" className="userSelect">
                        <g stroke="blue" strokeWidth="1" strokeOpacity="1">
                            <path d={this.coordinatePath.textLine} ></path>
                        </g>
                        <text x={this.object.rightText.x} y="-10" textAnchor="middle" textLength={this.object.rightText.textLength}>{this.object.rightText.text}</text>
                    </g>
                    <g id="topleft-arrow" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime"  >
                        <path d={this.coordinatePath.topleftPointPath} cursor="crosshair" ></path>
                    </g>
                    <g id="topright-arrow" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onMouseDown={this.readyMoveLine1Right}>
                        <path d={this.coordinatePath.topRightPointPath} cursor="crosshair" ></path>
                    </g>
                    <g id="midleft" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onMouseDown={this.readyLine2LeftMove}>
                        <rect x={this.coordinatePath.midleftPoint.x} y={this.coordinatePath.midleftPoint.y} width={this.coordinatePath.midrightPoint.width} height={this.coordinatePath.midrightPoint.height} cursor="crosshair"></rect>
                    </g>
                    <g id="midmid" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onMouseDown={this.readyLine2MidMove}>
                        <path d={this.coordinatePath.midmidPointPath} cursor="crosshair"></path>
                    </g>
                    <g id="midright" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onMouseDown={this.readyLine2RightMove}>
                        <rect x={this.coordinatePath.midrightPoint.x} y={this.coordinatePath.midrightPoint.y} transform={this.coordinatePath.midrightPoint.transform} width={this.coordinatePath.midrightPoint.width} height={this.coordinatePath.midrightPoint.height} cursor="crosshair" ></rect>
                    </g>
                    <g id="bottomleft-arrow" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime">
                        <path d={this.coordinatePath.bottomleftPointPath} cursor="crosshair"></path>
                    </g>
                    <g id="bottomright-arrow" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime">
                        <path d={this.coordinatePath.bottomrightPointPath} cursor="crosshair" ></path>
                    </g>
                    <g stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onMouseDown={this.readyLine1RightRampMove}>
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

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
        this.newRoadCoordinate = { x: 0, y: 0 };
        this.oldRoadCoordinate = { x: 0, y: 0 };
        this.oldRoadMousePoint = { x: 0, y: 0 };
        this.movedDistance = { x: 0, y: 0 };
        this.isAddedRoad1 = false;
        this.state = { renderRoad: false, point: { x: 0, y: 0 } };

        //to make sure 'this' can be used in other funcitons, in ES6 this just can be used in constructor
        this.addRoad = this.addRoad.bind(this);
        this.renderRoad = this.renderRoad.bind(this);
    }

    renderRoad() {
        if (this.state.renderRoad) {
            return <Road point={this.state.point} movedDistance={this.movedDistance} coordinate={this.newRoadCoordinate} movingType={this.movingType} tellParentRoadhaveBeenClicked={(currentMousePoint, currentRoadCoordinate) => this.onRoadClicked(currentMousePoint, currentRoadCoordinate)} tellParentLine1RighthaveBeenClicked={(currentMousePoint, currentRoadCoordinate) => this.onLine1RightControllerPointClicked(currentMousePoint, currentRoadCoordinate)} tellParentTopMidHaveBeenClicked={() => this.onTopMidContollerPointClicked()} tellParentLine2RightHaveBeenClicked={() => this.onLine2RightContollerPointClicked()} tellParentLine2LeftHaveBeenClicked={() => this.onLine2LeftContollerPointClicked()} tellParentLine2MidHaveBeenClicked={(currentMousePoint, currentRoadCoordinate) => this.onLine2MidContollerPointClicked(currentMousePoint, currentRoadCoordinate)} tellParentline3Point2M3HaveBeenClicked={() => this.online3Point2M3HaveBeenClicked()} tellParentline3Point2M1HaveBeenClicked={() => this.online3Point2M1HaveBeenClicked()} tellParentline3Point2M2HaveBeenClicked={() => this.online3Point2M2HaveBeenClicked()} tellParentVerticalRoadHaveBeenClicked={() => this.onVerticalRoadHaveBeenClicked()} />;
        } else {
            return "";
        }
    }

    onRoadClicked(currentMousePoint, currentRoadCoordinate) {
        this.oldRoadMousePoint = currentMousePoint;
        this.oldRoadCoordinate = currentRoadCoordinate;
        this.movingType = 'Road';
    }

    onLine1RightControllerPointClicked(currentMousePoint, currentRoadCoordinate) {
        this.oldRoadMousePoint = currentMousePoint;
        this.oldRoadCoordinate = currentRoadCoordinate;
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

    onLine2MidContollerPointClicked(currentMousePoint, currentRoadCoordinate) {
        this.oldRoadMousePoint = currentMousePoint;
        this.oldRoadCoordinate = currentRoadCoordinate;
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

    onVerticalRoadHaveBeenClicked() {
        this.movingType = 'VerticalRoad';
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
        this.newRoadCoordinate = { x: e.clientX - leftWidth, y: e.clientY };
        this.isAddedRoad1 = true;
    }

    addVerticalRoad = (event) => {
        if (this.isAddedRoad1) {
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
        else {
            this.movingType = '';
            alert("Please drag paved 1 to canvas at first.");
            this.stopMove();
            return;
        }
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
            var currentMousePoint = { x: e.clientX - leftWidth, y: e.clientY };

            var mouseMovedX = currentMousePoint.x - this.oldRoadMousePoint.x;
            var mouseMovedY = currentMousePoint.y - this.oldRoadMousePoint.y;
            this.movedDistance = { x: mouseMovedX, y: mouseMovedY };
            this.newRoadCoordinate = { x: this.oldRoadCoordinate.x + mouseMovedX, y: this.oldRoadCoordinate.y + mouseMovedY };

            this.setState({ point: currentMousePoint });
        }
    }

    stopMove = (event) => {
        this.movingType = '';
        this.oldRoadCoordinate = this.newRoadCoordinate;
    }


    render() {
        return (

            <div id="editorPanel" className="editor-panel">

                {/* The left navigation component panel */}
                <div className="nav-panel">
                    <div style={{ margin: 7 }}>

                        <div className="nav" title="Drag and drop the Paved 1 tool on the drawing to add a horizontal street.">
                            <div>
                                <div className="symbol-item form-group" draggable="true" id="paved2" className="cursor-pointer" onTouchMove={this.addRoad} onDragEnd={this.addRoad}>
                                    <div className="symbol-item-svg fl" alt="Paved 1">
                                        <img src="../svg/Paved_2.png" />
                                    </div>
                                    <div className="symbol-item-text fl">&nbsp;Paved 1</div>
                                </div>

                            </div>
                        </div>

                        <div className="nav" title="Drag and drop the Paved 2 tool on the drawing to add a vertical street.">
                            <div>
                                <div className="symbol-item form-group" draggable="true" id="paved1" className="cursor-pointer" onTouchMove={this.addVerticalRoad} onDragEnd={this.addVerticalRoad}>
                                    <div alt="Paved 1" className="symbol-item-svg fl">
                                        <img src="../svg/Paved_1.png" />
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
            distance: 40,
            minShowSymbolDistance: 30,
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
            rememberLastWidth: roadObject.width,
            rightY: 0,
            topMidX: 0,
            moveLine2MidPointY: 0,
            isMovedCentrePoint: false,
            fixedWidthRatio: 1.02,
            fixedHeightRatio: 2.36,
            centrePoint: {
                x: roadObject.width / 2,
                y: roadObject.height / 2
            },
            rightText: {
                text: "",
                textLength: 0,
                x: roadObject.width,
                y: 0
            },
            maskLayerPaths: {
                path1: "M0," + roadObject.height / 2 + " L" + roadObject.width + "," + roadObject.height / 2,
            },
            line1RightRampPoint: { x: roadObject.width, y: 0 },
            line1RightPoint: { x: roadObject.width, y: 0 },
            Line2RightRotate: 0,
            rememberRoadLine2RightPointCoordinate: { x: 0, y: 0 },
            reDrawRamp: {
                midMovePointY: 0,
                deg: 0,
                line1R: 0,
                isBigCircle: 0,
                isInside: false,
                toward: 0,
                line1LeftPoint: { x: 0, y: 0 },
                line1RightPoint: { x: 0, y: 0 },
                islPointBigCircle: 0
            }
        };

        this.coordinatePath = {
            topleftPointPath: "",
            streetLine1: "M0,0 L" + this.horizontalRoadParam.width + ",0",
            streetLine2: this.getLine2Path(),
            streetLine3: "M0," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height,
            streetLine1RightRampPath: "",
            pavedFillPath: "M0,0 L" + this.horizontalRoadParam.width + ",0 L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height + " L0," + this.horizontalRoadParam.height,
            rotate: ""
        };

        this.verticalRoadCoordinates = {
            startPoint: { x: (roadObject.width / 2 - roadObject.height / 2), y: roadObject.width / 2 + roadObject.height / 2 },
            endPoint: { x: (roadObject.width / 2 - roadObject.height / 2), y: (-roadObject.width / 2 + roadObject.height / 2) },
            line3Point2: {
                MQ1XSpace: this.commonParam.distance,
                MQ1YSpace: this.commonParam.distance,
            }
        }


        this.verticalRoadParam = {
            width: verticalRoadObject.width,
            height: verticalRoadObject.height,
            maskLayerStrokeWidth: verticalRoadObject.width - 2,// background width of vertical road 
            line2Point1: { x: 0, y: 0, transform: "" },
            line2Point2: { x: 0, y: 0, transform: "" },
            line3Point2M1: { x: 0, y: 0, width: this.commonParam.square.width, height: this.commonParam.square.height },//vertical road ramp point of start
            line3Point2M2: { x: 0, y: 0, width: this.commonParam.square.width, height: this.commonParam.square.height },//vertical road ramp point of end
            line3Point2M3: { x: 0, y: 0, width: this.commonParam.square.width, height: this.commonParam.square.height },//vertical road and horizontal road middle point
            line3Point2LPath: "",
            line3Point2QPath: "",
            streetLine1: "M" + (roadObject.width / 2 - roadObject.height / 2) + "," + (-roadObject.width / 2 + roadObject.height / 2) + " L" + (roadObject.width / 2 - roadObject.height / 2) + "," + (roadObject.width / 2 + roadObject.height / 2),
            streetLine2: "M" + roadObject.width / 2 + "," + (-roadObject.width / 2 + roadObject.height / 2) + " L" + (roadObject.width / 2) + "," + (roadObject.width / 2 + roadObject.height / 2),
            streetLine3: "M" + (roadObject.width / 2 + roadObject.height / 2) + "," + (-roadObject.width / 2 + roadObject.height / 2) + " L" + (roadObject.width / 2 + roadObject.height / 2) + "," + (roadObject.width / 2 + roadObject.height / 2),
            maskLayerPath1: "M" + (roadObject.width / 2) + "," + (-roadObject.width / 2 + roadObject.height / 2) + " L" + (roadObject.width / 2) + "," + (roadObject.width / 2 + roadObject.height / 2),
            point2TextH: {//line3 of horizontal road's text
                text: "",
                textLength: 0,
                textLine: "",
                textRoate: "",
            },
            point2TextV: {//line3 of vertical road's text
                text: "",
                textLength: 0,
                textLine: "",
                textRoate: "",
            }

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
        this.rememberedLine1Right = {};
        this.isChangeLeftPoint = false;
        this.changedLeftPoint = {};
        this.isChangedCenterPoint = false;
        this.changedCenterPoint = {};

        this.rightLine1GotoMax = false;
        this.rightLine1GotoMix = false;

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
            if (this.props.movingType == '') {
                this.lastRoadPoint = {
                    x: this.props.point.x,
                    y: this.props.point.y
                }
                this.coordinatePath.roadCoordinate = { x: (this.props.point.x - this.horizontalRoadParam.width / 2), y: (this.props.point.y - this.horizontalRoadParam.height / 2) };
                this.horizontalRoadParam.rememberRoadLine2RightPointCoordinate = { x: this.coordinatePath.roadCoordinate.x + this.horizontalRoadParam.width, y: this.coordinatePath.roadCoordinate.y + this.horizontalRoadParam.height / 2 };

                this.coordinatePath.transform = "translate(" + this.coordinatePath.roadCoordinate.x + "," + this.coordinatePath.roadCoordinate.y + ") rotate(" + this.horizontalRoadParam.Line2RightRotate + ", 0," + this.horizontalRoadParam.height / 2 + ")";
            } else {
                this.coordinatePath.roadCoordinate = this.props.coordinate;
                this.coordinatePath.transform = "translate(" + this.props.coordinate.x + "," + this.props.coordinate.y + ") rotate(" + this.horizontalRoadParam.Line2RightRotate + ", 0," + this.horizontalRoadParam.height / 2 + ")";

                this.horizontalRoadParam.rememberRoadLine2RightPointCoordinate = { x: this.horizontalRoadParam.rememberRoadLine2RightPointCoordinateTemp.x + this.props.movedDistance.x, y: this.horizontalRoadParam.rememberRoadLine2RightPointCoordinateTemp.y + this.props.movedDistance.y };

                this.lastRoadPoint = {
                    x: this.coordinatePath.roadCoordinate.x + this.horizontalRoadParam.width / 2,
                    y: this.coordinatePath.roadCoordinate.y + this.horizontalRoadParam.height / 2
                }
            }
        }
        else if (this.props.movingType == 'VerticalRoad') {
            this.lastVerticalRoadPoint = {
                x: this.props.point.x,
                y: this.props.point.y
            }
        }

        if (!this.isChangeLeftPoint) {
            this.coordinatePath.topleftPointPath = this.getTriangle({ x: 0, y: 0 }, "up");
        } else {
            this.coordinatePath.topleftPointPath = this.getTriangle(this.changedLeftPoint, "up");
        }

        if (!this.rememberLine1Right) {
            this.coordinatePath.topRightPointPath = this.getTriangle({ x: this.horizontalRoadParam.width - this.commonParam.triangle.width, y: 0 }, "up");
        } else {
            this.coordinatePath.topRightPointPath = this.getTriangle(this.rememberedLine1Right, "up");
        }

        this.coordinatePath.bottomleftPointPath = this.getTriangle({ x: 0, y: this.horizontalRoadParam.height }, "down");
        this.coordinatePath.bottomrightPointPath = this.getTriangle({ x: this.horizontalRoadParam.width - this.commonParam.triangle.width, y: this.horizontalRoadParam.height }, "down");
        this.coordinatePath.midleftPoint = { x: -this.commonParam.square.width * 3, y: this.horizontalRoadParam.centrePoint.y - this.commonParam.rhombi.halfHeight, width: this.commonParam.square.width, height: this.commonParam.square.height };
        this.coordinatePath.midrightPoint = { x: this.horizontalRoadParam.width + this.commonParam.square.width * 2, y: this.horizontalRoadParam.centrePoint.y - this.commonParam.rhombi.halfHeight, transform: "", width: this.commonParam.square.width, height: this.commonParam.square.height };

        this.coordinatePath.midmidBigPointPath = { x: this.horizontalRoadParam.width / 2 - this.commonParam.rhombi.halfHeight, y: this.horizontalRoadParam.height / 2 - this.commonParam.rhombi.halfHeight }

        if (!this.isChangedCenterPoint) {
            this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);
        } else {
            this.coordinatePath.midmidPointPath = this.getRhombi(this.changedCenterPoint);
        }
    }

    //draw all line,symbol,text path of this road component
    drawRoadPaths() {

        var movePointY = - (this.lastRoadPoint.y - this.props.point.y - this.horizontalRoadParam.height / 2);// Y mouse moving distance
        var movePointX = (this.props.point.x - this.lastRoadPoint.x);// X mouse moving distance

        if (this.horizontalRoadParam.Line2RightRotate != 0) {
            var rotateHeight = this.horizontalRoadParam.width * Math.sin(this.horizontalRoadParam.Line2RightRotate * Math.PI / 180);
            movePointY -= rotateHeight;
        }

        //console.log('this.coordinatePath.roadCoordinate  x:  ' + this.coordinatePath.roadCoordinate.x + '  y:  '+ this.coordinatePath.roadCoordinate.y)

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
            if (!this.isChangeLeftPoint && !this.isChangedCenterPoint) {
                this.rememberLine1Right = true;
                this.horizontalRoadParam.rightY = movePointY;

                this.rememberedLine1Right.x = this.horizontalRoadParam.width - this.commonParam.triangle.width;
                this.rememberedLine1Right.y = movePointY;

                var lPoint = { x: fixWidth / 2 + movePointY * this.horizontalRoadParam.fixedWidthRatio, y: 0 };
                var cPoint3 = { x: lPoint.x + (-movePointY) * this.horizontalRoadParam.fixedHeightRatio, y: movePointY };
                var cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: 0 };
                var cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: movePointY };
                this.horizontalRoadParam.Line1RightLPoint1 = lPoint;
                this.horizontalRoadParam.Line1RightCPoint1 = cPoint1;
                this.horizontalRoadParam.Line1RightCPoint2 = cPoint2;
                this.horizontalRoadParam.Line1RightCPoint3 = cPoint3;

                this.coordinatePath.streetLine1RightRampPath = "M0,0  L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + "," + movePointY;
                this.horizontalRoadParam.rightY = movePointY;
                this.horizontalRoadParam.line1RightRampPoint.y = movePointY;
                if (movePointY != 0) {
                    this.coordinatePath.line1RightRampTrianglePath = this.getTriangle({ x: (cPoint1.x + 3 + (cPoint2.x - cPoint1.x) / 2), y: (movePointY / 2 + 3) }, "right");
                } else {
                    this.coordinatePath.line1RightRampTrianglePath = "";
                }
                this.coordinatePath.streetLine1 = "M0,0 L" + lPoint.x + ",0 M" + cPoint3.x + ",0 L" + this.horizontalRoadParam.width + ",0";

                if (!this.rememberLine1Right) {
                    this.coordinatePath.topRightPointPath = this.getTriangle({ x: this.horizontalRoadParam.width - this.commonParam.triangle.width, y: movePointY }, "up");
                } else {
                    this.coordinatePath.topRightPointPath = this.getTriangle(this.rememberedLine1Right, "up");
                }

                this.coordinatePath.midmidBigPointPath = { x: this.horizontalRoadParam.width / 2 - this.commonParam.rhombi.halfHeight, y: this.horizontalRoadParam.height / 2 - this.commonParam.rhombi.halfHeight }
                if (!this.isChangedCenterPoint) {
                    this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);
                } else {
                    this.coordinatePath.midmidPointPath = this.getRhombi(this.changedCenterPoint);
                }
            } else {
                var deg = 90;
                var increasedR = 0;
                if (this.horizontalRoadParam.isMovedCentrePoint == true) {
                    var c = this.horizontalRoadParam.height / 2;
                    var a = Math.abs(this.horizontalRoadParam.line1RightPoint.y - this.horizontalRoadParam.height / 2);

                    deg = Math.asin(a / c) * 180 / Math.PI;

                    var bb;
                    var increasedR;
                    if (deg < 30) {
                        if (this.horizontalRoadParam.reDrawRamp.midMovePointY > 0) {
                            bb = -this.props.movedDistance.x;
                        } else {
                            bb = this.props.movedDistance.x;
                        }
                        increasedR = bb / Math.cos(deg * Math.PI / 180);
                    } else {
                        if (this.horizontalRoadParam.reDrawRamp.midMovePointY > 0) {
                            bb = -this.props.movedDistance.y;
                        } else {

                            bb = this.props.movedDistance.y;
                        }
                        increasedR = bb / Math.sin(deg * Math.PI / 180);
                    }

                    //if (deg < 45) {
                    //    if (this.horizontalRoadParam.reDrawRamp.midMovePointY > 0) {
                    //        if (this.horizontalRoadParam.reDrawRamp.isBigCircle == 0) {
                    //            bb = (this.horizontalRoadParam.line1RightPoint.x + (this.lastRoadPoint.x - roadObject.width / 2)) - this.props.point.x;//X
                    //        } else {
                    //            bb = (this.horizontalRoadParam.line1RightPoint.x + (this.lastRoadPoint.x - roadObject.width / 2)) - this.props.point.x;
                    //        }
                    //    } else {
                    //        if (this.horizontalRoadParam.reDrawRamp.isBigCircle == 0) {
                    //            bb = this.props.point.x - (this.horizontalRoadParam.line1RightPoint.x + (this.lastRoadPoint.x - roadObject.width / 2));
                    //        } else {
                    //            bb = this.props.point.x - (this.horizontalRoadParam.line1RightPoint.x + (this.lastRoadPoint.x - roadObject.width / 2));
                    //        }
                    //    }
                    //    increasedR = bb / Math.cos(deg * Math.PI / 180);
                    //} else {
                    //    if (this.horizontalRoadParam.reDrawRamp.midMovePointY > 0) {
                    //        if (this.horizontalRoadParam.reDrawRamp.isBigCircle == 0) {
                    //            bb = (this.horizontalRoadParam.line1RightPoint.y + (this.lastRoadPoint.y - roadObject.height / 2)) - this.props.point.y;
                    //        } else {
                    //            bb = this.props.point.y - (this.horizontalRoadParam.line1RightPoint.y + (this.lastRoadPoint.y - roadObject.height / 2));
                    //        }
                    //    } else {
                    //        if (this.horizontalRoadParam.reDrawRamp.isBigCircle == 0) {
                    //            bb = (this.horizontalRoadParam.line1RightPoint.y + (this.lastRoadPoint.y - roadObject.height / 2)) - this.props.point.y;
                    //        } else {
                    //            bb = this.props.point.y - (this.horizontalRoadParam.line1RightPoint.y + (this.lastRoadPoint.y - roadObject.height / 2));
                    //        }
                    //    }
                    //    increasedR = bb / Math.sin(deg * Math.PI / 180);
                    //}

                    if (this.rightLine1GotoMax && Math.abs(increasedR) < this.horizontalRoadParam.height) {
                        increasedR = this.horizontalRoadParam.height - Math.abs(increasedR);
                    }

                    console.log('   deg:   ' + deg + '   bb:   ' + bb + '   increasedR:    ' + increasedR + '  rightY :  ' + this.horizontalRoadParam.rightY);

                    if (increasedR < -this.horizontalRoadParam.height) {
                        increasedR = -this.horizontalRoadParam.height;
                        this.rightLine1GotoMax = false;
                    }
                    if (increasedR > this.horizontalRoadParam.height) {
                        increasedR = this.horizontalRoadParam.height;
                        this.rightLine1GotoMax = true;
                    }

                    this.horizontalRoadParam.rightY = -Math.abs(increasedR);

                    this.reDrawLine1RightMoveRamp(this.horizontalRoadParam.reDrawRamp.midMovePointY, this.horizontalRoadParam.reDrawRamp.deg,
                        this.horizontalRoadParam.reDrawRamp.line1R, this.horizontalRoadParam.reDrawRamp.isBigCircle, this.horizontalRoadParam.reDrawRamp.isInside,
                        this.horizontalRoadParam.reDrawRamp.toward, this.horizontalRoadParam.reDrawRamp.line1LeftPoint, this.horizontalRoadParam.reDrawRamp.line1RightPoint);

                    //if (this.horizontalRoadParam.Line2RightRotate != 0) {
                    //    this.coordinatePath.midrightPoint.transform = "rotate(" + this.horizontalRoadParam.Line2RightRotate + "," + (this.horizontalRoadParam.width + this.commonParam.square.width * 2) + "," + (this.horizontalRoadParam.height / 2 + this.commonParam.square.height) + ")";
                    //}
                }
            }

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
        if (this.props.movingType != "" && this.props.movingType != "Road")
            this.setHideHorizontalRoadPoint();
    }

    //draw line 1 right text
    drawLine1RightText() {
        var text = (this.horizontalRoadParam.rightY * -1) / 4 + "";
        if (text.length > 4) text = text.substring(0, text.indexOf("."));
        this.horizontalRoadParam.rightText.text = text + "'";

        var y = (this.horizontalRoadParam.rightY * -1);
        this.horizontalRoadParam.rightText.textLength = this.horizontalRoadParam.rightText.text.length * 8;

        this.horizontalRoadParam.rightText.x = this.horizontalRoadParam.line1RightPoint.x - (y / 2 + this.horizontalRoadParam.rightText.textLength / 2) + 15;
        this.horizontalRoadParam.rightText.y = this.horizontalRoadParam.line1RightPoint.y + 25;

        if (this.horizontalRoadParam.rightText.textLength > y || y < 25) {
            this.horizontalRoadParam.rightText.text = "";
            this.coordinatePath.textLine = "";
        }
        else {
            var line1RightPointY = this.horizontalRoadParam.line1RightPoint.y;
            var space = 6;

            this.coordinatePath.textLine = "M" + (this.horizontalRoadParam.line1RightPoint.x - y) + " ," + line1RightPointY + " L" + this.horizontalRoadParam.line1RightPoint.x + " ," + line1RightPointY + " M" + (this.horizontalRoadParam.line1RightPoint.x - space) + " " + (line1RightPointY - space) + ",L " + this.horizontalRoadParam.line1RightPoint.x + " " + line1RightPointY + " M " + this.horizontalRoadParam.line1RightPoint.x + "," + line1RightPointY + " L " + (this.horizontalRoadParam.line1RightPoint.x - space) + " " + (line1RightPointY + space) + " M" + (this.horizontalRoadParam.line1RightPoint.x - y + space) + "," + (line1RightPointY - space) + ",L " + (this.horizontalRoadParam.line1RightPoint.x - y) + " " + line1RightPointY + " M " + (this.horizontalRoadParam.line1RightPoint.x - y) + "," + line1RightPointY + " L " + (this.horizontalRoadParam.line1RightPoint.x - y + space) + " " + (line1RightPointY + space);


            var deg = 90;
            if (this.horizontalRoadParam.isMovedCentrePoint == true) {
                var c = this.horizontalRoadParam.height / 2;
                var a = Math.abs(this.horizontalRoadParam.line1RightPoint.y - this.horizontalRoadParam.height / 2);

                deg = Math.asin(a / c) * 180 / Math.PI;

                if (this.horizontalRoadParam.isInside == false) {
                    if (this.horizontalRoadParam.isBigCircle == false)
                        deg = 180 - deg;
                    else {
                        deg = deg + 180;
                    }
                } else {
                    if (this.horizontalRoadParam.isBigCircle)
                        deg = -deg;
                    else
                        deg = deg;

                }
            }

            this.coordinatePath.textRoate = "rotate(" + deg + ", " + (this.horizontalRoadParam.line1RightPoint.x) + ",  " + this.horizontalRoadParam.line1RightPoint.y + ")";
        }
    }

    drawVLine3Point2Text(isHide) {
        var text = (this.verticalRoadCoordinates.line3Point2.MQ1YSpace) / 4 + "";
        if (text.length > 4) text = text.substring(0, text.indexOf("."));

        this.verticalRoadParam.point2TextV.text = text + "'";

        var y = this.verticalRoadCoordinates.line3Point2.MQ1YSpace;
        this.verticalRoadParam.point2TextV.textLength = this.verticalRoadParam.point2TextV.text.length * 8;

        var x = this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width - 15;
        this.verticalRoadParam.point2TextV.y = this.horizontalRoadParam.height + y + 25;
        if (this.verticalRoadParam.point2TextV.textLength > y || y < 25 || isHide) {
            this.verticalRoadParam.point2TextV.text = "";
            this.verticalRoadParam.point2TextV.textLine = "";
        }
        else {
            var textLineHeight = this.horizontalRoadParam.height + y;
            var space = 6;
            this.verticalRoadParam.point2TextV.x = x - y / 2;
            this.verticalRoadParam.point2TextV.textLine = "M" + (x - y) + " ," + textLineHeight + " L" + x + " ," + textLineHeight + " M" + (x - space) + " " + (textLineHeight - space) + ",L " + x + " " + textLineHeight + " M " + x + "," + textLineHeight + " L " + (x - space) + " " + (textLineHeight + space) + " M" + (x - y + space) + " " + (textLineHeight - space) + ",L " + (x - y) + " " + textLineHeight + " M " + (x - y) + "," + textLineHeight + " L " + (x - y + space) + " " + (textLineHeight + space);

            this.verticalRoadParam.point2TextV.textRoate = "rotate(90, " + x + ", " + textLineHeight + ")";
        }
    }

    drawHLine3Point2Text(isHide) {
        var text = (this.verticalRoadCoordinates.line3Point2.MQ1XSpace) / 4 + "";
        if (text.length > 4) text = text.substring(0, text.indexOf("."));

        this.verticalRoadParam.point2TextH.text = text + "'";

        var y = this.verticalRoadCoordinates.line3Point2.MQ1XSpace;
        this.verticalRoadParam.point2TextH.textLength = this.verticalRoadParam.point2TextH.text.length * 8;

        var x = this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width;
        this.verticalRoadParam.point2TextH.y = this.horizontalRoadParam.height - 25;
        if (this.verticalRoadParam.point2TextH.textLength > y || y < 25 || isHide) {
            this.verticalRoadParam.point2TextH.text = "";
            this.verticalRoadParam.point2TextH.textLine = "";
        }
        else {
            var textLineHeight = this.horizontalRoadParam.height - 20;
            var space = 6;
            this.verticalRoadParam.point2TextH.x = x + y / 2;
            this.verticalRoadParam.point2TextH.textLine = "M" + x + " ," + textLineHeight + " L" + (x + y) + " ," + textLineHeight + " M" + (x + space) + " " + (textLineHeight + space) + ",L " + x + " " + textLineHeight + " M " + x + "," + textLineHeight + " L " + (x + space) + " " + (textLineHeight - space) + " M" + (x + y - space) + " " + (textLineHeight + space) + ",L " + (x + y) + " " + textLineHeight + " M " + (x + y) + "," + textLineHeight + " L " + (x + y - space) + " " + (textLineHeight - space);

            this.verticalRoadParam.point2TextH.textRoate = "rotate(0, " + x + ", " + textLineHeight + ")";
        }
    }

    //-------------READY MOVE EVENTS DEFINE--------------------
    readyMoveRoad = (event) => {
        var e;
        if (event.type == "touchmove") {
            e = event.touches[0];
        } else {
            e = event;
        }

        var currentMousePoint = { x: e.clientX - $(".nav-panel").width(), y: e.clientY };
        var currentRoadCoordinate = { x: this.coordinatePath.roadCoordinate.x, y: this.coordinatePath.roadCoordinate.y };
        this.props.tellParentRoadhaveBeenClicked(currentMousePoint, currentRoadCoordinate);
        this.horizontalRoadParam.rememberRoadLine2RightPointCoordinateTemp = this.horizontalRoadParam.rememberRoadLine2RightPointCoordinate;
        event.stopPropagation();
        event.preventDefault();


    }

    readyMoveLine1Right = (event) => {
        var e;
        if (event.type == "touchmove") {
            e = event.touches[0];
        } else {
            e = event;
        }

        var currentMousePoint = { x: e.clientX - $(".nav-panel").width(), y: e.clientY };
        var currentRoadCoordinate = { x: this.coordinatePath.roadCoordinate.x, y: this.coordinatePath.roadCoordinate.y };
        this.props.tellParentLine1RighthaveBeenClicked(currentMousePoint, currentRoadCoordinate);
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
        var e;
        if (event.type == "touchmove") {
            e = event.touches[0];
        } else {
            e = event;
        }

        var currentMousePoint = { x: e.clientX - $(".nav-panel").width(), y: e.clientY };
        var currentRoadCoordinate = { x: this.coordinatePath.roadCoordinate.x, y: this.coordinatePath.roadCoordinate.y };
        this.horizontalRoadParam.rememberedMoveLine2MidPointY = this.horizontalRoadParam.moveLine2MidPointY;
        this.props.tellParentLine2MidHaveBeenClicked(currentMousePoint, currentRoadCoordinate);
        event.stopPropagation();
        event.preventDefault();
    }

    readyVerticalRoadMove = (event) => {
        this.props.tellParentVerticalRoadHaveBeenClicked();
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
        var movePointX = this.props.point.x - this.coordinatePath.roadCoordinate.x - this.commonParam.square.width * 2;// X mouse moving distance
        var movePointY = this.props.point.y - this.lastRoadPoint.y;

        if (this.horizontalRoadParam.Line2RightRotate != 0) {
            this.horizontalRoadParam.width = movePointX / Math.cos(this.horizontalRoadParam.Line2RightRotate * Math.PI / 180);
        } else {
            this.horizontalRoadParam.width = movePointX;
        }
        if (this.horizontalRoadParam.width < roadObject.width) this.horizontalRoadParam.width = roadObject.width;
        this.horizontalRoadParam.line1RightPoint.x = this.horizontalRoadParam.width;
        this.coordinatePath.streetLine1 = "M0,0 L" + this.horizontalRoadParam.width + ",0 ";
        this.coordinatePath.streetLine2 = this.getLine2Path();
        this.coordinatePath.streetLine3 = "M0," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height + "";

        this.horizontalRoadParam.maskLayerPaths.path1 = "M0," + this.horizontalRoadParam.height / 2 + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height / 2;

        this.coordinatePath.midmidBigPointPath = { x: this.horizontalRoadParam.width / 2 - this.commonParam.rhombi.halfHeight, y: this.horizontalRoadParam.height / 2 - this.commonParam.rhombi.halfHeight }
        if (!this.isChangedCenterPoint) {
            this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);
        } else {
            this.coordinatePath.midmidPointPath = this.getRhombi(this.changedCenterPoint);
        }

        this.getLine1RightRampPath();

        this.rememberLine1Right = true;
        this.rememberedLine1Right = {
            x: this.horizontalRoadParam.width - this.commonParam.triangle.width,
            y: this.horizontalRoadParam.rightY
        };

        this.coordinatePath.topRightPointPath = this.getTriangle(this.rememberedLine1Right, "up");
        this.drawLine1RightText();
        this.horizontalRoadParam.rememberLastWidth = this.horizontalRoadParam.width;
        if (movePointY != 0) {
            var a = this.props.point.y - this.coordinatePath.roadCoordinate.y - this.horizontalRoadParam.height / 2;
            var b = this.props.point.x - this.coordinatePath.roadCoordinate.x;
            var deg = Math.atan(a / b) * 180 / Math.PI;
            this.horizontalRoadParam.Line2RightRotate = deg;
            this.coordinatePath.transform = "translate(" + this.coordinatePath.roadCoordinate.x + "," + this.coordinatePath.roadCoordinate.y + ") rotate(" + deg + ", 0," + this.horizontalRoadParam.height / 2 + ")";
            this.horizontalRoadParam.rememberRoadLine2RightPointCoordinate = {
                x: this.props.point.x - this.commonParam.square.width * 2,
                y: this.props.point.y
            };
        }
    }

    moveToDrawByLine2LeftRect() {
        var a = this.horizontalRoadParam.rememberRoadLine2RightPointCoordinate.x - this.props.point.x;
        var b = this.horizontalRoadParam.rememberRoadLine2RightPointCoordinate.y - this.props.point.y;
        var deg = Math.atan(b / a) * 180 / Math.PI;

        this.horizontalRoadParam.width = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) - this.commonParam.square.width * 2;
        //if (this.horizontalRoadParam.width < roadObject.width) {
        //    a = roadObject.width;
        //    deg = Math.atan(b / a) * 180 / Math.PI;
        //    this.horizontalRoadParam.width = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) - this.commonParam.square.width * 2;

        //}

        this.horizontalRoadParam.Line2RightRotate = deg;
        this.horizontalRoadParam.line1RightPoint.x = this.horizontalRoadParam.width;
        this.coordinatePath.streetLine1 = "M0,0 L" + this.horizontalRoadParam.width + ",0 ";
        this.coordinatePath.streetLine2 = this.getLine2Path();
        this.coordinatePath.streetLine3 = "M0," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height + "";

        this.horizontalRoadParam.maskLayerPaths.path1 = "M0," + this.horizontalRoadParam.height / 2 + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height / 2;

        this.rememberedLine1Right.x = this.horizontalRoadParam.width - this.commonParam.triangle.width;
        this.rememberedLine1Right.y = this.horizontalRoadParam.rightY;

        this.coordinatePath.midmidBigPointPath = { x: this.horizontalRoadParam.width / 2 - this.commonParam.rhombi.halfHeight, y: this.horizontalRoadParam.height / 2 - this.commonParam.rhombi.halfHeight }
        if (!this.isChangedCenterPoint) {
            this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);
        } else {
            this.coordinatePath.midmidPointPath = this.getRhombi(this.changedCenterPoint);
        }

        this.getLine1RightRampPath();

        this.coordinatePath.topRightPointPath = this.getTriangle({ x: this.horizontalRoadParam.width - this.commonParam.triangle.width, y: this.horizontalRoadParam.rightY }, "up");
        this.drawLine1RightText();

        this.coordinatePath.roadCoordinate.x = this.props.point.x + this.commonParam.square.width * 2;
        this.coordinatePath.roadCoordinate.y = this.props.point.y - this.horizontalRoadParam.height / 2;
        this.coordinatePath.transform = "translate(" + this.coordinatePath.roadCoordinate.x + "," + this.coordinatePath.roadCoordinate.y + ") rotate(" + deg + ", 0," + this.horizontalRoadParam.height / 2 + ")";
    }

    moveToDrawLine2MidControllerPoint() {

        var movePointY = (this.props.point.y - this.coordinatePath.roadCoordinate.y - (this.horizontalRoadParam.height / 2));
        var midMovePointY = movePointY - this.horizontalRoadParam.height / 2;

        var  toward = midMovePointY > 0 ? 0 : 1;

        var c = Math.sqrt(Math.pow(this.horizontalRoadParam.width / 2, 2) + Math.pow(midMovePointY, 2));

        this.horizontalRoadParam.isMovedCentrePoint = midMovePointY != 0;

        var tempB = c / 2;
        var deg = 90 - Math.atan(Math.abs(midMovePointY) / (this.horizontalRoadParam.width / 2)) * 180 / Math.PI;

        var cosvalue = Math.cos(deg * Math.PI / 180);
        var r = tempB / cosvalue;

        var isInside = midMovePointY > 0 ? true : false;
        var line1R = isInside == true ? (r - this.horizontalRoadParam.height / 2) : (r + this.horizontalRoadParam.height / 2);
        var line3R = isInside == true ? (r + this.horizontalRoadParam.height / 2) : (r - this.horizontalRoadParam.height / 2);

        var isBigCircle = Math.abs(midMovePointY) > this.horizontalRoadParam.width / 2 ? 1 : 0;
        this.horizontalRoadParam.isBigCircle = isBigCircle;
        this.horizontalRoadParam.isInside = isInside;
        var line1LeftPoint = this.getLine1LeftControllerPoint(midMovePointY, deg, c, 1);

        var line1RightPoint = this.getLine1RightControllerPoint(line1LeftPoint, midMovePointY, 1);

        console.log('line1LeftPoint   x: ' + line1LeftPoint.x + '  y:  ' + line1LeftPoint.y + 'line1RightPoint   x:  ' + line1RightPoint.x + '  y:   ' + line1RightPoint.y);

        this.coordinatePath.topleftPointPath = this.getTriangle(line1LeftPoint, "up");
        if (this.horizontalRoadParam.rightY != 0) {
            this.coordinatePath.topRightPointPath = this.getTriangle({ x: line1RightPoint.x - 12, y: this.horizontalRoadParam.rightY }, "up");
        } else {
            this.coordinatePath.topRightPointPath = this.getTriangle(line1RightPoint, "up");
        }

        this.horizontalRoadParam.line1RightPoint = line1RightPoint;

        if (midMovePointY != 0) {
            this.isChangeLeftPoint = true;
            this.isChangedCenterPoint = true;
            this.rememberLine1Right = true;
            this.rememberedLine1Right.x = line1RightPoint.x - 6;
            this.rememberedLine1Right.y = line1RightPoint.y;
            this.changedLeftPoint.x = line1LeftPoint.x - 6;
            this.changedLeftPoint.y = line1LeftPoint.y;
            this.changedCenterPoint.x = this.horizontalRoadParam.width / 2;
            this.changedCenterPoint.y = movePointY;
        } else {
            this.isChangeLeftPoint = false;
            this.isChangedCenterPoint = false;
            this.changedLeftPoint = {};
            this.changedCenterPoint = {};
        }

        this.reDrawLine1RightMoveRamp(midMovePointY, deg, line1R, isBigCircle, isInside, toward, line1LeftPoint, line1RightPoint);

        if (midMovePointY != 0) {
            this.horizontalRoadParam.maskLayerPaths.path1 = "M0," + this.horizontalRoadParam.height / 2 + " A" + r + "," + r + " 0 " + isBigCircle + " " + toward + " " + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height / 2;
        }

        var line3LeftPoint = this.getLine3LeftControllerPoint(midMovePointY, deg, c, 1);
        var line3RightPoint = this.getLine1RightControllerPoint(line3LeftPoint, midMovePointY, 3);

        if (this.horizontalRoadParam.Line1RightLPoint1 == null) {
            this.coordinatePath.streetLine1 = "M" + line1LeftPoint.x + "," + line1LeftPoint.y + " A" + line1R + "," + line1R + " 0 " + isBigCircle + " " + toward + " " + line1RightPoint.x + "," + line1RightPoint.y;
        }
        this.coordinatePath.streetLine2 = "";
        this.coordinatePath.streetLine3 = "";
        this.coordinatePath.bottomleftPointPath = "";
        this.coordinatePath.bottomrightPointPath = "";

        this.coordinatePath.midmidBigPointPath = { x: this.horizontalRoadParam.width / 2, y: movePointY };

        this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);

        var x = this.horizontalRoadParam.width / 2;
        var y = movePointY / 2 + this.commonParam.square.height * 2;

        var totateDeg = - Math.atan(x / y) * 180 / Math.PI;
        this.coordinatePath.midrightPoint.width = this.coordinatePath.midrightPoint.height = 0;
        this.coordinatePath.midleftPoint.width = this.coordinatePath.midleftPoint.height = 0;

        this.coordinatePath.midrightPoint.transform = "rotate(" + totateDeg + "," + (this.horizontalRoadParam.width + this.commonParam.square.width * 2) + "," + (this.horizontalRoadParam.height / 2 + this.commonParam.square.height) + ")";
        this.setDisplayHorizontalRoadPoint();
        this.drawLine1RightText();
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
        var movePointX = this.props.point.x - this.lastRoadPoint.x - this.horizontalRoadParam.height / 2;// X mouse moving distance
        var movePointY = this.props.point.y - this.lastRoadPoint.y;
        this.verticalRoadCoordinates.startPoint = { x: (this.horizontalRoadParam.width / 2 - this.horizontalRoadParam.height / 2 + movePointX), y: -this.horizontalRoadParam.width / 2 + this.horizontalRoadParam.height / 2 + movePointY };
        this.verticalRoadCoordinates.endPoint = { x: (this.horizontalRoadParam.width / 2 - this.horizontalRoadParam.height / 2 + movePointX), y: (this.horizontalRoadParam.width / 2 + this.horizontalRoadParam.height / 2 + movePointY) };

        if ((this.verticalRoadCoordinates.startPoint.x - this.commonParam.distance) < 0) {
            movePointX = 0;
            this.verticalRoadCoordinates.startPoint.x = this.verticalRoadCoordinates.endPoint.x = this.commonParam.distance;
        }
        else if (this.verticalRoadCoordinates.startPoint.x > (this.horizontalRoadParam.width - this.verticalRoadParam.width - this.commonParam.distance)) {
            movePointX = 0;
            this.verticalRoadCoordinates.startPoint.x = this.verticalRoadCoordinates.endPoint.x = this.horizontalRoadParam.width - this.verticalRoadParam.width - this.commonParam.distance;
        }

        if ((this.verticalRoadCoordinates.startPoint.y + this.commonParam.distance) > 0) {
            movePointY = 0;
            this.verticalRoadCoordinates.startPoint.y = - this.commonParam.distance;
            this.verticalRoadCoordinates.endPoint.y = this.verticalRoadCoordinates.startPoint.y + this.verticalRoadParam.height;
        }
        else if ((this.verticalRoadCoordinates.endPoint.y - this.commonParam.distance) < this.horizontalRoadParam.height) {
            movePointY = 0;
            this.verticalRoadCoordinates.endPoint.y = this.horizontalRoadParam.height + this.commonParam.distance;
            this.verticalRoadCoordinates.startPoint.y = this.verticalRoadCoordinates.endPoint.y - this.verticalRoadParam.height;
        }

        var line1Intersection = { x: 0, y: 0 };
        var space = this.commonParam.distance;
        if (this.verticalRoadCoordinates.startPoint.x < this.horizontalRoadParam.width) {
            line1Intersection.x = this.verticalRoadCoordinates.startPoint.x;
            line1Intersection.y = 0;
        }

        this.verticalRoadParam.maskLayerPath1 = "";
        $("#paved2MaskLayer").addClass("display-none");
        $("#paved2Point").addClass("display-none");
        $("#mainpaved1").removeClass("display-none");
        $("#paved1MaskLayer").removeClass("display-none");
        $("#paved1Point").removeClass("display-none");

        this.verticalRoadParam.streetLine1 = "M" + this.verticalRoadCoordinates.startPoint.x + "," + this.verticalRoadCoordinates.startPoint.y + " L" + this.verticalRoadCoordinates.startPoint.x + "," + (line1Intersection.y - space) + " Q " + line1Intersection.x + "," + line1Intersection.y + " " + (line1Intersection.x - space) + ",0  M" + this.verticalRoadCoordinates.startPoint.x + "," + (line1Intersection.y + this.horizontalRoadParam.height + space) + " Q " + line1Intersection.x + "," + (line1Intersection.y + this.horizontalRoadParam.height) + " " + (line1Intersection.x - space) + "," + (line1Intersection.y + this.horizontalRoadParam.height) + "  M" + this.verticalRoadCoordinates.startPoint.x + "," + (line1Intersection.y + this.horizontalRoadParam.height + space) + " L" + this.verticalRoadCoordinates.endPoint.x + "," + this.verticalRoadCoordinates.endPoint.y;

        this.verticalRoadParam.streetLine2 = "M" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width / 2) + "," + this.verticalRoadCoordinates.startPoint.y + " L" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width / 2) + "," + (line1Intersection.y - space) + " M" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width / 2) + "," + (line1Intersection.y + this.horizontalRoadParam.height + space) + " L" + (this.verticalRoadCoordinates.endPoint.x + this.verticalRoadParam.width / 2) + "," + this.verticalRoadCoordinates.endPoint.y;
        ;
        var line3MQ2 = { x: this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width, y: line1Intersection.y + this.horizontalRoadParam.height + space };
        var line3Q2_1 = { x: line1Intersection.x + this.verticalRoadParam.width, y: line1Intersection.y + this.horizontalRoadParam.height };
        var line3Q2_2 = { x: line1Intersection.x + this.verticalRoadParam.width + space, y: line1Intersection.y + this.horizontalRoadParam.height };

        this.verticalRoadParam.streetLine3 = "M" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width) + "," + this.verticalRoadCoordinates.startPoint.y + " L" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width) + "," + (line1Intersection.y - space) + " Q " + (line1Intersection.x + this.verticalRoadParam.width) + "," + line1Intersection.y + " " + (line1Intersection.x + this.verticalRoadParam.width + space) + ",0  M" + line3MQ2.x + "," + line3MQ2.y + " Q " + line3Q2_1.x + "," + line3Q2_1.y + " " + line3Q2_2.x + "," + line3Q2_2.y + "  M" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width) + "," + (line1Intersection.y + this.horizontalRoadParam.height + space) + " L" + (this.verticalRoadCoordinates.endPoint.x + this.verticalRoadParam.width) + "," + this.verticalRoadCoordinates.endPoint.y;

        this.coordinatePath.streetLine1 = "M0,0 L" + (line1Intersection.x - space) + ",0 M" + (line1Intersection.x + this.verticalRoadParam.width + space) + ",0 L" + this.horizontalRoadParam.width + ",0";

        this.coordinatePath.streetLine2 = "M0," + this.horizontalRoadParam.height / 2 + " L" + (line1Intersection.x - space) + "," + this.horizontalRoadParam.height / 2 + " M" + (line1Intersection.x + this.verticalRoadParam.width + space) + "," + this.horizontalRoadParam.height / 2 + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height / 2;

        this.coordinatePath.streetLine3 = "M0," + this.horizontalRoadParam.height + " L" + (line1Intersection.x - space) + "," + this.horizontalRoadParam.height + " M" + (line1Intersection.x + this.verticalRoadParam.width + space) + "," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height;

        this.verticalRoadParam.line3Point2M1.x = line3MQ2.x - this.commonParam.square.width / 2;
        this.verticalRoadParam.line3Point2M1.y = line3MQ2.y - this.commonParam.square.height;
        this.verticalRoadParam.line3Point2M2.x = line3Q2_2.x - this.commonParam.square.width;
        this.verticalRoadParam.line3Point2M2.y = line3Q2_2.y - this.commonParam.square.height / 2;
        this.verticalRoadParam.line3Point2M3 = { x: line3MQ2.x + (line3Q2_2.x - line3MQ2.x) / 2 - this.commonParam.square.width / 2, y: line3Q2_2.y + (line3MQ2.y - line3Q2_2.y) / 2 - this.commonParam.square.height };

        this.verticalRoadParam.line3Point2LPath = "M" + (this.verticalRoadParam.line3Point2M1.x + this.commonParam.square.width) + "," + this.verticalRoadParam.line3Point2M1.y + " L" + (this.verticalRoadParam.line3Point2M3.x) + "," + (this.verticalRoadParam.line3Point2M3.y + this.commonParam.square.height) + " M" + (this.verticalRoadParam.line3Point2M3.x + this.commonParam.square.width) + "," + this.verticalRoadParam.line3Point2M3.y + " L" + (this.verticalRoadParam.line3Point2M2.x) + "," + (this.verticalRoadParam.line3Point2M2.y + this.commonParam.square.height);


        this.verticalRoadParam.line3Point2QPath = "M" + line3MQ2.x + ", " + line3MQ2.y + " Q " + line3Q2_1.x + ", " + line3Q2_1.y + " " + line3Q2_2.x + ", " + line3Q2_2.y;

        this.verticalRoadParam.maskLayerPath1 = "M" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width / 2) + "," + this.verticalRoadCoordinates.startPoint.y + " L" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width / 2) + "," + this.verticalRoadCoordinates.endPoint.y;

        this.verticalRoadParam.line1Point1Path = this.getTriangle({ x: this.verticalRoadCoordinates.startPoint.x, y: this.verticalRoadCoordinates.startPoint.y + this.commonParam.triangle.width }, "left");
        this.verticalRoadParam.line1Point2Path = this.getTriangle(this.verticalRoadCoordinates.endPoint, "left");
        this.verticalRoadParam.line3Point1Path = this.getTriangle({ x: this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width, y: this.verticalRoadCoordinates.startPoint.y + this.commonParam.triangle.width }, "right");
        this.verticalRoadParam.line3Point2Path = this.getTriangle({ x: this.verticalRoadCoordinates.endPoint.x + this.verticalRoadParam.width, y: this.verticalRoadCoordinates.endPoint.y }, "right");

        this.verticalRoadParam.line2Point1Path = this.getRhombi({ x: this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width / 2, y: this.horizontalRoadParam.height / 2 - this.commonParam.rhombi.halfHeight });

        this.verticalRoadParam.line2Point1 = { x: this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width / 2 - this.commonParam.square.width / 2, y: this.verticalRoadCoordinates.startPoint.y - this.commonParam.square.height * 2, transform: "" };
        this.verticalRoadParam.line2Point2 = { x: this.verticalRoadCoordinates.endPoint.x + this.verticalRoadParam.width / 2 - this.commonParam.square.width / 2, y: this.verticalRoadCoordinates.endPoint.y + this.commonParam.square.height * 2, transform: "" };
        this.coordinatePath.streetLine1RightRampPath = "";
        this.drawVLine3Point2Text(true);
        this.drawHLine3Point2Text(true);

    }

    moveToLine3Point2M3() {

        var movePointX = this.props.point.x - this.lastRoadPoint.x - this.verticalRoadParam.width / 2 - this.verticalRoadCoordinates.line3Point2.MQ1XSpace / 2 + (this.horizontalRoadParam.width / 2 - this.verticalRoadCoordinates.startPoint.x - this.verticalRoadParam.width / 2);

        var line3MQ1XSpace = this.verticalRoadCoordinates.line3Point2.MQ1XSpace + movePointX;
        var line3MQ1YSpace = this.verticalRoadCoordinates.line3Point2.MQ1YSpace + movePointX;
        if (line3MQ1YSpace < 0) line3MQ1YSpace = 0;
        if (line3MQ1XSpace < 0) line3MQ1XSpace = 0;
        var moveDistance = line3MQ1YSpace > line3MQ1XSpace ? line3MQ1XSpace : line3MQ1YSpace;
        var vWidth = this.verticalRoadCoordinates.endPoint.y - this.horizontalRoadParam.height;
        var hWidth = this.horizontalRoadParam.width - this.verticalRoadCoordinates.endPoint.x - this.verticalRoadParam.width;
        var maxDistance = vWidth > hWidth ? hWidth : vWidth;
        if (moveDistance > maxDistance) moveDistance = maxDistance;

        this.verticalRoadCoordinates.line3Point2.MQ1XSpace = moveDistance;
        this.verticalRoadCoordinates.line3Point2.MQ1YSpace = moveDistance;

        this.setLine3Point2Path("M3");
        this.drawVLine3Point2Text();
        this.drawHLine3Point2Text();
    }

    moveToLine3Point2M1() {
        var movePointY = this.props.point.y - this.lastRoadPoint.y - this.horizontalRoadParam.height / 2 - this.verticalRoadCoordinates.line3Point2.MQ1YSpace;

        var line3MQ1XSpace = this.verticalRoadCoordinates.line3Point2.MQ1XSpace
        var line3MQ1YSpace = this.verticalRoadCoordinates.line3Point2.MQ1YSpace + movePointY;;

        if (line3MQ1YSpace < 0) line3MQ1YSpace = 0;
        var moveDistance = line3MQ1YSpace;
        var maxDistance = this.verticalRoadCoordinates.endPoint.y - roadObject.height;

        if (moveDistance > maxDistance) moveDistance = maxDistance;

        this.verticalRoadCoordinates.line3Point2.MQ1YSpace = moveDistance;

        this.setLine3Point2Path("M1");
        this.drawVLine3Point2Text();
        this.drawHLine3Point2Text();
    }

    moveToLine3Point2M2() {

        var movePointX = 0;
        if ((this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width / 2) >= this.lastRoadPoint.x) {
            movePointX = this.props.point.x - this.lastRoadPoint.x - this.verticalRoadParam.width / 2 - this.verticalRoadCoordinates.line3Point2.MQ1XSpace;
        } else {
            movePointX = this.props.point.x - this.lastRoadPoint.x - this.verticalRoadParam.width / 2 - this.verticalRoadCoordinates.line3Point2.MQ1XSpace + (this.horizontalRoadParam.width / 2 - this.verticalRoadCoordinates.startPoint.x - this.verticalRoadParam.width / 2);
        }

        var line1Intersection = { x: 0, y: 0 };

        var line3MQ1XSpace = this.verticalRoadCoordinates.line3Point2.MQ1XSpace + movePointX;

        if (line3MQ1XSpace < 0) line3MQ1XSpace = 0;
        var moveDistance = line3MQ1XSpace;
        var maxDistance = this.horizontalRoadParam.width - (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width);

        if (moveDistance > maxDistance) moveDistance = maxDistance;
        this.verticalRoadCoordinates.line3Point2.MQ1XSpace = moveDistance;

        this.setLine3Point2Path("M2");
        this.drawVLine3Point2Text();
        this.drawHLine3Point2Text();
    }
    getLeftMovePoint(midMovePointY, line1LeftPoint, isBigCircle, rightMoveY) {
        var angleRight;
        if (midMovePointY < 0) {
            if (isBigCircle == 0) {
                angleRight = Math.atan(Math.abs(this.horizontalRoadParam.height / 2 - line1LeftPoint.y) / Math.abs(0 - line1LeftPoint.x));
            } else {
                angleRight = Math.atan(Math.abs(0 - line1LeftPoint.x) / Math.abs(line1LeftPoint.y - this.horizontalRoadParam.height / 2));
            }
        } else {
            if (isBigCircle == 0) {
                angleRight = Math.atan(Math.abs(this.horizontalRoadParam.height / 2 - line1LeftPoint.y) / Math.abs(line1LeftPoint.x));
            } else {
                angleRight = Math.atan(Math.abs(line1LeftPoint.x) / Math.abs(line1LeftPoint.y - this.horizontalRoadParam.height / 2));
            }
        }

        var leftMovePointEnd = {};
        if (midMovePointY < 0) {
            if (isBigCircle == 0) {
                leftMovePointEnd.x = line1LeftPoint.x - Math.cos(angleRight) * Math.abs(rightMoveY);
                leftMovePointEnd.y = line1LeftPoint.y - Math.sin(angleRight) * Math.abs(rightMoveY);
            } else {
                leftMovePointEnd.x = line1LeftPoint.x - Math.sin(angleRight) * Math.abs(rightMoveY);
                leftMovePointEnd.y = line1LeftPoint.y + Math.cos(angleRight) * Math.abs(rightMoveY);
            }
        } else {
            if (isBigCircle == 0) {
                leftMovePointEnd.x = line1LeftPoint.x + Math.cos(angleRight) * Math.abs(rightMoveY);
                leftMovePointEnd.y = line1LeftPoint.y - Math.sin(angleRight) * Math.abs(rightMoveY);
            } else {
                leftMovePointEnd.x = line1LeftPoint.x + Math.sin(angleRight) * Math.abs(rightMoveY);
                leftMovePointEnd.y = line1LeftPoint.y + Math.cos(angleRight) * Math.abs(rightMoveY);
            }
        }

        return leftMovePointEnd;
    }

    getRightEndPoint(midMovePointY, line1RightPoint, isBigCircle) {
        var angleRight;
        if (midMovePointY < 0) {
            if (isBigCircle == 0) {
                angleRight = Math.atan(Math.abs(this.horizontalRoadParam.height / 2 - line1RightPoint.y) / Math.abs(line1RightPoint.x - this.horizontalRoadParam.width));
            } else {
                angleRight = Math.atan(Math.abs(line1RightPoint.x - this.horizontalRoadParam.width) / Math.abs(line1RightPoint.y - this.horizontalRoadParam.height / 2));
            }
        } else {
            if (isBigCircle == 0) {
                angleRight = Math.atan(Math.abs(this.horizontalRoadParam.height / 2 - line1RightPoint.y) / Math.abs(this.horizontalRoadParam.width - line1RightPoint.x));
            } else {
                angleRight = Math.atan(Math.abs(this.horizontalRoadParam.width - line1RightPoint.x) / Math.abs(line1RightPoint.y - this.horizontalRoadParam.height / 2));
            }
        }

        var line1RightPointEnd = {};
        if (midMovePointY < 0) {
            if (isBigCircle == 0) {
                line1RightPointEnd.x = line1RightPoint.x + Math.cos(angleRight) * Math.abs(this.horizontalRoadParam.rightY);
                line1RightPointEnd.y = line1RightPoint.y - Math.sin(angleRight) * Math.abs(this.horizontalRoadParam.rightY);
            } else {
                line1RightPointEnd.x = line1RightPoint.x + Math.sin(angleRight) * Math.abs(this.horizontalRoadParam.rightY);
                line1RightPointEnd.y = line1RightPoint.y + Math.cos(angleRight) * Math.abs(this.horizontalRoadParam.rightY);
            }
        } else {
            if (isBigCircle == 0) {
                line1RightPointEnd.x = line1RightPoint.x - Math.cos(angleRight) * Math.abs(this.horizontalRoadParam.rightY);
                line1RightPointEnd.y = line1RightPoint.y - Math.sin(angleRight) * Math.abs(this.horizontalRoadParam.rightY);
            } else {
                line1RightPointEnd.x = line1RightPoint.x - Math.sin(angleRight) * Math.abs(this.horizontalRoadParam.rightY);
                line1RightPointEnd.y = line1RightPoint.y + Math.cos(angleRight) * Math.abs(this.horizontalRoadParam.rightY);
            }
        }

        return line1RightPointEnd;
    }

    reDrawLine1RightMoveRamp(midMovePointY, deg, line1R, isBigCircle, isInside, toward, line1LeftPoint, line1RightPoint) {
        this.getLine1RightRampPath();

        this.horizontalRoadParam.reDrawRamp.midMovePointY = midMovePointY;
        this.horizontalRoadParam.reDrawRamp.deg = deg;
        this.horizontalRoadParam.reDrawRamp.line1R = line1R;
        this.horizontalRoadParam.reDrawRamp.isBigCircle = isBigCircle;
        this.horizontalRoadParam.reDrawRamp.isInside = isInside;
        this.horizontalRoadParam.reDrawRamp.toward = toward;
        this.horizontalRoadParam.reDrawRamp.line1LeftPoint = line1LeftPoint;
        this.horizontalRoadParam.reDrawRamp.line1RightPoint = line1RightPoint;

        if (this.horizontalRoadParam.Line1RightLPoint1 == null || midMovePointY == 0) {
            return;
        }

        var line1RightLPoint1 = this.getLine1ControllerPointForLine2Mid(midMovePointY, deg, line1R, isBigCircle, line1LeftPoint, 0);
        var line1RightCPoint1 = this.getLine1ControllerPointForLine2Mid(midMovePointY, deg, line1R, isBigCircle, line1LeftPoint, 1);

        var tempLine1R = midMovePointY > 0 ? line1R - Math.abs(this.horizontalRoadParam.rightY) : line1R + Math.abs(this.horizontalRoadParam.rightY);
        var tempLeftPoint = this.getLeftMovePoint(midMovePointY, line1LeftPoint, isBigCircle, this.horizontalRoadParam.rightY);

        var line1RightCPoint2 = this.getLine1ControllerPointForLine2Mid(midMovePointY + this.horizontalRoadParam.rightY, deg, tempLine1R, isBigCircle, tempLeftPoint, 2);
        var line1RightCPoint3 = this.getLine1ControllerPointForLine2Mid(midMovePointY + this.horizontalRoadParam.rightY, deg, tempLine1R, isBigCircle, tempLeftPoint, 3);

        var line1RightCPoint3Inside = this.getLine1ControllerPointForLine2Mid(midMovePointY, deg, line1R, isBigCircle, line1LeftPoint, 3);

        var line1RightPointEnd = this.getRightEndPoint(midMovePointY, line1RightPoint, isBigCircle);

        var newline1R = midMovePointY > 0 ? line1R - Math.abs(this.horizontalRoadParam.rightY) : line1R + Math.abs(this.horizontalRoadParam.rightY);
        if (tempLine1R < 0) {
            line1RightCPoint2 = line1RightCPoint3 = line1RightPointEnd;
        }

        if (Math.abs(line1RightCPoint3.y) < Math.abs(line1RightCPoint2.y) && isInside == true && isBigCircle == 0 && this.horizontalRoadParam.Line2RightRotate == 0) {
            line1RightCPoint3.y = line1RightPointEnd.y;
        }

        var line1RightPath = "";

        if (this.horizontalRoadParam.rightY != 0) {
            line1RightPath = "M" + line1LeftPoint.x + "," + line1LeftPoint.y + " A" + line1R + "," + line1R + " 0 " + this.horizontalRoadParam.reDrawRamp.islPointBigCircle + " " + toward + " " + line1RightLPoint1.x + "," + line1RightLPoint1.y + " C" + line1RightCPoint1.x + "," + line1RightCPoint1.y + " " + line1RightCPoint2.x + "," + line1RightCPoint2.y + " " + line1RightCPoint3.x + "," + line1RightCPoint3.y + " A" + newline1R + "," + newline1R + " 0 " + 0 + " " + toward + " " + line1RightPointEnd.x + "," + line1RightPointEnd.y;
        } else {
            line1RightPath = "M" + line1LeftPoint.x + "," + line1LeftPoint.y + " A" + newline1R + "," + newline1R + " 0 " + isBigCircle + " " + toward + " " + line1RightPointEnd.x + "," + line1RightPointEnd.y;
        }

        this.horizontalRoadParam.line1RightRampPoint = line1RightPointEnd;

        this.coordinatePath.streetLine1RightRampPath = line1RightPath;

        //this.coordinatePath.testingPath = "M" + line1LeftPoint.x + "," + line1LeftPoint.y + " L" + line1RightLPoint1.x + "," + line1RightLPoint1.y + " L " + line1RightCPoint1.x + "," + line1RightCPoint1.y + " L" + line1RightCPoint2.x + "," + line1RightCPoint2.y + " L" + line1RightCPoint3.x + "," + line1RightCPoint3.y + " L" + line1RightPointEnd.x + "," + line1RightPointEnd.y;

        this.coordinatePath.streetLine1 = "M" + line1LeftPoint.x + "," + line1LeftPoint.y + " A" + line1R + "," + line1R + " 0 " + this.horizontalRoadParam.reDrawRamp.islPointBigCircle + " " + toward + " " + line1RightLPoint1.x + "," + line1RightLPoint1.y + " M" + line1RightCPoint3Inside.x + "," + line1RightCPoint3Inside.y + " A" + line1R + "," + line1R + " 0 " + 0 + " " + toward + " " + line1RightPoint.x + "," + line1RightPoint.y;

        this.rememberedLine1Right.x = line1RightPointEnd.x - 6;
        this.rememberedLine1Right.y = line1RightPointEnd.y;
        this.coordinatePath.topRightPointPath = this.getTriangle(this.rememberedLine1Right, "up");
    }

    getLine1ControllerPointForLine2Mid(midMovePointY, deg, line1R, isBigCircle, line1LeftPoint, pointNumber) {
        var line1deg = (90 - deg)//(90 - deg) * 4;
        var line1Length = Math.abs((2 * Math.PI * line1R) * line1deg / 360) * 4;//line1 change to arc length
        var line1ChangeScale = line1Length / this.horizontalRoadParam.width;

        var lPoint = this.horizontalRoadParam.Line1RightLPoint1;
        var cPoint3 = this.horizontalRoadParam.Line1RightCPoint3;

        var cPoint1ToPoint3Distance;
        var left = 0;
        if (line1ChangeScale >= 1) {
            cPoint1ToPoint3Distance = Math.abs(cPoint3.x - lPoint.x) / 3;
            left = (this.horizontalRoadParam.width * line1ChangeScale - (lPoint.x * line1ChangeScale + (cPoint3.x - lPoint.x) + (this.horizontalRoadParam.width - cPoint3.x))) / 2;
        } else {
            cPoint1ToPoint3Distance = Math.abs((cPoint3.x - lPoint.x) * line1ChangeScale) / 3;
        }

        var lPointArcLength = lPoint.x * line1ChangeScale + left;
        var islPointBigCircle = 0;
        if (lPointArcLength > (Math.PI * line1R)) {
            this.horizontalRoadParam.reDrawRamp.islPointBigCircle = 1;
        } else {
            this.horizontalRoadParam.reDrawRamp.islPointBigCircle = 0;
        }
        //if (pointNumber == 0) {
        //    lPointArcLength = lPoint.x * line1ChangeScale + left;
        //} else 
        if (pointNumber == 1) {
            lPointArcLength = lPoint.x * line1ChangeScale + left + cPoint1ToPoint3Distance;
        } else if (pointNumber == 2) {
            lPointArcLength = lPoint.x * line1ChangeScale + left + cPoint1ToPoint3Distance * 2;
        } else if (pointNumber == 3) {
            lPointArcLength = lPoint.x * line1ChangeScale + left + cPoint1ToPoint3Distance * 3;
        }

        var line1CenterPoint = {};
        var centerY = midMovePointY > 0 ? midMovePointY - line1R : midMovePointY + line1R;
        line1CenterPoint.x = this.horizontalRoadParam.width / 2;
        line1CenterPoint.y = centerY;

        var lPointArc = (lPointArcLength / (2 * Math.PI * line1R)) * 360;
        var leftPointArc;
        if (isBigCircle == 0) {
            //leftPointArc = 90 - lPointArc - (Math.asin(Math.abs(line1CenterPoint.y - line1LeftPoint.y) / line1R) * 180 / Math.PI); 
            leftPointArc = 90 - lPointArc - (Math.acos(Math.abs(line1CenterPoint.x - line1LeftPoint.x) / line1R) * 180 / Math.PI);
        } else {
            leftPointArc = 90 - lPointArc + (Math.asin(Math.abs(line1CenterPoint.y - line1LeftPoint.y) / line1R) * 180 / Math.PI);
        }

        var anglec = (180 - leftPointArc) / 2;

        var bc = Math.sin((leftPointArc / 2) * Math.PI / 180) * line1R * 2;

        var lPointEnd = {};
        lPointEnd.x = line1CenterPoint.x - bc * Math.sin(anglec * Math.PI / 180);

        if (midMovePointY > 0) {
            lPointEnd.y = line1CenterPoint.y + (line1R - bc * Math.cos(anglec * Math.PI / 180));
        } else {
            lPointEnd.y = line1CenterPoint.y - (line1R - bc * Math.cos(anglec * Math.PI / 180));
        }

        return lPointEnd;
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
            this.horizontalRoadParam.Line1RightCPoint1 = cPoint1;
            this.horizontalRoadParam.Line1RightCPoint2 = cPoint2;
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

    // Set line3 of vertical road  and line3 of horizontal road intersection square's path
    setLine3Point2Path(pointName) {
        var line1Intersection = { x: 0, y: 0 };
        if (this.verticalRoadCoordinates.startPoint.x < this.horizontalRoadParam.width) {
            line1Intersection.x = this.verticalRoadCoordinates.startPoint.x;
            line1Intersection.y = 0;
        }
        var line3MQ2 = { x: this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width, y: line1Intersection.y + this.horizontalRoadParam.height + this.verticalRoadCoordinates.line3Point2.MQ1YSpace };
        var line3Q2_1 = { x: line1Intersection.x + this.verticalRoadParam.width, y: line1Intersection.y + this.horizontalRoadParam.height };
        var line3Q2_2 = { x: line1Intersection.x + this.verticalRoadParam.width + this.verticalRoadCoordinates.line3Point2.MQ1XSpace, y: line1Intersection.y + this.horizontalRoadParam.height };

        if (pointName == "M3") {//  line3 of vertical road and line3 of horizontal road 's middle square
            this.verticalRoadParam.streetLine3 = "M" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width) + "," + this.verticalRoadCoordinates.startPoint.y + " L" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width) + "," + (line1Intersection.y - this.commonParam.distance) + " Q " + (line1Intersection.x + this.verticalRoadParam.width) + "," + line1Intersection.y + " " + (line1Intersection.x + this.verticalRoadParam.width + this.commonParam.distance) + ",0  M" + line3MQ2.x + "," + line3MQ2.y + " Q " + line3Q2_1.x + "," + line3Q2_1.y + " " + line3Q2_2.x + "," + line3Q2_2.y + "  M" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width) + "," + (line1Intersection.y + this.horizontalRoadParam.height + this.verticalRoadCoordinates.line3Point2.MQ1YSpace) + " L" + (this.verticalRoadCoordinates.endPoint.x + this.verticalRoadParam.width) + "," + this.verticalRoadCoordinates.endPoint.y;

            this.coordinatePath.streetLine3 = "M0," + this.horizontalRoadParam.height + " L" + (line1Intersection.x - this.commonParam.distance) + "," + this.horizontalRoadParam.height + " M" + (line1Intersection.x + this.verticalRoadParam.width + (this.verticalRoadCoordinates.line3Point2.MQ1XSpace < (this.commonParam.square.width / 2) ? (this.commonParam.square.width / 2) : this.verticalRoadCoordinates.line3Point2.MQ1XSpace)) + "," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height;

        } else if (pointName == "M1") {// line3 of vertical road 's square
            this.verticalRoadParam.streetLine3 = "M" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width) + "," + this.verticalRoadCoordinates.startPoint.y + " L" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width) + "," + (line1Intersection.y - this.commonParam.distance) + " Q " + (line1Intersection.x + this.verticalRoadParam.width) + "," + line1Intersection.y + " " + (line1Intersection.x + this.verticalRoadParam.width + this.commonParam.distance) + ",0  M" + line3MQ2.x + "," + line3MQ2.y + " Q " + line3Q2_1.x + "," + line3Q2_1.y + " " + line3Q2_2.x + "," + line3Q2_2.y + "  M" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width) + "," + (line1Intersection.y + this.horizontalRoadParam.height + this.verticalRoadCoordinates.line3Point2.MQ1YSpace) + " L" + (this.verticalRoadCoordinates.endPoint.x + this.verticalRoadParam.width) + "," + this.verticalRoadCoordinates.endPoint.y;

            this.coordinatePath.streetLine3 = "M0," + this.horizontalRoadParam.height + " L" + (line1Intersection.x - this.commonParam.distance) + "," + this.horizontalRoadParam.height + " M" + (line1Intersection.x + this.verticalRoadParam.width + this.verticalRoadCoordinates.line3Point2.MQ1XSpace) + "," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height;
        }
        else if (pointName == "M2") {// line3 of horizontal road 's square
            this.verticalRoadParam.streetLine3 = "M" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width) + "," + this.verticalRoadCoordinates.startPoint.y + " L" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width) + "," + (line1Intersection.y - this.commonParam.distance) + " Q " + (line1Intersection.x + this.verticalRoadParam.width) + "," + line1Intersection.y + " " + (line1Intersection.x + verticalRoadObject.width + this.commonParam.distance) + ",0  M" + line3MQ2.x + "," + line3MQ2.y + " Q " + line3Q2_1.x + "," + line3Q2_1.y + " " + line3Q2_2.x + "," + line3Q2_2.y + "  M" + (this.verticalRoadCoordinates.startPoint.x + verticalRoadObject.width) + "," + (line1Intersection.y + this.horizontalRoadParam.height + this.verticalRoadCoordinates.line3Point2.MQ1YSpace) + " L" + (this.verticalRoadCoordinates.endPoint.x + this.verticalRoadParam.width) + "," + this.verticalRoadCoordinates.endPoint.y;


            this.coordinatePath.streetLine3 = "M0," + this.horizontalRoadParam.height + " L" + (line1Intersection.x - this.commonParam.distance) + "," + this.horizontalRoadParam.height + " M" + (line1Intersection.x + this.verticalRoadParam.width + (this.verticalRoadCoordinates.line3Point2.MQ1XSpace < this.commonParam.square.width / 2 ? this.commonParam.square.width / 2 : this.verticalRoadCoordinates.line3Point2.MQ1XSpace)) + "," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height;
        }

        this.verticalRoadParam.line3Point2M1.x = line3MQ2.x - this.commonParam.square.width / 2;
        this.verticalRoadParam.line3Point2M1.y = line3MQ2.y - this.commonParam.square.height / 2;
        this.verticalRoadParam.line3Point2M2.x = line3Q2_2.x - this.commonParam.square.width;
        this.verticalRoadParam.line3Point2M2.y = line3Q2_2.y - this.commonParam.square.height / 2;
        this.verticalRoadParam.line3Point2M3 = { x: line3MQ2.x + (line3Q2_2.x - line3MQ2.x) / 2 - this.commonParam.square.width, y: line3Q2_2.y + (line3MQ2.y - line3Q2_2.y) / 2 - this.commonParam.square.height / 2 };

        if (this.verticalRoadCoordinates.line3Point2.MQ1XSpace < this.commonParam.minShowSymbolDistance && this.verticalRoadCoordinates.line3Point2.MQ1YSpace < this.commonParam.minShowSymbolDistance) {

            this.verticalRoadParam.line3Point2LPath = "";
            this.verticalRoadParam.line3Point2M1 = { x: line3MQ2.x - this.commonParam.square.width / 2, y: line3MQ2.y - this.commonParam.square.height / 2, width: 0, height: 0 };
            this.verticalRoadParam.line3Point2M2 = { x: line3Q2_2.x - this.commonParam.square.width, y: line3Q2_2.y - this.commonParam.square.height / 2, width: 0, height: 0 };


        } else {

            this.verticalRoadParam.line3Point2M1 = { x: line3MQ2.x - this.commonParam.square.width / 2, y: line3MQ2.y - this.commonParam.square.height / 2, width: this.commonParam.square.width, height: this.commonParam.square.height };

            this.verticalRoadParam.line3Point2M2.width = this.commonParam.square.width;
            this.verticalRoadParam.line3Point2M2.height = this.commonParam.square.height;

            this.verticalRoadParam.line3Point2LPath = "M" + (this.verticalRoadParam.line3Point2M1.x + this.commonParam.square.width) + "," + this.verticalRoadParam.line3Point2M1.y + " L" + (this.verticalRoadParam.line3Point2M2.x) + "," + (this.verticalRoadParam.line3Point2M2.y + this.commonParam.square.height);
        }

        if (this.verticalRoadCoordinates.line3Point2.MQ1XSpace < this.commonParam.square.width || this.verticalRoadCoordinates.line3Point2.MQ1YSpace < this.commonParam.square.height) {
            this.verticalRoadParam.line3Point2LPath = "";
        }
        if (this.verticalRoadCoordinates.line3Point2.MQ1XSpace < this.commonParam.square.width / 2) {

            this.verticalRoadParam.line3Point2M2.x = this.verticalRoadParam.line3Point2M2.x + this.commonParam.square.width / 2;
            this.verticalRoadParam.line3Point2M3.x = this.verticalRoadParam.line3Point2M3.x + this.commonParam.square.width / 2;
        }


        this.verticalRoadParam.line3Point2QPath = "M" + line3MQ2.x + ", " + line3MQ2.y + " Q " + line3Q2_1.x + ", " + line3Q2_1.y + " " + line3Q2_2.x + ", " + line3Q2_2.y;
    }

    setDisplayHorizontalRoadPoint() {
        if (this.horizontalRoadParam.isMovedCentrePoint == true) {
            $("#line1RightRampArrow").addClass("display-none");
            $("#midleft").addClass("display-none");
            $("#midright").addClass("display-none");
            $("#bottomleft-arrow").addClass("display-none");
            $("#bottomright-arrow").addClass("display-none");
        } else {
            $("#line1RightRampArrow").removeClass("display-none");
            $("#midright").removeClass("display-none");

        }
    }

    setHideHorizontalRoadPoint() {
        $("#topleft-arrow").addClass("display-none");
        $("#bottomleft-arrow").addClass("display-none");
        $("#bottomright-arrow").addClass("display-none");
    }

    //-------------GET POINTS OR PATHS DEFINE END--------------


    render() {
        this.renderRoad();

        return (
            <g transform={this.coordinatePath.transform}  >
                <defs>
                    <marker id='markerTriangleUp' markerWidth='7' strokeWidth='1' stroke="#000000" markerHeight="7" refX="0" refY="6" orient="auto">
                        <path d="M0,6 L6,6 L3,0 z" style={{ fill: 'lime' }} />
                    </marker>
                    <marker id='markerArrowUp' markerWidth='13' markerHeight="13" refX="2" refY="6" orient="auto">
                        <path d="M2,2 L10,6 L2,11" style={{ fill: 'blue' }} />
                    </marker>
                    <marker id='markerArrowDown' markerWidth='13' markerHeight="13" refX="2" refY="6" orient="auto">
                        <path d="M2,2 L12,2 L8,10" style={{ fill: 'blue' }} />
                    </marker>
                </defs>

                <g id="mainpaved1" className="display-none">
                    <g fill="#FFFFFF" fillOpacity="1.0" fillRule="evenodd" stroke="#000000" strokeWidth="1" strokeOpacity="1.0" strokeLinecap="round" strokeLinejoin="round" textAnchor="middle" fontWeight="normal">
                        <g strokeWidth="1" >
                            <g>
                                <path fill="none" d={this.verticalRoadParam.streetLine1} ></path>
                            </g>

                            <g>
                                <path fill="none" d={this.verticalRoadParam.streetLine1}></path>
                            </g>
                            <g>

                                <path fill="none" d={this.verticalRoadParam.streetLine2} strokeDasharray="20,20,20,20,10,20" fill="none" ></path>
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
                    <g id="paved1MaskLayer" stroke="lime" strokeWidth="2" strokeDasharray="12 7" strokeOpacity="1" fill="none" onMouseDown={this.readyVerticalRoadMove} onTouchStart={this.readyVerticalRoadMove}>
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
                        <rect x={this.verticalRoadParam.line3Point2M1.x} y={this.verticalRoadParam.line3Point2M1.y} width={this.verticalRoadParam.line3Point2M1.width} height={this.verticalRoadParam.line3Point2M1.height} cursor="crosshair" onMouseDown={this.readyline3Point2M1Move} onTouchStart={this.readyline3Point2M1Move} ></rect>
                        <rect x={this.verticalRoadParam.line3Point2M2.x} y={this.verticalRoadParam.line3Point2M2.y} width={this.verticalRoadParam.line3Point2M2.width} height={this.verticalRoadParam.line3Point2M2.height} cursor="crosshair" onMouseDown={this.readyline3Point2M2Move} onTouchStart={this.readyline3Point2M2Move}></rect>
                        <rect x={this.verticalRoadParam.line3Point2M3.x} y={this.verticalRoadParam.line3Point2M3.y} width={this.commonParam.square.width} height={this.commonParam.square.height} cursor="crosshair" onMouseDown={this.readyline3Point2M3Move} onTouchStart={this.readyline3Point2M3Move}></rect>
                        <g stroke="lime">
                            <path d={this.verticalRoadParam.line3Point2LPath} strokeDasharray="3,3" fill="lime" strokeLinecap="butt"></path>
                        </g>
                        <path d={this.verticalRoadParam.line3Point2QPath} strokeDasharray="3,3" fill="none" stroke="lime" strokeLinecap="butt"></path>
                        <g fill="#0000FF" strokeOpacity="0" strokeWidth="0" transform={this.verticalRoadParam.point2TextV.textRoate} fontSize="13" className="userSelect">
                            <g stroke="blue" strokeWidth="1" strokeOpacity="1">
                                <path d={this.verticalRoadParam.point2TextV.textLine} ></path>
                            </g>
                            <text x={this.verticalRoadParam.point2TextV.x} y={this.verticalRoadParam.point2TextV.y} textAnchor="middle" textLength={this.verticalRoadParam.point2TextV.textLength}>{this.verticalRoadParam.point2TextV.text}</text>
                        </g>

                        <g fill="#0000FF" strokeOpacity="0" strokeWidth="0" transform={this.verticalRoadParam.point2TextH.textRoate} fontSize="13" className="userSelect">
                            <g stroke="blue" strokeWidth="1" strokeOpacity="1">
                                <path d={this.verticalRoadParam.point2TextH.textLine} ></path>
                            </g>
                            <text x={this.verticalRoadParam.point2TextH.x} y={this.verticalRoadParam.point2TextH.y} textAnchor="middle" textLength={this.verticalRoadParam.point2TextH.textLength}>{this.verticalRoadParam.point2TextH.text}</text>
                        </g>
                    </g>

                </g>

                <g id="mainpaved2" onMouseDown={this.readyMoveRoad} onTouchStart={this.readyMoveRoad} >
                    <g fill="#FFFFFF" fillOpacity="1.0" fillRule="evenodd" stroke="#000000" strokeWidth="1" strokeOpacity="1.0" strokeLinecap="round" strokeLinejoin="round" textAnchor="middle" fontWeight="normal">
                        <g strokeWidth="2" >
                            <g stroke="red" strokeWidth="6">
                                <path fill="none" d={this.coordinatePath.testingPath}></path>
                            </g>
                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine1RightRampPath}></path>
                            </g>

                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine1}></path>
                            </g>
                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine2} strokeDasharray="20,20,20,20,10,20" strokeLinecap="butt"></path>
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

                    <g id="topRightText" fill="#0000FF" strokeOpacity="0" strokeWidth="0" transform={this.coordinatePath.textRoate} fontSize="13" className="userSelect">
                        <g stroke="blue" strokeWidth="1" strokeOpacity="1">
                            <path d={this.coordinatePath.textLine}></path>
                        </g>
                        <text x={this.horizontalRoadParam.rightText.x} y={this.horizontalRoadParam.rightText.y} textAnchor="middle" textLength={this.horizontalRoadParam.rightText.textLength}>{this.horizontalRoadParam.rightText.text}</text>
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
                    <g id="line1RightRampArrow" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onTouchStart={this.readyLine1RightRampMove} onMouseDown={this.readyLine1RightRampMove}>
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
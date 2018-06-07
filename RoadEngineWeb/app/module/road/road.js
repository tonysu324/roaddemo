
'use strict';

class Road extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topMidMoving: false,
            reRender: 0
        };

        var isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
        var scale = isMobile ? 1.5 : 1;
        this.commonParam = {
            distance: 40,
            minShowSymbolDistance: 30,
            triangle: {
                width: 12 * scale,
                height: 12 * scale,
                halfWidth: 6 * scale,
                halfHeight: 6 * scale,
            },
            square: {
                width: 10 * scale,
                height: 10 * scale
            },
            rhombi: {
                width: 12 * scale,
                height: 12 * scale,
                halfHeight: 6 * scale
            },
        }

        this.horizontalRoadParam = {
            width: roadObject.width,
            height: roadObject.height,
            rememberLastWidth: roadObject.width,
            line1RampMoveY: 0,//top two point moved distance
            line3RampMoveY: 0,//bottom two point moved distance
            moveLine2MidPointY: 0,
            isMovedCentrePoint: false,
            isDrawLine1LeftRamp: false,//is moved top line's left point
            isDrawLine1RightRamp: false,//is moved  top line's left point
            isDrawLine3LeftRamp: false,//is moved bottom line's left point
            isDrawLine3RightRamp: false,//is moved bottom line's right point
            fixedWidthRatio: 1.02,
            fixedHeightRatio: 2.36,
            centrePoint: {
                x: roadObject.width / 2,
                y: roadObject.height / 2
            },
            Line1RampText: {//write the text and draw arrow distance when top point is moved
                text: "",
                textLength: 0,
                x: roadObject.width,
                y: 0
            },
            Line3RampText: {//write the text and draw arrow distance when bottom point is moved
                text: "",
                textLength: 0,
                x: roadObject.width,
                y: 0
            },
            maskLayerPaths: {
                Path: "M0," + roadObject.height / 2 + " L" + roadObject.width + "," + roadObject.height / 2,
            },
            line1RightRampPoint: { x: roadObject.width, y: 0 },//the line1's right point(when the point is moved and draw the line1 ramp)
            line1RightPoint: { x: roadObject.width - this.commonParam.triangle.width, y: 0 },//the line1's right point (when the center point is moved)
            line1LeftRampPoint: { x: 0, y: 0 },//the line1's left point(when the point is moved and draw the line1 ramp)
            line1LeftPoint: { x: 0, y: 0 },//the line1's right point (when the center point is moved)
            line3RightRampPoint: { x: roadObject.width, y: roadObject.height },//the line3's right point(when the point is moved and draw the line3 ramp)
            line3RightPoint: { x: roadObject.width - this.commonParam.triangle.width, y: roadObject.height },//the line3's right point (when the center point is moved)
            line3LeftRampPoint: { x: 0, y: roadObject.height },//the line3's left point(when the point is moved and draw the line3 ramp)
            line3LeftPoint: { x: 0, y: roadObject.height },//the line3's left point (when the center point is moved)
            Line2RightRotate: 0,
            rememberRoadLine2RightPointCoordinate: { x: 0, y: 0 },
            Line1RightLPoint1: null,//line1 draw the ramp left point
            Line1RightCPoint1: null,//line1 draw the (bezier-curve) ramp first point
            Line1RightCPoint2: null,//line1 draw the (bezier-curve) ramp second point
            Line1RightCPoint3: null,//line1 draw the (bezier-curve) ramp third point
            Line3RampLPoint1: null,//line3 draw the ramp left point
            Line3RampCPoint1: null,//line3 draw the (bezier-curve) ramp first point
            Line3RampCPoint2: null,//line3 draw the (bezier-curve) ramp second point
            Line3RampCPoint3: null,//line3 draw the (bezier-curve) ramp third point
            reDrawRamp: {
                midMovePointY: 0,
                deg: 0,
                line1R: 0,//the line1's radius (when the center point is moved, the road is become to a circle)
                line3R: 0,//the line3's radius (when the center point is moved, the road is become to a circle)
                isBigCircle: 0,
                isInside: false,
                toward: 0,
                islPointBigCircle: 0,//draw line1's big circle or not 
                is3PointBigCircle: 0//draw line3's big circle or not 
            }
        };

        this.coordinatePath = {
            topLeftPointPath: "",
            streetLine1: "M0,0 L" + this.horizontalRoadParam.width + ",0",
            streetLine2: this.getLine2Path(),
            streetLine3: "M0," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height,
            streetLine1RampPath: "",//line1 ramp path
            streetLine3RampPath: "",//line3 ramp path
            line1RampTrianglePath: "",//line2 ramp center point
            line3RampTrianglePath: "",//line3 ramp center point
            Line1TextRoate: "",
            Line1RampText: "",
            Line3TextRoate: "",
            Line3RampText: "",
            pavedFillPath: "M0,0 L" + this.horizontalRoadParam.width + ",0 L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height + " L0," + this.horizontalRoadParam.height,
            transform: ""
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
            streetLine1: "M" + (roadObject.width / 2 - this.getHorizontalRoadHalfHeight()) + "," + (-roadObject.width / 2 + this.getHorizontalRoadHalfHeight()) + " L" + (roadObject.width / 2 - this.getHorizontalRoadHalfHeight()) + "," + (roadObject.width / 2 + this.getHorizontalRoadHalfHeight()),
            streetLine2: "M" + roadObject.width / 2 + "," + (-roadObject.width / 2 + this.getHorizontalRoadHalfHeight()) + " L" + (roadObject.width / 2) + "," + (roadObject.width / 2 + this.getHorizontalRoadHalfHeight()),
            streetLine3: "M" + (roadObject.width / 2 + this.getHorizontalRoadHalfHeight()) + "," + (-roadObject.width / 2 + this.getHorizontalRoadHalfHeight()) + " L" + (roadObject.width / 2 + this.getHorizontalRoadHalfHeight()) + "," + (roadObject.width / 2 + this.getHorizontalRoadHalfHeight()),
            maskLayerPath1: "M" + (roadObject.width / 2) + "," + (-roadObject.width / 2 + this.getHorizontalRoadHalfHeight()) + " L" + (roadObject.width / 2) + "," + (roadObject.width / 2 + this.getHorizontalRoadHalfHeight()),
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

        this.drawControllerPointPaths();
    }

    renderRoad() {
        this.drawControllerPointPaths();
        this.drawRoadPaths();
    }

    getHorizontalRoadHalfHeight() {
        return this.horizontalRoadParam.height / 2;
    }

    getHorizontalRoadHalfWidth() {
        return this.horizontalRoadParam.width / 2;
    }

    //draw controller points in this road component
    drawControllerPointPaths() {
        if (this.props.movingType == 'Road' || this.props.movingType == '') {
            if (this.props.movingType == '') {
                this.lastRoadPoint = {
                    x: this.props.point.x,
                    y: this.props.point.y
                }
                this.coordinatePath.roadCoordinate = { x: (this.props.point.x - this.getHorizontalRoadHalfWidth()), y: (this.props.point.y - this.getHorizontalRoadHalfHeight()) };
                this.horizontalRoadParam.rememberRoadLine2RightPointCoordinate = { x: this.coordinatePath.roadCoordinate.x + this.horizontalRoadParam.width, y: this.coordinatePath.roadCoordinate.y + this.getHorizontalRoadHalfHeight() };

                this.coordinatePath.transform = "translate(" + this.coordinatePath.roadCoordinate.x + "," + this.coordinatePath.roadCoordinate.y + ") rotate(" + this.horizontalRoadParam.Line2RightRotate + ", 0," + this.getHorizontalRoadHalfHeight() + ")";
            } else {
                this.coordinatePath.roadCoordinate = this.props.coordinate;
                this.coordinatePath.transform = "translate(" + this.props.coordinate.x + "," + this.props.coordinate.y + ") rotate(" + this.horizontalRoadParam.Line2RightRotate + ", 0," + this.getHorizontalRoadHalfHeight() + ")";

                this.horizontalRoadParam.rememberRoadLine2RightPointCoordinate = { x: this.horizontalRoadParam.rememberRoadLine2RightPointCoordinateTemp.x + this.props.movedDistance.x, y: this.horizontalRoadParam.rememberRoadLine2RightPointCoordinateTemp.y + this.props.movedDistance.y };

                this.lastRoadPoint = {
                    x: this.coordinatePath.roadCoordinate.x + this.getHorizontalRoadHalfWidth(),
                    y: this.coordinatePath.roadCoordinate.y + this.getHorizontalRoadHalfHeight()
                }
            }
        }
        else if (this.props.movingType == 'VerticalRoad') {
            this.lastVerticalRoadPoint = {
                x: this.props.point.x,
                y: this.props.point.y
            }
        }

        if (this.props.movingType == "Line1Left") {
            this.horizontalRoadParam.isDrawLine1RightRamp = true;
            this.horizontalRoadParam.isDrawLine1LeftRamp = false;
        } else if (this.props.movingType == "Line1Right") {
            this.horizontalRoadParam.isDrawLine1LeftRamp = true;
            this.horizontalRoadParam.isDrawLine1RightRamp = false;
        } else if (this.props.movingType == "Line3Left") {
            this.horizontalRoadParam.isDrawLine3LeftRamp = true;
            this.horizontalRoadParam.isDrawLine3RightRamp = false;
        } else if (this.props.movingType == "Line3Right") {
            this.horizontalRoadParam.isDrawLine3LeftRamp = true;
            this.horizontalRoadParam.isDrawLine3RightRamp = false;
        }

        // if the line 1 left point is moved, triangle should be the moved point, or else line 1 left point
        if (!this.horizontalRoadParam.isDrawLine1LeftRamp) {
            this.coordinatePath.topLeftPointPath = this.getTriangle(this.horizontalRoadParam.line1LeftPoint, "up");
        } else {
            this.coordinatePath.topLeftPointPath = this.getTriangle(this.horizontalRoadParam.line1LeftRampPoint, "up");
        }

        // if the line 1 right point is moved, triangle should be the moved point, or else line 1 right point
        if (!this.horizontalRoadParam.isDrawLine1RightRamp) {
            this.coordinatePath.topRightPointPath = this.getTriangle(this.horizontalRoadParam.line1RightPoint, "up");
        } else {
            this.coordinatePath.topRightPointPath = this.getTriangle(this.horizontalRoadParam.line1RightRampPoint, "up");
        }

        // if the line 3 left point is moved, triangle should be the moved point, or else line 3 left point
        if (!this.horizontalRoadParam.isDrawLine3LeftRamp) {
            this.coordinatePath.bottomleftPointPath = this.getTriangle(this.horizontalRoadParam.line3LeftPoint, "down");
        } else {
            this.coordinatePath.bottomleftPointPath = this.getTriangle(this.horizontalRoadParam.line3LeftRampPoint, "down");
        }

        // if the line 3 right point is moved, triangle should be the moved point, or else line 3 right point
        if (!this.horizontalRoadParam.isDrawLine3RightRamp) {
            this.coordinatePath.bottomrightPointPath = this.getTriangle(this.horizontalRoadParam.line3RightPoint, "down");
        } else {
            this.coordinatePath.bottomrightPointPath = this.getTriangle(this.horizontalRoadParam.line3RightRampPoint, "down");
        }

        if (!this.horizontalRoadParam.isMovedCentrePoint) {
            this.coordinatePath.midleftPoint = { x: -this.commonParam.square.width * 3, y: (this.getHorizontalRoadHalfHeight() - this.commonParam.rhombi.halfHeight), width: this.commonParam.square.width, height: this.commonParam.square.height };
            this.coordinatePath.midrightPoint = { x: this.horizontalRoadParam.width + this.commonParam.square.width * 2, y: (this.getHorizontalRoadHalfHeight() - this.commonParam.rhombi.halfHeight), transform: "", width: this.commonParam.square.width, height: this.commonParam.square.height };
        }

        this.coordinatePath.midmidBigPointPath = { x: this.getHorizontalRoadHalfWidth(), y: this.getHorizontalRoadHalfHeight() - this.commonParam.rhombi.halfHeight }
        
        if (!this.horizontalRoadParam.isMovedCentrePoint) {
            this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);
        } else {
            this.coordinatePath.midmidPointPath = this.getRhombi(this.horizontalRoadParam.centrePoint);
        }
    }

    //draw all line,symbol,text path of this road component
    drawRoadPaths() {
        var movePointX = this.props.point.x - this.coordinatePath.roadCoordinate.x - this.getHorizontalRoadHalfWidth();// X mouse moving distance

        var minMoveX = -40;
        var maxMoveX = this.horizontalRoadParam.width / 4;// restrict move min, max width
        if (movePointX > maxMoveX) {
            movePointX = maxMoveX; 
        }
        if (movePointX < minMoveX) {
            movePointX = minMoveX;
        }

        if (this.props.movingType == 'Line1Right') {
            this.moveToDrawLine1LeftRightRamp(this.props.movingType);
        }
        else if (this.props.movingType == 'Line1Left') {
            this.moveToDrawLine1LeftRightRamp(this.props.movingType);
        }
        else if (this.props.movingType == 'Line3Left') {
            this.moveToDrawLine3LeftRightRamp(this.props.movingType);
        }
        else if (this.props.movingType == 'Line3Right') {
            this.moveToDrawLine3LeftRightRamp(this.props.movingType);
        }
        else if (this.props.movingType == 'TopMid') {
            this.moveToDrawLine1CentreRamp(movePointX);// move line1 right ramp
        }
        else if (this.props.movingType == 'BottomMid') {
            this.moveToDrawLine3CentreRamp(movePointX);// move line3 right ramp
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

    //get the line 1 is left or right point moved distance
    getLine1MoveY(roadCoordinate, lineRotateDeg, isInSide, isBigCircle) {
        var movePointY = 0;
        var relatedTriangleA1 = 0, relatedTriangleB1 = 0, relatedTriangleC1 = 0, relatedTriangleA2 = 0, relatedTriangleC2 = 0;
        if (lineRotateDeg == 0) {//if the road is not rotate, the movepointy is mouse point.y - roadcoordinate.y
            movePointY = - (roadCoordinate.y - this.props.point.y);// Y mouse moving distance
        }
        else if (lineRotateDeg < 0) {//when the road rotate up the rotate deg < 0
            if (this.horizontalRoadParam.isDrawLine1RightRamp) {
                if (!isBigCircle) {
                    relatedTriangleB1 = this.props.point.x - roadCoordinate.x;
                    relatedTriangleA1 = Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleB1;
                    relatedTriangleC2 = roadCoordinate.y + this.getHorizontalRoadHalfHeight() - this.props.point.y - relatedTriangleA1;
                    movePointY = -(Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleC2 - this.getHorizontalRoadHalfHeight());
                } else { 
                    relatedTriangleB1 = roadCoordinate.x - this.props.point.x;
                    relatedTriangleA1 = Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleB1;
                    relatedTriangleC2 = this.props.point.y - (roadCoordinate.y + this.getHorizontalRoadHalfHeight()) - relatedTriangleA1;
                    movePointY = relatedTriangleC2 * Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180) - this.getHorizontalRoadHalfHeight();
                }
            } else if (this.horizontalRoadParam.isDrawLine1LeftRamp) {
                if (!isBigCircle) {
                    relatedTriangleB1 = this.props.point.x - roadCoordinate.x;
                    relatedTriangleA1 = Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleB1;
                    relatedTriangleC2 = roadCoordinate.y + this.getHorizontalRoadHalfHeight() - this.props.point.y - relatedTriangleA1;
                    movePointY = -(Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleC2 - this.getHorizontalRoadHalfHeight());
                } else {
                    relatedTriangleB1 = this.props.point.x - roadCoordinate.x;
                    relatedTriangleA1 = Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleB1;
                    relatedTriangleC2 = this.props.point.y - (roadCoordinate.y + this.getHorizontalRoadHalfHeight()) + relatedTriangleA1;
                    movePointY = relatedTriangleC2 * Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180) - this.getHorizontalRoadHalfHeight();
                }
            }
        } else if (lineRotateDeg > 0) {////when the road rotate down the rotate deg > 0
            if (this.horizontalRoadParam.isDrawLine1RightRamp) {
                if (!isBigCircle) {
                    relatedTriangleA1 = roadCoordinate.y + this.getHorizontalRoadHalfHeight() - this.props.point.y;
                    relatedTriangleC1 = relatedTriangleA1 / Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180);
                    relatedTriangleB1 = relatedTriangleA1 * Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180);
                    relatedTriangleC2 = this.props.point.x - roadCoordinate.x - relatedTriangleB1;
                    relatedTriangleA2 = Math.sin(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleC2;
                    movePointY = -(relatedTriangleA2 + relatedTriangleC1 - this.getHorizontalRoadHalfHeight());
                } else {
                    relatedTriangleB1 = this.props.point.x - roadCoordinate.x;
                    relatedTriangleA1 = Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleB1;
                    relatedTriangleC2 = this.props.point.y - relatedTriangleA1 - (roadCoordinate.y + this.getHorizontalRoadHalfHeight());
                    movePointY = (Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleC2 - this.getHorizontalRoadHalfHeight());
                }
            } else if (this.horizontalRoadParam.isDrawLine1LeftRamp) {
                if (!isBigCircle) {
                    relatedTriangleB1 = roadCoordinate.x - this.props.point.x;
                    relatedTriangleA1 = Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleB1;
                    relatedTriangleC2 = roadCoordinate.y + this.getHorizontalRoadHalfHeight() - this.props.point.y - relatedTriangleA1;
                    movePointY = -(Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleC2 - this.getHorizontalRoadHalfHeight());
                } else { 
                    relatedTriangleA1 = this.props.point.y - (roadCoordinate.y + this.getHorizontalRoadHalfHeight());
                    relatedTriangleC1 = relatedTriangleA1 / Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180);
                    relatedTriangleB1 = relatedTriangleA1 * Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180);
                    relatedTriangleC2 = roadCoordinate.x - this.props.point.x - relatedTriangleB1;
                    relatedTriangleA2 = Math.sin(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleC2;
                    movePointY = relatedTriangleA2 + relatedTriangleC1 - this.getHorizontalRoadHalfHeight();
                }
            }
        }

        return movePointY;
    }

    //get the line 3 is left or right point moved distance
    getLine3MoveY(roadCoordinate, lineRotateDeg, isInSide, isBigCircle) {
        var movePointY = 0;
        var relatedTriangleA1 = 0, relatedTriangleB1 = 0, relatedTriangleC1 = 0, relatedTriangleA2 = 0, relatedTriangleC2 = 0;
        if (lineRotateDeg == 0) {//if the road is not rotate, the movepointy is mouse point.y - roadcoordinate.y
            movePointY = this.props.point.y - roadCoordinate.y;// Y mouse moving distance
        }
        else if (lineRotateDeg < 0) {//when the road rotate up the rotate deg < 0
            if (this.horizontalRoadParam.isDrawLine3RightRamp) {
                if (!isBigCircle) {
                    relatedTriangleB1 = roadCoordinate.x - this.props.point.x;
                    relatedTriangleA1 = Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleB1;
                    relatedTriangleC2 = this.props.point.y - (roadCoordinate.y + this.getHorizontalRoadHalfHeight()) - relatedTriangleA1;
                    movePointY = relatedTriangleC2 * Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180) + this.getHorizontalRoadHalfHeight();
                } else { 
                    relatedTriangleB1 = this.props.point.x - roadCoordinate.x;
                    relatedTriangleA1 = Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleB1;
                    relatedTriangleC2 = roadCoordinate.y + this.getHorizontalRoadHalfHeight() - this.props.point.y - relatedTriangleA1;
                    movePointY = (Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleC2 + this.getHorizontalRoadHalfHeight());
                }
            } else if (this.horizontalRoadParam.isDrawLine3LeftRamp) {
                if (!isBigCircle) { 
                    relatedTriangleB1 = this.props.point.x - roadCoordinate.x;
                    relatedTriangleA1 = Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleB1;
                    relatedTriangleC2 = this.props.point.y - (roadCoordinate.y + this.getHorizontalRoadHalfHeight()) + relatedTriangleA1;
                    movePointY = relatedTriangleC2 * Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180) + this.getHorizontalRoadHalfHeight();
                } else {
                    relatedTriangleB1 = this.props.point.x - roadCoordinate.x;
                    relatedTriangleA1 = Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleB1;
                    relatedTriangleC2 = roadCoordinate.y + this.getHorizontalRoadHalfHeight() - this.props.point.y - relatedTriangleA1;
                    movePointY = (Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleC2 + this.getHorizontalRoadHalfHeight());
                }
            }
        } else if (lineRotateDeg > 0) {////when the road rotate down the rotate deg > 0
            if (this.horizontalRoadParam.isDrawLine3RightRamp) {
                if (!isBigCircle) {
                    relatedTriangleB1 = this.props.point.x - roadCoordinate.x;
                    relatedTriangleA1 = Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleB1;
                    relatedTriangleC2 = this.props.point.y - relatedTriangleA1 - (roadCoordinate.y + this.getHorizontalRoadHalfHeight());
                    movePointY = (Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleC2 + this.getHorizontalRoadHalfHeight());
                } else {
                    relatedTriangleA1 = roadCoordinate.y + this.getHorizontalRoadHalfHeight() - this.props.point.y;
                    relatedTriangleC1 = relatedTriangleA1 / Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180);
                    relatedTriangleB1 = relatedTriangleA1 * Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180);
                    relatedTriangleC2 = this.props.point.x - roadCoordinate.x - relatedTriangleB1;
                    relatedTriangleA2 = Math.sin(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleC2;
                    movePointY = (relatedTriangleA2 + relatedTriangleC1 + this.getHorizontalRoadHalfHeight());
                }
            } else if (this.horizontalRoadParam.isDrawLine3LeftRamp) {
                if (!isBigCircle) {
                    relatedTriangleA1 = this.props.point.y - (roadCoordinate.y + this.getHorizontalRoadHalfHeight());
                    relatedTriangleC1 = relatedTriangleA1 / Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180);
                    relatedTriangleB1 = relatedTriangleA1 * Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180);
                    relatedTriangleC2 = roadCoordinate.x - this.props.point.x - relatedTriangleB1;
                    relatedTriangleA2 = Math.sin(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleC2;
                    movePointY = relatedTriangleA2 + relatedTriangleC1 + this.getHorizontalRoadHalfHeight();
                } else {               
                    relatedTriangleB1 = roadCoordinate.x - this.props.point.x;
                    relatedTriangleA1 = Math.tan(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleB1;
                    relatedTriangleC2 = roadCoordinate.y + this.getHorizontalRoadHalfHeight() - this.props.point.y - relatedTriangleA1;
                    movePointY = (Math.cos(Math.abs(lineRotateDeg) * Math.PI / 180) * relatedTriangleC2 + this.getHorizontalRoadHalfHeight());
                }
            }
        }  

        return movePointY;
    }

    //set the line 1 point to default when left or right point is moved
    setLine1PointToDefault(movingType) {
        this.horizontalRoadParam.line1RampMoveY = 0;
        if (movingType == 'Line1Right') {
            if (this.horizontalRoadParam.isDrawLine1LeftRamp) {
                this.coordinatePath.streetLine1RampPath = "";
                this.horizontalRoadParam.Line1RampText.text = "";
                this.coordinatePath.Line1RampText = "";
            }
            this.horizontalRoadParam.isDrawLine1RightRamp = true;
            this.horizontalRoadParam.isDrawLine1LeftRamp = false;

            if (this.horizontalRoadParam.isMovedCentrePoint) {
                this.horizontalRoadParam.line1LeftRampPoint = this.horizontalRoadParam.line1LeftPoint;
            } else {
                this.horizontalRoadParam.line1LeftRampPoint = { x: 0, y: 0 };
            }

            this.coordinatePath.topLeftPointPath = this.getTriangle(this.horizontalRoadParam.line1LeftRampPoint, "up");

        } else if (movingType == 'Line1Left') {
            if (this.horizontalRoadParam.isDrawLine1RightRamp) {
                this.coordinatePath.streetLine1RampPath = "";
                this.horizontalRoadParam.Line1RampText.text = "";
                this.coordinatePath.Line1RampText = "";
            }
            this.horizontalRoadParam.isDrawLine1LeftRamp = true;
            this.horizontalRoadParam.isDrawLine1RightRamp = false;
            if (this.horizontalRoadParam.isMovedCentrePoint) {
                this.horizontalRoadParam.line1RightRampPoint = this.horizontalRoadParam.line1RightPoint;
            } else {
                this.horizontalRoadParam.line1RightRampPoint = { x: this.horizontalRoadParam.width - this.commonParam.triangle.width, y: 0 };
            }

            this.coordinatePath.topRightPointPath = this.getTriangle(this.horizontalRoadParam.line1RightRampPoint, "up");
        }
    }

    //set the line 3 point to default when left or right point is moved
    setLine3PointToDefault(movingType) {
        this.horizontalRoadParam.line3RampMoveY = 0;
        if (movingType == 'Line3Right') {
            if (this.horizontalRoadParam.isDrawLine3LeftRamp) {
                this.coordinatePath.streetLine3RampPath = "";
                this.horizontalRoadParam.Line3RampText.text = "";
                this.coordinatePath.Line3RampText = "";
            }
            this.horizontalRoadParam.isDrawLine3RightRamp = true;
            this.horizontalRoadParam.isDrawLine3LeftRamp = false;

            if (this.horizontalRoadParam.isMovedCentrePoint) {
                this.horizontalRoadParam.line3LeftRampPoint = this.horizontalRoadParam.line3LeftPoint;
            } else {
                this.horizontalRoadParam.line3LeftRampPoint = { x: 0, y: this.horizontalRoadParam.height };
            }

            this.coordinatePath.bottomleftPointPath = this.getTriangle(this.horizontalRoadParam.line3LeftRampPoint, "down");

        } else if (movingType == 'Line3Left') {
            if (this.horizontalRoadParam.isDrawLine3RightRamp) {
                this.coordinatePath.streetLine3RampPath = "";
                this.horizontalRoadParam.Line3RampText.text = "";
                this.coordinatePath.Line3RampText = "";
            }
            this.horizontalRoadParam.isDrawLine3LeftRamp = true;
            this.horizontalRoadParam.isDrawLine3RightRamp = false;
            if (this.horizontalRoadParam.isMovedCentrePoint) {
                this.horizontalRoadParam.line3RightRampPoint = this.horizontalRoadParam.line3RightPoint;
            } else {
                this.horizontalRoadParam.line3RightRampPoint = { x: this.horizontalRoadParam.width - this.commonParam.triangle.width, y: this.horizontalRoadParam.height };
            }

            this.coordinatePath.bottomrightPointPath = this.getTriangle(this.horizontalRoadParam.line3RightRampPoint, "down");
        }
    }

    //                                   25'
    //draw line 1 right text, e.g.  <---------->
    drawLine1RightText(movingType) {
        var rampText = (this.horizontalRoadParam.line1RampMoveY * -1) / 4 + "";
        var line1MoveY = (this.horizontalRoadParam.line1RampMoveY * -1);

        var calculatePoint = {};

        if (movingType == undefined) {
            if (this.horizontalRoadParam.isDrawLine1LeftRamp) {
                movingType = 'Line1Left';
            } else if (this.horizontalRoadParam.isDrawLine1RightRamp) {
                movingType = 'Line1Right';
            } else {
                return;
            }
        }

        if (movingType == "Line1Right") {
            calculatePoint = this.horizontalRoadParam.line1RightPoint;
            this.horizontalRoadParam.Line1RampText.y = calculatePoint.y + 20;
        } else {
            calculatePoint = this.horizontalRoadParam.line1LeftPoint;
            this.horizontalRoadParam.Line1RampText.y = calculatePoint.y - 10;
        }

        this.horizontalRoadParam.Line1RampText.x = calculatePoint.x - (line1MoveY / 2 + this.horizontalRoadParam.Line1RampText.textLength / 2) + 15;

        if (rampText.length > 4) rampText = rampText.substring(0, rampText.indexOf("."));
        this.horizontalRoadParam.Line1RampText.text = rampText + "'";
        this.horizontalRoadParam.Line1RampText.textLength = this.horizontalRoadParam.Line1RampText.text.length * 8;

        if (this.horizontalRoadParam.Line1RampText.textLength > line1MoveY || line1MoveY < 25) {
            this.horizontalRoadParam.Line1RampText.text = "";
            this.coordinatePath.Line1RampText = "";
        }
        else {
            var arrowDistance = 6;
            var line1PointY = calculatePoint.y;

            this.coordinatePath.Line1RampText = "M" + (calculatePoint.x - line1MoveY) + " ," + line1PointY + " L" + calculatePoint.x + " ," + line1PointY + " M" + (calculatePoint.x - arrowDistance) + " " + (line1PointY - arrowDistance) + ",L " + calculatePoint.x + " " + line1PointY + " M " + calculatePoint.x + "," + line1PointY + " L " + (calculatePoint.x - arrowDistance) + " " + (line1PointY + arrowDistance) + " M" + (calculatePoint.x - line1MoveY + arrowDistance) + "," + (line1PointY - arrowDistance) + ",L " + (calculatePoint.x - line1MoveY) + " " + line1PointY + " M " + (calculatePoint.x - line1MoveY) + "," + line1PointY + " L " + (calculatePoint.x - line1MoveY + arrowDistance) + " " + (line1PointY + arrowDistance);

            var rotateDeg = 90;
            if (this.horizontalRoadParam.isMovedCentrePoint == true) {
                var c = this.getHorizontalRoadHalfHeight();
                var a = Math.abs(calculatePoint.y - this.getHorizontalRoadHalfHeight());

                rotateDeg = Math.asin(a / c) * 180 / Math.PI;

                if (this.horizontalRoadParam.isInside == false) {
                    if (this.horizontalRoadParam.isBigCircle) {
                        rotateDeg = rotateDeg + 180;
                    } else {
                        rotateDeg = 180 - rotateDeg;
                    }
                } else {
                    if (this.horizontalRoadParam.isBigCircle) {
                        rotateDeg = -rotateDeg;
                    } else {
                        rotateDeg = rotateDeg;
                    }
                }
            }

            if (movingType == "Line1Right") {
                this.coordinatePath.Line1TextRoate = "rotate(" + rotateDeg + ", " + (calculatePoint.x) + ",  " + calculatePoint.y + ")";
            } else {
                this.coordinatePath.Line1TextRoate = "rotate(" + (180 - rotateDeg) + ", " + (calculatePoint.x) + ",  " + calculatePoint.y + ")";
            }
        }
    }

    //                                   25'
    //draw line 3 right text, e.g.  <---------->
    drawLine3RightText(movingType) {
        var calcMoveY = this.horizontalRoadParam.height - this.horizontalRoadParam.line3RampMoveY;
        var rampText = (calcMoveY * -1) / 4 + "";
        var line3MoveY = (calcMoveY * -1);

        var calculatePoint = {};

        if (movingType == undefined) {
            if (this.horizontalRoadParam.isDrawLine3LeftRamp) {
                movingType = 'Line3Left';
            } else if (this.horizontalRoadParam.isDrawLine3RightRamp) {
                movingType = 'Line3Right';
            } else {
                return;
            }
        }

        if (movingType == "Line3Right") {
            calculatePoint = this.horizontalRoadParam.line3RightPoint;
            this.horizontalRoadParam.Line3RampText.y = calculatePoint.y - 10;
        } else if (movingType == "Line3Left") {
            calculatePoint = this.horizontalRoadParam.line3LeftPoint;
            this.horizontalRoadParam.Line3RampText.y = calculatePoint.y + 20;
        }

        this.horizontalRoadParam.Line3RampText.x = calculatePoint.x - (line3MoveY / 2 + this.horizontalRoadParam.Line3RampText.textLength / 2) + 15;

        if (rampText.length > 4) rampText = rampText.substring(0, rampText.indexOf("."));
        this.horizontalRoadParam.Line3RampText.text = rampText + "'";
        this.horizontalRoadParam.Line3RampText.textLength = this.horizontalRoadParam.Line3RampText.text.length * 8;

        if (this.horizontalRoadParam.Line3RampText.textLength > line3MoveY || line3MoveY < 25) {
            this.horizontalRoadParam.Line3RampText.text = "";
            this.coordinatePath.Line3RampText = "";
        }
        else {
            var arrowDistance = 6;
            var line3PointY = calculatePoint.y;

            this.coordinatePath.Line3RampText = "M" + (calculatePoint.x - line3MoveY) + "," + line3PointY + " L" + calculatePoint.x + "," + line3PointY + " M" + (calculatePoint.x - arrowDistance) + " " + (line3PointY - arrowDistance) + ",L " + calculatePoint.x + " " + line3PointY + " M " + calculatePoint.x + "," + line3PointY + " L " + (calculatePoint.x - arrowDistance) + " " + (line3PointY + arrowDistance) + " M" + (calculatePoint.x - line3MoveY + arrowDistance) + "," + (line3PointY - arrowDistance) + ",L " + (calculatePoint.x - line3MoveY) + " " + line3PointY + " M " + (calculatePoint.x - line3MoveY) + "," + line3PointY + " L " + (calculatePoint.x - line3MoveY + arrowDistance) + " " + (line3PointY + arrowDistance);

            var rotateDeg = -90;
            if (this.horizontalRoadParam.isMovedCentrePoint == true) {
                var c = this.getHorizontalRoadHalfHeight();
                var a = Math.abs(calculatePoint.y - this.getHorizontalRoadHalfHeight());

                rotateDeg = Math.asin(a / c) * 180 / Math.PI;

                if (this.horizontalRoadParam.isInside == false) {
                    if (this.horizontalRoadParam.isBigCircle) {
                        rotateDeg = rotateDeg;
                    } else {
                        rotateDeg = -rotateDeg;
                    }
                } else {
                    if (this.horizontalRoadParam.isBigCircle) {
                        rotateDeg = 180 - rotateDeg;
                    } else {
                        rotateDeg = rotateDeg - 180;
                    }
                }
            }

            if (movingType == "Line3Right") {
                this.coordinatePath.Line3TextRoate = "rotate(" + rotateDeg + ", " + (calculatePoint.x) + ",  " + calculatePoint.y + ")";
            } else {
                this.coordinatePath.Line3TextRoate = "rotate(" + (180 - rotateDeg) + ", " + (calculatePoint.x) + ",  " + calculatePoint.y + ")";
            }
        }
    }

    drawVRoadLine3Point2Text(isHide) {
        var rampText = (this.verticalRoadCoordinates.line3Point2.MQ1YSpace) / 4 + "";
        if (rampText.length > 4) rampText = rampText.substring(0, rampText.indexOf("."));

        this.verticalRoadParam.point2TextV.text = rampText + "'";

        var vLine3MoveY = this.verticalRoadCoordinates.line3Point2.MQ1YSpace;
        this.verticalRoadParam.point2TextV.textLength = this.verticalRoadParam.point2TextV.text.length * 8;

        var x = this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width - 15;
        this.verticalRoadParam.point2TextV.y = this.horizontalRoadParam.height + vLine3MoveY + 25;
        if (this.verticalRoadParam.point2TextV.textLength > vLine3MoveY || vLine3MoveY < 25 || isHide) {
            this.verticalRoadParam.point2TextV.text = "";
            this.verticalRoadParam.point2TextV.textLine = "";
        }
        else {
            var textLineHeight = this.horizontalRoadParam.height + vLine3MoveY;
            var arrowDistance = 6;
            this.verticalRoadParam.point2TextV.x = x - vLine3MoveY / 2;
            this.verticalRoadParam.point2TextV.textLine = "M" + (x - vLine3MoveY) + " ," + textLineHeight + " L" + x + " ," + textLineHeight + " M" + (x - arrowDistance) + " " + (textLineHeight - arrowDistance) + ",L " + x + " " + textLineHeight + " M " + x + "," + textLineHeight + " L " + (x - arrowDistance) + " " + (textLineHeight + arrowDistance) + " M" + (x - vLine3MoveY + arrowDistance) + " " + (textLineHeight - arrowDistance) + ",L " + (x - vLine3MoveY) + " " + textLineHeight + " M " + (x - vLine3MoveY) + "," + textLineHeight + " L " + (x - vLine3MoveY + arrowDistance) + " " + (textLineHeight + arrowDistance);

            this.verticalRoadParam.point2TextV.textRoate = "rotate(90, " + x + ", " + textLineHeight + ")";
        }
    }

    drawHRoadLine3Point2Text(isHide) {
        var rampText = (this.verticalRoadCoordinates.line3Point2.MQ1XSpace) / 4 + "";
        if (rampText.length > 4) rampText = rampText.substring(0, rampText.indexOf("."));

        this.verticalRoadParam.point2TextH.text = rampText + "'";

        var hLine3MoveY = this.verticalRoadCoordinates.line3Point2.MQ1XSpace;
        this.verticalRoadParam.point2TextH.textLength = this.verticalRoadParam.point2TextH.text.length * 8;

        var x = this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width;
        this.verticalRoadParam.point2TextH.y = this.horizontalRoadParam.height - 25;
        if (this.verticalRoadParam.point2TextH.textLength > hLine3MoveY || hLine3MoveY < 25 || isHide) {
            this.verticalRoadParam.point2TextH.text = "";
            this.verticalRoadParam.point2TextH.textLine = "";
        }
        else {
            var textLineHeight = this.horizontalRoadParam.height - 20;
            var arrowDistance = 6;
            this.verticalRoadParam.point2TextH.x = x + hLine3MoveY / 2;
            this.verticalRoadParam.point2TextH.textLine = "M" + x + " ," + textLineHeight + " L" + (x + hLine3MoveY) + " ," + textLineHeight + " M" + (x + arrowDistance) + " " + (textLineHeight + arrowDistance) + ",L " + x + " " + textLineHeight + " M " + x + "," + textLineHeight + " L " + (x + arrowDistance) + " " + (textLineHeight - arrowDistance) + " M" + (x + hLine3MoveY - arrowDistance) + " " + (textLineHeight + arrowDistance) + ",L " + (x + hLine3MoveY) + " " + textLineHeight + " M " + (x + hLine3MoveY) + "," + textLineHeight + " L " + (x + hLine3MoveY - arrowDistance) + " " + (textLineHeight - arrowDistance);

            this.verticalRoadParam.point2TextH.textRoate = "rotate(0, " + x + ", " + textLineHeight + ")";
        }
    }

    //-------------READY MOVE EVENTS DEFINE--------------------
    readyMoveRoad = (event) => {
        var currentMousePoint = this.getMousePoint(event);
        var currentRoadCoordinate = { x: this.coordinatePath.roadCoordinate.x, y: this.coordinatePath.roadCoordinate.y };
        this.props.tellParentRoadhaveBeenClicked(currentMousePoint, currentRoadCoordinate);
        this.horizontalRoadParam.rememberRoadLine2RightPointCoordinateTemp = this.horizontalRoadParam.rememberRoadLine2RightPointCoordinate;
        event.stopPropagation();
        event.preventDefault();
    }

    readyMoveLine1Right = (event) => {
        var currentMousePoint = this.getMousePoint(event);
        var currentRoadCoordinate = { x: this.coordinatePath.roadCoordinate.x, y: this.coordinatePath.roadCoordinate.y };
        this.props.tellParentLine1RighthaveBeenClicked(currentMousePoint, currentRoadCoordinate);
        event.stopPropagation();
        event.preventDefault();
    }

    readyMoveLine1Left = (event) => {
        var currentMousePoint = this.getMousePoint(event);
        var currentRoadCoordinate = { x: this.coordinatePath.roadCoordinate.x, y: this.coordinatePath.roadCoordinate.y };
        this.props.tellParentLine1LefthaveBeenClicked(currentMousePoint, currentRoadCoordinate);
        event.stopPropagation();
        event.preventDefault();
    }

    readyLine1RightRampMove = (event) => {
        this.props.tellParentTopMidHaveBeenClicked();
        event.stopPropagation();
        event.preventDefault();
    }

    readyLine3RightRampMove = (event) => {
        this.props.tellParentBottomMidHaveBeenClicked();
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

        var currentMousePoint = this.getMousePoint(event);
        var currentRoadCoordinate = { x: this.coordinatePath.roadCoordinate.x, y: this.coordinatePath.roadCoordinate.y };

        this.props.tellParentLine2MidHaveBeenClicked(currentMousePoint, currentRoadCoordinate);
        event.stopPropagation();
        event.preventDefault();
    }

    readyMoveLine3Left = (event) => {
        var currentMousePoint = this.getMousePoint(event);
        var currentRoadCoordinate = { x: this.coordinatePath.roadCoordinate.x, y: this.coordinatePath.roadCoordinate.y };
        this.props.tellParentLine3LefthaveBeenClicked(currentMousePoint, currentRoadCoordinate);
        event.stopPropagation();
        event.preventDefault();
    }

    readyMoveLine3Right = (event) => {
        var currentMousePoint = this.getMousePoint(event);
        var currentRoadCoordinate = { x: this.coordinatePath.roadCoordinate.x, y: this.coordinatePath.roadCoordinate.y };
        this.props.tellParentLine3RighthaveBeenClicked(currentMousePoint, currentRoadCoordinate);
        event.stopPropagation();
        event.preventDefault();
    }

    getMousePoint(event) {
        var e;
        if (event.type == "touchstart" || event.type == "touchmove") {
            e = event.touches[0];
        } else {
            e = event;
        }

        return { x: e.clientX - $(".nav-panel").width(), y: e.clientY };
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

    //calculate horizontal road relate of point when moving right point of the line 2
    moveToDrawByLine2RightRect() {
        var movePointX = this.props.point.x - this.coordinatePath.roadCoordinate.x - this.commonParam.square.width * 2;// X mouse moving distance
        var movePointY = this.props.point.y - this.lastRoadPoint.y;

        if (this.horizontalRoadParam.Line2RightRotate != 0) {// if the road have rotate degree then calculate the width of road
            this.horizontalRoadParam.width = movePointX / Math.cos(this.horizontalRoadParam.Line2RightRotate * Math.PI / 180);
        } else {
            this.horizontalRoadParam.width = movePointX;
        }

        if (this.horizontalRoadParam.width < roadObject.width) {
            this.horizontalRoadParam.width = roadObject.width;// limit the road min width
        }

        this.lastRoadPoint.x = this.coordinatePath.roadCoordinate.x + this.getHorizontalRoadHalfWidth();

        if (!this.horizontalRoadParam.isDrawLine1LeftRamp) {
            this.horizontalRoadParam.isDrawLine1RightRamp = true;
        }
        this.horizontalRoadParam.line1RightRampPoint = {
            x: this.horizontalRoadParam.width - this.commonParam.triangle.width,
            y: this.horizontalRoadParam.isDrawLine1RightRamp ? this.horizontalRoadParam.line1RampMoveY : 0
        };

        if (!this.horizontalRoadParam.isDrawLine3LeftRamp) {
            this.horizontalRoadParam.isDrawLine3RightRamp = true;
        }
        this.horizontalRoadParam.line3RightRampPoint = {
            x: this.horizontalRoadParam.width - this.commonParam.triangle.width,
            y: this.horizontalRoadParam.isDrawLine3RightRamp ? (this.horizontalRoadParam.line3RampMoveY == 0 ? this.horizontalRoadParam.height : this.horizontalRoadParam.line3RampMoveY) : this.horizontalRoadParam.height
        };

        this.coordinatePath.topRightPointPath = this.getTriangle(this.horizontalRoadParam.line1RightRampPoint, "up");
        this.coordinatePath.bottomrightPointPath = this.getTriangle(this.horizontalRoadParam.line3RightRampPoint, "down");

        if (movePointY != 0) {//calculate rotate deg when moving the point
            var a = this.props.point.y - this.coordinatePath.roadCoordinate.y - this.getHorizontalRoadHalfHeight();
            var b = this.props.point.x - this.coordinatePath.roadCoordinate.x;
            var rotateDeg = Math.atan(a / b) * 180 / Math.PI;
            this.horizontalRoadParam.Line2RightRotate = rotateDeg;
            this.coordinatePath.transform = "translate(" + this.coordinatePath.roadCoordinate.x + "," + this.coordinatePath.roadCoordinate.y + ") rotate(" + rotateDeg + ", 0," + this.getHorizontalRoadHalfHeight() + ")";

            this.horizontalRoadParam.rememberRoadLine2RightPointCoordinate = {
                x: this.props.point.x - this.commonParam.square.width * 2,
                y: this.props.point.y
            };
        }

        if (!this.horizontalRoadParam.isMovedCentrePoint) {
            this.horizontalRoadParam.line1RightPoint.x = this.horizontalRoadParam.width;
            this.horizontalRoadParam.line3RightPoint.x = this.horizontalRoadParam.width;
            this.coordinatePath.streetLine1 = "M0,0 L" + this.horizontalRoadParam.width + ",0 ";
            this.coordinatePath.streetLine2 = this.getLine2Path();
            this.coordinatePath.streetLine3 = "M0," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height + "";

            this.horizontalRoadParam.maskLayerPaths.Path = "M0," + this.getHorizontalRoadHalfHeight() + " L" + this.horizontalRoadParam.width + "," + this.getHorizontalRoadHalfHeight();

            this.coordinatePath.midmidBigPointPath = { x: this.getHorizontalRoadHalfWidth() - this.commonParam.rhombi.halfHeight, y: this.getHorizontalRoadHalfHeight() - this.commonParam.rhombi.halfHeight }
            if (!this.horizontalRoadParam.isMovedCentrePoint) {
                this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);
            } else {
                this.coordinatePath.midmidPointPath = this.getRhombi(this.horizontalRoadParam.centrePoint);
            }

            this.getLine1RightRampPath();
            this.getLine3RightRampPath();            

            this.drawLine1RightText();
            this.drawLine3RightText();

            this.horizontalRoadParam.rememberLastWidth = this.horizontalRoadParam.width;
            
        } else {
            this.moveToDrawLine2MidControllerPoint(true);
        }
    }

    moveToDrawByLine2LeftRect() {
        var a = this.horizontalRoadParam.rememberRoadLine2RightPointCoordinate.x - this.props.point.x;
        var b = this.horizontalRoadParam.rememberRoadLine2RightPointCoordinate.y - this.props.point.y;
        var rotateDeg = Math.atan(b / a) * 180 / Math.PI;//calculate rotate degree

        this.horizontalRoadParam.width = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) - this.commonParam.square.width * 2;

        if (this.horizontalRoadParam.width < roadObject.width) {
            this.horizontalRoadParam.width = roadObject.width;// limit the road min width
        }

        this.horizontalRoadParam.Line2RightRotate = rotateDeg;// save rotate degree

        this.coordinatePath.roadCoordinate.x = this.props.point.x + this.commonParam.square.width * 2;
        this.coordinatePath.roadCoordinate.y = this.props.point.y - this.getHorizontalRoadHalfHeight();

        this.coordinatePath.transform = "translate(" + this.coordinatePath.roadCoordinate.x + "," + this.coordinatePath.roadCoordinate.y + ") rotate(" + rotateDeg + ", 0," + this.getHorizontalRoadHalfHeight() + ")";

        if (!this.horizontalRoadParam.isDrawLine1LeftRamp) {
            this.horizontalRoadParam.isDrawLine1RightRamp = true;
        }
        this.horizontalRoadParam.line1RightRampPoint = {
            x: this.horizontalRoadParam.width - this.commonParam.triangle.width,
            y: this.horizontalRoadParam.isDrawLine1RightRamp ? this.horizontalRoadParam.line1RampMoveY : 0
        };

        if (!this.horizontalRoadParam.isDrawLine3LeftRamp) {
            this.horizontalRoadParam.isDrawLine3RightRamp = true;
        }
        this.horizontalRoadParam.line3RightRampPoint = {
            x: this.horizontalRoadParam.width - this.commonParam.triangle.width,
            y: this.horizontalRoadParam.isDrawLine3RightRamp ? (this.horizontalRoadParam.line3RampMoveY == 0 ? this.horizontalRoadParam.height : this.horizontalRoadParam.line3RampMoveY) : this.horizontalRoadParam.height
        };

        this.coordinatePath.topRightPointPath = this.getTriangle(this.horizontalRoadParam.line1RightRampPoint, "up");
        this.coordinatePath.bottomrightPointPath = this.getTriangle(this.horizontalRoadParam.line3RightRampPoint, "down");

        if (!this.horizontalRoadParam.isMovedCentrePoint) {
            this.horizontalRoadParam.line1RightPoint.x = this.horizontalRoadParam.width;
            this.horizontalRoadParam.line3RightPoint.x = this.horizontalRoadParam.width;

            this.coordinatePath.streetLine1 = "M0,0 L" + this.horizontalRoadParam.width + ",0 ";
            this.coordinatePath.streetLine2 = this.getLine2Path();
            this.coordinatePath.streetLine3 = "M0," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height + "";

            this.horizontalRoadParam.maskLayerPaths.Path = "M0," + this.getHorizontalRoadHalfHeight() + " L" + this.horizontalRoadParam.width + "," + this.getHorizontalRoadHalfHeight();            

            this.coordinatePath.midmidBigPointPath = { x: this.getHorizontalRoadHalfWidth() - this.commonParam.rhombi.halfHeight, y: this.getHorizontalRoadHalfHeight() - this.commonParam.rhombi.halfHeight };
            if (!this.horizontalRoadParam.isMovedCentrePoint) {//is moved centre point
                this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);
            } else {
                this.coordinatePath.midmidPointPath = this.getRhombi(this.horizontalRoadParam.centrePoint);
            }

            this.getLine1RightRampPath();
            this.getLine3RightRampPath();

            this.drawLine1RightText();
            this.drawLine3RightText();

        } else {

            this.moveToDrawLine2MidControllerPoint(true);
        }
    }

    moveToDrawLine2MidControllerPoint(isReCalculate) {
        //get the top line's point move distance base the road coordinate and the road rotate angle
        var movePointY = this.getLine1MoveY(this.coordinatePath.roadCoordinate, this.horizontalRoadParam.Line2RightRotate);
        var midMovePointY = movePointY - this.getHorizontalRoadHalfHeight();//get the centre point move distance

        if (isReCalculate == true) {
            midMovePointY = this.horizontalRoadParam.moveLine2MidPointY;
            movePointY = midMovePointY + this.getHorizontalRoadHalfHeight();
        }
        this.horizontalRoadParam.moveLine2MidPointY = midMovePointY;
        //isClosewise means draw the ramp's direction, if the centre point is moved up, the direction is clockwise，and if the cener point is moved down, the direction is anticlockwise
        var isClosewise = midMovePointY > 0 ? 0 : 1;
        //centre point to centre line's left point distance,  base the Pythagorean theorem
        var centrePointTriangleDistance = Math.sqrt(Math.pow(this.getHorizontalRoadHalfWidth(), 2) + Math.pow(midMovePointY, 2));

        this.horizontalRoadParam.isMovedCentrePoint = midMovePointY != 0;

        var halfCentreDistance = centrePointTriangleDistance / 2;
        //angle of moved centre point and centre line's left point
        var angleOfCentrePoint = 90 - Math.atan(Math.abs(midMovePointY) / (this.getHorizontalRoadHalfWidth())) * 180 / Math.PI;

        var cosvalue = Math.cos(angleOfCentrePoint * Math.PI / 180);//get the angle's cosine
        var centreCricleRadius = halfCentreDistance / cosvalue;//get the centre cricle's radius

        var isInside = midMovePointY > 0 ? true : false;//the cricle is up or down, up is out side, down is inside
        //calc the line1 and line3 is radius
        var line1R = isInside == true ? (centreCricleRadius - this.getHorizontalRoadHalfHeight()) : (centreCricleRadius + this.getHorizontalRoadHalfHeight());
        var line3R = isInside == true ? (centreCricleRadius + this.getHorizontalRoadHalfHeight()) : (centreCricleRadius - this.getHorizontalRoadHalfHeight());

        //when the centre point moved distance overloaded the half road's width, should be draw the big cricle, base on the Path named A's params
        var isBigCircle = Math.abs(midMovePointY) > this.getHorizontalRoadHalfWidth() ? 1 : 0;
        this.horizontalRoadParam.isBigCircle = isBigCircle;
        this.horizontalRoadParam.isInside = isInside;
        //calc the line1's left point after the centre point is moved
        var line1LeftPoint = this.getLine1LeftControllerPoint(midMovePointY, angleOfCentrePoint, centrePointTriangleDistance);
        var line1RightPoint = this.getLine1RightControllerPoint(line1LeftPoint);//calc the line1's right point base on the left point

        //calc the line2's left point after the centre point is moved
        var line2LeftPoint = this.getLine2LeftControllerPoint(midMovePointY, isBigCircle, this.commonParam.square.width * 3, line1LeftPoint);
        var line2RightPoint = this.getLine2RightControllerPoint(line2LeftPoint, isBigCircle);

        //calc the line3's left point after the centre point is moved
        var line3LeftPoint = { x: line1LeftPoint.x - (line1LeftPoint.x * 2), y: line1LeftPoint.y + (this.getHorizontalRoadHalfHeight() - line1LeftPoint.y) * 2 };
        var line3RightPoint = this.getLine1RightControllerPoint(line3LeftPoint);//calc the line3's right point base on the left point

        //draw the line1's triangle for the left and right point base on previous the calculate result
        if (this.horizontalRoadParam.line1RampMoveY != 0) {
            if (this.horizontalRoadParam.isDrawLine1LeftRamp) {
                this.coordinatePath.topRightPointPath = this.getTriangle(line1RightPoint, "up");
            } else {
                this.coordinatePath.topLeftPointPath = this.getTriangle(line1LeftPoint, "up");
            }
        } else {
            this.coordinatePath.topLeftPointPath = this.getTriangle(line1LeftPoint, "up");
            this.coordinatePath.topRightPointPath = this.getTriangle(line1RightPoint, "up");

            if (this.horizontalRoadParam.isDrawLine1LeftRamp) {
                this.horizontalRoadParam.line1LeftRampPoint = line1LeftPoint;
            } else if (this.horizontalRoadParam.isDrawLine1RightRamp) {
                this.horizontalRoadParam.line1RightRampPoint = line1RightPoint;
            }
        }

        //draw the line3's triangle for the left and right point base on previous calculate result
        if (this.horizontalRoadParam.line3RampMoveY != 0) {
            if (this.horizontalRoadParam.isDrawLine3LeftRamp) {
                this.coordinatePath.bottomrightPointPath = this.getTriangle(line3RightPoint, "down");
            } else {
                this.coordinatePath.bottomleftPointPath = this.getTriangle(line3LeftPoint, "down");
            }
        } else {
            this.coordinatePath.bottomleftPointPath = this.getTriangle(line3LeftPoint, "down");
            this.coordinatePath.bottomrightPointPath = this.getTriangle(line3RightPoint, "down");

            if (this.horizontalRoadParam.isDrawLine3LeftRamp) {
                this.horizontalRoadParam.line3LeftRampPoint = line3LeftPoint;
            } else {
                this.horizontalRoadParam.line3RightRampPoint = line3RightPoint;
            }
        }

        //record the point to public params, so others place can using this
        this.horizontalRoadParam.line1LeftPoint = line1LeftPoint;
        this.horizontalRoadParam.line1RightPoint = line1RightPoint;

        this.horizontalRoadParam.line3LeftPoint = line3LeftPoint;
        this.horizontalRoadParam.line3RightPoint = line3RightPoint;

        if (midMovePointY != 0) {
            this.horizontalRoadParam.isMovedCentrePoint = true;
            this.horizontalRoadParam.centrePoint.x = this.getHorizontalRoadHalfWidth();
            this.horizontalRoadParam.centrePoint.y = movePointY - this.commonParam.rhombi.halfHeight;
        } else {
            this.horizontalRoadParam.isMovedCentrePoint = false;
            this.horizontalRoadParam.centrePoint.x = roadObject.width / 2;
            this.horizontalRoadParam.centrePoint.y = this.getHorizontalRoadHalfHeight() - this.commonParam.rhombi.halfHeight;
        }

        //redraw the line1 and line3 is Ramp (if the ramp is already draw)
        this.reDrawLine1RightMoveRamp(midMovePointY, angleOfCentrePoint, line1R, isBigCircle, isInside, isClosewise, line1LeftPoint, line1RightPoint);
        this.reDrawLine3RightMoveRamp(midMovePointY, angleOfCentrePoint, line3R, isBigCircle, isInside, isClosewise, line3LeftPoint, line3RightPoint);

        //redraw the road after the centre point moved
        if (midMovePointY != 0) {
            this.horizontalRoadParam.maskLayerPaths.Path = "M0," + this.getHorizontalRoadHalfHeight() + " A" + centreCricleRadius + "," + centreCricleRadius + " 0 " + isBigCircle + " " + isClosewise + " " + this.horizontalRoadParam.width + "," + this.getHorizontalRoadHalfHeight();
        }

        //redraw the line1's line when the line1's left or right point is moved
        if (this.horizontalRoadParam.Line1RightLPoint1 == null) {
            this.coordinatePath.streetLine1 = "M" + line1LeftPoint.x + "," + line1LeftPoint.y + " A" + line1R + "," + line1R + " 0 " + isBigCircle + " " + isClosewise + " " + line1RightPoint.x + "," + line1RightPoint.y;
        }

        this.coordinatePath.streetLine2 = "";
        //redraw the line3's line when the line3's left or right point is moved
        if (this.horizontalRoadParam.Line3RampLPoint1 == null) {
            this.coordinatePath.streetLine3 = "M" + line3LeftPoint.x + "," + line3LeftPoint.y + " A" + line3R + "," + line3R + " 0 " + isBigCircle + " " + isClosewise + " " + line3RightPoint.x + "," + line3RightPoint.y;
        }

        this.coordinatePath.midmidBigPointPath = { x: this.getHorizontalRoadHalfWidth(), y: (movePointY - this.commonParam.square.height * 0.8) };
        this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);//redraw the centre point is rhombi

        var halfWidth = this.getHorizontalRoadHalfWidth();
        var rotateMoveY = movePointY / 2 + this.commonParam.square.height * 2;

        var rotateDeg = - Math.atan(halfWidth / rotateMoveY) * 180 / Math.PI;// calculate rotate degree
        this.coordinatePath.midleftPoint = {
            x: line2LeftPoint.x - this.commonParam.square.height / 2, y: line2LeftPoint.y - this.commonParam.square.height / 2
        };
        this.coordinatePath.midrightPoint = {
            x: line2RightPoint.x - this.commonParam.square.height / 2, y: line2RightPoint.y - this.commonParam.square.height / 2
        };
        this.coordinatePath.midrightPoint.width = this.coordinatePath.midrightPoint.height = this.commonParam.square.width;
        this.coordinatePath.midleftPoint.width = this.coordinatePath.midleftPoint.height = this.commonParam.square.height;
        
        //redraw the entire road if the rotate angle is not 0
        //this.coordinatePath.midrightPoint.transform = "rotate(" + rotateDeg + "," + (this.horizontalRoadParam.width + this.commonParam.square.width * 2) + "," + (this.getHorizontalRoadHalfHeight() + this.commonParam.square.height) + ")";

        this.setDisplayHorizontalRoadPoint();
        this.drawLine1RightText();//redraw the line1's text (if the line1's left or right point is moved)
        this.drawLine3RightText();//redraw the line3's text (if the line3's left or right point is moved)
    }

    moveToDrawLine1LeftRightRamp(movingType) {
        var movePointY = 0;
        this.setLine1PointToDefault(this.props.movingType);//set some default value when movingtype changed

        if (!this.horizontalRoadParam.isMovedCentrePoint) {
            movePointY = this.getLine1MoveY(this.coordinatePath.roadCoordinate, this.horizontalRoadParam.Line2RightRotate);

            var maxY = 0;
            var minY = -this.horizontalRoadParam.height;// restrict move min, max height
            if (movePointY > maxY) movePointY = maxY;
            if (movePointY < minY) movePointY = minY;
            /* params explain:
            lPoint: L point in the line1RampPath
            start with "c" is C point of line1RampPath
            */
            var lPoint = {};
            var cPoint3 = {};
            var cPoint1 = {};
            var cPoint2 = {};
            var line1RampPath = "";
            var line1CentreTrianglePoint = {};
            this.horizontalRoadParam.line1RampMoveY = movePointY;

            if (movingType == 'Line1Right') {// when moving right point of the first line
                this.horizontalRoadParam.line1RightRampPoint.x = this.horizontalRoadParam.width - this.commonParam.triangle.width;
                this.horizontalRoadParam.line1RightRampPoint.y = movePointY;

                //calculate point of path
                lPoint = { x: this.getHorizontalRoadHalfWidth() + movePointY * this.horizontalRoadParam.fixedWidthRatio, y: 0 };
                cPoint3 = { x: lPoint.x + (-movePointY) * this.horizontalRoadParam.fixedHeightRatio, y: movePointY };
                cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: 0 };
                cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: movePointY };

                line1RampPath = "M0,0  L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + "," + movePointY;

                line1CentreTrianglePoint = { x: (cPoint1.x + 3 + (cPoint2.x - cPoint1.x) / 2), y: (movePointY / 2 + 3) };

                this.coordinatePath.topRightPointPath = this.getTriangle(this.horizontalRoadParam.line1RightRampPoint, "up");

            } else {// when moving left point of the first line
                this.horizontalRoadParam.line1LeftRampPoint.x = 0;
                this.horizontalRoadParam.line1LeftRampPoint.y = movePointY;

                //calculate point of path
                lPoint = { x: this.getHorizontalRoadHalfWidth() + movePointY * this.horizontalRoadParam.fixedWidthRatio, y: movePointY };
                cPoint3 = { x: lPoint.x + (-movePointY) * this.horizontalRoadParam.fixedHeightRatio, y: 0 };

                var lpointx = this.horizontalRoadParam.width - cPoint3.x;
                var cpoint3x = this.horizontalRoadParam.width - lPoint.x;
                lPoint.x = lpointx;
                cPoint3.x = cpoint3x;

                cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: movePointY };
                cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: 0 };

                line1RampPath = "M0," + movePointY + " L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + ",0";

                line1CentreTrianglePoint = { x: (cPoint1.x - 3 + (cPoint2.x - cPoint1.x) / 2), y: (movePointY / 2 + 3) };

                this.coordinatePath.topLeftPointPath = this.getTriangle(this.horizontalRoadParam.line1LeftRampPoint, "up");
            }

            this.horizontalRoadParam.Line1RightLPoint1 = lPoint;
            this.horizontalRoadParam.Line1RightCPoint1 = cPoint1;
            this.horizontalRoadParam.Line1RightCPoint2 = cPoint2;
            this.horizontalRoadParam.Line1RightCPoint3 = cPoint3;

            this.coordinatePath.streetLine1RampPath = line1RampPath;

            //center triangle left and right are same
            if (movePointY != 0) {
                this.coordinatePath.line1RampTrianglePath = this.getTriangle(line1CentreTrianglePoint, "right");
            } else {
                this.coordinatePath.line1RampTrianglePath = "";
            }

            this.coordinatePath.streetLine1 = "M0,0 L" + lPoint.x + ",0 M" + cPoint3.x + ",0 L" + this.horizontalRoadParam.width + ",0";

            this.coordinatePath.midmidBigPointPath = { x: this.getHorizontalRoadHalfWidth() - this.commonParam.rhombi.halfHeight, y: this.getHorizontalRoadHalfHeight() - this.commonParam.rhombi.halfHeight }
            if (!this.horizontalRoadParam.isMovedCentrePoint) {
                this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);
            } else {
                this.coordinatePath.midmidPointPath = this.getRhombi(this.horizontalRoadParam.centrePoint);
            }
        }
        else {
            // calculate degree 
            var deg = 90;
            var increasedR = 0;
            var c = this.getHorizontalRoadHalfHeight();
            var b;
            if (movingType == 'Line1Right') {// when moving right point of the first line
                b = Math.abs(this.horizontalRoadParam.width - this.horizontalRoadParam.line1RightPoint.x);
                deg = Math.acos(b / c) * 180 / Math.PI;

                if (this.horizontalRoadParam.isInside) {
                    if (this.horizontalRoadParam.isBigCircle == 1) {
                        deg = 90 - deg;
                    } else {
                        deg = -(90 - Math.abs(deg));
                    }
                } else {
                    if (this.horizontalRoadParam.isBigCircle == 1) {
                        deg = -(90 - Math.abs(deg));
                    } else {
                        deg = 90 - deg;
                    }
                }
            } else {// when moving left point of the first line
                b = Math.abs(this.horizontalRoadParam.line1LeftPoint.x);
                deg = Math.acos(b / c) * 180 / Math.PI;

                if (this.horizontalRoadParam.isInside) {
                    if (this.horizontalRoadParam.isBigCircle == 1) {
                        deg = -(90 - Math.abs(deg));
                    } else {
                        deg = 90 - deg;
                    }
                } else {
                    if (this.horizontalRoadParam.isBigCircle == 1) {
                        deg = 90 - deg;
                    } else {
                        deg = -(90 - Math.abs(deg));
                    }
                }
            }

            if (this.horizontalRoadParam.Line2RightRotate == 0) {
                if (movingType == 'Line1Right') {
                    movePointY = this.getLine1MoveY({ x: (this.coordinatePath.roadCoordinate.x + this.horizontalRoadParam.width), y: this.coordinatePath.roadCoordinate.y }, deg, this.horizontalRoadParam.isInside, this.horizontalRoadParam.isBigCircle == 1);
                } else {
                    movePointY = this.getLine1MoveY({ x: this.coordinatePath.roadCoordinate.x, y: this.coordinatePath.roadCoordinate.y }, deg, this.horizontalRoadParam.isInside, this.horizontalRoadParam.isBigCircle == 1);
                }
                if (this.horizontalRoadParam.isBigCircle == 1) {
                    if (movePointY > this.horizontalRoadParam.height) {
                        movePointY = this.horizontalRoadParam.height;
                    }
                    if (movePointY < 0) {
                        movePointY = 0;
                    }
                } else {
                    if (movePointY < -this.horizontalRoadParam.height) {
                        movePointY = -this.horizontalRoadParam.height;
                    }
                    if (movePointY > 0) {
                        movePointY = 0;
                    }
                }

                this.horizontalRoadParam.line1RampMoveY = -Math.abs(movePointY);

                this.reDrawLine1RightMoveRamp(this.horizontalRoadParam.reDrawRamp.midMovePointY, this.horizontalRoadParam.reDrawRamp.deg,
                    this.horizontalRoadParam.reDrawRamp.line1R, this.horizontalRoadParam.reDrawRamp.isBigCircle, this.horizontalRoadParam.reDrawRamp.isInside,
                    this.horizontalRoadParam.reDrawRamp.toward, this.horizontalRoadParam.line1LeftPoint, this.horizontalRoadParam.line1RightPoint);
            } else { //todo
                var newCenterY;
                var newCenterX;

                if (this.horizontalRoadParam.isDrawLine1RightRamp) {
                    newCenterY = Math.sin(this.horizontalRoadParam.Line2RightRotate * Math.PI / 180) * this.horizontalRoadParam.width + this.getHorizontalRoadHalfHeight() + this.coordinatePath.roadCoordinate.y;
                    newCenterX = Math.cos(this.horizontalRoadParam.Line2RightRotate * Math.PI / 180) * this.horizontalRoadParam.width + this.coordinatePath.roadCoordinate.x;
                } else {
                    newCenterX = this.coordinatePath.roadCoordinate.x;
                    newCenterY = this.coordinatePath.roadCoordinate.y;
                }

                var newDeg = deg + this.horizontalRoadParam.Line2RightRotate;
                movePointY = this.getLine1MoveY({ x: newCenterX, y: newCenterY }, newDeg, this.horizontalRoadParam.isInside, this.horizontalRoadParam.isBigCircle == 1);

                if (this.horizontalRoadParam.isBigCircle == 1) {
                    if (movePointY > this.horizontalRoadParam.height) {
                        movePointY = this.horizontalRoadParam.height;
                    }
                    if (movePointY < 0) {
                        movePointY = 0;
                    }
                } else {
                    if (movePointY < -this.horizontalRoadParam.height) {
                        movePointY = -this.horizontalRoadParam.height;
                    }
                    if (movePointY > 0) {
                        movePointY = 0;
                    }
                }

                this.horizontalRoadParam.line1RampMoveY = -Math.abs(movePointY);

                this.reDrawLine1RightMoveRamp(this.horizontalRoadParam.reDrawRamp.midMovePointY, this.horizontalRoadParam.reDrawRamp.deg,
                    this.horizontalRoadParam.reDrawRamp.line1R, this.horizontalRoadParam.reDrawRamp.isBigCircle, this.horizontalRoadParam.reDrawRamp.isInside,
                    this.horizontalRoadParam.reDrawRamp.toward, this.horizontalRoadParam.line1LeftPoint, this.horizontalRoadParam.line1RightPoint);
            }
        }

        this.drawLine1RightText(this.props.movingType);//change text
    }

    moveToDrawLine1CentreRamp(movePointX) {
          //calculate point of path
        var lPointX = this.horizontalRoadParam.Line1RightLPoint1.x + movePointX;
        var cPoint3X = this.horizontalRoadParam.Line1RightCPoint3.x + movePointX;
        if (lPointX < 0) lPointX = 0;
        if (cPoint3X > this.horizontalRoadParam.width) cPoint3X = this.horizontalRoadParam.width;

        var lPoint = { x: lPointX, y: this.horizontalRoadParam.Line1RightLPoint1.y };
        var cPoint3 = { x: cPoint3X, y: this.horizontalRoadParam.Line1RightCPoint3.y };
        var cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: this.horizontalRoadParam.Line1RightCPoint1.y };
        var cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: this.horizontalRoadParam.Line1RightCPoint2.y };

        var line1RampPath = "";
        var line1CentreTrianglePoint = {};
        if (this.horizontalRoadParam.isDrawLine1LeftRamp) {
            line1RampPath = "M0," + this.horizontalRoadParam.line1RampMoveY + " L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + ",0";

            line1CentreTrianglePoint = { x: (cPoint1.x - 3 + (cPoint2.x - cPoint1.x) / 2), y: (this.horizontalRoadParam.line1RampMoveY / 2 + 3) };
        } else if (this.horizontalRoadParam.isDrawLine1RightRamp) {
            line1RampPath = "M0,0 L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.line1RampMoveY;

            line1CentreTrianglePoint = { x: (cPoint1.x + 3 + (cPoint2.x - cPoint1.x) / 2), y: (this.horizontalRoadParam.line1RampMoveY / 2 + 3) };
        }

        this.coordinatePath.streetLine1RampPath = line1RampPath;
        this.coordinatePath.line1RampTrianglePath = this.getTriangle(line1CentreTrianglePoint, "right");
        this.coordinatePath.streetLine1 = "M0,0 L" + lPoint.x + ",0 M" + cPoint3.x + ",0 L" + this.horizontalRoadParam.width + ",0";
    }

    //redraw the line3's ramp when the ramp centre point is moved
    moveToDrawLine3CentreRamp(movePointX) {
        //calc the point moved distance base on the previous records points
        var lPointX = this.horizontalRoadParam.Line3RampLPoint1.x + movePointX;
        var cPoint3X = this.horizontalRoadParam.Line3RampCPoint3.x + movePointX;
        if (lPointX < 0) lPointX = 0;
        if (cPoint3X > this.horizontalRoadParam.width) cPoint3X = this.horizontalRoadParam.width;

        var lPoint = { x: lPointX, y: this.horizontalRoadParam.Line3RampLPoint1.y };
        var cPoint3 = { x: cPoint3X, y: this.horizontalRoadParam.Line3RampCPoint3.y };
        var cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: this.horizontalRoadParam.Line3RampCPoint1.y };
        var cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: this.horizontalRoadParam.Line3RampCPoint2.y };

        var line3RampPath = "";
        var line3CentreTrianglePoint = {};
        var centerPointY = (this.horizontalRoadParam.line3RampMoveY - this.horizontalRoadParam.height) / 2 + this.horizontalRoadParam.height;
        if (this.horizontalRoadParam.isDrawLine3LeftRamp) {//if the left point is moved
            line3RampPath = "M0," + this.horizontalRoadParam.line3RampMoveY + " L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + ",0";

            line3CentreTrianglePoint = { x: (cPoint1.x - 3 + (cPoint2.x - cPoint1.x) / 2), y: (centerPointY + 9) };
        } else if (this.horizontalRoadParam.isDrawLine3RightRamp) {//if the right point is moved
            line3RampPath = "M0,0 L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.line3RampMoveY;

            line3CentreTrianglePoint = { x: (cPoint1.x + 3 + (cPoint2.x - cPoint1.x) / 2), y: (centerPointY + 6) };
        }

        this.coordinatePath.streetLine3RampPath = line3RampPath;
        this.coordinatePath.line3RampTrianglePath = this.getTriangle(line3CentreTrianglePoint, "right");
        this.coordinatePath.streetLine3 = "M0," + this.horizontalRoadParam.height + " L" + lPoint.x + "," + this.horizontalRoadParam.height + " M" + cPoint3.x + "," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height;
    }

    //draw the line3's ramp when the line3's left or right point is moved
    moveToDrawLine3LeftRightRamp(movingType) {
        var movePointY = 0;
        this.setLine3PointToDefault(this.props.movingType);//set some default value when movingtype changed

        //the road is horizontal (no rotate and no move centre point)
        if (!this.horizontalRoadParam.isMovedCentrePoint) {
            //calc the left or right point moved distance
            movePointY = this.getLine3MoveY(this.coordinatePath.roadCoordinate, this.horizontalRoadParam.Line2RightRotate);
            
            var maxMoveY = this.horizontalRoadParam.height * 2;
            var minMoveY = this.horizontalRoadParam.height;// restrict move min, max height
            if (movePointY > maxMoveY) {
                movePointY = maxMoveY;
            }
            if (movePointY < minMoveY) {
                movePointY = minMoveY;
            }

            var lPoint = {};
            var cPoint3 = {};
            var cPoint1 = {};
            var cPoint2 = {};
            var line3RampPath = "";
            var line3CentreTrianglePoint = {};
            this.horizontalRoadParam.line3RampMoveY = movePointY;

            var centerPointY = (movePointY - this.horizontalRoadParam.height) / 2 + this.horizontalRoadParam.height;
            //when move the right point
            if (movingType == 'Line3Right') {
                this.horizontalRoadParam.line3RightRampPoint.x = this.horizontalRoadParam.width - this.commonParam.triangle.width;
                this.horizontalRoadParam.line3RightRampPoint.y = movePointY;

                var calcMoveY = this.horizontalRoadParam.height - movePointY;

                lPoint = { x: this.getHorizontalRoadHalfWidth() + calcMoveY * this.horizontalRoadParam.fixedWidthRatio, y: this.horizontalRoadParam.height };
                cPoint3 = { x: lPoint.x + (-calcMoveY) * this.horizontalRoadParam.fixedHeightRatio, y: movePointY };
                cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: this.horizontalRoadParam.height };
                cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: movePointY };

                line3RampPath = "M0," + this.horizontalRoadParam.height + "  L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + "," + movePointY;

                line3CentreTrianglePoint = { x: (cPoint1.x + 3 + (cPoint2.x - cPoint1.x) / 2), y: (centerPointY + 9) };

                this.coordinatePath.bottomrightPointPath = this.getTriangle(this.horizontalRoadParam.line3RightRampPoint, "down");
            } else if (movingType == 'Line3Left') {//when move the left point
                this.horizontalRoadParam.line3LeftRampPoint.x = 0;
                this.horizontalRoadParam.line3LeftRampPoint.y = movePointY;

                var calcMoveY = this.horizontalRoadParam.height - movePointY;

                lPoint = { x: this.getHorizontalRoadHalfWidth() + calcMoveY * this.horizontalRoadParam.fixedWidthRatio, y: movePointY };
                cPoint3 = { x: lPoint.x + (-calcMoveY) * this.horizontalRoadParam.fixedHeightRatio, y: this.horizontalRoadParam.height };

                var lpointx = this.horizontalRoadParam.width - cPoint3.x;
                var cpoint3x = this.horizontalRoadParam.width - lPoint.x;
                lPoint.x = lpointx;
                cPoint3.x = cpoint3x;

                cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: movePointY };
                cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: this.horizontalRoadParam.height };

                line3RampPath = "M0," + movePointY + " L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height;

                line3CentreTrianglePoint = { x: (cPoint1.x - 3 + (cPoint2.x - cPoint1.x) / 2), y: (centerPointY + 6) };

                this.coordinatePath.bottomleftPointPath = this.getTriangle(this.horizontalRoadParam.line3LeftRampPoint, "down");
            }

            //records important points
            this.horizontalRoadParam.Line3RampLPoint1 = lPoint;
            this.horizontalRoadParam.Line3RampCPoint1 = cPoint1;
            this.horizontalRoadParam.Line3RampCPoint2 = cPoint2;
            this.horizontalRoadParam.Line3RampCPoint3 = cPoint3;

            this.coordinatePath.streetLine3RampPath = line3RampPath;//draw the ramp path

            //center triangle left and right are same
            var tempMoveY = movePointY - this.horizontalRoadParam.height;
            if (tempMoveY != 0) {
                this.coordinatePath.line3RampTrianglePath = this.getTriangle(line3CentreTrianglePoint, "right");
            } else {
                this.coordinatePath.line3RampTrianglePath = "";
            }

            this.coordinatePath.streetLine3 = "M0," + this.horizontalRoadParam.height + " L" + lPoint.x + "," + this.horizontalRoadParam.height + " M" + cPoint3.x + "," + this.horizontalRoadParam.height + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height;

            this.coordinatePath.midmidBigPointPath = { x: this.getHorizontalRoadHalfWidth() - this.commonParam.rhombi.halfHeight, y: this.getHorizontalRoadHalfHeight() - this.commonParam.rhombi.halfHeight }
            if (!this.horizontalRoadParam.isMovedCentrePoint) {
                this.coordinatePath.midmidPointPath = this.getRhombi(this.coordinatePath.midmidBigPointPath);
            } else {
                this.coordinatePath.midmidPointPath = this.getRhombi(this.horizontalRoadParam.centrePoint);
            }
        }
        else {
            var roadRotateDeg = 90;
            var increasedR = 0;
            var basicTriangleC = this.getHorizontalRoadHalfHeight();
            var basicTriangleB;
            if (movingType == 'Line3Right') {
                basicTriangleB = Math.abs(this.horizontalRoadParam.width - this.horizontalRoadParam.line1RightPoint.x);
                roadRotateDeg = Math.acos(basicTriangleB / basicTriangleC) * 180 / Math.PI;

                if (this.horizontalRoadParam.isInside) {
                    if (this.horizontalRoadParam.isBigCircle == 1) {
                        roadRotateDeg = 90 - roadRotateDeg;
                    } else {
                        roadRotateDeg = -(90 - Math.abs(roadRotateDeg));
                    }
                } else {
                    if (this.horizontalRoadParam.isBigCircle == 1) {
                        roadRotateDeg = -(90 - Math.abs(roadRotateDeg));
                    } else {
                        roadRotateDeg = 90 - roadRotateDeg;
                    }
                }
            } else {
                basicTriangleB = Math.abs(this.horizontalRoadParam.line1LeftPoint.x);
                roadRotateDeg = Math.acos(basicTriangleB / basicTriangleC) * 180 / Math.PI;

                if (this.horizontalRoadParam.isInside) {
                    if (this.horizontalRoadParam.isBigCircle == 1) {
                        roadRotateDeg = -(90 - Math.abs(roadRotateDeg));
                    } else {
                        roadRotateDeg = 90 - roadRotateDeg;
                    }
                } else {
                    if (this.horizontalRoadParam.isBigCircle == 1) {
                        roadRotateDeg = 90 - roadRotateDeg;
                    } else {
                        roadRotateDeg = -(90 - Math.abs(roadRotateDeg));
                    }
                }
            }

            if (this.horizontalRoadParam.Line2RightRotate == 0) {
                if (movingType == 'Line3Right') {
                    movePointY = this.getLine3MoveY({ x: (this.coordinatePath.roadCoordinate.x + this.horizontalRoadParam.width), y: this.coordinatePath.roadCoordinate.y }, roadRotateDeg, this.horizontalRoadParam.isInside, this.horizontalRoadParam.isBigCircle == 1);
                } else {
                    movePointY = this.getLine3MoveY({ x: this.coordinatePath.roadCoordinate.x, y: this.coordinatePath.roadCoordinate.y }, roadRotateDeg, this.horizontalRoadParam.isInside, this.horizontalRoadParam.isBigCircle == 1);
                }

                if (movePointY > this.horizontalRoadParam.height * 2) {
                    movePointY = this.horizontalRoadParam.height * 2;
                }
                if (movePointY < this.horizontalRoadParam.height) {
                    movePointY = this.horizontalRoadParam.height;
                }

                this.horizontalRoadParam.line3RampMoveY = movePointY;

                this.reDrawLine3RightMoveRamp(this.horizontalRoadParam.reDrawRamp.midMovePointY, this.horizontalRoadParam.reDrawRamp.deg,
                    this.horizontalRoadParam.reDrawRamp.line3R, this.horizontalRoadParam.reDrawRamp.isBigCircle, this.horizontalRoadParam.reDrawRamp.isInside,
                    this.horizontalRoadParam.reDrawRamp.toward, this.horizontalRoadParam.line3LeftPoint, this.horizontalRoadParam.line3RightPoint);
            } else { //todo
                var newCenterY;
                var newCenterX;

                if (this.horizontalRoadParam.isDrawLine3RightRamp) {
                    newCenterY = Math.sin(this.horizontalRoadParam.Line2RightRotate * Math.PI / 180) * this.horizontalRoadParam.width + this.getHorizontalRoadHalfHeight() + this.coordinatePath.roadCoordinate.y;
                    newCenterX = Math.cos(this.horizontalRoadParam.Line2RightRotate * Math.PI / 180) * this.horizontalRoadParam.width + this.coordinatePath.roadCoordinate.x;
                } else {
                    newCenterX = this.coordinatePath.roadCoordinate.x;
                    newCenterY = this.coordinatePath.roadCoordinate.y;
                }

                var newDeg = roadRotateDeg + this.horizontalRoadParam.Line2RightRotate;
                movePointY = this.getLine3MoveY({ x: newCenterX, y: newCenterY }, newDeg, this.horizontalRoadParam.isInside, this.horizontalRoadParam.isBigCircle == 1);

                if (movePointY > this.horizontalRoadParam.height * 2) {
                    movePointY = this.horizontalRoadParam.height * 2;
                }
                if (movePointY < this.horizontalRoadParam.height) {
                    movePointY = this.horizontalRoadParam.height;
                }

                this.horizontalRoadParam.line3RampMoveY = movePointY;

                this.reDrawLine3RightMoveRamp(this.horizontalRoadParam.reDrawRamp.midMovePointY, this.horizontalRoadParam.reDrawRamp.deg,
                    this.horizontalRoadParam.reDrawRamp.line3R, this.horizontalRoadParam.reDrawRamp.isBigCircle, this.horizontalRoadParam.reDrawRamp.isInside,
                    this.horizontalRoadParam.reDrawRamp.toward, this.horizontalRoadParam.line3LeftPoint, this.horizontalRoadParam.line3RightPoint);
            }
        }

        this.drawLine3RightText(this.props.movingType);//change text
    }

    moveToDrawVerticalRoad() {
        var movePointX = this.props.point.x - this.lastRoadPoint.x - this.getHorizontalRoadHalfHeight();// X mouse moving distance
        var movePointY = this.props.point.y - this.lastRoadPoint.y;
          //calculate vertical road start point
        this.verticalRoadCoordinates.startPoint = { x: (this.getHorizontalRoadHalfWidth() - this.getHorizontalRoadHalfHeight() + movePointX), y: -this.getHorizontalRoadHalfWidth() + this.getHorizontalRoadHalfHeight() + movePointY };
        // calculate vertical road end point
        this.verticalRoadCoordinates.endPoint = { x: (this.getHorizontalRoadHalfWidth() - this.getHorizontalRoadHalfHeight() + movePointX), y: (this.getHorizontalRoadHalfWidth() + this.getHorizontalRoadHalfHeight() + movePointY) };

        // limit vertical road moved dictance
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
        
        // hide some elements
        this.hideElements();

        //draw path
        this.verticalRoadParam.streetLine1 = "M" + this.verticalRoadCoordinates.startPoint.x + "," + this.verticalRoadCoordinates.startPoint.y + " L" + this.verticalRoadCoordinates.startPoint.x + "," + (line1Intersection.y - space) + " Q " + line1Intersection.x + "," + line1Intersection.y + " " + (line1Intersection.x - space) + ",0  M" + this.verticalRoadCoordinates.startPoint.x + "," + (line1Intersection.y + this.horizontalRoadParam.height + space) + " Q " + line1Intersection.x + "," + (line1Intersection.y + this.horizontalRoadParam.height) + " " + (line1Intersection.x - space) + "," + (line1Intersection.y + this.horizontalRoadParam.height) + "  M" + this.verticalRoadCoordinates.startPoint.x + "," + (line1Intersection.y + this.horizontalRoadParam.height + space) + " L" + this.verticalRoadCoordinates.endPoint.x + "," + this.verticalRoadCoordinates.endPoint.y; 

        this.verticalRoadParam.streetLine2 = "M" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width / 2) + "," + this.verticalRoadCoordinates.startPoint.y + " L" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width / 2) + "," + (line1Intersection.y - space) + " M" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width / 2) + "," + (line1Intersection.y + this.horizontalRoadParam.height + space) + " L" + (this.verticalRoadCoordinates.endPoint.x + this.verticalRoadParam.width / 2) + "," + this.verticalRoadCoordinates.endPoint.y;
        
        // calculate vertical road can be moved point coordinate
        var line3MQ2 = { x: this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width, y: line1Intersection.y + this.horizontalRoadParam.height + space };
        var line3Q2_1 = { x: line1Intersection.x + this.verticalRoadParam.width, y: line1Intersection.y + this.horizontalRoadParam.height };
        var line3Q2_2 = { x: line1Intersection.x + this.verticalRoadParam.width + space, y: line1Intersection.y + this.horizontalRoadParam.height };

        this.verticalRoadParam.streetLine3 = "M" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width) + "," + this.verticalRoadCoordinates.startPoint.y + " L" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width) + "," + (line1Intersection.y - space) + " Q " + (line1Intersection.x + this.verticalRoadParam.width) + "," + line1Intersection.y + " " + (line1Intersection.x + this.verticalRoadParam.width + space) + ",0  M" + line3MQ2.x + "," + line3MQ2.y + " Q " + line3Q2_1.x + "," + line3Q2_1.y + " " + line3Q2_2.x + "," + line3Q2_2.y + "  M" + (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width) + "," + (line1Intersection.y + this.horizontalRoadParam.height + space) + " L" + (this.verticalRoadCoordinates.endPoint.x + this.verticalRoadParam.width) + "," + this.verticalRoadCoordinates.endPoint.y;

        this.coordinatePath.streetLine1 = "M0,0 L" + (line1Intersection.x - space) + ",0 M" + (line1Intersection.x + this.verticalRoadParam.width + space) + ",0 L" + this.horizontalRoadParam.width + ",0";
        this.coordinatePath.streetLine2 = "M0," + this.getHorizontalRoadHalfHeight() + " L" + (line1Intersection.x - space) + "," + this.getHorizontalRoadHalfHeight() + " M" + (line1Intersection.x + this.verticalRoadParam.width + space) + "," + this.getHorizontalRoadHalfHeight() + " L" + this.horizontalRoadParam.width + "," + this.getHorizontalRoadHalfHeight();
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

        this.verticalRoadParam.line2Point1Path = this.getRhombi({ x: this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width / 2, y: this.getHorizontalRoadHalfHeight() - this.commonParam.rhombi.halfHeight });

        this.verticalRoadParam.line2Point1 = { x: this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width / 2 - this.commonParam.square.width / 2, y: this.verticalRoadCoordinates.startPoint.y - this.commonParam.square.height * 2, transform: "" };
        this.verticalRoadParam.line2Point2 = { x: this.verticalRoadCoordinates.endPoint.x + this.verticalRoadParam.width / 2 - this.commonParam.square.width / 2, y: this.verticalRoadCoordinates.endPoint.y + this.commonParam.square.height * 2, transform: "" };
        this.coordinatePath.streetLine1RampPath = "";
        this.coordinatePath.streetLine3RampPath = "";
        this.drawVRoadLine3Point2Text(true);
        this.drawHRoadLine3Point2Text(true);

    }

    //vertical road the third line of from left to right and on the third line's intersection's  right and bottom point of horizontal road
    moveToLine3Point2M3() {
        var moveDistance = 0;
        var movePointX = 0;
        if (this.horizontalRoadParam.Line2RightRotate == 0) {
            //calculate distince of moving x
            movePointX = this.props.point.x - this.lastRoadPoint.x - this.verticalRoadParam.width / 2 - this.verticalRoadCoordinates.line3Point2.MQ1XSpace / 2 + (this.getHorizontalRoadHalfWidth() - this.verticalRoadCoordinates.startPoint.x - this.verticalRoadParam.width / 2);
            
        } else {
            movePointX = this.props.point.x - this.lastRoadPoint.x - this.verticalRoadParam.width / 2 - this.verticalRoadCoordinates.line3Point2.MQ1XSpace / 2 + (this.getHorizontalRoadHalfWidth() - this.verticalRoadCoordinates.startPoint.x - this.verticalRoadParam.width / 2);
        }

        var line3MQ1XSpace = this.verticalRoadCoordinates.line3Point2.MQ1XSpace + movePointX;
        var line3MQ1YSpace = this.verticalRoadCoordinates.line3Point2.MQ1YSpace + movePointX;
        if (line3MQ1YSpace < 0) line3MQ1YSpace = 0;
        if (line3MQ1XSpace < 0) line3MQ1XSpace = 0;
        moveDistance = line3MQ1YSpace > line3MQ1XSpace ? line3MQ1XSpace : line3MQ1YSpace;

        var vWidth = this.verticalRoadCoordinates.endPoint.y - this.horizontalRoadParam.height;
        var hWidth = this.horizontalRoadParam.width - this.verticalRoadCoordinates.endPoint.x - this.verticalRoadParam.width;
        var maxDistance = vWidth > hWidth ? hWidth : vWidth;
        if (moveDistance > maxDistance) moveDistance = maxDistance;// limit max distance
        this.verticalRoadCoordinates.line3Point2.MQ1XSpace = moveDistance;
        this.verticalRoadCoordinates.line3Point2.MQ1YSpace = moveDistance;

        this.setLine3Point2Path("M3");
        this.drawVRoadLine3Point2Text();
        this.drawHRoadLine3Point2Text();
    }
     //vertical road the third line of from left to right and on the third line's intersection's  bottom point of  horizontal road
    moveToLine3Point2M1() {
        //calculate distince of moving y
        var movePointY = this.props.point.y - this.lastRoadPoint.y - this.getHorizontalRoadHalfHeight() - this.verticalRoadCoordinates.line3Point2.MQ1YSpace;

        var line3MQ1XSpace = this.verticalRoadCoordinates.line3Point2.MQ1XSpace
        var line3MQ1YSpace = this.verticalRoadCoordinates.line3Point2.MQ1YSpace + movePointY;;

        if (line3MQ1YSpace < 0) line3MQ1YSpace = 0;
        var moveDistance = line3MQ1YSpace;
        var maxDistance = this.verticalRoadCoordinates.endPoint.y - roadObject.height;

        if (moveDistance > maxDistance) moveDistance = maxDistance;// limit max distance

        this.verticalRoadCoordinates.line3Point2.MQ1YSpace = moveDistance;

        this.setLine3Point2Path("M1");
        this.drawVRoadLine3Point2Text();
        this.drawHRoadLine3Point2Text();
    }
     //vertical road the third line of from left to right and on the third line's intersection's  right point of  horizontal road
    moveToLine3Point2M2() {
          //calculate distince of moving x
        var movePointX = 0;
        if ((this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width / 2) >= this.lastRoadPoint.x) {
            movePointX = this.props.point.x - this.lastRoadPoint.x - this.verticalRoadParam.width / 2 - this.verticalRoadCoordinates.line3Point2.MQ1XSpace;
        } else {
            movePointX = this.props.point.x - this.lastRoadPoint.x - this.verticalRoadParam.width / 2 - this.verticalRoadCoordinates.line3Point2.MQ1XSpace + (this.getHorizontalRoadHalfWidth() - this.verticalRoadCoordinates.startPoint.x - this.verticalRoadParam.width / 2);
        }

        var line1Intersection = { x: 0, y: 0 };

        var line3MQ1XSpace = this.verticalRoadCoordinates.line3Point2.MQ1XSpace + movePointX;

        if (line3MQ1XSpace < 0) line3MQ1XSpace = 0;
        var moveDistance = line3MQ1XSpace;
        var maxDistance = this.horizontalRoadParam.width - (this.verticalRoadCoordinates.startPoint.x + this.verticalRoadParam.width);

        if (moveDistance > maxDistance) moveDistance = maxDistance;// limit max distance
        this.verticalRoadCoordinates.line3Point2.MQ1XSpace = moveDistance;

        this.setLine3Point2Path("M2");
        this.drawVRoadLine3Point2Text();
        this.drawHRoadLine3Point2Text();
    }

    // hide some elements
    hideElements() {

        this.verticalRoadParam.maskLayerPath1 = "";
        $("#paved2MaskLayer").addClass("display-none");
        $("#paved2Point").addClass("display-none");
        $("#mainpaved1").removeClass("display-none");
        $("#paved1MaskLayer").removeClass("display-none");
        $("#paved1Point").removeClass("display-none");
    }

    getLeftMovePoint(midMovePointY, lineLeftPoint, isBigCircle, rightMoveY, lineNumber) {
        var angleRight;
        var leftMovePointEnd = {};
        if (lineNumber == 1) {
            if (midMovePointY < 0) {
                if (isBigCircle == 0) {
                    angleRight = Math.atan(Math.abs(this.getHorizontalRoadHalfHeight() - lineLeftPoint.y) / Math.abs(0 - lineLeftPoint.x));
                } else {
                    angleRight = Math.atan(Math.abs(0 - lineLeftPoint.x) / Math.abs(lineLeftPoint.y - this.getHorizontalRoadHalfHeight()));
                }
            } else {
                if (isBigCircle == 0) {
                    angleRight = Math.atan(Math.abs(this.getHorizontalRoadHalfHeight() - lineLeftPoint.y) / Math.abs(lineLeftPoint.x));
                } else {
                    angleRight = Math.atan(Math.abs(lineLeftPoint.x) / Math.abs(lineLeftPoint.y - this.getHorizontalRoadHalfHeight()));
                }
            }

            if (midMovePointY < 0) {
                if (isBigCircle == 0) {
                    leftMovePointEnd.x = lineLeftPoint.x - Math.cos(angleRight) * Math.abs(rightMoveY);
                    leftMovePointEnd.y = lineLeftPoint.y - Math.sin(angleRight) * Math.abs(rightMoveY);
                } else {
                    leftMovePointEnd.x = lineLeftPoint.x - Math.sin(angleRight) * Math.abs(rightMoveY);
                    leftMovePointEnd.y = lineLeftPoint.y + Math.cos(angleRight) * Math.abs(rightMoveY);
                }
            } else {
                if (isBigCircle == 0) {
                    leftMovePointEnd.x = lineLeftPoint.x + Math.cos(angleRight) * Math.abs(rightMoveY);
                    leftMovePointEnd.y = lineLeftPoint.y - Math.sin(angleRight) * Math.abs(rightMoveY);
                } else {
                    leftMovePointEnd.x = lineLeftPoint.x + Math.sin(angleRight) * Math.abs(rightMoveY);
                    leftMovePointEnd.y = lineLeftPoint.y + Math.cos(angleRight) * Math.abs(rightMoveY);
                }
            }
        } else if (lineNumber == 3) {
            if (midMovePointY < 0) {
                if (isBigCircle == 0) {
                    angleRight = Math.atan(Math.abs(lineLeftPoint.y - this.getHorizontalRoadHalfHeight()) / Math.abs(lineLeftPoint.x - 0));
                } else {
                    angleRight = Math.atan(Math.abs(lineLeftPoint.x - 0) / Math.abs(this.getHorizontalRoadHalfHeight() - lineLeftPoint.y));
                }
            } else {
                if (isBigCircle == 0) {
                    angleRight = Math.atan(Math.abs(lineLeftPoint.y - this.getHorizontalRoadHalfHeight()) / Math.abs(0 - lineLeftPoint.x));
                } else {
                    angleRight = Math.atan(Math.abs(0 - lineLeftPoint.x) / Math.abs(this.getHorizontalRoadHalfHeight() - lineLeftPoint.y));
                }
            }

            if (midMovePointY < 0) {
                if (isBigCircle == 0) {
                    leftMovePointEnd.x = lineLeftPoint.x + Math.cos(angleRight) * Math.abs(rightMoveY);
                    leftMovePointEnd.y = lineLeftPoint.y + Math.sin(angleRight) * Math.abs(rightMoveY);
                } else {
                    leftMovePointEnd.x = lineLeftPoint.x + Math.sin(angleRight) * Math.abs(rightMoveY);
                    leftMovePointEnd.y = lineLeftPoint.y - Math.cos(angleRight) * Math.abs(rightMoveY);
                }
            } else {
                if (isBigCircle == 0) {
                    leftMovePointEnd.x = lineLeftPoint.x - Math.cos(angleRight) * Math.abs(rightMoveY);
                    leftMovePointEnd.y = lineLeftPoint.y + Math.sin(angleRight) * Math.abs(rightMoveY);
                } else {
                    leftMovePointEnd.x = lineLeftPoint.x - Math.sin(angleRight) * Math.abs(rightMoveY);
                    leftMovePointEnd.y = lineLeftPoint.y - Math.cos(angleRight) * Math.abs(rightMoveY);
                }
            }
        }
        return leftMovePointEnd;
    }

    getRightEndPoint(midMovePointY, lineRightPoint, isBigCircle, rightMoveY, lineNumber) {
        var angleRight;
        var line1RightPointEnd = {};
        if (lineNumber == 1) {
            if (midMovePointY < 0) {
                if (isBigCircle == 0) {
                    angleRight = Math.atan(Math.abs(this.getHorizontalRoadHalfHeight() - lineRightPoint.y) / Math.abs(lineRightPoint.x - this.horizontalRoadParam.width));
                } else {
                    angleRight = Math.atan(Math.abs(lineRightPoint.x - this.horizontalRoadParam.width) / Math.abs(lineRightPoint.y - this.getHorizontalRoadHalfHeight()));
                }
            } else {
                if (isBigCircle == 0) {
                    angleRight = Math.atan(Math.abs(this.getHorizontalRoadHalfHeight() - lineRightPoint.y) / Math.abs(this.horizontalRoadParam.width - lineRightPoint.x));
                } else {
                    angleRight = Math.atan(Math.abs(this.horizontalRoadParam.width - lineRightPoint.x) / Math.abs(lineRightPoint.y - this.getHorizontalRoadHalfHeight()));
                }
            }

            if (midMovePointY < 0) {
                if (isBigCircle == 0) {
                    line1RightPointEnd.x = lineRightPoint.x + Math.cos(angleRight) * Math.abs(rightMoveY);
                    line1RightPointEnd.y = lineRightPoint.y - Math.sin(angleRight) * Math.abs(rightMoveY);
                } else {
                    line1RightPointEnd.x = lineRightPoint.x + Math.sin(angleRight) * Math.abs(rightMoveY);
                    line1RightPointEnd.y = lineRightPoint.y + Math.cos(angleRight) * Math.abs(rightMoveY);
                }
            } else {
                if (isBigCircle == 0) {
                    line1RightPointEnd.x = lineRightPoint.x - Math.cos(angleRight) * Math.abs(rightMoveY);
                    line1RightPointEnd.y = lineRightPoint.y - Math.sin(angleRight) * Math.abs(rightMoveY);
                } else {
                    line1RightPointEnd.x = lineRightPoint.x - Math.sin(angleRight) * Math.abs(rightMoveY);
                    line1RightPointEnd.y = lineRightPoint.y + Math.cos(angleRight) * Math.abs(rightMoveY);
                }
            }
        } else if (lineNumber == 3) {
            var roadWidth = this.horizontalRoadParam.width;
            if (midMovePointY < 0) {
                if (isBigCircle == 0) {
                    angleRight = Math.atan(Math.abs(lineRightPoint.y - this.getHorizontalRoadHalfHeight()) / Math.abs(roadWidth - lineRightPoint.x));
                } else {
                    angleRight = Math.atan(Math.abs(roadWidth - lineRightPoint.x) / Math.abs(this.getHorizontalRoadHalfHeight() - lineRightPoint.y));
                }
            } else {
                if (isBigCircle == 0) {
                    angleRight = Math.atan(Math.abs(lineRightPoint.y - this.getHorizontalRoadHalfHeight()) / Math.abs(lineRightPoint.x - roadWidth));
                } else {
                    angleRight = Math.atan(Math.abs(lineRightPoint.x - roadWidth) / Math.abs(this.getHorizontalRoadHalfHeight() - lineRightPoint.y));
                }
            }

            if (midMovePointY < 0) {
                if (isBigCircle == 0) {
                    line1RightPointEnd.x = lineRightPoint.x - Math.cos(angleRight) * Math.abs(rightMoveY);
                    line1RightPointEnd.y = lineRightPoint.y + Math.sin(angleRight) * Math.abs(rightMoveY);
                } else {
                    line1RightPointEnd.x = lineRightPoint.x - Math.sin(angleRight) * Math.abs(rightMoveY);
                    line1RightPointEnd.y = lineRightPoint.y - Math.cos(angleRight) * Math.abs(rightMoveY);
                }
            } else {
                if (isBigCircle == 0) {
                    line1RightPointEnd.x = lineRightPoint.x + Math.cos(angleRight) * Math.abs(rightMoveY);
                    line1RightPointEnd.y = lineRightPoint.y + Math.sin(angleRight) * Math.abs(rightMoveY);
                } else {
                    line1RightPointEnd.x = lineRightPoint.x + Math.sin(angleRight) * Math.abs(rightMoveY);
                    line1RightPointEnd.y = lineRightPoint.y - Math.cos(angleRight) * Math.abs(rightMoveY);
                }
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

        if (this.horizontalRoadParam.Line1RightLPoint1 == null || midMovePointY == 0) {
            return;
        }

        var line1RightLPoint1 = {};
        var line1RightCPoint1 = {};
        var line1RightCPoint2 = {};
        var line1RightCPoint3 = {};
        var line1RightPointEnd = {};

        var tempLine1R = midMovePointY > 0 ? line1R - Math.abs(this.horizontalRoadParam.line1RampMoveY) : line1R + Math.abs(this.horizontalRoadParam.line1RampMoveY);
        var tempLeftPoint = this.getLeftMovePoint(midMovePointY, line1LeftPoint, isBigCircle, this.horizontalRoadParam.line1RampMoveY, 1);
        var line1RightLPoint1Inside = this.getLine1ControllerPointForLine2Mid(midMovePointY, deg, line1R, isBigCircle, line1LeftPoint, 0);
        var line1RightCPoint3Inside = this.getLine1ControllerPointForLine2Mid(midMovePointY, deg, line1R, isBigCircle, line1LeftPoint, 3);
        var line1RightPointEnd = this.getRightEndPoint(midMovePointY, line1RightPoint, isBigCircle, this.horizontalRoadParam.line1RampMoveY, 1);
        var tempMidMovePointY = midMovePointY > 0 ? midMovePointY + this.horizontalRoadParam.line1RampMoveY : midMovePointY + this.horizontalRoadParam.line1RampMoveY;

       // console.log('tempLine1R:   ' + tempLine1R + '    midMovePointY:    ' + midMovePointY + '      tempMidMovePointY:    ' + tempMidMovePointY);

        if (this.horizontalRoadParam.isDrawLine1LeftRamp) {
            line1RightLPoint1 = this.getLine1ControllerPointForLine2Mid(tempMidMovePointY, deg, tempLine1R, isBigCircle, tempLeftPoint, 0);
            line1RightCPoint1 = this.getLine1ControllerPointForLine2Mid(tempMidMovePointY, deg, tempLine1R, isBigCircle, tempLeftPoint, 1);

            line1RightCPoint2 = this.getLine1ControllerPointForLine2Mid(midMovePointY, deg, line1R, isBigCircle, line1LeftPoint, 2);
            line1RightCPoint3 = this.getLine1ControllerPointForLine2Mid(midMovePointY, deg, line1R, isBigCircle, line1LeftPoint, 3);

            if (tempLine1R < 0) {
                line1RightLPoint1 = line1RightCPoint1 = tempLeftPoint;
            }
            if (Math.abs(line1RightCPoint1.y) < Math.abs(line1RightLPoint1.y) && isInside == true && isBigCircle == 0 && this.horizontalRoadParam.Line2RightRotate == 0) {
                line1RightCPoint1.y = tempLeftPoint.y;
            }
        } else {
            line1RightLPoint1 = this.getLine1ControllerPointForLine2Mid(midMovePointY, deg, line1R, isBigCircle, line1LeftPoint, 0);
            line1RightCPoint1 = this.getLine1ControllerPointForLine2Mid(midMovePointY, deg, line1R, isBigCircle, line1LeftPoint, 1);

            line1RightCPoint2 = this.getLine1ControllerPointForLine2Mid(tempMidMovePointY, deg, tempLine1R, isBigCircle, tempLeftPoint, 2);
            line1RightCPoint3 = this.getLine1ControllerPointForLine2Mid(tempMidMovePointY, deg, tempLine1R, isBigCircle, tempLeftPoint, 3);

            if (tempLine1R < 0) {
                line1RightCPoint2 = line1RightCPoint3 = line1RightPointEnd;
            }

            if (Math.abs(line1RightCPoint3.y) < Math.abs(line1RightCPoint2.y) && isInside == true && isBigCircle == 0 && this.horizontalRoadParam.Line2RightRotate == 0) {
                line1RightCPoint3.y = line1RightPointEnd.y;
            }
        }

        var line1RightPath = "";
        var streetLine1Path = "";

        if (this.horizontalRoadParam.line1RampMoveY != 0) {
            if (this.horizontalRoadParam.isDrawLine1LeftRamp) {
                line1RightPath = "M" + tempLeftPoint.x + "," + tempLeftPoint.y + " A" + tempLine1R + "," + tempLine1R + " 0 " + this.horizontalRoadParam.reDrawRamp.islPointBigCircle + " " + toward + " " + line1RightLPoint1.x + "," + line1RightLPoint1.y + " C" + line1RightCPoint1.x + "," + line1RightCPoint1.y + " " + line1RightCPoint2.x + "," + line1RightCPoint2.y + " " + line1RightCPoint3.x + "," + line1RightCPoint3.y + " A" + line1R + "," + line1R + " 0 " + 0 + " " + toward + " " + line1RightPoint.x + "," + line1RightPoint.y;

                streetLine1Path = "M" + line1LeftPoint.x + "," + line1LeftPoint.y + " A" + line1R + "," + line1R + " 0 " + this.horizontalRoadParam.reDrawRamp.islPointBigCircle + " " + toward + " " + line1RightLPoint1Inside.x + "," + line1RightLPoint1Inside.y + " M" + line1RightCPoint3.x + "," + line1RightCPoint3.y + " A" + line1R + "," + line1R + " 0 " + 0 + " " + toward + " " + line1RightPoint.x + "," + line1RightPoint.y;

                this.horizontalRoadParam.line1LeftRampPoint = { x: tempLeftPoint.x - 6, y: tempLeftPoint.y };
                this.coordinatePath.topLeftPointPath = this.getTriangle(this.horizontalRoadParam.line1LeftRampPoint, "up");
            } else {
                line1RightPath = "M" + line1LeftPoint.x + "," + line1LeftPoint.y + " A" + line1R + "," + line1R + " 0 " + this.horizontalRoadParam.reDrawRamp.islPointBigCircle + " " + toward + " " + line1RightLPoint1.x + "," + line1RightLPoint1.y + " C" + line1RightCPoint1.x + "," + line1RightCPoint1.y + " " + line1RightCPoint2.x + "," + line1RightCPoint2.y + " " + line1RightCPoint3.x + "," + line1RightCPoint3.y + " A" + tempLine1R + "," + tempLine1R + " 0 " + 0 + " " + toward + " " + line1RightPointEnd.x + "," + line1RightPointEnd.y;
                streetLine1Path = "M" + line1LeftPoint.x + "," + line1LeftPoint.y + " A" + line1R + "," + line1R + " 0 " + this.horizontalRoadParam.reDrawRamp.islPointBigCircle + " " + toward + " " + line1RightLPoint1.x + "," + line1RightLPoint1.y + " M" + line1RightCPoint3Inside.x + "," + line1RightCPoint3Inside.y + " A" + line1R + "," + line1R + " 0 " + 0 + " " + toward + " " + line1RightPoint.x + "," + line1RightPoint.y;

                this.horizontalRoadParam.line1RightRampPoint = { x: line1RightPointEnd.x - 6, y: line1RightPointEnd.y };
                this.coordinatePath.topRightPointPath = this.getTriangle(this.horizontalRoadParam.line1RightRampPoint, "up");
            }
        } else {
            if (this.horizontalRoadParam.isDrawLine1LeftRamp) {
                line1RightPath = "M" + tempLeftPoint.x + "," + tempLeftPoint.y + " A" + tempLine1R + "," + tempLine1R + " 0 " + isBigCircle + " " + toward + " " + line1RightPoint.x + "," + line1RightPoint.y;
            } else {
                line1RightPath = "M" + line1LeftPoint.x + "," + line1LeftPoint.y + " A" + tempLine1R + "," + tempLine1R + " 0 " + isBigCircle + " " + toward + " " + line1RightPointEnd.x + "," + line1RightPointEnd.y;
            }
        }

        this.coordinatePath.streetLine1RampPath = line1RightPath;
        this.coordinatePath.streetLine1 = streetLine1Path;

    }

    reDrawLine3RightMoveRamp(midMovePointY, deg, line3R, isBigCircle, isInside, toward, line3LeftPoint, line3RightPoint) {
        this.getLine3RightRampPath();//recalculate the points for the line3's ramp

        this.horizontalRoadParam.reDrawRamp.midMovePointY = midMovePointY;
        this.horizontalRoadParam.reDrawRamp.deg = deg;
        this.horizontalRoadParam.reDrawRamp.line3R = line3R;
        this.horizontalRoadParam.reDrawRamp.isBigCircle = isBigCircle;
        this.horizontalRoadParam.reDrawRamp.isInside = isInside;
        this.horizontalRoadParam.reDrawRamp.toward = toward;

        if (this.horizontalRoadParam.Line3RampLPoint1 == null || midMovePointY == 0) {
            return;
        }

        var line3RightLPoint1 = {};
        var line3RightCPoint1 = {};
        var line3RightCPoint2 = {};
        var line3RightCPoint3 = {};
        var line3RightPointEnd = {};

        var calc3MoveY = this.horizontalRoadParam.line3RampMoveY == 0 ? 0 : this.horizontalRoadParam.height - this.horizontalRoadParam.line3RampMoveY;
        //line3 inside or outside circle's radius
        var tempLine3R = midMovePointY > 0 ? line3R + Math.abs(calc3MoveY) : line3R - Math.abs(calc3MoveY);
        //line3 inside or outside circle's left point 
        var tempLeftPoint = this.getLeftMovePoint(midMovePointY, line3LeftPoint, isBigCircle, calc3MoveY, 3);

        //line3's point1 inside
        var line3RightLPoint1Inside = this.getLine3ControllerPointForLine2Mid(midMovePointY + this.horizontalRoadParam.height, deg, line3R, isBigCircle, line3LeftPoint, 0);
        //line3's point3 inside
        var line3RightCPoint3Inside = this.getLine3ControllerPointForLine2Mid(midMovePointY + this.horizontalRoadParam.height, deg, line3R, isBigCircle, line3LeftPoint, 3);

        var line3RightPointEnd = this.getRightEndPoint(midMovePointY, line3RightPoint, isBigCircle, calc3MoveY, 3);
        var tempMidMovePointY = this.horizontalRoadParam.line3RampMoveY + midMovePointY;

        //base on the moving type calculate the new points 
        if (this.horizontalRoadParam.isDrawLine3LeftRamp) {
            line3RightLPoint1 = this.getLine3ControllerPointForLine2Mid(tempMidMovePointY, deg, tempLine3R, isBigCircle, tempLeftPoint, 0);
            line3RightCPoint1 = this.getLine3ControllerPointForLine2Mid(tempMidMovePointY, deg, tempLine3R, isBigCircle, tempLeftPoint, 1);

            line3RightCPoint2 = this.getLine3ControllerPointForLine2Mid(midMovePointY + this.horizontalRoadParam.height, deg, line3R, isBigCircle, line3LeftPoint, 2);
            line3RightCPoint3 = this.getLine3ControllerPointForLine2Mid(midMovePointY + this.horizontalRoadParam.height, deg, line3R, isBigCircle, line3LeftPoint, 3);

            if (tempLine3R < 0) {
                line3RightLPoint1 = line3RightCPoint1 = tempLeftPoint;
            }
            if (Math.abs(line3RightCPoint1.y) < Math.abs(line3RightLPoint1.y) && isInside == true && isBigCircle == 0 && this.horizontalRoadParam.Line2RightRotate == 0) {
                line3RightCPoint1.y = tempLeftPoint.y;
            }
        } else {
            line3RightLPoint1 = this.getLine3ControllerPointForLine2Mid(midMovePointY + this.horizontalRoadParam.height, deg, line3R, isBigCircle, line3LeftPoint, 0);
            line3RightCPoint1 = this.getLine3ControllerPointForLine2Mid(midMovePointY + this.horizontalRoadParam.height, deg, line3R, isBigCircle, line3LeftPoint, 1);

            line3RightCPoint2 = this.getLine3ControllerPointForLine2Mid(tempMidMovePointY, deg, tempLine3R, isBigCircle, tempLeftPoint, 2);
            line3RightCPoint3 = this.getLine3ControllerPointForLine2Mid(tempMidMovePointY, deg, tempLine3R, isBigCircle, tempLeftPoint, 3);
            //if (tempLine3R < 0) {
            //    line3RightCPoint2 = line3RightCPoint3 = line3RightPointEnd;
            //}

            //if (Math.abs(line3RightCPoint3.y) < Math.abs(line3RightCPoint2.y) && isInside == true && isBigCircle == 0 && this.horizontalRoadParam.Line2RightRotate == 0) {
            //    line3RightCPoint3.y = line3RightPointEnd.y;
            //}
        }

        var line3RightPath = "";
        var streetLine3Path = "";

        //base on the move distance and moving type draw different ramp path (left or right)
        if (this.horizontalRoadParam.line3RampMoveY != 0) {
            if (this.horizontalRoadParam.isDrawLine3LeftRamp) {
                line3RightPath = "M" + tempLeftPoint.x + "," + tempLeftPoint.y + " A" + tempLine3R + "," + tempLine3R + " 0 " + this.horizontalRoadParam.reDrawRamp.is3PointBigCircle + " " + toward + " " + line3RightLPoint1.x + "," + line3RightLPoint1.y + " C" + line3RightCPoint1.x + "," + line3RightCPoint1.y + " " + line3RightCPoint2.x + "," + line3RightCPoint2.y + " " + line3RightCPoint3.x + "," + line3RightCPoint3.y + " A" + line3R + "," + line3R + " 0 " + 0 + " " + toward + " " + line3RightPoint.x + "," + line3RightPoint.y;

                streetLine3Path = "M" + line3LeftPoint.x + "," + line3LeftPoint.y + " A" + line3R + "," + line3R + " 0 " + this.horizontalRoadParam.reDrawRamp.is3PointBigCircle + " " + toward + " " + line3RightLPoint1Inside.x + "," + line3RightLPoint1Inside.y + " M" + line3RightCPoint3.x + "," + line3RightCPoint3.y + " A" + line3R + "," + line3R + " 0 " + 0 + " " + toward + " " + line3RightPoint.x + "," + line3RightPoint.y;

                this.horizontalRoadParam.line3LeftRampPoint = { x: tempLeftPoint.x - 6, y: tempLeftPoint.y };
                this.coordinatePath.bottomleftPointPath = this.getTriangle(this.horizontalRoadParam.line3LeftRampPoint, "down");
            } else {
                line3RightPath = "M" + line3LeftPoint.x + "," + line3LeftPoint.y + " A" + line3R + "," + line3R + " 0 " + this.horizontalRoadParam.reDrawRamp.is3PointBigCircle + " " + toward + " " + line3RightLPoint1.x + "," + line3RightLPoint1.y + " C" + line3RightCPoint1.x + "," + line3RightCPoint1.y + " " + line3RightCPoint2.x + "," + line3RightCPoint2.y + " " + line3RightCPoint3.x + "," + line3RightCPoint3.y + " A" + tempLine3R + "," + tempLine3R + " 0 " + 0 + " " + toward + " " + line3RightPointEnd.x + "," + line3RightPointEnd.y;
                streetLine3Path = "M" + line3LeftPoint.x + "," + line3LeftPoint.y + " A" + line3R + "," + line3R + " 0 " + this.horizontalRoadParam.reDrawRamp.is3PointBigCircle + " " + toward + " " + line3RightLPoint1.x + "," + line3RightLPoint1.y + " M" + line3RightCPoint3Inside.x + "," + line3RightCPoint3Inside.y + " A" + line3R + "," + line3R + " 0 " + 0 + " " + toward + " " + line3RightPoint.x + "," + line3RightPoint.y;

                this.horizontalRoadParam.line3RightRampPoint = { x: line3RightPointEnd.x - 6, y: line3RightPointEnd.y };
                this.coordinatePath.bottomrightPointPath = this.getTriangle(this.horizontalRoadParam.line3RightRampPoint, "down");
            }
        } else {
            if (this.horizontalRoadParam.isDrawLine3LeftRamp) {
                line3RightPath = "M" + tempLeftPoint.x + "," + tempLeftPoint.y + " A" + tempLine3R + "," + tempLine3R + " 0 " + isBigCircle + " " + toward + " " + line3RightPoint.x + "," + line3RightPoint.y;
            } else {
                line3RightPath = "M" + line3LeftPoint.x + "," + line3LeftPoint.y + " A" + tempLine3R + "," + tempLine3R + " 0 " + isBigCircle + " " + toward + " " + line3RightPointEnd.x + "," + line3RightPointEnd.y;
            }
        }

        this.coordinatePath.streetLine3RampPath = line3RightPath;
        this.coordinatePath.streetLine3 = streetLine3Path;
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
        if ((this.horizontalRoadParam.isDrawLine1LeftRamp && pointNumber >= 2) || (this.horizontalRoadParam.isDrawLine1RightRamp && pointNumber <= 1)) {// && pointNumber == 0
            if (lPointArcLength > (Math.PI * line1R)) {
                this.horizontalRoadParam.reDrawRamp.islPointBigCircle = 1;
            } else {
                this.horizontalRoadParam.reDrawRamp.islPointBigCircle = 0;
            }
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
        line1CenterPoint.x = this.getHorizontalRoadHalfWidth();
        line1CenterPoint.y = centerY;

        var lPointArc = (lPointArcLength / (2 * Math.PI * line1R)) * 360;
        var leftPointArc;
        if (isBigCircle == 0) {
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

    //get line3's points base on the line3's radius and the pointnumber
    getLine3ControllerPointForLine2Mid(midMovePointY, deg, line3R, isBigCircle, line3LeftPoint, pointNumber) {
        var line3deg = (90 - deg);
        var line3Length = Math.abs((2 * Math.PI * line3R) * line3deg / 360) * 4;//line3 change to the arc length
        var line3ChangeScale = line3Length / this.horizontalRoadParam.width;//changed scale

        var lPoint = this.horizontalRoadParam.Line3RampLPoint1;
        var cPoint3 = this.horizontalRoadParam.Line3RampCPoint3;

        var cPoint1ToPoint3Distance;
        var left = 0;
        if (line3ChangeScale >= 1) {
            cPoint1ToPoint3Distance = Math.abs(cPoint3.x - lPoint.x) / 3;
            left = (this.horizontalRoadParam.width * line3ChangeScale - (lPoint.x * line3ChangeScale + (cPoint3.x - lPoint.x) + (this.horizontalRoadParam.width - cPoint3.x))) / 2;
        } else {
            cPoint1ToPoint3Distance = Math.abs((cPoint3.x - lPoint.x) * line3ChangeScale) / 3;
        }

        var lPointArcLength = lPoint.x * line3ChangeScale + left;
        var islPointBigCircle = 0;
        if ((this.horizontalRoadParam.isDrawLine3LeftRamp && pointNumber >= 2) || (this.horizontalRoadParam.isDrawLine3RightRamp && pointNumber <= 1)) {
            if (lPointArcLength > (Math.PI * line3R)) {
                this.horizontalRoadParam.reDrawRamp.is3PointBigCircle = 1;
            } else {
                this.horizontalRoadParam.reDrawRamp.is3PointBigCircle = 0;
            }
        }

        if (pointNumber == 1) {
            lPointArcLength = lPoint.x * line3ChangeScale + left + cPoint1ToPoint3Distance;
        } else if (pointNumber == 2) {
            lPointArcLength = lPoint.x * line3ChangeScale + left + cPoint1ToPoint3Distance * 2;
        } else if (pointNumber == 3) {
            lPointArcLength = lPoint.x * line3ChangeScale + left + cPoint1ToPoint3Distance * 3;
        }

        var line3CenterPoint = {};
        var centerY = (midMovePointY > 0 ? midMovePointY - line3R : midMovePointY + line3R);
        line3CenterPoint.x = this.getHorizontalRoadHalfWidth();
        line3CenterPoint.y = centerY;

        var lPointArc = (lPointArcLength / (2 * Math.PI * line3R)) * 360;
        var leftPointArc;
        var leftPointDeg;
        if (isBigCircle == 0) {
            leftPointDeg = Math.asin(Math.abs(line3CenterPoint.y - line3LeftPoint.y) / line3R) * 180 / Math.PI;
            if (isNaN(leftPointDeg)) {
                leftPointDeg = Math.acos(Math.abs(line3CenterPoint.x - line3LeftPoint.x) / line3R) * 180 / Math.PI;
            }
            leftPointArc = 90 - lPointArc - leftPointDeg;
        } else {
            leftPointDeg = Math.acos(Math.abs(line3CenterPoint.x - line3LeftPoint.x) / line3R) * 180 / Math.PI;
            if (isNaN(leftPointDeg)) {
                leftPointDeg = Math.asin(Math.abs(line3CenterPoint.y - line3LeftPoint.y) / line3R) * 180 / Math.PI;
            }
            leftPointArc = 90 - lPointArc + leftPointDeg;
        }

        var anglec = (180 - leftPointArc) / 2;
        var bc = Math.sin((leftPointArc / 2) * Math.PI / 180) * line3R * 2;

        var lPointEnd = {};
        lPointEnd.x = line3CenterPoint.x - bc * Math.sin(anglec * Math.PI / 180);

        if (midMovePointY > 0) {
            lPointEnd.y = line3CenterPoint.y + (line3R - bc * Math.cos(anglec * Math.PI / 180));
        } else {
            lPointEnd.y = line3CenterPoint.y - (line3R - bc * Math.cos(anglec * Math.PI / 180));
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
        return "M " + point.x + " " + point.y + " L " + (point.x - this.commonParam.rhombi.halfHeight) + " " + (point.y + this.commonParam.rhombi.halfHeight) + " L " + point.x + " " + (point.y + this.commonParam.rhombi.width) + " L " + (point.x + this.commonParam.rhombi.halfHeight) + " " + (point.y + this.commonParam.rhombi.halfHeight) + " L " + point.x + " " + point.y;
    }

    getLine2Path() {
        return "M0," + this.getHorizontalRoadHalfHeight() + " L" + this.horizontalRoadParam.width + "," + this.getHorizontalRoadHalfHeight();
    }

    getLine1RightRampPath() {
        if (this.horizontalRoadParam.line1RampMoveY != 0) {
            var lPoint = {};
            var cPoint3 = {};
            var cPoint1 = {};
            var cPoint2 = {};
            var line1RampPath = "";
            var line1CentreTrianglePoint = {};

            if (this.horizontalRoadParam.isDrawLine1LeftRamp) {
                lPoint = { x: this.getHorizontalRoadHalfWidth() + this.horizontalRoadParam.line1RampMoveY * this.horizontalRoadParam.fixedWidthRatio, y: this.horizontalRoadParam.line1RampMoveY };
                cPoint3 = { x: lPoint.x + (-this.horizontalRoadParam.line1RampMoveY) * this.horizontalRoadParam.fixedHeightRatio, y: 0 };

                var lpointx = this.horizontalRoadParam.width - cPoint3.x;
                var cpoint3x = this.horizontalRoadParam.width - lPoint.x;
                lPoint.x = lpointx;
                cPoint3.x = cpoint3x;

                cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: this.horizontalRoadParam.line1RampMoveY };
                cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: 0 };

                line1RampPath = "M0," + this.horizontalRoadParam.line1RampMoveY + " L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + ",0";

                line1CentreTrianglePoint = { x: (cPoint1.x - 3 + (cPoint2.x - cPoint1.x) / 2), y: (this.horizontalRoadParam.line1RampMoveY / 2 + 3) };
            } else {
                lPoint = { x: this.getHorizontalRoadHalfWidth() + this.horizontalRoadParam.line1RampMoveY * this.horizontalRoadParam.fixedWidthRatio, y: 0 };
                cPoint3 = { x: lPoint.x + (-this.horizontalRoadParam.line1RampMoveY) * this.horizontalRoadParam.fixedHeightRatio, y: this.horizontalRoadParam.line1RampMoveY };
                cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: 0 };
                cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: this.horizontalRoadParam.line1RampMoveY };

                line1RampPath = "M0,0  L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.line1RampMoveY;

                line1CentreTrianglePoint = { x: (cPoint1.x + 3 + (cPoint2.x - cPoint1.x) / 2), y: (this.horizontalRoadParam.line1RampMoveY / 2 + 3) };
            }

            this.horizontalRoadParam.Line1RightLPoint1 = lPoint;
            this.horizontalRoadParam.Line1RightCPoint1 = cPoint1;
            this.horizontalRoadParam.Line1RightCPoint2 = cPoint2;
            this.horizontalRoadParam.Line1RightCPoint3 = cPoint3;

            this.coordinatePath.streetLine1RampPath = line1RampPath;
            this.coordinatePath.line1RampTrianglePath = this.getTriangle(line1CentreTrianglePoint, "right");
        }
        else {
            this.coordinatePath.streetLine1RampPath = "";
            this.coordinatePath.line1RampTrianglePath = "";
        }
    }

    getLine3RightRampPath() {
        var movePointY = this.horizontalRoadParam.line3RampMoveY;
        if (movePointY != 0 && movePointY != this.horizontalRoadParam.height) {
            var lPoint = {};
            var cPoint3 = {};
            var cPoint1 = {};
            var cPoint2 = {};
            var line3RampPath = "";
            var line3CentreTrianglePoint = {};
            var centerPointY = (movePointY - this.horizontalRoadParam.height) / 2 + this.horizontalRoadParam.height;
            if (this.horizontalRoadParam.isDrawLine3LeftRamp) {
                var calcMoveY = this.horizontalRoadParam.height - movePointY;
                lPoint = { x: this.horizontalRoadParam.width / 2 + calcMoveY * this.horizontalRoadParam.fixedWidthRatio, y: movePointY };
                cPoint3 = { x: lPoint.x + (-calcMoveY) * this.horizontalRoadParam.fixedHeightRatio, y: this.horizontalRoadParam.height };

                var lpointx = this.horizontalRoadParam.width - cPoint3.x;
                var cpoint3x = this.horizontalRoadParam.width - lPoint.x;
                lPoint.x = lpointx;
                cPoint3.x = cpoint3x;

                cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: movePointY };
                cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: this.horizontalRoadParam.height };

                line3RampPath = "M0," + movePointY + " L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + "," + this.horizontalRoadParam.height;

                line3CentreTrianglePoint = { x: (cPoint1.x - 3 + (cPoint2.x - cPoint1.x) / 2), y: (centerPointY + 6) };
            } else {
                var calcMoveY = this.horizontalRoadParam.height - movePointY;

                lPoint = { x: this.horizontalRoadParam.width / 2 + calcMoveY * this.horizontalRoadParam.fixedWidthRatio, y: this.horizontalRoadParam.height };
                cPoint3 = { x: lPoint.x + (-calcMoveY) * this.horizontalRoadParam.fixedHeightRatio, y: movePointY };
                cPoint1 = { x: lPoint.x + (cPoint3.x - lPoint.x) / 3, y: this.horizontalRoadParam.height };
                cPoint2 = { x: lPoint.x + ((cPoint3.x - lPoint.x) / 3) * 2, y: movePointY };

                line3RampPath = "M0," + this.horizontalRoadParam.height + "  L" + lPoint.x + "," + lPoint.y + " C" + cPoint1.x + "," + cPoint1.y + " " + cPoint2.x + "," + cPoint2.y + " " + cPoint3.x + "," + cPoint3.y + " L" + this.horizontalRoadParam.width + "," + movePointY;

                line3CentreTrianglePoint = { x: (cPoint1.x + 3 + (cPoint2.x - cPoint1.x) / 2), y: (centerPointY + 9) };
            }

            this.horizontalRoadParam.Line3RampLPoint1 = lPoint;
            this.horizontalRoadParam.Line3RampCPoint1 = cPoint1;
            this.horizontalRoadParam.Line3RampCPoint2 = cPoint2;
            this.horizontalRoadParam.Line3RampCPoint3 = cPoint3;

            this.coordinatePath.streetLine3RampPath = line3RampPath;
            this.coordinatePath.line3RampTrianglePath = this.getTriangle(line3CentreTrianglePoint, "right");
        }
        else {
            this.coordinatePath.streetLine3RampPath = "";
            this.coordinatePath.line3RampTrianglePath = "";
        }
    }

    getLine1LeftControllerPoint(midMovePointY, deg, c) {
        var tempA = Math.cos(deg * Math.PI / 180) * (this.getHorizontalRoadHalfHeight());
        var b = Math.abs(midMovePointY);
        var a = this.getHorizontalRoadHalfWidth();
        var isInside = midMovePointY > 0 ? true : false;

        var c1 = 0;
        if (isInside) {
            c1 = c - 2 * tempA;
        } else {
            c1 = 2 * tempA + c;
        }
        var a1 = Math.sin(deg * Math.PI / 180) * c1;
        var b1 = Math.cos(deg * Math.PI / 180) * c1;

        var x = a - a1;
        var y = isInside ? b - b1 : b1 - b;

        return { x: x, y: y };
    }

    getLine1RightControllerPoint(line1LeftControllerPoint) {
        return { x: this.horizontalRoadParam.width - line1LeftControllerPoint.x, y: line1LeftControllerPoint.y };
    }

    getLine2LeftControllerPoint(midMovePointY, isBigCircle, centreDistance, line1LeftPoint) {
        var degOfLeftPoint = Math.acos(Math.abs(line1LeftPoint.x / this.getHorizontalRoadHalfHeight())) * 180 / Math.PI;
        var degOfCentrePoint = 90 - degOfLeftPoint;

        var pointX = Math.cos(degOfCentrePoint * Math.PI / 180) * centreDistance;
        var pointY = Math.sin(degOfCentrePoint * Math.PI / 180) * centreDistance;

        if (isBigCircle == 0) {
            pointX = -pointX;
        }
        if (midMovePointY < 0) {
            pointY = this.getHorizontalRoadHalfHeight() + pointY;
        } else {
            pointY = this.getHorizontalRoadHalfHeight() - pointY;
        }

        return { x: pointX, y: pointY };
    }

    getLine2RightControllerPoint(line2LeftControllerPoint, isBigCircle) {
        var pointX = line2LeftControllerPoint.x;
        var pointY = line2LeftControllerPoint.y;
        if (isBigCircle == 0) {
            pointX = this.horizontalRoadParam.width + Math.abs(pointX);
        } else {
            pointX = this.horizontalRoadParam.width - Math.abs(pointX);
        }

        return { x: pointX, y: pointY };
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
            $("#line3RightRampArrow").addClass("display-none");
            //$("#midleft").addClass("display-none");
            //$("#midright").addClass("display-none");
        } else {
            $("#line1RightRampArrow").removeClass("display-none");
            $("#line3RightRampArrow").removeClass("display-none");
            //$("#midright").removeClass("display-none");
        }
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
                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine1RampPath}></path>
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
                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine3RampPath}></path>
                            </g>
                        </g>
                        <g>
                            <g fill="#FFFFFF" fillOpacity="0" strokeOpacity="0" strokeWidth="0">
                                <path d={this.pavedFillPath}></path>
                            </g>
                        </g>
                    </g>
                    <g id="paved2MaskLayer" stroke="lime" strokeWidth="2" strokeDasharray="20,20,20,20,10,20" strokeOpacity="1" fill="none">
                        <path d={this.horizontalRoadParam.maskLayerPaths.Path} strokeWidth={this.horizontalRoadParam.height} strokeOpacity="1" strokeLinecap="butt" strokeDasharray="none" stroke="#808080"></path>
                        <path d={this.horizontalRoadParam.maskLayerPaths.Path}></path>
                        <path d={this.horizontalRoadParam.maskLayerPaths.Path} fill="none" strokeLinecap="butt"></path>
                    </g>


                </g>
                <g id="paved2Point">

                    <g id="topRightText" fill="#0000FF" strokeOpacity="0" strokeWidth="0" transform={this.coordinatePath.Line1TextRoate} fontSize="13" className="userSelect">
                        <g stroke="blue" strokeWidth="1" strokeOpacity="1">
                            <path d={this.coordinatePath.Line1RampText}></path>
                        </g>
                        <text x={this.horizontalRoadParam.Line1RampText.x} y={this.horizontalRoadParam.Line1RampText.y} textAnchor="middle" textLength={this.horizontalRoadParam.Line1RampText.textLength}>{this.horizontalRoadParam.Line1RampText.text}</text>
                    </g>
                    <g id="topleft-arrow" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onTouchStart={this.readyMoveLine1Left} onMouseDown={this.readyMoveLine1Left}  >
                        <path d={this.coordinatePath.topLeftPointPath} transform={this.coordinatePath.topLeftPointRotate} cursor="crosshair" ></path>
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
                    <g id="bottomText" fill="#0000FF" strokeOpacity="0" strokeWidth="0" transform={this.coordinatePath.Line3TextRoate} fontSize="13" className="userSelect">
                        <g stroke="blue" strokeWidth="1" strokeOpacity="1">
                            <path d={this.coordinatePath.Line3RampText}></path>
                        </g>
                        <text x={this.horizontalRoadParam.Line3RampText.x} y={this.horizontalRoadParam.Line3RampText.y} textAnchor="middle" textLength={this.horizontalRoadParam.Line3RampText.textLength}>{this.horizontalRoadParam.Line3RampText.text}</text>
                    </g>

                    <g id="bottomleft-arrow" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onTouchStart={this.readyMoveLine3Left} onMouseDown={this.readyMoveLine3Left}>
                        <path d={this.coordinatePath.bottomleftPointPath} cursor="crosshair"></path>
                    </g>
                    <g id="bottomright-arrow" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onTouchStart={this.readyMoveLine3Right} onMouseDown={this.readyMoveLine3Right}>
                        <path d={this.coordinatePath.bottomrightPointPath} cursor="crosshair" ></path>
                    </g>
                    <g id="line1RightRampArrow" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onTouchStart={this.readyLine1RightRampMove} onMouseDown={this.readyLine1RightRampMove}>
                        <path d={this.coordinatePath.line1RampTrianglePath} cursor="crosshair" ></path>
                    </g>
                    <g id="line3RightRampArrow" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime" onTouchStart={this.readyLine3RightRampMove} onMouseDown={this.readyLine3RightRampMove}>
                        <path d={this.coordinatePath.line3RampTrianglePath} cursor="crosshair" ></path>
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
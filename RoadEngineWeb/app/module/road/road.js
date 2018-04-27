
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
            return <Road point={this.state.point} movingType={this.movingType} tellParentRoadhaveBeenClicked={() => this.onRoadClicked()} tellParentLine1RighthaveBeenClicked={() => this.onLine1RightClicked()} tellParentTopMidHaveBeenClicked={() => this.onTopMidHaveBeenClicked()} />;
        } else {
            return "";
        }
    }

    onRoadClicked() {
        this.movingType = 'Road';
    }

    onLine1RightClicked() {
        this.movingType = 'Line1Right';
    }

    onTopMidHaveBeenClicked() {
        this.movingType = 'TopMid';

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

        this.coordinatePath = {
            roadMatrix: "",
            topleftPointPath: "",
            streetLine1: "M0,0 L280,0",
            streetLine2: "M0,50 L40,50 M60,50 L100,50 M120,50 L160,50 M180,50 L220,50 M240,50 L280,50",
            streetLine3: "M0,100 L280,100",
            streetLine1RightRampPath: "",
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
            }
        };

        this.lastRoadPoint = {
            x: this.props.point.x,
            y: this.props.point.y
        }

        this.rememberRoad = false;
        this.rememberLine1Right = false;
        this.calculatePoints();
    }

    renderRoad() {
        this.calculatePoints();
        this.calculatePaths();
    }

    readyMoveRoad = (event) => {
        this.props.tellParentRoadhaveBeenClicked();
        event.stopPropagation();
        event.preventDefault();
    }

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

    calculatePoints() {
        if (this.props.movingType == 'Road' || this.props.movingType == '') {
            this.rememberRoad = true;
            this.lastRoadPoint = {
                x: this.props.point.x,
                y: this.props.point.y
            }
            this.coordinatePath.roadMatrix = "matrix(1 0 0 1 " + (this.props.point.x - this.object.width / 2) + " " + (this.props.point.y - this.object.height / 2) + ")";
        }

        this.coordinatePath.topleftPointPath = this.getTriangle({ x: 0, y: 0 }, "up");

        if (!this.rememberLine1Right) {
            this.coordinatePath.topRightPointPath = this.getTriangle({ x: this.object.width - this.object.triangle.width, y: 0 }, "up");
        }

        this.coordinatePath.bottomleftPointPath = this.getTriangle({ x: 0, y: this.object.height }, "down");
        this.coordinatePath.bottomrightPointPath = this.getTriangle({ x: this.object.width - this.object.triangle.width, y: this.object.height }, "down");
        this.coordinatePath.midleftPoint = { x: -30, y: this.object.centrePoint.y - this.object.rhombi.halfHeight };
        this.coordinatePath.midrightPoint = { x: this.object.width + 20, y: this.object.centrePoint.y - this.object.rhombi.halfHeight };
        this.coordinatePath.midmidPointPath = this.getRhombi({ x: this.object.centrePoint.x, y: this.object.centrePoint.y - this.object.rhombi.halfHeight });
    }

    readyMoveLine1Right = (event) => {
        this.props.tellParentLine1RighthaveBeenClicked();
        event.stopPropagation();
        event.preventDefault();
    }
    //calculate all line,symbol,text path
    calculatePaths() {

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

            this.changeTopRightText();//change text 

        }
        else if (this.props.movingType == 'TopMid') {
            this.moveLine1RightRamp(movePointX);// move line1 right ramp
        }

    }

    changeTopRightText() {
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
        }
    }

    moveLine1RightRamp(movePointX) {
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

    readyLine1RightRampMove = (event) => {
        this.props.tellParentTopMidHaveBeenClicked();
        event.stopPropagation();
        event.preventDefault();
    }


    render() {
        this.renderRoad();

        return (
            <g transform={this.coordinatePath.roadMatrix} >
                <g id="mainpaved2" onMouseDown={this.readyMoveRoad}>
                    <g fill="#FFFFFF" fillOpacity="1.0" fillRule="evenodd" stroke="#000000" strokeWidth="1" strokeOpacity="1.0" strokeLinecap="round" strokeLinejoin="round" textAnchor="middle" fontWeight="normal">
                        <g strokeWidth="2" >
                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine1RightRampPath}></path>
                            </g>

                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine1}></path>
                            </g>
                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine2}></path>
                            </g>
                            <g>
                                <path fill="none" d={this.coordinatePath.streetLine3}></path>
                            </g>
                        </g>
                        <g>
                            <g fill="#FFFFFF" fillOpacity="0" strokeOpacity="0" strokeWidth="0">
                                <path d="M0,0 L280,0 L280,100 L0,100"></path>
                            </g>
                        </g>
                    </g>
                    <g stroke="lime" strokeWidth="2" strokeDasharray="12 7" strokeOpacity="1" fill="none">
                        <path d="M 0 50 L280 50" strokeWidth="98" strokeOpacity="1" strokeLinecap="butt" strokeDasharray="none" stroke="#808080"></path>
                        <path d="M 0 50 L280 50"></path>
                        <path d="M 0 50 L280 50" fill="none" strokeLinecap="butt"></path>
                    </g>
                </g>
                <g>
                    <g fill="#0000FF" strokeOpacity="0" strokeWidth="0" transform="rotate(90, 260 -20)" fontSize="13" className="userSelect">
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
                    <g id="midleft" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime">
                        <rect x={this.coordinatePath.midleftPoint.x} y={this.coordinatePath.midleftPoint.y} width="10" height="10" cursor="crosshair"></rect>
                    </g>
                    <g id="midmid" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime">
                        <path d={this.coordinatePath.midmidPointPath} cursor="crosshair"></path>
                    </g>
                    <g id="midright" stroke="#000000" strokeWidth="1" strokeOpacity="1" fill="lime">
                        <rect x={this.coordinatePath.midrightPoint.x} y={this.coordinatePath.midrightPoint.y} width="10" height="10" cursor="crosshair" ></rect>
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
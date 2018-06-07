
'use strict';

//set default value of road's width and height. 140,50 for mobile
var roadObject = {
    width: $("body").width() > 420 ? 280 : 140,
    height: $("body").width() > 420 ? 100 : 50
}

//set default value of vertical road's width and height. 140,50 for mobile
var verticalRoadObject = {
    width: $("body").width() > 420 ? 100 : 50,
    height: $("body").width() > 420 ? 280 : 140,
}

class MainPanel extends React.Component {
    constructor(props) {
        super(props);
        this.movingType = '';//mouse operation type on main panel, eg: moving road or rotate road
        this.newRoadCoordinate = { x: 0, y: 0 };
        this.oldRoadCoordinate = { x: 0, y: 0 };
        this.oldRoadMousePoint = { x: 0, y: 0 };
        this.movedDistance = { x: 0, y: 0 };// mouse moved distance on the main panel
        this.isAddedHorizontalRoad = false;// It indicated if you have been added horizontal road. When isAddedHorizontalRoad is ture then you can add vertical road to main panel
        this.state = { renderRoad: false, point: { x: 0, y: 0 } };

        //to make sure 'this' can be used in other funcitons, in ES6 this just can be used in constructor
        this.addRoad = this.addRoad.bind(this);
        this.renderRoad = this.renderRoad.bind(this);
    }

    renderRoad() {
        if (this.state.renderRoad) {
            return <Road point={this.state.point} movedDistance={this.movedDistance} coordinate={this.newRoadCoordinate} movingType={this.movingType} tellParentRoadhaveBeenClicked={(currentMousePoint, currentRoadCoordinate) => this.onRoadClicked(currentMousePoint, currentRoadCoordinate)} tellParentLine1RighthaveBeenClicked={(currentMousePoint, currentRoadCoordinate) => this.onLine1RightControllerPointClicked(currentMousePoint, currentRoadCoordinate)} tellParentLine1LefthaveBeenClicked={(currentMousePoint, currentRoadCoordinate) => this.onLine1LeftControllerPointClicked(currentMousePoint, currentRoadCoordinate)} tellParentLine3LefthaveBeenClicked={(currentMousePoint, currentRoadCoordinate) => this.onLine3LeftControllerPointClicked(currentMousePoint, currentRoadCoordinate)} tellParentLine3RighthaveBeenClicked={(currentMousePoint, currentRoadCoordinate) => this.onLine3RightControllerPointClicked(currentMousePoint, currentRoadCoordinate)} tellParentTopMidHaveBeenClicked={() => this.onTopMidContollerPointClicked()} tellParentBottomMidHaveBeenClicked={() => this.onBottomMidContollerPointClicked()} tellParentLine2RightHaveBeenClicked={() => this.onLine2RightContollerPointClicked()} tellParentLine2LeftHaveBeenClicked={() => this.onLine2LeftContollerPointClicked()} tellParentLine2MidHaveBeenClicked={(currentMousePoint, currentRoadCoordinate) => this.onLine2MidContollerPointClicked(currentMousePoint, currentRoadCoordinate)} tellParentline3Point2M3HaveBeenClicked={() => this.online3Point2M3HaveBeenClicked()} tellParentline3Point2M1HaveBeenClicked={() => this.online3Point2M1HaveBeenClicked()} tellParentline3Point2M2HaveBeenClicked={() => this.online3Point2M2HaveBeenClicked()} tellParentVerticalRoadHaveBeenClicked={() => this.onVerticalRoadHaveBeenClicked()} />;
        } else {
            return "";
        }
    }

    onRoadClicked(currentMousePoint, currentRoadCoordinate) {
        this.oldRoadMousePoint = currentMousePoint;
        this.oldRoadCoordinate = currentRoadCoordinate;
        this.movingType = 'Road';
    }
     //The right point of the first line from top to bottom of the horizontal road
    onLine1RightControllerPointClicked(currentMousePoint, currentRoadCoordinate) {
        this.oldRoadMousePoint = currentMousePoint;
        this.oldRoadCoordinate = currentRoadCoordinate;
        this.movingType = 'Line1Right';
    }
       //The left point of the first line from top to bottom of the horizontal road
    onLine1LeftControllerPointClicked(currentMousePoint, currentRoadCoordinate) {
        this.oldRoadMousePoint = currentMousePoint;
        this.oldRoadCoordinate = currentRoadCoordinate;
        this.movingType = 'Line1Left';
    }
     //The left point of the third line from top to bottom of the horizontal road
    onLine3LeftControllerPointClicked(currentMousePoint, currentRoadCoordinate) {
        this.oldRoadMousePoint = currentMousePoint;
        this.oldRoadCoordinate = currentRoadCoordinate;
        this.movingType = 'Line3Left';
    }
    //The right point of the third line from top to bottom of the horizontal road
    onLine3RightControllerPointClicked(currentMousePoint, currentRoadCoordinate) {
        this.oldRoadMousePoint = currentMousePoint;
        this.oldRoadCoordinate = currentRoadCoordinate;
        this.movingType = 'Line3Right';
    }
    //The ramp middle point of the first line from top to bottom of the horizontal road
    onTopMidContollerPointClicked() {
        this.movingType = 'TopMid';
    }
       //The ramp middle point of the third line from top to bottom of the horizontal road
    onBottomMidContollerPointClicked() {
        this.movingType = 'BottomMid';
    }
    //The right point of the second line from top to bottom of the horizontal road
    onLine2RightContollerPointClicked() {
        this.movingType = 'Line2Right';
    }
    //The left point of the second line from top to bottom of the horizontal road
    onLine2LeftContollerPointClicked() {
        this.movingType = 'Line2Left';
    }

    //The middle point of the second line from top to bottom of the horizontal road
    onLine2MidContollerPointClicked(currentMousePoint, currentRoadCoordinate) {
        this.oldRoadMousePoint = currentMousePoint;
        this.oldRoadCoordinate = currentRoadCoordinate;
        this.movingType = 'Line2Mid';
    }

    //vertical road the third line of from left to right and on the third line's intersection's  right and bottom point of horizontal road
    online3Point2M3HaveBeenClicked() {
        this.movingType = 'line3Point2M3';
    }

    //vertical road the third line of from left to right and on the third line's intersection's  bottom point of  horizontal road
    online3Point2M1HaveBeenClicked() {
        this.movingType = 'line3Point2M1';
    }

    //vertical road the third line of from left to right and on the third line's intersection's  right point of  horizontal road
    online3Point2M2HaveBeenClicked() {
        this.movingType = 'line3Point2M2';
    }

    // add vertical road to main panel
    onVerticalRoadHaveBeenClicked() {
        this.movingType = 'VerticalRoad';
    }

    getMousePoint(event) {
        var e;
        if (event.type == "touchstart" || event.type == "touchmove") {
            e = event.touches[0];
        } else {
            e = event;
        }
        //minus left menu width
        return { x: e.clientX - $(".nav-panel").width(), y: e.clientY };
    }


    addRoad(event) {
        var e = this.getMousePoint(event);
        this.setState({ renderRoad: true, point: e });
        this.newRoadCoordinate = e;
        this.isAddedHorizontalRoad = true;
    }

    addVerticalRoad = (event) => {
        if (this.isAddedHorizontalRoad) {
            event.stopPropagation();
            event.preventDefault();
            this.movingType = 'VerticalRoad';
            this.setState({ renderRoad: true, point: this.getMousePoint(event) });
        }
        else {
            this.movingType = '';
            alert("Please drag paved 1 to canvas at first.");
            this.stopMove();
            return;
        }
    }

    startMove = (event) => {

        if (this.state.renderRoad && this.movingType != '') {
            var currentMousePoint = this.getMousePoint(event);

            var mouseMovedX = currentMousePoint.x - this.oldRoadMousePoint.x;
            var mouseMovedY = currentMousePoint.y - this.oldRoadMousePoint.y;
            this.movedDistance = { x: mouseMovedX, y: mouseMovedY };//calculate mouse moved distance
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
                    <div className="nav-panel-content">

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
/**
 * mod jam
 * Junming He
 * 
 * Let's add some fun things 
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

let gameStatement = {
    currentStatement: undefined,

    //different statement 
    menu: "menu",
    gameStart: "gameStart",
    gameOver: "gameOver",
    MenuLevel: 1
}

let mapLayout = {
    level1_lotus: [],
    level2_lotus: [],

    level1_river: [],
    level2_river: [],

    lotusHeight: undefined,

    lotusOffset1: 30,
    lotusOffset2: 20

}

let lotus = {
    R: 182,
    G: 233,
    B: 6,
    size1: 230,
    size2: 180
}




const frog = {

    body: {
        x1: 320,
        y1: 650,
        size1: 150,

        x2: 280,
        y2: 640,
        size2: 100,

        locationX: 0
    },


    tongue: {
        x: undefined,
        y: undefined,
        size: 20,
        speed: 20,
        tmpY: undefined,

        state: "idle" // State can be: idle, outbound, inbound
    },

    eyes: {
        x1: undefined,
        y1: undefined,
        x2: undefined,
        y2: undefined,
        size: undefined,

    }
};

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speed: 3
};


function setup() {
    createCanvas(960, 640);

    // Give the fly its first random position
    resetFly();

    //Set current statement to menu 
    gameStatement.currentStatement = gameStatement.menu;

    //collect all the layout data
    let tmplevel1_origin = (width / 4) / 2;
    let tmplevel1_gap = width / 4;
    let tmplevel2_origin = (width / 5) / 2;
    let tmplevel2_gap = width / 5;


    //get map data 
    for (let i = 0; i < 6; i++) {
        // level1 lotus
        if (i < 4) {
            mapLayout.level1_lotus[i] = tmplevel1_origin + i * tmplevel1_gap;
        }

        if (i < 5) {

            //level1 river 
            mapLayout.level1_river[i] = i * tmplevel1_gap;

            //level2 lotus
            mapLayout.level2_lotus[i] = tmplevel2_origin + i * tmplevel2_gap;
        }

        //level2 river 
        mapLayout.level2_river[i] = i * tmplevel2_gap;

        //debug 
        // console.log("level1 lotus", mapLayout.level1_lotus[i]);
        // console.log("level1 river", mapLayout.level1_river[i]);
        // console.log("level2 lotus", mapLayout.level2_lotus[i]);
        // console.log("level1 river", mapLayout.level2_river[i]);
    }




}

function draw() {


    background("#87ceeb");


    // in menu statement 
    if (gameStatement.currentStatement === gameStatement.menu) {
        switch (gameStatement.MenuLevel) {
            case 1:

                drawLevel1();
                menuText1();
                setTongueY();

                break;

            case 2:
                setTongueY();
                drawLevel2();
                menuText2();


                break;
        }
    }


    // in game statement 
    if (gameStatement.currentStatement === gameStatement.gameStart) {
        switch (gameStatement.MenuLevel) {
            case 1:
                drawLevel1();
                drawFly();

                drawFrog();

                moveFly();
                // moveFrog();
                moveTongue();
                checkTongueFlyOverlap();
                break;

            case 2:
                drawLevel2();;
                moveFly();
                drawFly();
                moveFrog();
                moveTongue();
                drawFrog();
                checkTongueFlyOverlap();
                break;
        }
    }

}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveFly() {
    // Move the fly
    fly.x += fly.speed;
    // Handle the fly going off the canvas
    if (fly.x > width) {
        resetFly();
    }
}

/**
 * Draws the fly as a black circle
 */
function drawFly() {

    push();
    noStroke();
    fill("#000000");
    ellipse(fly.x1, fly.y1, fly.size);
    pop();
}

/**
 * Resets the fly to the left with a random y
 */
function resetFly() {
    fly.x = 0;
    fly.y = random(0, 300);
}

/**
 * Moves the frog to the mouse position on x
 */
function moveFrog() {

    switch (gameStatement.MenuLevel) {
        case 1:
            //frog.body.x1 = mouseX;
            break;

        case 2:
            //frog.body.x2 = mouseX;
            break;
    }

}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {

    // If the tongue is idle, it doesn't do anything
    if (frog.tongue.state === "idle") {
        // Do nothing
    }
    // If the tongue is outbound, it moves up
    else if (frog.tongue.state === "outbound") {
        frog.tongue.y += -frog.tongue.speed;
        // The tongue bounces back if it hits the top
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
    }
    // If the tongue is inbound, it moves down
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        // The tongue stops if it hits the bottom
        if (frog.tongue.y >= frog.tongue.tmpY) {
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {


    // Draw the frog's body
    if (gameStatement.MenuLevel == 1) {


        // Draw the tongue tip
        frog.tongue.x = frog.body.x1;

        push();
        fill("#ff0000");
        noStroke();
        ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
        pop();

        // Draw the rest of the tongue
        push();
        stroke("#ff0000");
        strokeWeight(frog.tongue.size);
        line(frog.tongue.x, frog.tongue.y, frog.body.x1, frog.body.y1);
        pop();


        //frog body 
        frog.body.x1 = mapLayout.level1_lotus[frog.body.locationX];

        push();
        fill("#00ff00");
        noStroke();
        ellipse(frog.body.x1, frog.body.y1, frog.body.size1);
        pop();

        //draw the frog's eyes 
        frog.eyes.x1 = frog.body.x1 - frog.body.size1 / 2.8;
        frog.eyes.x2 = frog.body.x1 + frog.body.size1 / 2.8;

        frog.eyes.y1 = frog.body.y1 - frog.body.size1 / 2.8;
        frog.eyes.y2 = frog.body.y1 - frog.body.size1 / 2.8;

        frog.eyes.size = frog.body.size1 / 4;

        console.log(frog.eyes.x1);
        push();
        fill(0);
        ellipse(frog.eyes.x1, frog.eyes.y1, frog.eyes.size);
        ellipse(frog.eyes.x2, frog.eyes.y2, frog.eyes.size);
        pop();
    }

    if (gameStatement.MenuLevel == 2) {
        // Draw the tongue tip
        frog.tongue.x = frog.body.x2;

        push();
        fill("#ff0000");
        noStroke();
        ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
        pop();

        // Draw the rest of the tongue
        push();
        stroke("#ff0000");
        strokeWeight(frog.tongue.size);
        line(frog.tongue.x, frog.tongue.y, frog.body.x2, frog.body.y2);
        pop();


        //frog body 
        frog.body.x2 = mapLayout.level2_lotus[frog.body.locationX];

        push();
        fill("#00ff00");
        noStroke();
        ellipse(frog.body.x2, frog.body.y2, frog.body.size2);
        pop();

        //draw the frog's eyes 
        frog.eyes.x1 = frog.body.x2 - frog.body.size2 / 2.8;
        frog.eyes.x2 = frog.body.x2 + frog.body.size2 / 2.8;

        frog.eyes.y1 = frog.body.y2 - frog.body.size2 / 2.8;
        frog.eyes.y2 = frog.body.y2 - frog.body.size2 / 2.8;

        frog.eyes.size = frog.body.size2 / 4;


        push();
        fill(0);
        ellipse(frog.eyes.x1, frog.eyes.y1, frog.eyes.size);
        ellipse(frog.eyes.x2, frog.eyes.y2, frog.eyes.size);
        pop();
    }

}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + fly.size / 2);
    if (eaten) {
        // Reset the fly
        resetFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";
    }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}


function drawLevel1() {

    //set lotus height
    mapLayout.lotusHeight = height - mapLayout.lotusOffset1;

    for (let i = 0; i < 5; i++) {

        //draw lotus
        if (i < 4) {

            push();
            noStroke();
            fill(lotus.R, lotus.G, lotus.B);
            circle(mapLayout.level1_lotus[i], mapLayout.lotusHeight, lotus.size1);
            pop();

        }


        //draw river gap
        push();
        strokeWeight(2);
        stroke(0, 0, 0);
        line(mapLayout.level1_river[i], 0, mapLayout.level1_river[i], height);
        pop();
    }
}


function drawLevel2() {

    //set lotus height
    mapLayout.lotusHeight = height - mapLayout.lotusOffset2;

    for (let i = 0; i < 6; i++) {
        //draw lotus 
        if (i < 5) {
            push();
            noStroke();
            fill(lotus.R, lotus.G, lotus.B);
            circle(mapLayout.level2_lotus[i], mapLayout.lotusHeight, lotus.size2);
            pop();
        }

        //draw river gap 
        push();
        strokeWeight(2);
        stroke(0, 0, 0);
        line(mapLayout.level2_river[i], 0, mapLayout.level2_river[i], height);
        pop();
    }

}

function menuText1() {
    push();
    textSize(40);
    textAlign(CENTER)
    text("Press ↑ or ↓ to choose level", width / 2, height / 2);
    text("ENTRY to start", width / 2, height / 2 + 45);
    pop();
}

function menuText2() {
    push();
    textSize(40);
    textAlign(CENTER)
    text("Press ↑ or ↓ to choose level", width / 2, height / 2);
    text("ENTRY to start", width / 2, height / 2 + 45);
    pop();
}

function keyReleased() {
    if (gameStatement.currentStatement === gameStatement.menu) {

        if (keyCode === UP_ARROW) {
            if (gameStatement.MenuLevel < 2) {
                gameStatement.MenuLevel += 1;
            }
            else {
                gameStatement.MenuLevel = 1;
            }
        }

        if (keyCode === DOWN_ARROW) {
            if (gameStatement.MenuLevel >= 2) {
                gameStatement.MenuLevel -= 1;
            }
            else {
                gameStatement.MenuLevel = 2;
            }
        }

        if (keyCode === ENTER) {
            gameStatement.currentStatement = gameStatement.gameStart;
        }
    }
}

function keyPressed() {
    if (gameStatement.currentStatement === gameStatement.gameStart) {
        if (keyCode == LEFT_ARROW && gameStatement.MenuLevel == 1) {
            if (frog.body.locationX <= 0) {
                frog.body.locationX = 3;
            }
            else {
                frog.body.locationX -= 1;
            }
        }
        if (keyCode == RIGHT_ARROW && gameStatement.MenuLevel == 1) {
            if (frog.body.locationX >= 3) {
                frog.body.locationX = 0;
            }
            else {
                frog.body.locationX += 1;
            }
        }

        if (keyCode == LEFT_ARROW && gameStatement.MenuLevel == 2) {
            if (frog.body.locationX <= 0) {
                frog.body.locationX = 4;
            }
            else {
                frog.body.locationX -= 1;
            }
        }
        if (keyCode == RIGHT_ARROW && gameStatement.MenuLevel == 2) {
            if (frog.body.locationX >= 4) {
                frog.body.locationX = 0;
            }
            else {
                frog.body.locationX += 1;
            }
        }
    }

}

function setTongueY() {
    if (gameStatement.MenuLevel === 1) {

        //set togue.y and tmpY locations
        frog.tongue.y = frog.body.y1 - frog.body.size1 / 2;
        frog.tongue.tmpY = frog.tongue.y;
    }
    else {
        //set togue.y and tmpY locations
        frog.tongue.y = frog.body.y2 - frog.body.size2 / 2;
        frog.tongue.tmpY = frog.tongue.y;
    }
}

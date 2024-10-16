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
    level1: "level1",
    level2: "level2",
    gameOver: "gameOver",
    MenuLevel: 1
}

let mapLayout = {
    level1_lotus: [],
    level2_lotus: [],

    level1_river: [],
    level2_river: [],

    lotusHeight: undefined,
    lotusOffset: 40

}




const frog = {

    body: {
        x: 320,
        y: 650,
        size: 150
    },


    tongue: {
        x: undefined,
        y: 480,
        size: 20,
        speed: 20,

        state: "idle" // State can be: idle, outbound, inbound
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

    //set lotus height 
    mapLayout.lotusHeight = height - mapLayout.lotusOffset;


}

function draw() {


    background("#87ceeb");


    if (gameStatement.currentStatement === gameStatement.menu) {
        switch (gameStatement.MenuLevel) {
            case 1:
                drawLevel1();
                menuText1();
                break;

            case 2:
                drawLevel2();
                break;
        }


    }
    // drawLevel2();



    // moveFly();
    // drawFly();
    // moveFrog();
    // moveTongue();
    // drawFrog();
    // checkTongueFlyOverlap();
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
    ellipse(fly.x, fly.y, fly.size);
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
    frog.body.x = mouseX;
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    // Tongue matches the frog's x
    frog.tongue.x = frog.body.x;
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
        if (frog.tongue.y >= height) {
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Draw the frog's body
    push();
    fill("#00ff00");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();
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

    for (let i = 0; i < 5; i++) {

        //draw lotus
        if (i < 4) {

            push();
            noStroke();
            fill(182, 233, 6);
            circle(mapLayout.level1_lotus[i], mapLayout.lotusHeight, 15);
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

    for (let i = 0; i < 6; i++) {
        //draw lotus 
        if (i < 5) {
            push();
            noStroke();
            fill(182, 233, 6);
            circle(mapLayout.level2_lotus[i], mapLayout.lotusHeight, 15);
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
    text("ENTRY to star", width / 2, height / 2 + 45);
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
    }
}

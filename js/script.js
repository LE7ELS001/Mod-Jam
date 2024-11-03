/**
 * Frogue
 * Junming He
 * 
 * Your frog is hungry, his color is fading
 * try to eat as much as you can, but be careful of the green poison bugs and use waterball to eliminate them
 * use ⬅ and ➡ to move the frog, key 'c' to launch your tongue, key 'x' to launch the water ball.
 * eat a black bug will give you some value on color to help you survive, as well as gain 1 score.  
 * eliminate a poison bug will get 1 score, but if you eat them, you lost some color and lost 1 score(depends on the level)
 * the game will end in 1 minute unless your frog lost all his color in advance, try to get as high score as you can 
 * have fun
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

//game statement 
let gameStatement = {
    currentStatement: undefined,

    //different statement 
    menu: "menu",
    gameStart: "gameStart",
    gameOver: "gameOver",
    MenuLevel: 1
}

//map data 
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



// frog data
const frog = {

    body: {
        x1: 320,
        y1: 650,
        size1: 150,

        x2: 280,
        y2: 640,
        size2: 100,

        R: 0,
        G: 0,
        B: 0,


        defaultR: 92,
        defaultG: 240,
        defaultB: 24,

        fadingSpeed1: 0.08,
        fadingSpeed2: 0.12,


        locationX: 0
    },


    tongue: {
        x: undefined,
        y: undefined,
        size: 20,
        speed: 20,
        tmpY: undefined,



        R: 0,
        G: 0,
        B: 0,

        defaultR: 240,
        defaultG: 6,
        defaultB: 0,



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


// normal fly
let normalFly;

// poison fly 
let poisonFly;

//water ball 
let waterBall = {
    x: 0,
    y: 0,
    size: 30,
    speed: 20,
    state: "idle" // include "idle" "Launch" 
}


//score 
let playerScore = undefined;

//color change value 
let level_add = 5;
let level1_substract = 0.5;
let level2_substract = 0.7;

//timer 
let playingTime = 60 * 1000;
let setTimerOrNot = true;

//background music
let BGM;
let bgmIsPlaying;


function preload() {
    BGM = loadSound('assets/sounds/background_music.mp3');
}


function setup() {
    createCanvas(960, 640);
    BGM.setVolume(0.4);
    bgmIsPlaying = false;

    //createflies
    normalFly = createFly(10, "black", 6, 2, 1);
    poisonFly = createFly(20, "green", 4, 2, -1);


    //SET DEFAULT COLOR
    setFrogDefaultColor();




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

            // normal flies y position 
            normalFly.level1_Y[i] = 0;

            //poison flies y positon
            poisonFly.level1_Y[i] = -10;
        }

        if (i < 5) {

            //level1 river 
            mapLayout.level1_river[i] = i * tmplevel1_gap;

            //level2 lotus
            mapLayout.level2_lotus[i] = tmplevel2_origin + i * tmplevel2_gap;

            // normal flies y position
            normalFly.level2_Y[i] = 0;

            //poison flies y position 
            poisonFly.level2_Y[i] = -10;

            //normal flies speed
            normalFly.speed[i] = 0;

            //poison flies speed
            poisonFly.speed[i] = 0;



        }

        //level2 river 
        mapLayout.level2_river[i] = i * tmplevel2_gap;





        //debug 
        // console.log("level1 lotus", mapLayout.level1_lotus[i]);
        // console.log("level1 river", mapLayout.level1_river[i]);
        // console.log("level2 lotus", mapLayout.level2_lotus[i]);
        // console.log("level1 river", mapLayout.level2_river[i]);
    }

    //set playerScore
    playerScore = 0;

    //normal flies x position 
    normalFly.level1_X = mapLayout.level1_lotus;
    normalFly.level2_X = mapLayout.level2_lotus;

    //poison flies x position 
    poisonFly.level1_X = mapLayout.level1_lotus;
    poisonFly.level2_X = mapLayout.level2_lotus;






}

function draw() {


    background("#87ceeb");


    // in menu statement 
    if (gameStatement.currentStatement === gameStatement.menu) {


        setTimerOrNot = true;

        switch (gameStatement.MenuLevel) {
            case 1:

                drawLevel1();
                menuText();


                break;

            case 2:
                drawLevel2();
                menuText();

                break;
        }
        setTongueY();
        setWaterBallLocation();
        setFrogDefaultColor();
        playerScore = 0;
    }


    // in game statement 
    if (gameStatement.currentStatement === gameStatement.gameStart) {
        if (!bgmIsPlaying) {
            BGM.loop();
            bgmIsPlaying = true;
        }

        //set timer, the game will end after 1 minute 
        if (setTimerOrNot) {

            setTimeout(GameOverAfterminutes, playingTime);
            setTimerOrNot = false;
        }


        switch (gameStatement.MenuLevel) {
            case 1:
                drawLevel1();
                break;

            case 2:
                drawLevel2();
                break;
        }

        drawFly(normalFly);
        drawFly(poisonFly);
        drawWaterBall();
        drawFrog();
        ScoreDisplay();

        moveFly(normalFly);
        moveFly(poisonFly);

        moveTongue();
        MoveWaterBall();
        checkTongueFlyOverlap(normalFly);
        checkTongueFlyOverlap(poisonFly);
        checkWaterBallFlyOverlap(normalFly);
        checkWaterBallFlyOverlap(poisonFly);
        checkIfGameOver();


        //debug
        // console.log("R: " + frog.body.R);
        // console.log("G: " + frog.body.G);
        // console.log("B: " + frog.body.B);
    }

    //game over statement 
    if (gameStatement.currentStatement === gameStatement.gameOver) {
        gameOverText();
    }

}

//normal fly moving 
function moveFly(fly) {

    if (gameStatement.MenuLevel == 1) {
        for (let i = 0; i < 4; i++) {
            if (fly.speed[i] == 0) {

                fly.speed[i] = int(random(fly.minSpeed, fly.maxSpeed));
            }

            if (fly.level1_Y[i] >= height) {
                resetFly(fly, gameStatement.MenuLevel, i);
                fly.speed[i] = 0;
            }

            fly.level1_Y[i] += fly.speed[i];
        }
    }
    else {
        for (let i = 0; i < 5; i++) {
            if (fly.speed[i] == 0) {

                fly.speed[i] = int(random(fly.minSpeed, fly.maxSpeed));
            }


            if (fly.level2_Y[i] >= height) {
                resetFly(fly, gameStatement.MenuLevel, i);
                fly.speed[i] = 0;
            }

            fly.level2_Y[i] += fly.speed[i];

        }
    }

}

//draw fly
function drawFly(fly) {

    //level 1 
    if (gameStatement.MenuLevel == 1) {

        push();
        noStroke();
        fill(fly.color);

        for (let i = 0; i < 4; i++) {

            ellipse(fly.level1_X[i], fly.level1_Y[i], fly.size);
        }
        pop();
    }

    // level 2 
    if (gameStatement.MenuLevel == 2) {
        push();
        noStroke();
        fill(fly.color);

        for (let i = 0; i < 5; i++) {

            ellipse(fly.level2_X[i], fly.level2_Y[i], fly.size);
        }
        pop();
    }
}

//reset the fly 
function resetFly(fly, levelNumber, arrayNumber) {
    if (levelNumber == 1) {
        fly.level1_Y[arrayNumber] = 0;
    }
    else {
        fly.level2_Y[arrayNumber] = 0;
    }

}



//move the frog's tongue
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
 * draw frog's body, tongue
 */
function drawFrog() {

    //constrain the color
    frog.body.R = constrain(frog.body.R, 0, frog.body.defaultR);
    frog.body.G = constrain(frog.body.G, 0, frog.body.defaultG);
    frog.body.B = constrain(frog.body.B, 0, frog.body.defaultB);

    frog.tongue.R = constrain(frog.tongue.R, 0, frog.tongue.defaultR);
    frog.tongue.G = constrain(frog.tongue.G, 0, frog.tongue.defaultG);
    frog.tongue.B = constrain(frog.tongue.B, 0, frog.tongue.defaultB);


    // Draw the frog's body
    if (gameStatement.MenuLevel == 1) {


        // Draw the tongue tip
        frog.tongue.x = frog.body.x1;

        push();
        fill(frog.tongue.R, frog.tongue.G, frog.tongue.B);
        noStroke();
        ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
        pop();



        // Draw the rest of the tongue
        push();
        stroke(frog.tongue.R, frog.tongue.G, frog.tongue.B);
        strokeWeight(frog.tongue.size);
        line(frog.tongue.x, frog.tongue.y, frog.body.x1, frog.body.y1);
        pop();


        //frog body 
        frog.body.x1 = mapLayout.level1_lotus[frog.body.locationX];

        push();
        fill(frog.body.R, frog.body.G, frog.body.B);
        noStroke();
        ellipse(frog.body.x1, frog.body.y1, frog.body.size1);
        pop();


        //draw the frog's eyes 
        frog.eyes.x1 = frog.body.x1 - frog.body.size1 / 2.8;
        frog.eyes.x2 = frog.body.x1 + frog.body.size1 / 2.8;

        frog.eyes.y1 = frog.body.y1 - frog.body.size1 / 2.8;
        frog.eyes.y2 = frog.body.y1 - frog.body.size1 / 2.8;

        frog.eyes.size = frog.body.size1 / 4;

        push();
        fill(0);
        ellipse(frog.eyes.x1, frog.eyes.y1, frog.eyes.size);
        ellipse(frog.eyes.x2, frog.eyes.y2, frog.eyes.size);
        pop();

        //color fading 
        frog.tongue.R -= frog.body.fadingSpeed1;
        frog.tongue.G -= frog.body.fadingSpeed1;
        frog.tongue.B -= frog.body.fadingSpeed1;

        frog.body.R -= frog.body.fadingSpeed1;
        frog.body.G -= frog.body.fadingSpeed1;
        frog.body.B -= frog.body.fadingSpeed1;
    }
    else if (gameStatement.MenuLevel == 2) {
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
        fill(frog.body.R, frog.body.G, frog.body.B);
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


        //color fading 
        frog.tongue.R -= frog.body.fadingSpeed2;
        frog.tongue.G -= frog.body.fadingSpeed2;
        frog.tongue.B -= frog.body.fadingSpeed2;

        frog.body.R -= frog.body.fadingSpeed2;
        frog.body.G -= frog.body.fadingSpeed2;
        frog.body.B -= frog.body.fadingSpeed2;
    }

    checkIfGameOver();




}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap(fly) {
    if (gameStatement.MenuLevel == 1) {
        for (let i = 0; i < 4; i++) {
            // Get distance from tongue to fly
            const d = dist(frog.tongue.x, frog.tongue.y, fly.level1_X[i], fly.level1_Y[i]);

            afterEating(fly, d, i);
        }
    }
    else {
        for (let i = 0; i < 5; i++) {
            // Get distance from tongue to fly
            const d = dist(frog.tongue.x, frog.tongue.y, fly.level2_X[i], fly.level2_Y[i]);

            afterEating(fly, d, i);

        }
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


// texts on the menu page
function menuText() {
    push();
    textSize(40);
    textAlign(CENTER)
    text("Press ↑ or ↓ to choose level", width / 2, height / 2);
    text("ENTRY to start", width / 2, height / 2 + 45);
    pop();
}


// key setting 
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

    if (gameStatement.currentStatement == gameStatement.gameOver) {
        if (keyCode === ENTER) {
            gameStatement.currentStatement = gameStatement.menu;
        }
    }
}

function keyPressed() {
    if (gameStatement.currentStatement === gameStatement.gameStart) {

        if (gameStatement.MenuLevel == 1) {

            //frog move left in level1
            if (keyCode == LEFT_ARROW) {
                if (frog.body.locationX <= 0) {
                    frog.body.locationX = 3;
                }
                else {
                    frog.body.locationX -= 1;
                }
            }
            //frog move right in level1
            if (keyCode == RIGHT_ARROW) {
                if (frog.body.locationX >= 3) {
                    frog.body.locationX = 0;
                }
                else {
                    frog.body.locationX += 1;
                }
            }



        }
        else if (gameStatement.MenuLevel == 2) {

            //frog move left in level2
            if (keyCode == LEFT_ARROW) {
                if (frog.body.locationX <= 0) {
                    frog.body.locationX = 4;
                }
                else {
                    frog.body.locationX -= 1;
                }
            }

            //frog move right in level2
            if (keyCode == RIGHT_ARROW) {
                if (frog.body.locationX >= 4) {
                    frog.body.locationX = 0;
                }
                else {
                    frog.body.locationX += 1;
                }
            }

        }

        //frog launch tongue in level2
        if (key.toLowerCase() === "c") {
            if (frog.tongue.state === "idle") {
                frog.tongue.state = "outbound";
            }

            //debug
            //console.log("press space")

        }

        if (key.toLowerCase() === "x") {
            if (frog.tongue.state === "idle") {
                waterBall.state = "Launch";

            }

        }

    }




}

//set the location of the tongue tip 
function setTongueY() {
    if (gameStatement.MenuLevel === 1) {

        //set togue.y and tmpY locations
        frog.tongue.y = frog.body.y1 - frog.body.size1 / 2.3;
        frog.tongue.tmpY = frog.tongue.y;
    }
    else {
        //set togue.y and tmpY locations
        frog.tongue.y = frog.body.y2 - frog.body.size2 / 2.4;
        frog.tongue.tmpY = frog.tongue.y;
    }
}

//display the score in the top right 
function ScoreDisplay() {
    push();
    fill(255);
    stroke(0);
    strokeWeight(2);
    textSize(50);
    textAlign(RIGHT);
    textAlign(TOP);
    text(playerScore, width - 30, 50);
    pop();
}

//create fly according to parameter
function createFly(size, color, maxspeed, minspeed, score) {
    let fly = {

        size: size,
        speed: [],

        level1_X: [],
        level1_Y: [],

        level2_X: [],
        level2_Y: [],

        color: color,
        maxSpeed: maxspeed,
        minSpeed: minspeed,

        score: score,

    }
    return fly;
}

//set the waterball launch location 
function setWaterBallLocation() {
    if (gameStatement.MenuLevel == 1) {
        waterBall.y = frog.body.y1 - frog.body.size1 / 2.5;

    }
    else {
        waterBall.y = frog.body.y2 - frog.body.size2 / 3;

    }
}



// waterball values
function drawWaterBall() {
    if (gameStatement.MenuLevel == 1 && waterBall.state == "idle") {

        waterBall.x = frog.body.x1;

    }
    else if (gameStatement.MenuLevel == 2 && waterBall.state == "idle") {
        waterBall.x = frog.body.x2;
    }
    push();
    noStroke();
    fill("#0482DB");
    ellipse(waterBall.x, waterBall.y, waterBall.size);
    pop();
}


// water ball launch 
function MoveWaterBall() {

    if (waterBall.state === "Launch") {

        waterBall.y -= waterBall.speed;
    }



}

// water ball and flies overlap checking
function checkWaterBallFlyOverlap(fly) {
    if (gameStatement.MenuLevel == 1) {
        for (let i = 0; i < 4; i++) {
            // Get distance from water ball to fly
            const d = dist(waterBall.x, waterBall.y, fly.level1_X[i], fly.level1_Y[i]);

            // Check if it's an overlap
            const hit = (d < waterBall.size / 2 + fly.size / 2);

            if (hit) {
                // Reset the fly
                resetFly(fly, gameStatement.MenuLevel, i);
                fly.speed[i] = 0;
                // reset water ball
                waterBall.state = "idle";
                setWaterBallLocation();




                if (fly.score > 0) {
                    //you kill a normal fly 
                }
                else {
                    //you kill a poison fly
                    playerScore += -(fly.score);
                    frog.body.R += level_add * 0.5;
                    frog.body.G += level_add * 0.5;
                    frog.body.B += level_add * 0.5;

                    frog.tongue.R += level_add * 0.5;
                    frog.tongue.G += level_add * 0.5;
                    frog.tongue.B += level_add * 0.5;
                }
            }
        }
    }
    else {
        for (let i = 0; i < 5; i++) {
            // Get distance from waterball to fly
            const d = dist(waterBall.x, waterBall.y, fly.level2_X[i], fly.level2_Y[i]);

            // Check if it's an overlap
            const hit = (d < waterBall.size / 2 + fly.size / 2);

            if (hit) {
                // Reset the fly
                resetFly(fly, gameStatement.MenuLevel, i);
                fly.speed[i] = 0;
                // Bring back the tongue
                waterBall.state = "idle";
                setWaterBallLocation();

                if (fly.score > 0) {
                    // you kill a normal fly, in hard level, reduce your score 
                    playerScore -= fly.score;

                }
                else {
                    //you kill a poison fly
                    playerScore += -(fly.score);
                    frog.body.R += level_add * 0.5;
                    frog.body.G += level_add * 0.5;
                    frog.body.B += level_add * 0.5;

                    frog.tongue.R += level_add * 0.5;
                    frog.tongue.G += level_add * 0.5;
                    frog.tongue.B += level_add * 0.5;

                }
            }
        }
    }
}


//check if you lost all color 
function checkIfGameOver() {
    if (frog.body.R <= 0 && frog.body.G <= 0 && frog.body.B <= 0) {
        gameStatement.currentStatement = gameStatement.gameOver;
    }
}


function setFrogDefaultColor() {
    frog.body.R = frog.body.defaultR;
    frog.body.G = frog.body.defaultG;
    frog.body.B = frog.body.defaultB;

    frog.tongue.R = frog.tongue.defaultR;
    frog.tongue.G = frog.tongue.defaultG;
    frog.tongue.B = frog.tongue.defaultB;
}


//game over text
function gameOverText() {
    if (frog.body.R <= 0 && frog.body.G <= 0 && frog.B <= 0) {
        centerText("Your frog has starved to death");

    }
    else {
        centerText("Your frog has survived");
    }
}

function centerText(content) {
    push();
    textSize(40);
    textAlign(CENTER)
    text(content, width / 2, height / 2 - 45);

    text("Your score is " + playerScore, width / 2, height / 2);

    if (playerScore >= 0) {
        text("Congratulations!!!", width / 2, height / 2 + 45);
    }
    else {
        text("That's .... unexpected", width / 2, height / 2 + 45);
    }

    text("Press ENTER to continue", width / 2, height / 2 + 90);
    pop();

}

/**
 * eating checking
 * 1.reset the fly
 * 2.add or subtract score
 * 3.add or subtract color 
 */

function afterEating(fly, distant, i) {
    // Check if it's an overlap
    const eaten = (distant < frog.tongue.size / 2 + fly.size / 2);

    if (eaten) {
        // Reset the fly
        resetFly(fly, gameStatement.MenuLevel, i);
        fly.speed[i] = 0;

        //add score and color 
        playerScore += fly.score;

        // Bring back the tongue
        frog.tongue.state = "inbound";

        if (fly.score >= 0) {

            frog.body.R += level_add;
            frog.body.G += level_add;
            frog.body.B += level_add;

            frog.tongue.R += level_add;
            frog.tongue.G += level_add;
            frog.tongue.B += level_add;
        }
        else {
            if (gameStatement.MenuLevel == 1) {
                frog.body.R += level1_substract;
                frog.body.G += level1_substract;
                frog.body.B += level1_substract;

                frog.tongue.R += level1_substract;
                frog.tongue.G += level1_substract;
                frog.tongue.B += level1_substract;
            }
            else {
                frog.body.R += level2_substract;
                frog.body.G += level2_substract;
                frog.body.B += level2_substract;

                frog.tongue.R += level2_substract;
                frog.tongue.G += level2_substract;
                frog.tongue.B += level2_substract;
            }

        }
    }


}

//game over after playing for certain time
function GameOverAfterminutes() {
    gameStatement.currentStatement = gameStatement.gameOver;
}



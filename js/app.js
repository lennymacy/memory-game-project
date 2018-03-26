// Create a list that holds all of your cards and set fonts
let cardLists = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-car", "fa-gear", "fa-bicycle", "fa-key"];

//create variables: move counter, match counter, and game start
let moves = 0;
let match_found = 0;
let game_started = false;

// timer using easytimer.js on Github
let timer = new Timer();
timer.addEventListener('secondsUpdated', function (e) {$('#timer').html(timer.getTimeValues().toString());
});

// reset game click
$('#reset-button').click(resetGame);

// function to create cards by appending UL to add each LI for the card deck
function createCard(card) {
    $('#deck').append(`<li class="card animated"><i class="fa ${card}"></i></li>`);
}

// function to generte cards and call the shuffle function for initial setup of deck
function generateCards() {
    for (var i = 0; i < 2; i++) {
        cardLists = shuffle(cardLists);
        cardLists.forEach(createCard);
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
// create array to keep track of all open cards to be called by matchopencard function
openCards = [];

// fuction to flip card, start timer, increment move counter
function toggleCard() {

    if (game_started === false) {
        game_started = true;
        timer.start();
    }

    if (openCards.length === 0) {
        $(this).toggleClass("show open");
        openCards.push($(this));
        disableCLick();
    }
    else if (openCards.length === 1) {
        updateMoves();
        $(this).toggleClass("show open");
        openCards.push($(this));
        setTimeout(matchOpenCards, 1100);
    }
}

// function to disable click of open card
function disableCLick() {
    openCards.forEach(function (card) {
        card.off('click');
    });
}

// function to enable click
function enableClick() {
    openCards[0].click(toggleCard);
}

//function to check if open cards match
function matchOpenCards() {
    if (openCards[0][0].firstChild.className == openCards[1][0].firstChild.className) {
        console.log("matchCard");
        openCards[0].addClass("match");
        openCards[1].addClass("match");
        disableCLick();
        removeOpenCards();
        setTimeout(checkWin, 1000);
    }
    else {
        openCards[0].toggleClass("show open");
        openCards[1].toggleClass("show open");
        enableClick();
        removeOpenCards();
    }
}

// function to remove openCards
function removeOpenCards() {
    openCards = [];
}

/* function to update move counter and control number of stars
  based on number of moves  */
function updateMoves() {
    moves += 1;
    $('#moves').html(`${moves} Moves`);
    if (moves === 24) {
        addBlankStar();
    }
    else if (moves === 16) {
        addBlankStar();
    }
}

// function to determine all cards match and end game
function checkWin() {
    match_found += 1;
    if (match_found === 8) {
        showResults();
    }
}

// function to change stars
function addBlankStar() {
    $('#stars').children()[0].remove();
    $('#stars').append('<li><i class="fa fa-star-o"></i></li>');
}

// function to create stars
function addStars() {
    for (var i = 0; i < 3; i++) {
        $('#stars').append('<li><i class="fa fa-star"></i></li>');
    }
}

/* function to reset game on user command called by reset game click and reset
   initial variables */
function resetGame() {
    moves = 0;
    match_found = 0;
    $('#deck').empty();
    $('#stars').empty();
    $('#game-deck')[0].style.display = "";
    $('#sucess-result')[0].style.display = "none";
    game_started = false;
    timer.stop();
    $('#timer').html("00:00:00");
    playGame();
}

// fuction called by playgame to initiate game play
function playGame() {
    generateCards();
    $('.card').click(toggleCard);
    $('#moves').html("0 Moves");
    addStars(3);
}

/* function to generate score panel, clear out game deck, stop timer,
   and add elements to display results to score panel */
function showResults() {
    $('#sucess-result').empty();
    timer.pause();
   var scoreBoard = `
        <p class="success">YOU MATCHED ALL THE CARDS!</p>
        <p>
            <span class="score-titles">Total Moves:</span>
            <span class="score-values">${moves}</span>
            <span class="score-titles">Time Taken:</span>
            <span class="score-values">${timer.getTimeValues().toString()}</span>
        </p>
        <div class="text-center margin-top-2">
             <div class="star">
                <i class="fa fa-star fa-3x"></i>
             </div>
             <div class="star">
                <i class="fa ${ (moves > 24) ? "fa-star-o" : "fa-star"}  fa-3x"></i>
             </div>
            <div class="star">
                <i class="fa ${ (moves > 16) ? "fa-star-o" : "fa-star"} fa-3x"></i>
             </div>
        </div>
        <div class="text-center margin-top-2" id="restart">
            <i class="fa fa-repeat fa-2x"></i>
          </div>`
    ;

    $('#game-deck')[0].style.display = "none";
    $('#sucess-result')[0].style.display = "block";
    $('#sucess-result').append($(scoreBoard));
    $('#restart').click(resetGame);
}

// start the game
playGame();

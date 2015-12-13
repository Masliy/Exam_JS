var fire = document.getElementById("fire"),
    enemy = document.getElementById("enemy"),
    counterGunmen = document.getElementById("gunmen"),
    counterYour = document.getElementById("your"),
    points = document.getElementById("points"),
    pointsInner = document.getElementById("pointsInner"),
    reward = document.getElementById("reward"),
    your_time = document.getElementById("your_time"),
    main_window = document.getElementById("main_window"),
    musicStart = document.createElement("audio"),
    result = document.getElementById("result"),
    playAgain = document.getElementById("playAgain"),
    playAgain__yes = document.getElementById("yes"),
    round = document.getElementById("round"),
    lives = document.getElementById("life"),
    bestScoreDiv = document.getElementById("best"),
    biggestScore = document.getElementById("biggest_score");

var arrayImagesEnemy = {/*сюда будут передаваться url рендомного персонажа*/
    leftSideEnemy: [],
    frontEnemy: [],
    frontEnemyDead: [],
    frontEnemyWin: []
};

var step = 25,
    /*начальная позиция цели, margin-left: 25%;*/
    counterImage = 0,
    /*здесь лежит число, соответствующее изображению в массиве leftSideEnemy */
    counterRound = 1,
    /*какой раунд по счету*/
    availablLives = 3,
    /*сколько жизней(попыток) осталось*/
    necessaryTime = 1.00,
    /*время, за которое нужно успеть выстрелить*/
    condition = 1,
    /*здесь лежит число, соответствующее изображению в массиве frontEnemyWin */
    stopCondition = 0,
    /*переменная для отслеживания количества циклов смены изображения при победе стрелка*/
    total = 0,
    /*сколько всего набрал очков*/
    ifFoul = false,
    /*если выстрелил раньше времени, тут будет true*/
    valueLiveCounter = 0,
    /*здесь лежит значение счетчика для отображения прошедшего времени нон-стоп*/
    startGame, /*здесь будет лежать document.getElementById("startGame"). Но если определить сразу то jquetty начитает потом ругаться*/
    stepsFromStart = 0,
    /*сколько шагов было сделано*/
    ifClick = false, /*было ли выстрел. Если этого не делать то во втором раунде не выстрелишь. Если просто сделать onclick без проверки, то при нескольких нажатиях стрелок убегает со страшной скоростью за экран */
    bestScore = 0;/*максимальное количество очков, из разных игр*/

var randomWait, /*здесь лежит случайное время задержки перед выстрелом*/
    clearInterval__enemyMove, /*нужна для остановки интервала вызова функции enemyMove*/
    clearInterval__enemyGoHome, /*нужна для остановки интервала вызова функции enemyGoHome*/
    clearInterval__toggleWinEnemy, /*нужна для остановки интервала вызова функции toggleWinEnemy*/
    clearInterval__liveCounter, /*нужна для остановки интервала вызова функции liveCounter*/
    randomEnemy; /*здесь лежит результат выполнения функции randomNumber, число. Исходя из него выбирается персонаж*/


/*конструкторы*/
function stopInterval(obj) { //для остановки setInterval
    clearInterval(obj); //если не делать то постоянно запускает функцию, хоть и не 
} //видно

function soundClick(adressMusic) { /*для одиночных звуков - выстрелов и т.д.*/
    main_window.appendChild(musicStart);
    musicStart.src = adressMusic; // Указываем путь к звуку "клика"
    musicStart.autoplay = true; // Автоматически запускаем
    musicStart.type = "audio/mp3";
    musicStart.loop = false; //Для отмены постоянново воспроизведения 
}

function soundForever(adressMusic) { /**/
    main_window.appendChild(musicStart);
    musicStart.src = adressMusic; // Указываем путь к звуку "клика"
    musicStart.autoplay = true; // Автоматически запускаем
    musicStart.type = "audio/mp3";
    musicStart.loop = true;
}

function wait(arr) { /*генерирует случайное время задержки перед выстрелом из заданных величин, мс*/
    var arr = arr;
    var rand = Math.floor(Math.random() * arr.length);
    return randomWait = arr[rand];
};

function toggleWinEnemy(varId, var_array_images) { /*меняет изображение радующегося победившего стрелка. Не работает без глобальной переменной condition */
    if (condition > -1) {
        varId.style.backgroundImage = var_array_images[condition];
        condition++;
        stopCondition++;
        if (condition > 1) {
            varId.style.backgroundImage = var_array_images[condition];
            condition = 0;
        }
    }
};

function randomNumber(min, max) { /*для выбора случайного числа и использования его в дальнейщем для определения стрелка*/
    var max = max;
    var min = min;
    var result = Math.round(min + Math.random() * (max - min));
    return result;
};

function randomShooter() { /*определение случайного персонажа*/
    var cowboy = {
        leftSideEnemy: ['url(img/couboy/one.png)', 'url(img/couboy/two.png)', 'url(img/couboy/three.png)'],
        frontEnemy: ['url(img/couboy/front.png)', 'url(img/couboy/gunmanfire.png)'],
        frontEnemyDead: ['url(img/couboy/deadBody1.png)', 'url(img/couboy/deadBody2.png)'],
        frontEnemyWin: ['url(img/couboy/frontWin.png)', 'url(img/couboy/frontWin1.png)']
    };
    var mexican = {
        leftSideEnemy: ['url(img/mexican/front.png)', 'url(img/mexican/two.png)', 'url(img/mexican/three.png)'],
        frontEnemy: ['url(img/mexican/front.png)', 'url(img/mexican/gunmanfire.png)'],
        frontEnemyDead: ['url(img/mexican/deadBody1.png)', 'url(img/mexican/deadBody1.png)'],
        frontEnemyWin: ['url(img/mexican/frontWin.png)', 'url(img/mexican/frontWin1.png)']
    };
    var bald = {
        leftSideEnemy: ['url(img/bald/front.png)', 'url(img/bald/two.png)', 'url(img/bald/three.png)'],
        frontEnemy: ['url(img/bald/front.png)', 'url(img/bald/gunmanfire.png)'],
        frontEnemyDead: ['url(img/bald/deadBody1.png)', 'url(img/bald/deadBody1.png)'],
        frontEnemyWin: ['url(img/bald/frontWin.png)', 'url(img/bald/frontWin1.png)']
    };
    var villageGuy = {
        leftSideEnemy: ['url(img/villageGuy/front.png)', 'url(img/villageGuy/two.png)', 'url(img/villageGuy/three.png)'],
        frontEnemy: ['url(img/villageGuy/front.png)', 'url(img/villageGuy/gunmanfire.png)'],
        frontEnemyDead: ['url(img/villageGuy/deadBody1.png)', 'url(img/villageGuy/deadBody1.png)'],
        frontEnemyWin: ['url(img/villageGuy/frontWin.png)', 'url(img/villageGuy/frontWin1.png)']
    };
    var postman = {
        leftSideEnemy: ['url(img/postman/front.png)', 'url(img/postman/two.png)', 'url(img/postman/three.png)'],
        frontEnemy: ['url(img/postman/front.png)', 'url(img/postman/gunmanfire.png)'],
        frontEnemyDead: ['url(img/postman/deadBody1.png)', 'url(img/postman/deadBody2.png)'],
        frontEnemyWin: ['url(img/postman/frontWin.png)', 'url(img/postman/frontWin1.png)']
    };

    randomEnemy = randomNumber(1, 5); /*значение выполнения функции присваивается переменной randomEnemy*/
    if (randomEnemy == 1) {
        for (var key in cowboy) {
            arrayImagesEnemy[key] = cowboy[key];
        }
    }
    if (randomEnemy == 2) {
        for (var key in mexican) {
            arrayImagesEnemy[key] = mexican[key];
        }
    }
    if (randomEnemy == 3) {
        for (var key in bald) {
            arrayImagesEnemy[key] = bald[key];
        }
    }
    if (randomEnemy == 4) {
        for (var key in villageGuy) {
            arrayImagesEnemy[key] = villageGuy[key];
        }
    }
    if (randomEnemy == 5) {
        for (var key in postman) {
            arrayImagesEnemy[key] = postman[key];
        }
    }
};

/*вызовы функций*/
$(document).ready(function() {
    soundForever("sounds/start.mp3");
    startGame = document.getElementById("start"); /*если определить как все переменные подобного значения то не работает...загадкО*/
    startGame.classList.remove("invisible");
});

function commonActions() { //то, что выполняется с каждым циклом
    displayAll();
    lives.innerHTML = "Lives: " + availablLives;
    round.innerHTML = "Round: " + counterRound; /*какой бой по счету*/
    clearInterval__enemyMove = setInterval(enemyMove, 150);
    soundClick("sounds/intro.mp3");
    setTimeout('stopInterval(clearInterval__enemyMove)', 7000); /*7 секунд стрелок движется к центру при step = 25, т.е. margin-left=25%*/
    randomShooter();
};

$("#start").on("click", startGame);

function startGame() {
    startGame.classList.remove("visible");
    startGame.classList.add("hide");
    commonActions();
};

function displayAll() { /* показать все скрытые элементы*/
    bestScoreDiv.classList.remove("hide");
    points.classList.remove("hide");
    pointsInner.classList.remove("hide");
    reward.classList.remove("hide");
    counterGunmen.classList.remove("hide");
    counterYour.classList.remove("hide");
    document.getElementById("gunmen_time").innerHTML = necessaryTime.toFixed(2);
};

function liveCounter() { /*для бегущего счетчика*/
    if (ifFoul != true && your_time.innerHTML < necessaryTime) { /*если делал сравнение не с .innerHTML а с valueLiveCounter то не работало как надо*/
        valueLiveCounter += 4;
        your_time.innerHTML = (valueLiveCounter / 1000).toFixed(2);
    } else if(ifFoul != true && your_time.innerHTML >= necessaryTime) {
        stopInterval(clearInterval__liveCounter);
        lost();
    }
};

function timeToKill() { /*инициирует выстрел стрелка*/
    if (ifFoul != true) {
        /*проверяем есть ли класс hide. Если нет значить выстрелили
                        раньше, чем было нужно, и запускать функцию не нужно.*/
        fire.classList.remove("hide");
        enemy.style.backgroundImage = arrayImagesEnemy.frontEnemy[1];
        soundClick("sounds/fire.mp3");
    } 
};

function displayResult() {
    pointsInner.innerHTML = total;
    result.innerHTML = total + "$";
    if (total > bestScore) {
        bestScore = total;
        biggestScore.innerHTML = "$" + " " + bestScore;
    }
    setTimeout('playAgain.style.opacity = "1", playAgain.style.zIndex = "1", fire.classList.add("hide")', (stepsFromStart * 150) + 2000); /* для отображения окна с возможностью выбора сыграть еще сразу после ухода стрелка назад. При фиксированном значении, если выстрелить в него сразу как появится, нужно долго ждать*/
};

function enemyGoHome() { /*стрелок уходит, пристрелив игрока*/
    stopInterval(clearInterval__liveCounter);
    fire.classList.remove("notice");
    fire.innerHTML = "";
    counterImage = counterImage || 0;
    if (enemy.style.transform != "scaleX(-1)") {
        enemy.style.transform = "scaleX(-1)";
    }
    if (step >= -10 && step != 25) {
        enemy.style.backgroundImage = arrayImagesEnemy.leftSideEnemy[counterImage];
        enemy.style.marginLeft = step + "%";
        step++;
        counterImage++;
    }
    if (counterImage == 4) {
        counterImage = -1;
        enemy.style.backgroundImage = arrayImagesEnemy.leftSideEnemy[counterImage];
        counterImage++;
    }
    if (step == 25) {
        enemy.classList.add("hide");
    }
}

function enemyMove() { /*стрелок двигается к центру*/
    enemy.style.left = "50%";
    enemy.classList.remove("hide");
    if (fire.classList.contains("hide")) { //для того, чтобы при клике на стрелке он переставал идти

        if (step > -10) {
            step--;
            stepsFromStart++;
            enemy.style.marginLeft = step + "%";
        }
        if (counterImage > -1) {
            enemy.style.backgroundImage = arrayImagesEnemy.leftSideEnemy[counterImage];
            counterImage++;
            if (counterImage > 3) {
                enemy.style.backgroundImage = arrayImagesEnemy.leftSideEnemy[counterImage];
                counterImage = 0;
            }
            if (step == -10) {
                counterImage = undefined; /*для остановки счетчика*/
                enemy.style.backgroundImage = arrayImagesEnemy.frontEnemy[0];
                soundForever("sounds/before_shot.mp3");
                wait([200, 1000, 1500, 2000, 3000, 4000]);
                setTimeout(timeToKill, randomWait); /*устанавливает время задержки перед началом стрельбы*/
                if (ifFoul == false) {
                    setTimeout('clearInterval__liveCounter = setInterval(liveCounter, 4)', randomWait); /* запускаем таймер с постоянным отображением*/
                }
            }
        }
    } else if (ifFoul) { /*если выстрелил раньше*/
        foul();
    }
}

function foul() {
    ifFoul = true;
    stopInterval(clearInterval__enemyMove);
    fire.classList.remove("hide");
    fire.innerHTML = "FOUL!";
    soundClick("sounds/foul.mp3");
    setTimeout('clearInterval__enemyGoHome=setInterval(enemyGoHome, 150)', 2000);
    setTimeout('stopInterval(clearInterval__enemyGoHome)', (stepsFromStart * 150) + 2500); /* останавливает таймер когда стрелок уходит и исчезает*/
    playAgain.classList.remove("hide");
    setTimeout(anotherRound, (stepsFromStart * 150) + 3500);
};

function lost() {
    fire.innerHTML = "YOU LOST!";
    availablLives--;
    enemy.style.backgroundImage = arrayImagesEnemy.frontEnemyWin[0];
    main_window.style.backgroundImage = "url(img/bgRed.png)";
    clearInterval__toggleWinEnemy = setInterval('toggleWinEnemy(enemy, arrayImagesEnemy.frontEnemyWin)', 800);
    setTimeout('stopInterval(clearInterval__toggleWinEnemy)', 5000); /* за 5 секунд успевают 3 раза поменяться радующиеся стрелки*/
    soundClick("sounds/shot-miss.mp3");
    setTimeout('soundClick("sounds/death.mp3")', 1200);
    setTimeout('clearInterval__enemyGoHome=setInterval(enemyGoHome, 150)', 6000);
    setTimeout('stopInterval(clearInterval__enemyGoHome)', 12000); /*перестает вызывать функцию через 12 секунд, как раз доходит до margin-left=25%. Если не использовать переменную clearInterval__enemyGoHome а сразу вставлять вместо нее setInterval(enemyGoHome, 150) то не работает почему-то*/
    playAgain.classList.remove("hide");

    if (availablLives == 0) {
        stepsFromStart = 60;
        displayResult();
    } else {
        setTimeout(anotherRound, 12000);
    }
};

function win() {
    fire.innerHTML = "YOU WON!";
    soundClick("sounds/shot-win.mp3");
    setTimeout('soundClick("sounds/win.m4a")', 1200);
    enemy.style.backgroundImage = arrayImagesEnemy.frontEnemyDead[0];
    setTimeout('enemy.style.backgroundImage = arrayImagesEnemy.frontEnemyDead[1]', 500);
    total += +((necessaryTime - your_time.innerHTML) * 10000).toFixed(0);
    pointsInner.innerHTML = total;
    necessaryTime -= 0.10;
    setTimeout(anotherRound, 5000);
};

function anotherRound() {
    step = 25;
    counterRound++;
    stepsFromStart = 0;
    fire.classList.add("notice");
    fire.classList.add("hide");
    enemy.classList.add("hide");/*чтобы убрать артефакт с отображением стрелка с левой стороны на долю секунды*/
    counterImage = 0;
    playAgain.classList.add("hide");
    ifFoul = false;
    main_window.style.backgroundImage = "";
    your_time.innerHTML = "";
    valueLiveCounter = 0;
    fire.innerHTML = "FIRE!!";
    enemy.style.left = "";
    enemy.style.marginLeft = "";
    enemy.style.transform = "";
    playAgain.removeAttribute("style");
    ifClick = false;
    commonActions();
};

$("#enemy").on("click", function() { /*вызывает событие один раз*/
    stopInterval(clearInterval__liveCounter);
    ifClick = true;
    if (your_time.innerHTML == 0 && your_time.innerHTML < necessaryTime) {
        foul();
    }
    if (necessaryTime > your_time.innerHTML && your_time.innerHTML != 0) {
        win();
    }
});

$('#yes').on("click", function() {
    counterRound = 0;
    total = 0;
    pointsInner.innerHTML = total;
    availablLives = 3;
    necessaryTime = 1.00;
    enemy.style.backgroundImage = "../img/bg.png";
    anotherRound();
});

$('#no').on("click", function() {
    location.reload();
});

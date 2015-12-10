var fire = document.getElementById("fire");
var enemy = document.getElementById("enemy");
var counterGunmen = document.getElementById("gunmen");
var counterYour = document.getElementById("your");
var points = document.getElementById("points");
var pointsInner = document.getElementById("pointsInner");
var reward = document.getElementById("reward");
var your_time = document.getElementById("your_time");
var main_window = document.getElementById("main_window");
var musicStart = document.createElement('audio');

var bgIfDied = ['url(img/bgRed.png)'];
var leftSideEnemy = ['url(img/one.png)', 'url(img/two.png)', 'url(img/three.png)'];
var frontEnemy = ['url(img/front.png)', 'url(img/gunmanfire.png)'];
var frontEnemyDead = ['url(img/deadBody1.png)', 'url(img/deadBody2.png)', 'url(img/heat.png)'];
var frontEnemyWin = ['url(img/frontWin.png)', 'url(img/frontWin1.png)'];

var step = 25,
    /*начальная позиция цели, margin-left: 25%;*/
    counterImage = 0,
    /*здесь лежит число, соответствующее изображению в массиве leftSideEnemy */
    necessaryTime = 0.60,
    /*время, за которое нужно успеть выстрелить*/
    condition = 1,
    /*здесь лежит число, соответствующее изображению в массиве frontEnemyWin */
    stopCondition = 0,
    /*переменная для отслеживания количества циклов смены изображения при победе стрелка*/
    speed = 0,
    /*здесь лежит время, за которое ты успел выстрелить*/
    total = 0,
    /*сколько всего набрал очков*/
    ifFoul = false; /*если выстрелил раньше времени, тут будет true*/


var randomWait, /*здесь лежит случайное время задержки перед выстрелом*/
    valueLiveCounter = 0,
    /*здесь лежит значение счетчика для отображения прошедшего времени нон-стоп*/
    clearInterval__enemyMove, /*нужна для остановки интервала вызова функции enemyMove*/
    clearInterval__enemyGoHome, /*нужна для остановки интервала вызова функции enemyGoHome*/
    clearInterval__toggleWinEnemy, /*нужна для остановки интервала вызова функции toggleWinEnemy*/
    clearInterval__liveCounter; /*нужна для остановки интервала вызова функции liveCounter*/


$(document).ready(function() {
    soundForever("sounds/start.mp3");

    $("#start").on("click", startGame);

    function startGame() {
        var startGame = document.getElementById("start");
        startGame.classList.remove("visible");
        startGame.classList.add("hide");
        setTimeout(displayAll, 0);
        clearInterval__enemyMove = setInterval(enemyMove, 150);
        soundClick("sounds/intro.mp3");
        setTimeout('stopInterval(clearInterval__enemyMove)', 7000); //7 секунд стрелок движется к центру
        // при step = 25, т.е. margin-left=25%
    };
});

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

function displayAll() { /* показать все скрытые элементы*/
    points.classList.remove("hide");
    pointsInner.classList.remove("hide");
    reward.classList.remove("hide");
    counterGunmen.classList.remove("hide");
    counterYour.classList.remove("hide");
    document.getElementById("gunmen_time").innerHTML = necessaryTime.toFixed(2);
};

function wait(arr) { /*генерирует случайное время задержки перед выстрелом из заданных величин, мс*/
    var arr = arr;
    var rand = Math.floor(Math.random() * arr.length);
    return randomWait = arr[rand];
};

function liveCounter() {
    if (your_time.innerHTML != necessaryTime && ifFoul != true) { /*если делал сравнение не с .innerHTML а с valueLiveCounter то не работало как надо*/
        valueLiveCounter += 4;
        your_time.innerHTML = (valueLiveCounter / 1000).toFixed(2);
    } else if (your_time.innerHTML == necessaryTime) {
        stopInterval(clearInterval__liveCounter);
        lost();
    }
};


function timeToKill() {
    if (fire.classList.contains("hide")) {
        /*проверяем есть ли класс hide. Если нет значить выстрелили
                        раньше, чем было нужно.*/
        fire.classList.remove("hide");
        enemy.style.backgroundImage = frontEnemy[1];
        soundClick("sounds/fire.mp3");
    }
};


function toggleWinEnemy() { /*меняет изображение радующегося победившего стрелка*/
    if (condition > -1) {
        enemy.style.backgroundImage = frontEnemyWin[condition];
        condition++;
        stopCondition++;
        if (condition > 1) {
            enemy.style.backgroundImage = frontEnemyWin[condition];
            condition = 0;
        }
    }
};

function enemyGoHome() { /*стрелок уходит, пристрелив игрока*/
    fire.classList.remove("notice");
    fire.innerHTML = "";
    counterImage = counterImage || 0;
    if (enemy.style.transform != "scaleX(-1)") {
        enemy.style.transform = "scaleX(-1)";
    }
    if (step >= -10 && step != 25) {
        enemy.style.backgroundImage = leftSideEnemy[counterImage];
        enemy.style.marginLeft = step + "%";
        step++;
        counterImage++;
    }
    if (counterImage == 4) {
        counterImage = -1;
        enemy.style.backgroundImage = leftSideEnemy[counterImage];
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
            enemy.style.marginLeft = step + "%";
        }
        if (counterImage > -1) {
            enemy.style.backgroundImage = leftSideEnemy[counterImage];
            counterImage++;
            if (counterImage > 3) {
                enemy.style.backgroundImage = leftSideEnemy[counterImage];
                counterImage = 0;
            }
            if (step == -10) {
                counterImage = undefined; /*для остановки счетчика*/
                enemy.style.backgroundImage = frontEnemy[0];
                soundForever("sounds/before_shot.mp3");
                wait([200, 1000, 1500, 2000, 3000, 4000]);
                setTimeout(timeToKill, randomWait);
                setTimeout('clearInterval__liveCounter = setInterval(liveCounter, 4)', randomWait);
            }
        }
    } else if (fire.classList.contains("hide") && speed == 0) { /*если выстрелил раньше*/
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
    setTimeout('stopInterval(clearInterval__enemyGoHome)', 8000); /*за 8 секунд уходит с любого места экрана*/
};

function lost() {
    fire.innerHTML = "YOU LOST!";
    enemy.style.backgroundImage = frontEnemyWin[0];
    main_window.style.backgroundImage = bgIfDied[0];
    clearInterval__toggleWinEnemy = setInterval(toggleWinEnemy, 800);
    setTimeout('stopInterval(clearInterval__toggleWinEnemy)', 5000);
    soundClick("sounds/shot-miss.mp3");
    setTimeout('soundClick("sounds/death.mp3")', 1200);
    setTimeout('clearInterval__enemyGoHome=setInterval(enemyGoHome, 150)', 6000);
    setTimeout('stopInterval(clearInterval__enemyGoHome)', 12000); /*перестает вызывать функцию через 12 секунд, как раз доходит до margin-left=25%. Если не использовать переменную clearInterval__enemyGoHome а сразу вставлять вместо нее setInterval(enemyGoHome, 150) то не работает почему-то*/
};

function win() {
    fire.innerHTML = "YOU WON!";
    soundClick("sounds/shot-win.mp3");
    setTimeout('soundClick("sounds/win.m4a")', 1200);
    enemy.style.backgroundImage = frontEnemyDead[0];
    setTimeout('enemy.style.backgroundImage = frontEnemyDead[1]', 500);
    total += +((necessaryTime - speed) * 10000).toFixed(0); //пока не надо, а потом пригодится для нескольких раундов
    pointsInner.innerHTML = total;
};
$("#enemy").one("click", function() { /*вызывает событие один раз*/
    speed = your_time.innerHTML;
    stopInterval(clearInterval__liveCounter);
    if (speed == 0 || speed > necessaryTime) {
        foul();
    }
    if (necessaryTime > speed && speed != 0) {
        win();
    }
});

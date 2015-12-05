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

var step = 5; /*начальная позиция цели, margin-left: 25%;*/
var counterImage = 0; /*здесь лежит число, соответствующее изображению в массиве leftSideEnemy */
var necessaryTime = 0.80; /*время, за которое нужно успеть выстрелить*/
var condition = 1; /*здесь лежит число, соответствующее изображению в массиве frontEnemyWin */
var stopCondition = 0; /*переменная для отслеживания количества циклов смены изображения при победе врага*/
var startTimer, /*здесь лежит дата начала отсчета с момента появления "FIRE"*/
    stopTimer, /*здесь лежит дата выстрела в чувака*/
    speed, /*здесь лежит время, за которое ты успел выстрелить*/
    randomWait; /*здесь лежит случайное время задержки перед выстрелом*/


var IntID;


/*function totalScore() {
    var total = 0;
    return total;
alert("Вы заработали: " + totalScore() + " очков");
}*/
$( window ).load(function() {
  /*soundForever("sounds/start.mp3");*/
df


$("#start").on("click", startGame);


	function startGame() {
    var startGame = document.getElementById("start");
    startGame.classList.remove("visible");
    startGame.classList.add("hide");
    setTimeout(displayAll, 0);
    IntID = setInterval(enemyMove, 150);
	soundClick("sounds/intro.mp3");
	setTimeout(stopInterval, 7000);
};
});

function stopInterval() { //для остановки setInterval(enemyMove, 150)
    clearInterval(IntID); //если не делать то постоянно запускает функцию, хоть и не 
} 						  //видно

function soundClick(adressMusic) {/*для одиночных звуков - выстрелов и т.д.*/
    main_window.appendChild(musicStart);
    musicStart.src = adressMusic; // Указываем путь к звуку "клика"
    musicStart.autoplay = true; // Автоматически запускаем
    musicStart.loop = false;//Для отмены постоянново воспроизведения 
}

function soundForever(adressMusic) {/**/
    main_window.appendChild(musicStart);
    musicStart.src = adressMusic; // Указываем путь к звуку "клика"
    musicStart.autoplay = true; // Автоматически запускаем
    musicStart.loop = true;
}


function displayAll() {/* показать все скрытые элементы*/
    points.classList.remove("hide");
    pointsInner.classList.remove("hide");
    reward.classList.remove("hide");
    counterGunmen.classList.remove("hide");
    counterYour.classList.remove("hide");
    shootHimBefore("gunmen_time", necessaryTime);
};

function wait() { /*генерирует случайное время задержки перед выстрелом*/
    var arr = [1500, 200, 800, 1000, 1200, 3000];
    var rand = Math.floor(Math.random() * arr.length);
    return randomWait = arr[rand];
};

function timeToKill() {
    wait(); /*генерирует случайное время задержки перед выстрелом*/
    setTimeout('fire.classList.remove("hide")', randomWait);
    setTimeout('enemy.style.backgroundImage = frontEnemy[1]', randomWait);
    setTimeout("startTimer = Date.now()", randomWait);
    setTimeout('soundClick("sounds/fire.mp3")', randomWait);
};





function shootHimBefore(id, necessaryTime) {/*устанавливает необходимое время, за которое нужно успеть*/
 document.getElementById(id).innerHTML = necessaryTime.toFixed(2);
};

function toggleWinEnemy() {/*меняет изображение радующегося победившего чувака*/
    if (condition > -1) {
        enemy.style.backgroundImage = frontEnemyWin[condition];
        condition++;
        stopCondition++;
        if (stopCondition > 5) {
            condition = undefined;//чтобы прекратились запросы, перестает переключать фоны
        }
        if (condition > 1) {
            enemy.style.backgroundImage = frontEnemyWin[condition];
            condition = 0;
        }
    }
};

function enemyGoHome() { /*чувак уходит, пристрелив игрока*/
    /*enemy.style.left = "50%";*/
    if(step >= -10 && step != 25) {
        enemy.style.marginLeft = step + "%";
        step ++;
        counterImage = 0;
    }
    if (counterImage < 3) {
        enemy.style.backgroundImage = leftSideEnemy[counterImage];
        counterImage++;
        console.log(counterImage);
        if (counterImage == 3) {
            enemy.style.backgroundImage = leftSideEnemy[counterImage];
            counterImage = 0;
            console.log("при counterImage = 0:" , counterImage);
        }
    }
}



function enemyMove() {/*чувак двигается к центру*/
    enemy.style.left = "50%";
    enemy.classList.remove("hide");
    if (step > -10) {
        step --;
        enemy.style.marginLeft = step + "%";
    }
    if (counterImage > -1) {
        enemy.style.backgroundImage = leftSideEnemy[counterImage];
        counterImage++;
        if (counterImage > 3) {
            enemy.style.backgroundImage = leftSideEnemy[counterImage];
            counterImage = 0;
        } else if (step == -10) {
            counterImage = undefined;
            enemy.style.backgroundImage = frontEnemy[0];
            timeToKill();
        }
    }
}



$("#enemy").one("click", function() { /*вызывает событие один раз*/
    stopTimer = Date.now();
    speed = (((stopTimer - startTimer) / 1000).toFixed(2));
   /* if (speed == NaN) {
        fire.innerHTML = "FOUL!";
        console.log(speed);
    }*/
   if (speed != NaN && speed > 0) {
        your_time.innerHTML = speed;
    };
    if (necessaryTime > speed) {
        fire.innerHTML = "YOU WON!";
        soundClick("sounds/shot-win.mp3");
        setTimeout('soundClick("sounds/win.m4a")', 1200);
        enemy.style.backgroundImage = frontEnemyDead[0];
        setTimeout('enemy.style.backgroundImage = frontEnemyDead[1]', 500);
        pointsInner.innerHTML = ((necessaryTime - speed) * 10000).toFixed(0);
        /*setTimeout(startGame, 5000);*/
    }
    if (necessaryTime < speed) {
        fire.innerHTML = "YOU LOST!";
        enemy.style.backgroundImage = frontEnemyWin[0];
        main_window.style.backgroundImage = bgIfDied[0];
        setInterval(toggleWinEnemy, 800);
        soundClick("sounds/shot-miss.mp3");
        setTimeout('soundClick("sounds/death.mp3")', 1200);
        setTimeout('setInterval(enemyGoHome, 150)', 6000); 
        

    }
});

$(function () {
    var container = $('#container');
    var bird = $('#bird');
    var pole = $('.pole');
    var pole_1 = $('#pole_1');
    var pole_2 = $('#pole_2');
    var score = $('#score');
    var levelDisplay = $('#level');

    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var pole_initial_position = parseInt(pole.css('right'));
    var pole_initial_height = parseInt(pole.css('height'));
    var bird_left = parseInt(bird.css('left'));
    var bird_height = parseInt(bird.height());
    var speed = 10;

    var go_up = false;
    var score_updated = false;
    var game_over = false;
    var currentScore = 0;
    var level = 1;
    var interval = 40;
    var the_game;

    function playGame() {
        the_game = setInterval(gameLogic, interval);
    }

    function gameLogic() {
        var pole_current_position = parseInt(pole.css('right'));

        // Va chạm hoặc ra khỏi khung
        if (
            collision(bird, pole_1) ||
            collision(bird, pole_2) ||
            parseInt(bird.css('top')) <= 0 ||
            parseInt(bird.css('top')) > container_height - bird_height
        ) {
            stop_the_game();
            return;
        }

        // Cập nhật điểm
        if (pole_current_position > container_width - bird_left) {
            if (!score_updated) {
                currentScore++;
                score.text(currentScore);
                score_updated = true;
            }
        }

        // Kiểm tra ống nước ra khỏi khung
        if (pole_current_position > container_width) {
            var new_height = parseInt(Math.random() * 100);
            pole_1.css('height', pole_initial_height + new_height);
            pole_2.css('height', pole_initial_height - new_height);
            score_updated = false;
            pole.css('right', pole_initial_position);
        }

        // Di chuyển ống nước
        pole.css('right', pole_current_position + speed);

        // Chim rơi xuống
        if (!go_up) {
            go_down();
        }

        // Cập nhật level
        updateLevel();
    }

    function updateLevel() {
        if (currentScore >= 50) {
            stop_the_game();
            alert("Bạn đã chiến thắng!");
            return;
        } else if (currentScore >= 40) {
            level = 4;
            interval = 20;
        } else if (currentScore >= 20) {
            level = 3;
            interval = 25;
        } else if (currentScore >= 5) {
            level = 2;
            interval = 30;
        }

        levelDisplay.text('Level: ' + level);

        clearInterval(the_game);
        playGame();
    }

    function go_down() {
        bird.css('top', parseInt(bird.css('top')) + 10);
        bird.css('transform', 'rotate(50deg)');
    }

    function up() {
        bird.css('top', parseInt(bird.css('top')) - 20);
        bird.css('transform', 'rotate(-10deg)');
    }

    function stop_the_game() {
        clearInterval(the_game);
        game_over = true;
        $('#restart_btn').slideDown();
    }

    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;

        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        return !(b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2);
    }

    $('#container').mouseup(function () {
        clearInterval(go_up);
        go_up = false;
    });

    $('#container').mousedown(function () {
        go_up = setInterval(up, 40);
    });

    $('#play_btn').click(function () {
        playGame();
        $(this).hide();
    });

    $('#restart_btn').click(function () {
        location.reload();
    });
});

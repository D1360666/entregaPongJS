
let puntajej1 = 0;
let puntajej2 = 0;
puntaje1= document.getElementById("puntaje1");
puntaje2= document.getElementById("puntaje2");

//Creando Objeto jugador
(function(){
    self.Jugador = function(nombre, puntaje){
        this.nombre = nombre;
        this.puntaje = puntaje;
    }
    
   

})();
(function(){

    self.Board = function(width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars =[];
        this.ball = null;
    }

    self.Board.prototype = {
        get getWidth(){
            return this.width;
        },

        get getHeight(){
            return this.height;
        },
        
        get elements(){
            let elements = this.bars.map(function(bar){ return bar; }); 
            elements.push(this.ball);
            return elements;
        }
    }
}) ();

(function(){
    self.Ball = function(x, y, radius, board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.board = board;
        this.speed = 3;
        this.speed_y = 0;
        this.speed_x = 3;
        this.kind = "circle";
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        board.ball = this;
        
    }
    
    self.Ball.prototype = {
        move: function(){
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);

            if(this.y + this.radius > this.board.getHeight ||
                this.y + this.radius <= 20){
                    this.speed_y = -this.speed_y;
            }
            if(this.x + this.radius < 0){
                //ACA va puntaje para el j2
                puntaje2.innerHTML = ++puntajej2;

                if(puntajej2==5){
                    //TO:DO crear funciones
                    resetPuntajes();
                    ganador("Jugador 2");
                }
                resetearBola(this);
            }else if(this.x + this.radius > this.board.getWidth){
                puntaje1.innerHTML = ++puntajej1;
                if(puntajej1==5){
                    resetPuntajes();
                    ganador("Jugador 1");
                }
                resetearBola(this);
            }
        },
        get width(){
            return this.radius * 2;
        },
        get height(){
            return this.radius * 2;
        },
        collision: function(bar){
            
            let relative_intersect_y = (bar.y+(bar.height/2)) -this.y;

            let normalized_intersect_y = relative_intersect_y / (bar.height/2);

            this.bounce_angle =normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if(this.x > (this.board.width /2)){
                this.direction = -1;
            }else{
                this.direction = 1;
            }
        }
    }
}) ();
function resetearBola(){
    ball.x = ball.board.getWidth/2;
    ball.y = ball.board.getHeight/2;
    ball.speed = 5;
    ball.speed_x = -ball.speed_x;
}
function resetPuntajes(ball){
    puntaje1.innerHTML=0;
    puntaje2.innerHTML=0;
    
}

function ganador(ganador){
    alert("El ganador es: " + ganador);
}
(function(){
    //Se crea la clase Bar
    self.Bar = function(x, y, width, height, board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this); 
        this.kind = "rectangle";
        this.speed = 10;
    }

    
    self.Bar.prototype = {
        down: function(){
            this.y += this.speed; 
        },
        up: function(){
            this.y -= this.speed; 
        }
    }
}) ();

(function(){
    
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        clean: function(){
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function(){
            for(let i=this.board.elements.length-1; i>=0; i--){
                let el = this.board.elements[i];
    
                draw(this.ctx, el);
            }
        },
        check_collisions: function(){
            for (let i=this.board.bars.length-1 ; i>=0; i--) {
                let bar = this.board.bars[i];
                if(hit(bar, this.board.ball)){
                    this.board.ball.collision(bar);
                }
            }
        },
        play: function(){
    
            if (this.board.playing){
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }
        }
    }

    
    function hit(a, b){
        let hit = false;

        if(b.x + b.width >= a.x && b.x < a.x + a.width){
            if(b.y + b.height >= a.y && b.y < a.y + a.height){
                hit = true;
            }
        }
        if(b.x <= a.x && b.x + b.width >= a.x + a.width){
            if(b.y <= a.y && b.y + b.height >= a.y + a.height){
                hit = true;
            }
        }
        
        if(a.x <= b.x && a.x + a.width >= b.x + b.width){
            if(a.y <= b.y && a.y + a.height >= b.y + b.height){
                hit = true;
            }
        }

        return hit;
    }

    //Función que dibuja elementos
    function draw(ctx, element){
        switch(element.kind){
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                ctx.fillStyle='#00ecec';
                break;
            case "circle":
                ctx.beginPath();
                ctx.fillStyle ='#c50000';
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }
}) ();

//Instanciamos los objetos 
let board = new Board(800, 400);
let bar1 = new Bar(20, 100, 40, 100, board);
let bar2 = new Bar(735, 100, 40, 100, board);
let canvas = document.getElementById("canvas");
let board_view = new BoardView(canvas, board);
let ball = new Ball(350, 100, 10, board);
let player1 = new Jugador("-");
let player2 = new Jugador("-");

document.addEventListener("keydown", function(e){
    
        if(e.keyCode === 87){
        e.preventDefault();
        bar1.up();
    }else if(e.keyCode === 83){
        e.preventDefault();
        bar1.down();
    }else if(e.keyCode === 38){
        e.preventDefault();
        bar2.up();
    }else if (e.keyCode === 40){
        e.preventDefault();
        bar2.down();
    }
    else if (e.keyCode === 32){
        e.preventDefault();
        board.playing = !board.playing;
    }
});

board_view.draw();

self.requestAnimationFrame(controller);

function controller(){

    board_view.play();
    
    self.requestAnimationFrame(controller);


}

function confirmar(){
    j1 = document.getElementById("txtJ1");
    j2 = document.getElementById("txtJ2");
    
    
    if(j1.value==="" || j2.value===""){
        alert("Debe ingresar dos jugadores");
    }else{
        player1.setnombre= j1.value;
        player2.nombre= j2.value;

        document.getElementById("nameJ1").value=player1.nombre;
        document.getElementById("nameJ2").value=player2.nombre;
        document.getElementById("puntaje1").value=player1.puntaje;
        document.getElementById("puntaje2").value=player2.puntaje;
        alert("Que comience el juego");
    }
}
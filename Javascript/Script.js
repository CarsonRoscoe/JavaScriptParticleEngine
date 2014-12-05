// Needed to manipulate and draw on the canvas.
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

/* The function that does the initial draw, creates the particles and the emitter
used for dictating where the particles are created from and with what velocity*/
looping();

// The function to do the initial draw, etc. Mentioned above.
function looping() {

    //Calling the loop method at the rate of 60 times a second. This is to constantly update the page.
    var myVar = setInterval(function () { loop() }, 1000 / 60);

    //Settings used by the emitter to dictate all the atributes for the particle.
    var settings = {
        /* This is the redSplatter settings. To create a new particle, create another one below this and
        reference it in when the emitter is being created next.*/
        redSplatter: {
            'emission_rate': 100,
            'min_life': 3,
            'life_range': 2,
            'min_angle': 0,
            'angle_range': 360,
            'min_speed': 20,
            'speed_range': 30,
            'min_size': 3,
            'size_range': 2,
            'colour': '#FF0000'
        }
    };

    //Creation of the particle object and its given constructor.
    var Particle = function (x, y, angle, speed, life, size) {
        // Start position
        this.pos = {
            x: x,
            y: y
        };
        // Speed, time existing.
        this.speed = speed || 5;
        this.life = life || 1;
        this.size = size || 2;
        this.lived = 0;
        // Particles velocity
        var radians = angle * Math.PI / 180;
        this.vel = {
            x: Math.cos(radians) * speed,
            y: -Math.sin(radians) * speed
        };
    };
    // Creaetion of the emitter object and its given constructor.
    var Emitter = function (x, y, settings) {
        // Where the particles come from(emitter)
        this.pos = {
            x: x,
            y: y
        };
        // Set the settings
        this.settings = settings;
        // How often particles are created
        this.emission_delay = 1000 / settings.emission_rate;
        // Updates, last upvate and emission, default to 0.
        this.last_update = 0;
        this.last_emission = 0;
        // The particles objects created by the emitter.
        this.particles = [];
    };

    //Emitter's update function, to check when the page was last updated and to reupdate.
    Emitter.prototype.update = function () {
        // Sets "last_update" to now.
        if (!this.last_update) {
            this.last_update = Date.now();
            return;
        }
        var time = Date.now();
        // Milliseconds since the last update.
        var dt = time - this.last_update;

        this.last_emission += dt;
        this.last_update = time;

        //Check if we should emit another.
        if (this.last_emission > this.emission_delay) {
            var i = Math.floor(this.last_emission / this.emission_delay);
            this.last_emission -= i * this.emission_delay;
            while (i--) {
                this.particles.push(
                new Particle(
                    0,
                    0,
                    this.settings.min_angle + Math.random() * this.settings.angle_range,
                    this.settings.min_speed + Math.random() * this.settings.speed_range,
                    this.settings.min_life + Math.random() * this.settings.life_range,
                    this.settings.min_size + Math.random() * this.settings.size_range
                )
            );
            }
        }
        // Convert to seconds
        dt /= 1000;

        var i = this.particles.length;
        while (i--) {
            var particle = this.particles[i];
            if (particle.dead) {
                this.particles.splice(i, 1);
                continue;
            }
            particle.lived += dt;
            if (particle.lived >= particle.life) {
                particle.dead = true;
                continue;
            }
            particle.pos.x += particle.vel.x * dt;
            particle.pos.y += particle.vel.y * dt

            ctx.fillStyle = this.settings.colour;
            var x = this.pos.x + particle.pos.x;
            var y = this.pos.y + particle.pos.y;
            ctx.beginPath();
            ctx.arc(x, y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    /* Creating the new emitter object and setting the x and y position(where the particles will come out of,
    to be the center of the canvas. It uses the settings listed.*/
    var emitter = new Emitter(c.width / 2, c.height / 2, settings.redSplatter);

    /*the loop function, which is what is called 60 times a second. Clears the screen, draws the house and updates the emitter,
    which in turn updates the particles. */
    function loop() {
        ctx.clearRect(0, 0, c.width, c.height);
        //Any future drawings on the canvas should go here, behind the particles.
        emitter.update();
        //Or here, on top of the particles.
    }
    loop();
}
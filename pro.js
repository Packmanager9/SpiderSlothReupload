
window.addEventListener('DOMContentLoaded', (event) =>{

    let score = 0

    
    let keysPressed = {}

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
     });
     
     document.addEventListener('keyup', (event) => {
         delete keysPressed[event.key];
      });

      let scofrer = document.getElementById("go");

      let tutorial_canvas = document.getElementById("tutorial");
    let tutorial_canvas_context = tutorial_canvas.getContext('2d');

    tutorial_canvas.style.background = "#000000"


    let flex = tutorial_canvas.getBoundingClientRect();

    // Add the event listeners for mousedown, mousemove, and mouseup
    let tip = {}
    let xs
    let ys
   
   
    
    window.addEventListener('mousedown', e => {

          flex = tutorial_canvas.getBoundingClientRect();
          xs = e.clientX - flex.left;
          ys = e.clientY - flex.top;
          tip.x = xs
          tip.y = ys
    
          tip.body = tip

     });
    
    

    class Triangle{
        constructor(x, y, color, length){
            this.x = x
            this.y = y
            this.color= color
            this.length = length
            this.x1 = this.x + this.length
            this.x2 = this.x - this.length
            this.tip = this.y - this.length*2
            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
            this.accept2 = (this.y-this.tip)/(this.x2-this.x)

        }

        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.stokeWidth = 3
            tutorial_canvas_context.moveTo(this.x, this.y)
            tutorial_canvas_context.lineTo(this.x1, this.y)
            tutorial_canvas_context.lineTo(this.x, this.tip)
            tutorial_canvas_context.lineTo(this.x2, this.y)
            tutorial_canvas_context.lineTo(this.x, this.y)
            tutorial_canvas_context.stroke()
        }

        isPointInside(point){
            if(point.x <= this.x1){
                if(point.y >= this.tip){
                    if(point.y <= this.y){
                        if(point.x >= this.x2){
                            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
                            this.accept2 = (this.y-this.tip)/(this.x2-this.x)
                            this.basey = point.y-this.tip
                            this.basex = point.x - this.x
                            if(this.basex == 0){
                                return true
                            }
                            this.slope = this.basey/this.basex
                            if(this.slope >= this.accept1){
                                return true
                            }else if(this.slope <= this.accept2){
                                return true
                            }
                        }
                    }
                }
            }
            return false
        }
    }


    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move(){
            this.x+=this.xmom
            this.y+=this.ymom
        }
        isPointInsideGuy(point){
            if(point.x+point.radius >= this.x){
                if(point.y+point.radius >= this.y){
                    if(point.x-point.radius  <= this.x+this.width){
                        if(point.y-point.radius  <= this.y+this.height){
                        return true
                        }
                    }
                }
            }
            return false
        }
        isPointInside(point){
            if(point.x >= this.x){
                if(point.y >= this.y){
                    if(point.x <= this.x+this.width){
                        if(point.y <= this.y+this.height){
                        return true
                        }
                    }
                }
            }
            return false
        }
    }
    class Circle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){

            this.mark = []
            this.sxmom = 0
            this.symom = 0
            this.height = 0
            this.width = 0
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.xrepel = 0
            this.yrepel = 0
            this.lens = 0
        }       
         draw(){
            tutorial_canvas_context.lineWidth = 1
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fillStyle = this.color
        //    tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke(); 
        }
        move(){
            this.x += this.xmom
            this.y += this.ymom
            if(this!= chafer.body){

                this.xmom*=.8
                this.ymom*=.8
            }else{

            this.xmom*=.999
            this.ymom*=.999
            }
        }

        drive(){
            this.x+=this.sxmom
            this.y+=this.symom 

            this.sxmom*=.9
            this.symom*=.9
        }

        repelCheck(point){
            // console.log(point)
            this.areaY = point.y - this.y 
            this.areaX = point.x - this.x
            if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (2*this.radius+point.radius)*(2*point.radius+this.radius)){
                return true
            }
            return false
        }
        isPointInside(point){
            this.areaY = point.y - this.y 
            this.areaX = point.x - this.x
            if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (this.radius*this.radius)){
                return true
            }
            return false
        }

        repelCheck(point){
            this.areaY = point.y - this.y 
            this.areaX = point.x - this.x
            if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (this.radius+point.radius)*(point.radius+this.radius)){
                return true
            }
            return false
        }
    }

    class Line{
        constructor(x,y, x2, y2, color, width){
            this.x1 = x
            this.y1 = y
            this.x2 = x2
            this.y2 = y2
            this.color = color
            this.width = width
        }
        hypotenuse(){
            let xdif = this.x1-this.x2
            let ydif = this.y1-this.y2
            let hypotenuse = (xdif*xdif)+(ydif*ydif)
            return Math.sqrt(hypotenuse)
        }
        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.lineWidth = this.width
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.x1, this.y1)         
            tutorial_canvas_context.lineTo(this.x2, this.y2)
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.lineWidth = 1
        }
    }

    class Observer{
        constructor(){
            this.body = new Circle( 500, 500, 5, "white")
            this.ray = []
            this.rayrange = 220
            this.globalangle = Math.PI
            this.gapangle = Math.PI/8
            this.currentangle = 0
            this.obstacles = []
            this.raymake = 40
        }

        beam(){
            this.currentangle  = this.gapangle/2
            for(let k = 0; k<this.raymake; k++){
                this.currentangle+=(this.gapangle/Math.ceil(this.raymake/2))
                let ray = new Circle(this.body.x, this.body.y, 1, "white",((this.rayrange * (Math.cos(this.globalangle+this.currentangle))))/this.rayrange*2, ((this.rayrange * (Math.sin(this.globalangle+this.currentangle))))/this.rayrange*2 )
                ray.collided = 0
                ray.lifespan = this.rayrange-1
                this.ray.push(ray)
            }
            for(let f = 3; f<this.rayrange/2; f++){
                for(let t = 0; t<this.ray.length; t++){
                    if(this.ray[t].collided < 1){
                        this.ray[t].move()
                    for(let q = 0; q<this.obstacles.length; q++){
                        if(this.obstacles[q].isPointInside(this.ray[t])){
                            this.ray[t].collided = 1
                        }
                      }
                    }
                }
            }
        }

        draw(){
            this.beam()
            this.body.draw()
            tutorial_canvas_context.lineWidth = 1
            tutorial_canvas_context.fillStyle = "red"
            tutorial_canvas_context.strokeStyle = "red"
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.body.x, this.body.y)
            for(let y = 0; y<this.ray.length; y++){
                    tutorial_canvas_context.lineTo(this.ray[y].x, this.ray[y].y)
                        tutorial_canvas_context.lineTo(this.body.x, this.body.y)
                }
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.fill()
            this.ray =[]
        }

        control(){
            if(keysPressed['t']){
                this.globalangle += .05
            }
            if(keysPressed['r']){
                this.globalangle -= .05
            }
            if(keysPressed['w']){
                this.body.y-=2
            }
            if(keysPressed['d']){
                this.body.x+=2
            }
            if(keysPressed['s']){
                this.body.y+=2
            }
            if(keysPressed['a']){
                this.body.x-=2
            }
        }
    }

    class Shape{
        constructor(){
            this.circle = new Circle(360,350, 50, "red")
            this.circle2 = new Circle(320,350, 30, "red")
            this.circle3  = new Circle(400,350, 30, "red")
            this.rectangle = new Rectangle(300,140, 110, 110, "red")
            this.rectangle = new Rectangle(300,140, 110, 110, "red")
            this.triangle2 = new Triangle(340,350, "red", 40)
            this.triangle1 = new Triangle(380,350, "red", 50)
            this.triangle1.x2+=40
            this.triangle2.tip-=20

        }
        isPointInside(point){
            if(this.circle.isPointInside(point)){
                if(!this.circle2.isPointInside(point)){
                    // return true
                // if(this.rectangle.isPointInside(point)){
                    if(!this.circle3.isPointInside(point)){
                        return true
                    }
                // }
            }
        }
            return false
        }

    }


    class Player{
        constructor(){
            this.body = new Circle(350, 350, 10, "yellow")
            this.xp = 0
            this.level = 1
        }
        draw(){
            this.body.ymom+=.2
            for(let t = 0; t<floors.length;t++){
                if(floors[t].body.isPointInsideGuy(this.body)){
                    this.xp += floors[t].xp
                    floors[t].xp = 0
                    this.body.ymom = 0
                    let hump = this.body.y

                    this.body.y = floors[t].body.y-this.body.radius
                    tutorial_canvas_context.translate(0,(hump-this.body.y))
                }
            }
            this.control()
     
            this.body.move()
            this.body.draw()
            this.level = Math.floor(this.xp/10)+1
        }
        control(){
            if(keysPressed['w']){

            for(let t = 0; t<floors.length;t++){
                if(floors[t].body.isPointInsideGuy(this.body)){
                this.body.ymom-=(5+(this.level/2))
               this.body.y-=1
                // this.body.move()
                }
            }
            }
            if(keysPressed['d']){
                this.body.x+=2+(this.level/5)
                tutorial_canvas_context.translate(-(2+(this.level/5)),0)
            }
            if(keysPressed['s']){
                this.body.y+=2+(this.level/5)
                tutorial_canvas_context.translate(0,-(2+(this.level/5)))
            }
            if(keysPressed['a']){
                this.body.x-=2+(this.level/5)
                tutorial_canvas_context.translate((2+(this.level/5)),0)
            }
        }
    }

    class Platform{
        constructor(x,y){
            this.body = new Rectangle(x,y,5, 100, "blue")
            this.xp = 10
        }
        draw(){
            if(this.xp == 0){
                this.body.color = "red"
            }
            this.body.draw()
        }
    }

    class Spring{
        constructor(body = 0){
            if(body == 0){
                this.body = new Circle(350, 350, 5, "red",10,10)
                this.anchor = new Circle(this.body.x, this.body.y+5, 3, "red")
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
                this.length = 1
            }else{
                this.body = body
                this.length = .1
                this.anchor = new Circle(this.body.x-((Math.random()-.5)*10), this.body.y-((Math.random()-.5)*10), 1, "red")
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
            }

        }
        balance(){
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)

                if(this.beam.hypotenuse() !=0){
            if(this.beam.hypotenuse() < this.length){
                if(this.body != chafer.body){
                    this.body.xmom += (this.body.x-this.anchor.x)/(this.length)/300
                    this.body.ymom += (this.body.y-this.anchor.y)/(this.length)/300
                    this.anchor.xmom -= (this.body.x-this.anchor.x)/(this.length)/300
                    this.anchor.ymom -= (this.body.y-this.anchor.y)/(this.length)/300
                }else{

                    this.body.xmom += (this.body.x-this.anchor.x)/(this.length)/300
                    this.body.ymom += (this.body.y-this.anchor.y)/(this.length)/300
                    this.anchor.xmom -= (this.body.x-this.anchor.x)/(this.length)/300
                    this.anchor.ymom -= (this.body.y-this.anchor.y)/(this.length)/300
                }
            }else if(this.beam.hypotenuse() > this.length){

                if(this.body != chafer.body){
                    this.body.xmom -= (this.body.x-this.anchor.x)/(this.length)/300
                    this.body.ymom -= (this.body.y-this.anchor.y)/(this.length)/300
                    this.anchor.xmom += (this.body.x-this.anchor.x)/(this.length)/300
                    this.anchor.ymom += (this.body.y-this.anchor.y)/(this.length)/300    
                    }else{

                    this.body.xmom -= (this.body.x-this.anchor.x)/(this.length)/300
                    this.body.ymom -= (this.body.y-this.anchor.y)/(this.length)/300
                        this.anchor.xmom += (this.body.x-this.anchor.x)/(this.length)/300
                        this.anchor.ymom += (this.body.y-this.anchor.y)/(this.length)/300
                    }
            }

        }

        let xmomentumaverage 
        let ymomentumaverage
        xmomentumaverage = ((this.body.xmom*8)+this.anchor.xmom)/9
        ymomentumaverage = ((this.body.ymom*8)+this.anchor.ymom)/9

                this.body.xmom = ((this.body.xmom*2)+xmomentumaverage)/3
                this.body.ymom = ((this.body.ymom*2)+ymomentumaverage)/3
                this.anchor.xmom = ((this.anchor.xmom)+xmomentumaverage)/2
                this.anchor.ymom = ((this.anchor.ymom)+ymomentumaverage)/2
        }
        draw(){
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 2)
            this.beam.draw()
            this.body.draw()
            this.anchor.draw()
        }
        move(){
                // if(this.body != chafer.body){
                    this.body.move()
                // }
                    this.anchor.move()
        }

    }


    class Buggle{
        constructor(){
            this.counter = 0
            this.body = new Circle(350,350, 12, "red")
            this.legs = []
            this.tips = []
            this.joints = []
            this.limbs = 4
            this.xforce = 375*(this.limbs/10)
            this.yforce = 375*(this.limbs/10)
            this.leg = 0
            this.smack = 0
            this.tipsOn = []
            this.legshotclock = 0

            for(let t = 0; t<this.limbs;t++){

                let spring = new Spring(this.body)
                this.joints.push(spring.anchor)
                    this.legs.push(spring)
    
    
                    for(let k = 0; k<3;k++){
                        spring = new Spring(spring.anchor)
                        this.legs.push(spring)
                        this.joints.push(spring.anchor)
                    }
                    this.tips.push(spring.anchor)
            }
            for(let t = 0;t<this.tips.length;t++){
                this.tips[t].radius = 7
                this.tips[t].color = "green"
            }

        }
        walk(){


            for(let g = 0; g<orbs.length; g++){
                orbs[g].companion = []

                }

            let minimum = 100000
            let minreset = 0

            let mark = {}
            if(Math.random()<.001){

                for(let t = 0; t<orbs.length; t++){
                    orbs[t].body.mark = []
                }
    
            }
            if(Math.random()<.001){
    
            }
            this.legshotclock++
            for(let t = 0; t<orbs.length; t++){
               
                let link
                if(this.legshotclock < 55){
                    link = new Line(this.body.x, this.body.y, orbs[t].body.x, orbs[t].body.y, "red", 2)// let link = new Line(this.tips[this.leg].x, this.tips[this.leg].y, orbs[t].body.x, orbs[t].body.y, "red", 2)
                } else{
                    if(minreset == 0){
                        minreset = 1
                        minimum = 1000
                    }
                    link = new Line(this.tips[this.leg].x, this.tips[this.leg].y, orbs[t].body.x, orbs[t].body.y, "red", 2)
                }
                 this.tipsOn = []

                for(let g = 0; g<this.tips.length; g++){
                       for(let h = 0; h<orbs.length; h++){
                        if(g!=this.leg){
                            if(orbs[h].body.repelCheck(this.tips[g])){
                                    this.tipsOn.push(orbs[h].body)
                                    if(!orbs[h].companion.includes(this.tips[g])){

                                        orbs[h].companion.push(this.tips[g])
                                    }
                            }
                        }
                       }
                }
                for(let t = 0; t<orbs.length; t++){
                    orbs[t].body.gravity = .0
                }
                for(let t = 0; t<this.tipsOn.length; t++){
                    this.tipsOn[t].gravity = .1
                }

                if(!this.tipsOn.includes(orbs[t].body)){
                if(!orbs[t].body.mark.includes(this.leg)){
                if(link.hypotenuse()<minimum){
                        dummypin = orbs[t].body
                        minimum = link.hypotenuse()     
                  
                        // mark = orbs[t].body
                    }   
                    }
                }
            }

            this.tipsOn.push(dummypin)
            // console.log(this.tipsOn)
            let link = new Line(this.tips[this.leg].x, this.tips[this.leg].y, dummypin.x,dummypin.y, "red", 2)
            // link.draw()
            this.tips[this.leg].symom -= (this.tips[this.leg].y-dummypin.y)/450
            this.tips[this.leg].sxmom -= (this.tips[this.leg].x-dummypin.x)/450

            for(let t = 0;(Math.abs(this.tips[this.leg].sxmom)+Math.abs(this.tips[this.leg].symom)) < ((Math.abs(this.tips[this.leg].xmom)+Math.abs(this.tips[this.leg].ymom))+.55) ; t++ ){
                this.tips[this.leg].symom *=1.01
                this.tips[this.leg].sxmom *=1.01
                if(t>1000){
                    break
                }
            }
            // this.tips[this.leg].xmom = 0
            // this.tips[this.leg].ymom = 0
            this.tips[this.leg].drive()
            this.tips[this.leg].move()
            
            if(this.tips[this.leg].isPointInside(dummypin)){
                this.smack = 1
                dummypin.mark.push(this.leg)
            }else  if(dummypin.isPointInside(this.tips[this.leg])){
                this.smack = 1
                dummypin.mark.push(this.leg)
            }

            for(let t = 0; t<this.tips.length; t++){
                if(this.leg!==t){
                    this.tips[t].xmom = 0
                    this.tips[t].ymom = 0
                    this.tips[t].move()
                }
            }
            
            for(let  t= 0; t<this.tips.length;t++){
                for(let  k= 0; k<this.tips.length;k++){
                    if(t!=k){
                        if(this.tips[t].repelCheck(this.tips[k])){
                            let distance = ((new Line(this.tips[k].x, this.tips[k].y, this.tips[t].x, this.tips[t].y, 1, "red")).hypotenuse())-(2*this.tips[k].radius+this.tips[t].radius)
                            let angleRadians = Math.atan2(this.tips[k].y - this.tips[t].y, this.tips[k].x - this.tips[t].x);
                            if(t == this.leg){

                                // this.tips[t].xrepel += (Math.cos(angleRadians)*distance)/10
                                // this.tips[t].yrepel += (Math.sin(angleRadians)*distance)/10

                            }
                            // this.tips[k].xrepel += -(Math.cos(angleRadians)*distance)/10
                            // this.tips[k].yrepel += -(Math.sin(angleRadians)*distance)/10
                        }
                    }
                }
            }
        for(let t = 0; t<this.tips.length; t++){
            this.tips[t].x +=  this.tips[t].xrepel
            this.tips[t].y +=  this.tips[t].yrepel
            this.tips[t].xrepel = 0
            this.tips[t].yrepel = 0
        }
        }
        draw(){
            // this.counter++
            // if(this.counter%12 == 0){

            // }
            if(this.smack == 1){
                this.leg +=1
                this.leg %= this.tips.length
                this.smack = 0
                // console.log(this.legshotclock)
                this.legshotclock = 0
            }
            this.control()
            this.walk()
            // this.body.draw()
            for(let t = 0; t<this.legs.length;t++){
                this.legs[t].balance()
            }
            for(let t = 0; t<this.legs.length;t++){
                if(!this.tips.includes(this.joints[t])){
                this.legs[t].move()
                }
            }
            for(let t = 0; t<this.legs.length;t++){
                this.legs[t].draw()
            }
            


            for(let t = 0; t<this.joints.length;t++){
                for(let k = 0; k<this.joints.length;k++){
                    if(t!=k){
                        let guide = new Line(this.joints[t].x,this.joints[t].y, this.joints[k].x, this.joints[k].y, "red", .1)
                        // guide.draw()
                        if(guide.hypotenuse() == 0){

                        }else{

                        this.joints[k].xmom-=((this.joints[t].x-this.joints[k].x)/guide.hypotenuse())/this.xforce
                        this.joints[k].ymom-=((this.joints[t].y-this.joints[k].y)/guide.hypotenuse())/this.yforce
                        this.joints[t].xmom+=((this.joints[t].x-this.joints[k].x)/guide.hypotenuse())/this.xforce
                        this.joints[t].ymom+=((this.joints[t].y-this.joints[k].y)/guide.hypotenuse())/this.yforce
                        }
                    }
                }
                for(let t = 0; t<this.tips.length; t++){
                    if(this.leg!==t){
                        this.tips[t].xmom = 0
                        this.tips[t].ymom = 0
                    }
                }
                if(!this.tips.includes(this.joints[t])){
                    this.joints[t].move()

                }
            }


        }
        control(){
            if(keysPressed['w']){
                // this.body.y+=6
                this.body.ymom-=1.2
                // this.tips[this.leg].y-=1
                // this.tips[this.leg].ymom-=2
            }
            if(keysPressed['d']){
                // this.body.x-=6
                this.body.xmom+=1.2
                // this.tips[this.leg].x+=1
                // this.tips[this.leg].xmom+=2
            }
            if(keysPressed['s']){
                // this.body.y-=6
                this.body.ymom+=1.2
                // this.tips[this.leg].y+=1
                // this.tips[this.leg].ymom+=2
            }
            if(keysPressed['a']){
                // this.body.x+=6
                this.body.xmom-=1.2
                // this.tips[this.leg].x-=1
                // this.tips[this.leg].xmom-=2
            }
        }
    }

    class Orb{
        constructor(){
            this.body = new Circle(10+(Math.random()*tutorial_canvas.width-20), 10+(Math.random()*tutorial_canvas.height-20), 9, "blue")
            this.origin =  new Circle(this.body.x, this.body.y, 16, "blue")
            this.body.gravity = .05
            this.companion = []
            // this.companion.x = -12345
            this.fly = false
        }
        draw(){
            this.body.xmom -= (this.body.x-this.origin.x)/100
            this.body.ymom -= (this.body.y-this.origin.y)/100
            this.body.ymom+=this.body.gravity

            for(let t = 0;t<this.companion.length;t++){
                // if(Math.random()<.001){

                    // console.log(this.companion[t])
                    this.companion[t].y+=this.body.ymom
                    this.companion[t].x+=this.body.xmom
                //     console.log(this.companion[t])
                // }
            }
                // 
            

            this.body.move()

            if(this.fly == true){
                this.body.color ="yellow"
                this.body.radius =15
            }else{

                this.body.color ="blue"
                this.body.radius =9
            }
            this.body.draw()
        }
    }
    let dummypin = new Circle(100,100, 10, "blue")

    let chafer = new Buggle()

    let orbs = []

    for(let t = 0; t<500; t++){
        let orb = new Orb()
        let click = 0
        for(let k = 0; k<orbs.length; k++){
            let link = new Line(orb.body.x, orb.body.y, orbs[k].body.x, orbs[k].body.y, "green", 3)
            if(link.hypotenuse()< 49){
                click = 1
            }
        }
        if(click == 0){
        orbs.push(orb)
        }
    }

    let player = new Player()

    let platform = new Platform(400,400)

    let floor = new Platform(0,680)
    floor.body.width = 1000


    let floors = []

    floors.push(floor)
    floors.push(platform)
    
    // platform = new Platform(100,600)
    // floors.push(platform)
    platform = new Platform(200,500)
    floors.push(platform)
    platform = new Platform(500,400)
    floors.push(platform)
    platform = new Platform(100,600)
    floors.push(platform)


    let links = []

    for(let t = 0; t<orbs.length; t++){
        for(let k = 0; k<orbs.length; k++){

            if(k!==t){
                let link = new Line(orbs[t].body.x, orbs[t].body.y, orbs[k].body.x, orbs[k].body.y, "white", .3)

                // console.log(link)
                if(link.hypotenuse() < 85){
                    links.push([t,k])
                }
            }
        }
    }

    for(let t = 1; t< 19; t++){

            platform = new Platform(350-(t*110),350-(t*110))
            floors.push(platform)
    }

    orbs[0].fly = true
   
    window.setInterval(function(){ 
        tutorial_canvas_context.clearRect(-10000,-10000,tutorial_canvas.width*1000, tutorial_canvas.height*1000)
        chafer.draw()
        for(let t = 0; t<orbs.length; t++){
            orbs[t].draw()
        }
        for(let t = 0; t<links.length; t++){
            let link = new Line(orbs[links[t][0]].body.x, orbs[links[t][0]].body.y, orbs[links[t][1]].body.x, orbs[links[t][1]].body.y, "white", .3)
            link.draw()
        }
        chafer.draw()
        // player.draw()
        // for(let t = 0; t<floors.length; t++){
        //     floors[t].draw()
        // }

        for(let t = 0; t<orbs.length; t++){
            if(orbs[t].body.isPointInside(chafer.body)){
                if(orbs[t].fly == true){
                    orbs[t].fly = false
                    score++
                    orbs[Math.floor(Math.random()*orbs.length)].fly = true
                }
            }
        }
        

        scofrer.innerText = "Collected " + score
    }, 15) 



        
})
const canvas=document.querySelector('canvas');
const c=canvas.getContext('2d');

canvas.width=innerWidth;
canvas.height=innerHeight;

const scoreEl=document.querySelector('#scoreEl');
const startgamebtn=document.querySelector('#startgamebtn');
const modalel=document.querySelector('#modalel');
const scoreshow=document.querySelector('#scoreshow');

class Player
{
    constructor(x,y,radius,color)
    {
      this.x=x;
      this.y=y;
      this.radius=radius;
      this.color=color;
    }
    draw()
    {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,2*Math.PI,false);
        c.stroke();
        c.fillStyle=this.color;
        c.fill();
    }
}
//projectile
class Enemys
{
  constructor(x,y,radius,color,velocity)
  {
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.color=color;
    this.velocity=velocity;
  }
  draw()
    {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,2*Math.PI,false);
        c.stroke();
        c.fillStyle=this.color;
        c.fill();
    }

    update()
    {
      this.draw();
      this.x=this.x+this.velocity.x;
      this.y=this.y+this.velocity.y;
    }
}

const friction=0.99
class Particle
{
  constructor(x,y,radius,color,velocity)
  {
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.color=color;
    this.velocity=velocity;
    this.alpha=1;
  }
  draw()
    {
        c.save();
        c.globalAlpha=this.alpha;
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,2*Math.PI,false);
        c.stroke();
        c.fillStyle=this.color;
        c.fill();
        c.restore();
    }

    update()
    {
      this.draw();
      this.velocity.x *=friction;
      this.velocity.y *=friction;
      this.x=this.x+this.velocity.x;
      this.y=this.y+this.velocity.y;
      this.alpha-=.01;
    }
}
class EEnemys
{
  constructor(x,y,radius,color,velocity)
  {
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.color=color;
    this.velocity=velocity;
  }
  draw()
    {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,2*Math.PI,false);
        c.stroke();
        c.fillStyle=this.color;
        c.fill();
    }

    update()
    {
      this.draw();
      this.x=this.x+this.velocity.x;
      this.y=this.y+this.velocity.y;
    }
}

const x=canvas.width/2;
const y=canvas.height/2;

let player=new Player(x,y,20,'white');
let enmyy=[]
let enemies=[]
let particles=[]

//start again game when click start button
function init()
{
 player=new Player(x,y,20,'white');
 enmyy=[]
 enemies=[]
 particles=[]
 Score=0;

 //START SCORING AGAIN FROM 0
 scoreEl.innerHTML=Score;
 scoreshow.innerHTML=Score;

}

//enemy bubble moving
function spawnEnemies()
{
  setInterval(()=>{
    //size of all enemy bubbles
    const radius=Math.random()*(30-8)+8;

    let x;
    let y;
     if(Math.random()<.5)
     {
      x=Math.random()<.5?0-radius:canvas.width+radius;
      y=Math.random()*canvas.height;
     }
     else
     {
      x=Math.random()*canvas.width;
      y=Math.random()<.5?0-radius:canvas.height+radius;
     }
    //random color of enemy
    //huge saturation line  ==hsl for all type color
    const color=`hsl(${Math.random()*360},50%,50%)`
   
  const angle=Math.atan2(canvas.height/2-y,canvas.width/2-x)

  const velocity={
    x:Math.cos(angle),
    y:Math.sin(angle)
  }
    enemies.push(new EEnemys(x,y,radius,color,velocity))
  },1000)
}


let animationid;
let Score=0;

function animate()
{
  animationid= requestAnimationFrame(animate);
  c.fillStyle='rgba(0,0,0,.1)'
  c.fillRect(0,0,canvas.width,canvas.height)
  player.draw();
  particles.forEach((particle,index)=>
    {
      //if enemy bubble alpha is low then 
      if(particle.alpha<=0)
      {
        //it out from screen
        particles.splice(index,1)
      }
      else{
        particle.update()
      }
    });
  enmyy.forEach((enemy,index)=>
  {
    enemy.update()
   
    //remove from edges of screen
    if(enmyy.x+enmyy.radius<0 || enmyy.x-enmyy.redius>canvas.width
      ||enmyy.y+enmyy.radius<0||
      enmyy.y-enmyy.radius>canvas.height)
    {
      setTimeout(()=>{
        enmyy.splice(index,1)
      },0)

    }
  })

  //shoot enemy
  enemies.forEach((enemy_s,index)=>{
    enemy_s.update()
    
    //distance bw enemy and player
    const dist= Math.hypot(player.x-enemy_s.x,player.y-enemy_s.y)

    //end game when enemy touch the player
    if(dist-enemy_s.radius-player.radius<1)
     {
       cancelAnimationFrame(animationid)
       modalel.style.display= 'flex'
       scoreshow.innerHTML=Score;
     }

   //detect collision on enemy on projectile enemy
   enmyy.forEach((enemy,enemyindex)=>
    {
     const dist= Math.hypot(enemy.x-enemy_s.x,enemy.y-enemy_s.y)

     //object when projectile touch enemy touch
     if(dist-enemy_s.radius-enemy.radius<1)
     { 

       //create explosion
       for(let i=0;i<enemy.radius*2;i++)
       {
         particles.push(
           new Particle(
             enemy.x,enemy.y,
             Math.random()*2,
             enemy_s.color,
             {
           x:(Math.random()-0.5)*(Math.random()*8),
           y:(Math.random()-0.5)*(Math.random()*8)
         }))
       }
       if(enemy.radius-10>10)
       {
         //increase score
         Score+=100;
         scoreEl.innerHTML=Score;

         gsap.to(enemy,{
           radius:enemy.radius-10

         })
         setTimeout(()=>{
          enmyy.splice(enemyindex,1)
  
         },0)
       }
       else{

        Score+=100;
         scoreEl.innerHTML=Score;


        setTimeout(()=>{
          enemies.splice(index,1)
          enmyy.splice(enemyindex,1)
  
         },0)
       }
      
       
     }
    });
  })
}

addEventListener('click',(event)=>
{
  const angle=Math.atan2(event.clientY - canvas.height/2,event.clientX - canvas.width/2)

  const velocity={

    //projectile speed rays out from player
    x:Math.cos(angle)*6,
    y:Math.sin(angle)*6
  }
  enmyy.push(new Enemys(canvas.width / 2,canvas.height / 2,5,'white',velocity)
  )
})
startgamebtn.addEventListener('click',()=>
{
  init();
  animate();
  spawnEnemies();
  modalel.style.display= 'none'
})
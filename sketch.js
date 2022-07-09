// crio as variaveis
var trex, trexVivo , trexMorto
var chao, chaoImagem, chaoInvisivel
var  nuvemImagem, nuvemGrupo
var  cacto1,cacto2,cacto3,cacto4,cacto5,cacto6, cactoGrupo
var reiniciar,reiniciarImagem
var fimJogo,fimJogoImagem 
var placar=0
var estadoJogo="jogando"
var somMorte , somPulo , somCheckPoint

function resetar () {
    placar=0
    trex.changeAnimation ("vivo")
    cactoGrupo.destroyEach ()
    nuvemGrupo.destroyEach ()
    estadoJogo = "jogando"
    fimJogo.visible=false;
    reiniciar.visible=false
}

function criarNuvens () {
    if (frameCount % 200===0) {
        var nuvem=createSprite (650,100)
        nuvem.y=Math.round (random (50,100))
        nuvem.addImage (nuvemImagem)
        nuvem.velocityX=-2
        nuvem.lifetime=600
        nuvemGrupo.add (nuvem) 
        trex.depth=nuvem.depth
        trex.depth=trex.depth+1
    }
}

function criaCactos () {
    if (frameCount % 190===0) {
       var cacto=createSprite (650,170)
        cacto.velocityX=-(4+placar/100)
        cacto.lifetime=600
        cacto.scale=0.6
        cactoGrupo.add (cacto)
        var tipo= Math.round (random (1,6))
        switch (tipo) {
            case 1: cacto.addImage (cacto1)
            break;
            case 2: cacto.addImage (cacto2)
            break
            case 3: cacto.addImage (cacto3)
            break
            case 4: cacto.addImage (cacto4)
            break
            case 5: cacto.addImage (cacto5)
            break
            case 6:cacto.addImage (cacto6)
            break
            default: break
        }
    }
}

// serve para precarregar imagens/animacoes/sons
function preload() {
    trexVivo=loadAnimation ("trex1.png","trex2.png","trex3.png")
    trexMorto=loadAnimation ("trex_collided.png")
    chaoImagem=loadImage ("ground2.png")
    nuvemImagem= loadImage ("cloud.png")
    cacto1=loadImage("obstacle1.png")
    cacto2=loadImage("obstacle2.png")
    cacto3=loadImage("obstacle3.png")
    cacto4=loadImage("obstacle4.png")
    cacto5=loadImage("obstacle5.png")
    cacto6=loadImage("obstacle6.png")
    reiniciarImagem=loadImage ("restart.png")
    fimJogoImagem=loadImage("gameOver.png")
    somPulo=loadSound ("jump.mp3")
    somCheckPoint=loadSound ("checkPoint.mp3")
    somMorte=loadSound ("die.mp3")
}

// serve pra fazer a configuracao inicial (só é executada 1 vez quando o jogo começar)
function setup() {
    createCanvas(600, 200)

    trex=createSprite (60,150,10,30)
    trex.addAnimation("vivo",trexVivo)
    trex.addAnimation("morto",trexMorto)
    trex.scale= 0.7
    trex.setCollider ("circle", 0,0,40)

    chao=createSprite(300,193,600,20)
    chao.addImage (chaoImagem)
    chaoInvisivel=createSprite (300,200,600,5)
    chaoInvisivel.visible=false

    reiniciar=createSprite (300,150)
    reiniciar.addImage (reiniciarImagem)
    reiniciar.scale=0.7
    reiniciar.visible=false

    fimJogo= createSprite (300, 100)
    fimJogo.addImage (fimJogoImagem)
    fimJogo.scale=0.7
    fimJogo.visible=false

    nuvemGrupo= new Group ()    
    cactoGrupo= new Group ()  

}

// serve para fazer o jogo funcionar o tempo todo (é executada o tempo todo, infinitamente até parar o jogo)
function draw() {    
    background("white")
    text ("Pontos: " + placar,500,20)
    
    if (estadoJogo==="jogando") {
        placar=placar+ Math.round (frameRate ()/60)
        
        if ((keyDown("space") || touches.length>0) && trex.y>100) {
            trex.velocityY=-10
            somPulo.play ()
            touches = []
        }
        
        if (chao.x<0) {
            chao.x=chao.width/2
        }

        criarNuvens ()
        criaCactos ()

        chao.velocityX=-(4+placar/100)      

        if (trex.isTouching (cactoGrupo)) {
            estadoJogo='final'
            somMorte.play ()
        }

        if (placar>0 &&  placar% 500===0) {
            somCheckPoint.play ()
        }


    } else if(estadoJogo=== "final") {
        chao.velocityX=0
        nuvemGrupo.setVelocityXEach (0)
        cactoGrupo.setVelocityXEach (0)
        nuvemGrupo.setLifetimeEach (-1) 
        cactoGrupo.setLifetimeEach (-1) 
        trex.changeAnimation ("morto")        
        fimJogo.visible=true
        reiniciar.visible=true    
   
   if (mousePressedOver (reiniciar) || touches.length>0) {
        resetar ()
   touches = []
    }
    }

    trex.velocityY=trex.velocityY+0.5
    trex.collide (chaoInvisivel)   
    drawSprites()
}
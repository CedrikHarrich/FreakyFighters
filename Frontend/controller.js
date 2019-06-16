var context, controller, player, loop;

context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 640;
context.canvas.width = 960;

player = {

  height:120,
  jumping:true,
  width:120,
  x:144, // center of the canvas
  x_velocity:0,
  y:0,
  y_velocity:0

};

controller = {

  left:false,
  right:false,
  up:false,
  keyListener:function(event) {

    var key_state = (event.type == "keydown")?true:false;

    switch(event.keyCode) {

      case 37:// left key
        controller.left = key_state;
      break;
      case 38:// up key
        controller.up = key_state;
      break;
      case 39:// right key
        controller.right = key_state;
      break;

    }

  }

};

loop = function() {
  if (controller.up && player.jumping == false) {

    player.y_velocity -= 40; //bestimmt Höhe des Sprungs
    player.jumping = true;

  }

  if (controller.left) {

    player.x_velocity -= 1.5;

  }

  if (controller.right) {

    player.x_velocity += 1.5;

  }

  player.y_velocity += 1.2;// gravity
  player.x += player.x_velocity;
  player.y += player.y_velocity;
  player.x_velocity *= 0.9;// friction
  player.y_velocity *= 0.9;// friction

  // if player is falling below floor line
  if (player.y > 640 - 80 - 120) {

    player.jumping = false;
    player.y = 640 - 80 - 120;
    player.y_velocity = 0;

  }

  // if player is going off the left of the screen
  if (player.x < -120) {

    player.x = 960;

  } else if (player.x > 960) {// if player goes past right boundary

    player.x = -120;

  }

 //  context.fillStyle = "#202020";
//   context.fillRect(0, 0, 960, 640);// x, y, width, height
  context.drawImage(background, 0, 0, 960, 640);
  context.drawImage(img, player.x, player.y, player.width, player.height);

  // call update when the browser is ready to draw again
  window.requestAnimationFrame(loop);

};

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);

let img = new Image;
let background = new Image;
img.onload = function() {
   console.log ("Bild geladen");
   background.onload = function(){
  window.requestAnimationFrame(loop);
  }
}
img.src = "Character.png";  // erst nach dem Event Listener!
background.src = "background.png";

//   loadAsset(name, url) {
//     return new Promise((resolve, reject) => {
//       const image = new Image();
//       image.src = url;
//       image.addEventListener('load', function () {
//         return resolve({ name, image: this });
//       });
//     });
//   }
//
//   loadAssets(assetsToLoad) {
//     return Promise.all(
//       assetsToLoad.map(asset => this.loadAsset(asset.name, asset.url))
//     ).then(assets =>
//       assets.reduceRight(
//         (acc, elem) => ({ ...acc, [elem.name]: elem.image }),
//         {}
//       )
//     );
//   }
// loadAssets([
//     { name: 'character', url: './character.png' }
//   ])
//   .then(assets => {
//     window.requestAnimationFrame(loop);
//   });

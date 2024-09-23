/*
	This component:
	Creates a framed video element and adds to DOM
	Loads AFTER assets in attempt to speed up scene load times.
	!!! Need to still work on dimensions better for each size in scene. 
*/
AFRAME.registerComponent( 'vidloadcontrol', {
	schema: {
		vidid: { type: 'string', default: '' },
		vidsrc: { type: 'string', default: ''},
		vwidth: { type: 'number', default: 3 },
		vheight: { type: 'number', default: 1.5 },
		vscale: { type: 'number', default: 1.0 },
		style: { type: 'string', default: 'wall' }
	},

	init: function () {
		var data = this.data;
		var el = this.el;
    	var scene = el.sceneEl;

		//Only begin loading the component and video after the scene has finished loading.
		scene.addEventListener( 'loaded', function() {
			//console.log( 'Scene Loaded' );
		
			//Add object for style of frame, wall or rock or stand in future?
			if( data.style == 'wall' ) {
				var base = document.createElement( 'a-box' );
				base.setAttribute( 'width', data.vwidth + 0.05 );
				base.setAttribute( 'height', data.vheight + 0.05 );
				base.setAttribute( 'depth', 0.05 );
				base.setAttribute( 'color', 'gray' );
				base.setAttribute( 'scale', { x: data.vscale, y: data.vscale, z: 1.0 } );
			}

			//console.log( 'adding vid' );
			
			//Add a-video element and set video source
			var avideo = document.createElement('a-video');
			avideo.setAttribute( 'id', data.vidid );
			avideo.setAttribute( 'material', 'src', data.vidsrc );
			avideo.setAttribute( 'width', data.vwidth );
			avideo.setAttribute( 'height', data.vheight );
			avideo.setAttribute( 'position', '0 0 0.03' );
			avideo.setAttribute( 'scale', { x: data.vscale, y: data.vscale, z: 1.0 } );
			avideo.setAttribute( 'class', 'button' );

			//Attach everything to element/DOM
			el.appendChild( base );
			el.appendChild( avideo );

			var isplaying = false;
		
			//Once video loads, add button functionality
			//Sequence was important here I think.
			avideo.addEventListener( 'loaded', function () {
				//console.log( 'vid loaded' );
				//console.log( 'loading play button' );
				avideo.addEventListener( 'click', function () {
					//var vidEl = document.querySelector( '#newvid' );
					//console.log( vidEl );
					var vidobject = document.querySelector( '#' + data.vidid );
					//console.log( vidobject );
					var vidtexture = vidobject.getObject3D( 'mesh' ).material.map.image;
					//console.log( vidtexture );
					if (isplaying === false) {
						vidtexture.play();
						isplaying = true;
					}else if (isplaying === true) {
						vidtexture.pause();
						isplaying = false;
					}
				});
			});

		});

	},

	update: function () {},

	tick: function () {},

	remove: function () {},

	pause: function () {},

	play: function () {},

});

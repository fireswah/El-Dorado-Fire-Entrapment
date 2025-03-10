/*
	Copyright 2025 Matt Gibson
        Video display component:
		-Creates a framed video element and adds to DOM
		-Loads AFTER assets in attempt to speed up scene load times.

        This program is free software: you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        any later version.

        This program is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU General Public License for more details.

        You should have received a copy of the GNU General Public License
        along with this program.  If not, see <https://www.gnu.org/licenses/>.
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

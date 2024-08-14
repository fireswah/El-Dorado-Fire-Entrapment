/*
	This component:
	Creates a video element and adds to DOM,
	Creates an a-video element and uses the video element as src,
	Controls (play/pause video) by clicking on the video in scene.
		-Steps 1 and 2 should help loading large videos to the scene.
	-uses rayorigin mouse and raycaster objects on aframe cursor (html)
	-needs control detection for VR
*/
AFRAME.registerComponent('vidloadcontrol', {
	schema: {
		id: {type: 'string', default: ''},
		vidid: {type: 'string', default: ''},
		src: {type: 'string', default: ''},
		width: {type: 'number', default: 3 },
		height: {type: 'number', default: 1.5 }
	},

	init: function () {
		var data = this.data;
		var el = this.el;
    	var scene = el.sceneEl;
		var vidsource = document.getElementById( data.vidid );
/*
//video settings - not sure what I did so long ago here, but makes sense to do the settings here, but need to append to a-video instead?
//I may have been trying to load them separately from assets originally to reduce scene load.  Consider using three.js to load the assets instead?
		var video = document.createElement('video');
		video.setAttribute( 'id', data.vidid );
		video.setAttribute('src', data.src )
		video.setAttribute( 'autoplay', false );
		video.setAttribute( 'loop', false );
		document.body.appendChild(video);
*/
		var avideo = document.createElement('a-video');
		var selector = ( data.vidid );
		avideo.setAttribute( 'id', data.id );
		avideo.setAttribute( 'material', 'src', selector );
		avideo.setAttribute( 'width', data.width );
		avideo.setAttribute( 'height', data.height );
		avideo.setAttribute( 'class', 'button' );

		avideo.addEventListener( 'loaded', function () {
			document.getElementById( data.id ).load();
		});

		el.appendChild( avideo );

		var isplaying = false;
		var vidtexture = document.querySelector( selector );

		avideo.addEventListener('click', function (evt) {
			if (isplaying === false) {
				vidtexture.play();
				isplaying = true;
			}else if (isplaying === true) {
				vidtexture.pause();
				isplaying = false;
			}
		});

		avideo.addEventListener('ended', function (evt) {
			isplaying = false;
		});

	},

	update: function () {},

	tick: function () {},

	remove: function () {},

	pause: function () {},

	play: function () {},

});

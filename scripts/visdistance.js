/*
Component to toggle visibility on content given user's position.
*/
AFRAME.registerComponent('visdistance', {
	schema: {
		visType: { type: 'string', default: 'range' },//range or bounds
		xzMinMax: { type: 'array', default: [ 0, 0, 0, 0 ] },//x min, xmax, zmin, zmax
		//not worried about y in this scene
        range: { type: 'number', default: 10.0 },
		currentCamLocation: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },//internal use set below, not in html
	},

	init: function () {
		var data = this.data;
		var el = this.el;

		// Note for testing bounds: [ -35, 41, 24, -28 ];

		this.camerarig = document.querySelector( '#camrig' );

		data.currentCamLocation = this.camerarig.getAttribute( 'position' );

		//console.log( data.xzMinMax );
		//console.log( data.currentCamLocation);
		
		if( data.visType === 'range' ) {
			this.updateRange();
		}else if( data.visType === 'bounds' ) {
			this.updateBounds();
		}

	},

	update: function () {},

	tick: function () {
		var el = this.el;
        var data = this.data;

        data.currentCamLocation = this.camerarig.getAttribute( 'position' );
		
		if( data.visType === 'range' ) {
			this.updateRange();
		}else if( data.visType === 'bounds' ) {
			this.updateBounds();
		}
	},

	remove: function () {},

	pause: function () {},

	play: function () {},

	updateBounds() {
		var el = this.el;
		var data = this.data;
		
		if( data.currentCamLocation.x >= data.xzMinMax[ 0 ] && data.currentCamLocation.x <= data.xzMinMax[ 1 ] ) {
			if( data.currentCamLocation.z >= data.xzMinMax[ 2 ] && data.currentCamLocation.z <= data.xzMinMax[ 3 ] ) {
				console.log( "I will be visible." );
			}else {
				console.log( 'Outside z');
			}
		}else {
			console.log( 'I wont be visible.' );
		}
	},

	updateRange() {
		var el = this.el;
		var data = this.data;
		var distance = data.currentCamLocation.distanceTo( el.object3D.position );//distanceTo is three.js built in
		//sqrt((x1 - x2)^2 + (y1 - y2)^2 + (z1 - z2)^2)
		
		if( distance >= data.range && el.getAttribute( 'visible' ) === true ) {
			el.setAttribute( 'visible', false );
		}

		if( distance <= data.range && el.getAttribute( 'visible' ) === false ) {
			el.setAttribute( 'visible', true );
		}
	},

});
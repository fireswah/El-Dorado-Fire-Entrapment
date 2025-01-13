/*
	This component:
	-Creates a quoted text display for the scene
    -When adding to scene \n works in the quote text to add a new line
*/
AFRAME.registerComponent('add-quote', {
	schema: {
        quotetext: { type: 'string', default: '' },
	},

	init: function () {
		var data = this.data;
		var el = this.el;
    	var scene = el.sceneEl;

        //Create frame, text
        var frame = document.createElement( 'a-entity' );
        
        frame.setAttribute( 'geometry', { 
            primitive: 'plane',
            width: 0.0,//setting 0 autoscales to match the text
            height: 0.0//setting 0 autoscales to match the text
         });
        
       	frame.setAttribute( 'material', { color: 'gray', emissive: '#404040', emissiveIntensity: 1.0 } );

        frame.setAttribute( 'text', {
            width: 5.0,//the width of the final product in scene, may want to make this a schema setting.
            align: 'center',
            wrapCount: 30,//how many "letters" before dropping to the next line.  This is the setting to change.
            value: data.quotetext,
            color: 'yellow',
        });

        el.appendChild( frame );
	},

	update: function () {},

	tick: function () {},

	remove: function () {},

	pause: function () {},

	play: function () {},

});

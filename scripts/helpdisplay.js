/*
	Adds button and help info image
    button toggles graphic visibility
*/
AFRAME.registerComponent('help-display', {
	schema: {

	},

	init: function () {
		var data = this.data;
		var el = this.el;

        //Create button
        var button = document.createElement( 'a-gltf-model' );
        button.setAttribute( 'src', '#helpicon' );
        button.setAttribute( 'id', 'helpbutton' );
        button.setAttribute( 'class', 'button' );
        button.setAttribute( 'rotation', {
            x: -35,
            y: 0,
            z: 0
        });
        button.setAttribute( 'position', '0.0 -0.75 -1' );

        //Create help info panel
        var helpinfo = document.createElement( 'a-image' );
        helpinfo.setAttribute( 'id', 'helppanel' );
        helpinfo.setAttribute( 'src', '#help' );
        helpinfo.setAttribute( 'width', 0.816 );
        helpinfo.setAttribute( 'height', 1.056 );
        helpinfo.setAttribute( 'position', {
            x: 0,
            y: 0.05,
            z: -0.7
        });

        //Add to scene as child of camera
        el.appendChild( button );
        el.appendChild( helpinfo );

        //setup button toggle functionality
        el.addEventListener( 'loaded', function () {
            var toggle = document.querySelector( '#helpbutton' );

            toggle.addEventListener( 'click', function() {
                var info = document.querySelector( "#helppanel" );
                if( info.getAttribute( 'visible' ) === false ) {
                    info.setAttribute( 'visible', true );
                }else if( info.getAttribute( 'visible' ) === true ) {
                    info.setAttribute( 'visible', false );
                }
            });
        });

	},

	update: function () {},

	tick: function () {},

	remove: function () {},

	pause: function () {},

	play: function () {},

});

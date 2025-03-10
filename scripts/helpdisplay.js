/*
	Copyright 2025 Matt Gibson
        Simple Help Display:
		-Adds button and help info image
		-Button toggles graphic visibility

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

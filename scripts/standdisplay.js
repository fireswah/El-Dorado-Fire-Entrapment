/*
	Copyright 2025 Matt Gibson
        Audio stand display component:
		-Creates a stand podium for the El Dorado Museum
    		-Creates the billboard stand # display above the podium
    		-Adds graphics, text and/or play button to the podium for use with the content

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
AFRAME.registerComponent('stand-display', {
	schema: {
        platetext: { type: 'string', default: '' },
        billboardtext: { type: 'string', default: '' },
        audiosrc: { type: 'string', default: '' },
	rolloff: { type: 'int', default: 1 },
        maxDistance: { type: 'int', default: 10 }
	},

	init: function () {
		var data = this.data;
		var el = this.el;
    	var scene = el.sceneEl;

        //get main entity id so we can use it later with button play function
        var idName = el.getAttribute( 'id' );

        //Create base post
        var base = document.createElement( 'a-cone' );
        base.setAttribute( 'position', '0 0.4 0' );
        base.setAttribute( 'radius-bottom', 0.3 );
        base.setAttribute( 'radius-top', 0.06 );
        base.setAttribute( 'height', 0.8 );
        base.setAttribute( 'segments-radial', 6 );
        base.setAttribute( 'material', 'color', 'gray' );
        base.setAttribute( 'material', 'emissive', 'gray' );
        base.setAttribute( 'material', 'emissiveIntensity', 0.5 );
        el.appendChild( base );

        //Create faceplate, plate text and button
        var plate = document.createElement( 'a-box' );
        var plttext = document.createElement( 'a-entity' );
        var button = document.createElement( 'a-cylinder' );
        
        plate.setAttribute( 'height', 0.288 );
        plate.setAttribute( 'width', 1.152 );
        plate.setAttribute( 'depth', 0.05 );
        plate.setAttribute( 'position', '0 0.9 0' );
        plate.setAttribute( 'rotation', '-25 0 0' );
        plate.setAttribute( 'material', 'color', '#5c4033' );
        plate.setAttribute( 'material', 'emissive', '#5c4033' );
        plate.setAttribute( 'material', 'emissiveIntensity', 0.5 );
        
        //using an entity should autoscale the width of text to the primitive: https://aframe.io/docs/1.6.0/components/text.html
        plttext.setAttribute( 'geometry', 'primitive', 'plane' );
        plttext.setAttribute( 'geometry', 'width', 0.85 );
        plttext.setAttribute( 'geometry', 'height', 0.25 );
        plttext.setAttribute( 'position', '0.137 0 0.026' );
        plttext.setAttribute( 'material', 'opacity', 0.0 );
        plttext.setAttribute( 'text', 'value', data.platetext );
        plttext.setAttribute( 'text', 'align', 'center' );
        plttext.setAttribute( 'text', 'color', 'silver' );
        plttext.setAttribute( 'text', 'wrapPixels', '400' );//this is the adjustment to text size I used
        
        button.setAttribute( 'id', idName + '_button' );
        button.setAttribute( 'class', 'button' );
        button.setAttribute( 'position', '-0.385 -0.008 0.018' );
        button.setAttribute( 'rotation', '90 0 0' );
        button.setAttribute( 'scale', '0.075 0.045 0.075' );
        button.setAttribute( 'material', 'color', 'red' );
        button.setAttribute( 'material', 'emissive', 'red' );
        button.setAttribute( 'material', 'emissiveIntensity', 0.5 );
        
        el.appendChild( plate );
        plate.appendChild( plttext );
        plate.appendChild( button );

        button.addEventListener( 'click', function () {
            if( button.getAttribute( 'sound' ) ) {
                //don't reload over again.
                console.log( 'This sound file has already loaded.');
            }else {
                button.setAttribute( 'sound', {
                    src: data.audiosrc,
                    on: 'click',
                    rolloffFactor: data.rolloff,
                    maxDistance: data.maxDistance,
                    distanceModel: 'linear'
                });
                //console.log( 'loading sound' );
            }
        });
        
        //Once sound loads, change button color for visual indicator
        button.addEventListener( 'sound-loaded', function () {
            button.setAttribute( 'material', 'color', 'green' );
            button.setAttribute( 'material', 'emissive', 'green' );
            button.setAttribute( 'material', 'emissiveIntensity', 0.7 );
		});

        //Create billboard and billboard text
        //Note the text on the billboard doesn't autoscale, it should remain the same throughout.
        var billboard = document.createElement( 'a-entity' );
        var pointer = document.createElement( 'a-triangle' );
        var bbtext = document.createElement( 'a-entity' );

        pointer.setAttribute( 'rotation', '0 0 180' );
        pointer.setAttribute( 'scale', '0.25 0.25 1.0' );
        pointer.setAttribute( 'position', '0 1.335 0' );
        pointer.setAttribute( 'material', 'side', 'double' );
        pointer.setAttribute( 'material', 'emissive', 'yellow' );
        pointer.setAttribute( 'material', 'emissiveIntensity', 0.5 );

        //using an entity should autoscale the width of text to the primitive: https://aframe.io/docs/1.6.0/components/text.html
        bbtext.setAttribute( 'geometry', 'primitive', 'plane' );
        bbtext.setAttribute( 'geometry', 'width', 0.9 );
        bbtext.setAttribute( 'geometry', 'height', 2.08 );
        bbtext.setAttribute( 'material', 'side', 'double' );
        bbtext.setAttribute( 'material', 'emissive', 'yellow' );
        bbtext.setAttribute( 'material', 'emissiveIntensity', 0.5 );
        bbtext.setAttribute( 'position', '0 2.5 0' );
        bbtext.setAttribute( 'text', 'value', data.billboardtext );
        bbtext.setAttribute( 'text', 'align', 'center' );
        bbtext.setAttribute( 'text', 'color', 'black' );
        bbtext.setAttribute( 'text', 'wrapPixels', '300' );//this is the adjustment to text size I used

        billboard.appendChild( pointer );
        billboard.appendChild( bbtext );

        billboard.setAttribute( 'animation', {
            property: 'rotation',
            to: '0 360 0',
            loop: true,
            dur: '5000',
            easing: 'linear'
        });

        el.appendChild( billboard );
	},

	update: function () {},

	tick: function () {},

	remove: function () {},

	pause: function () {},

	play: function () {},

});

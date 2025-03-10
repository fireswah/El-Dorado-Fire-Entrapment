/*
	Copyright 2025 Matt Gibson
        Custom info and quote component:
		-Creates a text display for the scene in either quote or info text styles
        	-When adding to scene \n works in the text to add a new line
        	-Roughly 8-10 lines of text fit this way, much more and it'll get wonky.  Can adjust wrapCount!
   		-Adds backing object/model for either wall (indoor) or rock (outdoor) depending on location in scene

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
AFRAME.registerComponent('add-quote-info', {
	schema: {
        texttype: { type: 'string', default: 'quote' },//'quote' or 'info' determines how to use the text display
        titletext: { type: 'string', default: '' },//title at top
        maintext: { type: 'string', default: '' },//information text below title
        frametype: { type: 'string', default: 'wall' },//'wall' or 'rock' determines 3D model to use as backer
        scale: { type: 'number', default: 0.3 },//0.3 seems about right for the scene
        drawline: { type: 'boolean', default: true },//draw a line from info text origin down so it can point at something
        rotate: { type: 'boolean', default: false },//Used with info text, and rotates the entity, useful for planned map POI.
	},

	init: function () {
		var data = this.data;
		var el = this.el;
    	var scene = el.sceneEl;

        //Create frame, text
        var frame = document.createElement( 'a-entity' );
        var title = document.createElement( 'a-entity' );
        var settext = document.createElement( 'a-entity' );
        
        if ( data.texttype === 'quote' ) {
            if( data.frametype === 'wall' ) {
                frame.setAttribute( 'gltf-model', '#quoteboard' );
                frame.setAttribute( 'rotation', { x: 0, y: -90, z: 0 } );

                title.setAttribute( 'text', {
                    baseline: 'top',
                    align: 'center',
                    wrapCount: 20,//how many "letters" before dropping to the next line.
                    value: data.titletext,
                    color: 'yellow',
                    width: 8.54,//matches the face of the glb model (quoteboard or quoterock) for displaying text, then is scaled down later.
                    zOffset: 0.02,
                });
        
                title.setAttribute( 'position', { x: 0, y: 2, z: 0 } );
                
                settext.setAttribute( 'text', {
                    align: 'center',
                    anchor: 'align',
                    wrapCount: 40,//how many "letters" before dropping to the next line.
                    value: data.maintext,
                    color: 'yellow',
                    width: 8.54,//matches the face of the glb model (quoteboard or quoterock) for displaying text, then is scaled down later.
                    zOffset: 0.02,
                });
        
                settext.setAttribute( 'position', { x: 0, y: -0.4, z: 0 } );
        
                el.appendChild( frame );
                el.appendChild( title );
                el.appendChild( settext );
        
                el.setAttribute( 'scale', { x: data.scale, y: data.scale, z: data.scale } );

            }else if( data.frametype === 'rock' ) {
                frame.setAttribute( 'gltf-model', '#quoterock' );
                frame.setAttribute( 'rotation', { x: 0, y: -90, z: 0 } );
                var rotValue = el.getAttribute( 'rotation' );

                title.setAttribute( 'text', {
                    baseline: 'top',
                    align: 'center',
                    wrapCount: 20,//how many "letters" before dropping to the next line.
                    value: data.titletext,
                    color: 'yellow',
                    width: 8.54,//matches the face of the glb model (quoteboard or quoterock) for displaying text, then is scaled down later.
                    zOffset: 0.02,
                });
        
                title.setAttribute( 'position', { x: 0, y: 4, z: 0 } );
                
                settext.setAttribute( 'text', {
                    align: 'center',
                    anchor: 'align',
                    wrapCount: 40,//how many "letters" before dropping to the next line.
                    value: data.maintext,
                    color: 'yellow',
                    width: 8.54,//matches the face of the glb model (quoteboard or quoterock) for displaying text, then is scaled down later.
                    zOffset: 0.02,
                });
        
                settext.setAttribute( 'position', { x: 0, y: 1, z: 0 } );
        
                el.appendChild( frame );
                el.appendChild( title );
                el.appendChild( settext );
        
                el.setAttribute( 'scale', { x: data.scale, y: data.scale, z: data.scale } );
                el.setAttribute( 'rotation', { x: -55, y: rotValue.y, z: rotValue.z } );//sets the entity/rock so the display face is at a 35 degree angle, but keeps the original rotation values
                //may need to eventually correct position with scaling here, but not worrying about it now.
            }
        }else if( data.texttype === 'info' ) {
            
            if( data.drawline === true ){
                var line = document.createElement( 'a-entity' );

                line.setAttribute( 'line', 'start', { x: 0, y: -2.4, z: 0 } );//hard code base of height size
                line.setAttribute( 'line', 'end', { x: 0, y: -8, z: 0 } );
                line.setAttribute( 'line', 'color', 'darkgray' );
            }

            title.setAttribute( 'text', {
                baseline: 'top',
                align: 'center',
                wrapCount: 20,//how many "letters" before dropping to the next line.
                value: data.titletext,
                color: 'darkgray',
                width: 8.54,//matches the face of the glb model (quoteboard or quoterock) for displaying text, then is scaled down later.
                zOffset: 0.02,
            });
    
            title.setAttribute( 'position', { x: 0, y: 2, z: 0 } );
            
            settext.setAttribute( 'text', {
                align: 'center',
                anchor: 'align',
                wrapCount: 40,//how many "letters" before dropping to the next line.
                value: data.maintext,
                color: 'darkgray',
                width: 8.54,//matches the face of the glb model (quoteboard or quoterock) for displaying text, then is scaled down later.
                zOffset: 0.02,
            });
    
            settext.setAttribute( 'position', { x: 0, y: -0.4, z: 0 } );

            el.appendChild( title );
            el.appendChild( settext );
            el.appendChild( line );

            if( data.rotate === true ) {
                var titleback = document.createElement( 'a-entity' );
                var settextback = document.createElement( 'a-entity' );

                titleback.setAttribute( 'text', {
                    baseline: 'top',
                    align: 'center',
                    wrapCount: 20,//how many "letters" before dropping to the next line.
                    value: data.titletext,
                    color: 'darkgray',
                    width: 8.54,//matches the face of the glb model (quoteboard or quoterock) for displaying text, then is scaled down later.
                    zOffset: 0.02,
                });

                titleback.setAttribute( 'position', { x: 0, y: 2, z: 0 } );
                titleback.setAttribute( 'rotation', '0 180 0' );

                settextback.setAttribute( 'text', {
                    align: 'center',
                    anchor: 'align',
                    wrapCount: 40,//how many "letters" before dropping to the next line.
                    value: data.maintext,
                    color: 'darkgray',
                    width: 8.54,//matches the face of the glb model (quoteboard or quoterock) for displaying text, then is scaled down later.
                    zOffset: 0.02,
                });
        
                settextback.setAttribute( 'position', { x: 0, y: -0.4, z: 0 } );
                settextback.setAttribute( 'rotation', '0 180 0' );

                el.appendChild( titleback );
                el.appendChild( settextback );
            }

            el.setAttribute( 'scale', { x: data.scale, y: data.scale, z: data.scale } );

            if( data.rotate === true ) {
                el.setAttribute( 'animation', 'property: rotation; from: 0 0 0; to: 0 360 0; dur: 8000; loop: true; easing: linear;');
            }

        }

	},

	update: function () {},

	tick: function () {},

	remove: function () {},

	pause: function () {},

	play: function () {},

});

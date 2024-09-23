/*
	This component:
	-Creates a stand podium for the El Dorado Museum
    -Creates the billboard stand # display above the podium
    -Adds graphics, text and/or play button to the podium for use with the content
    -Requires separate audio player component
*/
AFRAME.registerComponent('stand-display', {
	schema: {
        basemat: { type: 'string', default: '' },
        platemat: { type: 'string', default: '' },
        platetext: { type: 'string', default: '' },
        billboardmat: { type: 'string', default: '' },
        billboardtext: { type: 'string', default: '' },
        audiosrc: { type: 'string', default: '' }
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
        base.setAttribute( 'src', data.basemat );
        el.appendChild( base );

        //Create faceplate, plate text and button
        var plate = document.createElement( 'a-box' );
        var plttext = document.createElement( 'a-text' );
        var button = document.createElement( 'a-cylinder' );
        
        plate.setAttribute( 'height', 0.288 );
        plate.setAttribute( 'width', 1.152 );
        plate.setAttribute( 'depth', 0.05 );
        plate.setAttribute( 'position', '0 0.9 0' );
        plate.setAttribute( 'rotation', '-25 0 0' );
        plate.setAttribute( 'src', data.platemat );
        
        plttext.setAttribute( 'position', '0.526 0 0.026' );
        plttext.setAttribute( 'text', 'value', data.platetext );
        plttext.setAttribute( 'text', 'width', 0.768 );
        plttext.setAttribute( 'scale', '2.5 4 1' );
        plttext.setAttribute( 'text', 'align', 'right' );
        plttext.setAttribute( 'text', 'color', 'silver' );
        
        button.setAttribute( 'id', idName + '_button' );
        button.setAttribute( 'class', 'button' );
        button.setAttribute( 'position', '-0.384 0 0' );
        button.setAttribute( 'rotation', '90 0 0' );
        button.setAttribute( 'scale', '0.075 0.075 0.075' );
        button.setAttribute( 'material', 'color', 'red' );
        
        el.appendChild( plate );
        plate.appendChild( plttext );
        plate.appendChild( button );

        button.addEventListener( 'click', function () {
            if( button.getAttribute( 'sound' ) ) {
                //don't reload over again.
                console.log('nothing');
            }else {
                button.setAttribute( 'sound', {
                    src: data.audiosrc,
                    on: 'click',
                    rolloffFactor: 1,
                    maxDistance: 20,
                    distanceModel: 'linear'
                });
                console.log( 'loading sound' );
            }
            
        });
        
        button.addEventListener( 'sound-loaded', function () {
			//document.getElementById( data.id ).load();
            button.setAttribute( 'material', 'color', 'green' );
		});

        //Create billboard and billboard text
        var billboard = document.createElement( 'a-plane' );
        var bbtext = document.createElement( 'a-text' );
        billboard.setAttribute( 'rotation', '0 0 0' );
        billboard.setAttribute( 'width', 0.900 );
        billboard.setAttribute( 'height', 2.080 );
        billboard.setAttribute( 'position', '0 2.5 0' );
        billboard.setAttribute( 'src', data.billboardmat );
        billboard.setAttribute( 'material', 'side', 'double' );
        billboard.setAttribute( 'material', 'alphaTest', 0.5 );
        billboard.setAttribute( 'animation', {
            property: 'rotation',
            to: '0 360 0',
            loop: true,
            dur: '5000',
            easing: 'linear'
        });

        bbtext.setAttribute( 'text', 'value', data.billboardtext );
        bbtext.setAttribute( 'text', 'align', 'center' );
        bbtext.setAttribute( 'text', 'color', 'black' );
        bbtext.setAttribute( 'position', '0 0.3 0.01' );
        
        el.appendChild( billboard );
        billboard.appendChild( bbtext );


	},

	update: function () {},

	tick: function () {},

	remove: function () {},

	pause: function () {},

	play: function () {},

});
